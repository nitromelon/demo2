import { Request, Response } from "express";
import App from "./app";
import RequestChain from "../request/chain";
import checkJWT from "../middleware/jwt";

export default class Demo extends App {
    override post = RequestChain.create(
        async (_req: Request, res: Response) => {
            // await this.db.user.create({
            //     data: {
            //         id: Math.floor(Math.random() * 1000),
            //         username: `"Alice"${Math.floor(Math.random() * 1000)}`,
            //         email: `test${Math.floor(Math.random() * 1000)}@google.com`,
            //         password: `"123456"${Math.floor(Math.random() * 1000)}`,
            //     },
            // });
            // console.log(await this.db.user.findMany());

            res.status(201).json({ message: "POST request to /page" });
        }
    ).add_middleware(checkJWT);

    override get = RequestChain.create((req: Request, res: Response) => {
        res.status(200).json({
            message: `GET request to /page with id ${req.params["id"]}`,
        });
    });

    override put = RequestChain.create((_req: Request, res: Response) => {
        res.status(200).json({ message: "PUT request to /page" });
    });

    override delete = RequestChain.create((_req: Request, res: Response) => {
        res.status(200).json({ message: "DELETE request to /page" });
    });
}
