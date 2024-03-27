import { Err, None } from "ts-results";
import checkJWT from "../middleware/jwt";
import RequestChain from "../request/chain";
import App from "./app";
import { ethers } from "ethers";

type SmartContractTransaction = any[][];
type ModifiedSmartContractTransaction = {
    product_id: string;
    time: Date;
    from: string;
    to: string;
    paid_price: string;
}[];

export default class WalletSend extends App {
    override post = RequestChain.create(async (req, res) => {
        const from = req.body.from; // private key
        const to = req.body.to; // public address
        const amount = req.body.amount; // in ether

        if (
            typeof from !== "string" ||
            typeof to !== "string" ||
            typeof amount !== "string"
        ) {
            res.status(400).json({ error: "Bad Request" });
            return;
        }

        const from_wallet = this.web3.getWallet(from);
        if (from_wallet instanceof Err) {
            res.status(400).json({ error: "Bad Request" });
            return;
        }

        const amount_in_wei = ethers.parseEther(amount);
        await this.web3.transfer(from_wallet.val, to, amount_in_wei);

        res.status(200).json({ message: "Success" });
    }).add_middleware(checkJWT);

    // Get all transactions history
    override get = RequestChain.create(async (req, res) => {
        const address = req.params["id"];
        const sub = req.auth?.payload.sub;

        if (typeof address !== "string" || !sub) {
            res.status(400).json({ error: "Bad Request" });
            return;
        }

        const wallet = this.web3.getWallet(address);

        if (wallet instanceof Err) {
            res.status(500).json({ error: "Internal Server Error" });
            return;
        }

        const public_address_from_wallet = wallet.val.address;
        const user = await this.db.user.findUnique({
            where: {
                sub: sub,
            },
        });

        if (user === null) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        if (public_address_from_wallet !== user.walletAddress) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const smart_contract = this.web3.getSmartContract(wallet.val);

        if (smart_contract instanceof Err) {
            res.status(500).json({ error: "Internal Server Error" });
            return;
        }

        const transaction = await this.web3.getPurchaseCount(
            smart_contract.val
        );

        if (transaction === None) {
            res.status(500).json({ error: "Internal Server Error" });
            return;
        }

        const transactions = transaction as any as SmartContractTransaction;

        const result: ModifiedSmartContractTransaction = transactions.map(
            (transaction) => ({
                product_id: transaction[0] as string,
                time: new Date(Number(transaction[1]) * 1000),
                from: transaction[2] as string,
                to: transaction[3] as string,
                paid_price: transaction[4] as string,
            })
        );

        res.status(200).json(result);
    }).add_middleware(checkJWT);
}
