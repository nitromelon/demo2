import dotenv from "dotenv";
import { Err, None } from "ts-results";
import checkJWT from "../middleware/jwt";
import RequestChain from "../request/chain";
import App from "./app";
import { ethers } from "ethers";
import { ProductStatus } from "@prisma/client";

dotenv.config();

export default class Product extends App {
    // Show 20 products of a category per page
    override get = RequestChain.create(async (req, res) => {
        const product_id = req.params["id"];
        if (product_id === undefined) {
            res.status(400).json({ error: "Bad Request" });
            return;
        }

        // get product info from database
        const product = await this.db.product.findUnique({
            where: {
                id: product_id,
            },
            include: {
                Provider: true,
                Category: true,
            }
        });

        if (!product) {
            res.status(404).json({ message: "Product not found" });
            return;
        }

        res.status(200).json(product);
    });

    // Update product, buy by who, who will get money, who will send money etc
    /*
        body: {
            private_key: string, // this is private key of the buyer
            to: string, // this is public address of the seller
        }
    */
    override put = RequestChain.create(async (req, res) => {
        const product_id = req.params["id"];
        // const amount = req.body.amount;
        const private_key = req.body.private_key;

        // aka admin as fallback. Yes this should not be hardcoded but still...
        const to = req.body.to ?? process.env["GETH_ACCOUNT_PUBLIC_KEY"];

        if (product_id === undefined || private_key === undefined) {
            res.status(400).json({ error: "Bad Request" });
            return;
        }

        const auth = req.auth;
        if (!auth || auth.payload.sub === undefined) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const sub = auth.payload.sub;

        const user = await this.db.user.findUnique({
            where: {
                sub: sub,
            },
        });

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        const user_address = user.walletAddress;

        if (user_address === null) {
            res.status(400).json({ error: "User has no wallet address" });
            return;
        }

        // check if user has enough money
        // check wallet address of the seller
        const [toBalance, userBalance, amount] = await Promise.all([
            this.web3.getBalance(to),
            this.web3.getBalance(user_address),
            this.db.product.findUnique({
                where: {
                    id: product_id,
                },
                select: {
                    price: true,
                },
            }),
        ]);

        if (toBalance instanceof Err || userBalance instanceof Err) {
            res.status(500).json({ message: "Internal Server Error" });
            return;
        }

        if (!amount) {
            res.status(404).json({ message: "Product not found" });
            return;
        }

        if (userBalance.val < amount.price) {
            res.status(400).json({ error: "Insufficient balance" });
            return;
        }

        // get the product
        const product = await this.db.product.findUnique({
            where: {
                id: product_id,
            },
        });

        if (!product) {
            res.status(404).json({ message: "Product not found" });
            return;
        }

        if (product.status === ProductStatus.SOLD) {
            res.status(400).json({ error: "Product has been sold" });
            return;
        }

        // Step 1: transfer money from buyer to seller
        // Step 2: transfer product through smart contract

        const buyer_wallet = this.web3.getWallet(private_key);
        if (buyer_wallet instanceof Err) {
            res.status(500).json({ message: "Internal Server Error" });
            return;
        }

        const smartContract = this.web3.getSmartContract(buyer_wallet.val);
        if (smartContract instanceof Err) {
            res.status(500).json({ message: "Internal Server Error" });
            return;
        }

        // convert price into bigint by converting ether to wei
        const amount_in_wei = ethers.parseEther(amount.price.toString());

        // Why no promise all with purchase? Because we need to check if the purchase is successful
        const transfer_money = await this.web3.transfer(
            buyer_wallet.val,
            to,
            amount_in_wei
        );

        const purchase = await this.web3.setPurchase(
            smartContract.val,
            to,
            product_id
        );

        if (purchase === None) {
            res.status(500).json({ message: "Internal Server Error" });
            return;
        }

        console.log(transfer_money);
        console.log(purchase);

        // update product status
        await this.db.product.update({
            where: {
                id: product_id,
            },
            data: {
                status: ProductStatus.SOLD,
            },
        });

        res.status(200).json({ message: "Success" });
    }).add_middleware(checkJWT);
}
