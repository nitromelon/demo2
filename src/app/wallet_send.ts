import { Err } from "ts-results";
import checkJWT from "../middleware/jwt";
import RequestChain from "../request/chain";
import App from "./app";
import { ethers } from "ethers";

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
        const result = await this.web3.transfer(from_wallet.val, to, amount_in_wei);
        if (result instanceof Err) {
            res.status(500).json({ error: "Internal Server Error" });
            return;
        }

        res.status(200).json({ message: "Success" });
    }).add_middleware(checkJWT);
}
