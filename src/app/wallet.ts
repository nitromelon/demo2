import { Err, None } from "ts-results";
import checkJWT from "../middleware/jwt";
import RequestChain from "../request/chain";
import App from "./app";
import { ethers } from "ethers";

export default class Wallet extends App {
    override post = RequestChain.create(async (req, res) => {
        const sub = req.auth?.payload.sub;
        if (sub === undefined) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const user = await this.db.user.findUnique({
            where: {
                sub: sub,
            },
        });

        if (user === null) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        if (user.walletAddress !== null) {
            res.status(409).json({ error: "Wallet already exists" });
            return;
        }

        const wallet = this.web3.createWallet();

        if (wallet instanceof Err) {
            console.error(wallet.val);
            res.status(500).json({ error: "Internal Server Error" });
            return;
        }

        const wallet_info = wallet.val;
        await this.db.user.update({
            where: {
                sub: sub,
            },
            data: {
                walletAddress: wallet_info.address,
            },
        });

        res.status(201).json(wallet_info);
    }).add_middleware(checkJWT);

    override get = RequestChain.create(async (req, res) => {
        const address = req.params["id"];
        if (typeof address !== "string") {
            res.status(400).json({ error: "Bad Request" });
            return;
        }

        const get_balance = await this.web3.getBalance(address);
        if (get_balance instanceof Err) {
            console.error(get_balance.val);
            res.status(500).json({ error: "Internal Server Error" });
            return;
        }

        const balance = get_balance.val;
        res.status(200).json({ balance: ethers.formatEther(balance) });
    });

    override put = RequestChain.create(async (req, res) => {
        const address = req.params["id"];
        const amount1 = req.body.amount;

        if (typeof address !== "string" || typeof amount1 !== "number") {
            res.status(400).json({ error: "Bad Request" });
            return;
        }

        const amount = amount1.toString();

        const sub = req.auth?.payload.sub;
        if (sub === undefined) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const user = await this.db.user.findUnique({
            where: {
                sub: sub,
            },
        });

        if (user === null) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        if (user.walletAddress !== address) {
            res.status(403).json({ error: "Forbidden" });
            return;
        }

        const admin_wallet = this.web3.adminWallet;
        if (admin_wallet === None) {
            res.status(500).json({ error: "Internal Server Error" });
            return;
        }

        const get_admin_balance = await this.web3.getBalance(
            admin_wallet.unwrap().address
        );
        const amount_in_wei = ethers.parseEther(amount);

        if (get_admin_balance instanceof Err) {
            console.error(get_admin_balance.val);
            res.status(500).json({ error: "Internal Server Error" });
            return;
        }

        const admin_balance = get_admin_balance.val;
        if (admin_balance < amount_in_wei) {
            res.status(400).json({ error: "Insufficient Funds" });
            return;
        }

        await this.web3.transfer(admin_wallet.unwrap(), address, amount_in_wei);

        res.status(204).end();
    }).add_middleware(checkJWT);
}
