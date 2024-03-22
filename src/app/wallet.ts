import { Err, None } from "ts-results";
import checkJWT from "../middleware/jwt";
import RequestChain from "../request/chain";
import App from "./app";
import { ethers } from "ethers";

export default class Wallet extends App {
    override post = RequestChain.create(async (_req, res) => {
        const wallet = this.web3.createWallet();

        if (wallet instanceof Err) {
            console.error(wallet.val);
            res.status(500).json({ error: "Internal Server Error" });
            return;
        }

        res.status(201).json(wallet.val);
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
    }).add_middleware(checkJWT);

    override put = RequestChain.create(async (req, res) => {
        const address = req.params["id"];
        const amount = req.body.amount;

        if (typeof address !== "string" || typeof amount !== "string") {
            res.status(400).json({ error: "Bad Request" });
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

        const transfer = this.web3.transfer(
            admin_wallet.unwrap(),
            address,
            amount_in_wei
        );

        if (transfer instanceof Err) {
            console.error(transfer.val);
            res.status(500).json({ error: "Internal Server Error" });
            return;
        }

        res.status(204).end();
    }).add_middleware(checkJWT);
}
