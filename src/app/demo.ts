import App from "./app";
import RequestChain from "../request/chain";
import checkJWT from "../middleware/jwt";
// import { Err } from "ts-results";
// import { ethers } from "ethers";

export default class Demo extends App {
    override post = RequestChain.create(async (_req, res) => {
        res.status(201).json({ message: "POST request to /page" });
    })
        .add_middleware(checkJWT)
        .add_middleware(async (_req, _res, next) => {
            // await this.db.user.create({
            //     data: {
            //         id: Math.floor(Math.random() * 1000),
            //         username: `"Alice"${Math.floor(Math.random() * 1000)}`,
            //         email: `test${Math.floor(Math.random() * 1000)}@google.com`,
            //         password: `"123456"${Math.floor(Math.random() * 1000)}`,
            //     },
            // });
            // console.log(await this.db.user.findMany());
            next();
        })
        .add_middleware(async (_req, _res, next) => {
            // const result = this.web3.getBalanceOfAdmin();
            // if (result instanceof Err) {
            //     console.log(result.val);
            // } else {
            //     const bigNumber = await result.val;
            //     // const balance = bigNumber.toString();
            //     const balance = ethers.utils.formatEther(bigNumber);
            //     console.log(balance);
            // }
            next();
        });

    override get = RequestChain.create((req, res) => {
        res.status(200).json({
            message: `GET request to /page with id ${req.params["id"]}`,
        });
    });

    override put = RequestChain.create((_req, res) => {
        res.status(200).json({ message: "PUT request to /page" });
    });

    override delete = RequestChain.create((_req, res) => {
        res.status(200).json({ message: "DELETE request to /page" });
    });
}
