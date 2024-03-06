import { Request, Response } from "express";
import App from "./app";
import RequestChain from "../request/chain";

export default class Demo extends App {
    override post = RequestChain.create(
        async (_req: Request, res: Response) => {
            if (this.db !== null) {
                console.log("Database is connected yay");
                // await this.db.user.create({
                //     data: {
                //         id: Math.floor(Math.random() * 1000),
                //         username: `"Alice"${Math.floor(Math.random() * 1000)}`,
                //         email: `test${Math.floor(
                //             Math.random() * 1000
                //         )}@google.com`,
                //         password: `"123456"${Math.floor(Math.random() * 1000)}`,
                //     },
                // });
                // console.log(await this.db.user.findMany());
                throw new Error("Database is not connected");
            }

            res.status(201).json({ message: "POST request to /page" });
        }
    ).add_middleware((_req: Request, _res: Response, _next) => {
        throw new Error("Middleware error test hehe");
    })

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
