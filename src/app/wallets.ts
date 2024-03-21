import { Err } from "ts-results";
import checkJWT from "../middleware/jwt";
import RequestChain from "../request/chain";
import App from "./app";

export default class Wallets extends App {
    override post = RequestChain.create(async (_req, res) => {
        const wallet = this.web3.createWallet();

        if (wallet instanceof Err) {
            console.error(wallet.val);
            res.status(500).json({ error: "Internal Server Error" });
            return
        }

        res.status(201).json(wallet.val);
    }).add_middleware(checkJWT);
}
