import { Request, Response } from "express";
import App from "./app";
import RequestChain from "../request/chain";

export default class Demo extends App {
    override post = RequestChain.create((_req: Request, res: Response) => {
        if (this.db !== null) {
            console.log("Database is connected yay");
        }
        res.status(201).json({ message: "POST request to /page" });
    }).add_middleware((req: Request, _res: Response, next) => {
        console.log(
            `POST request to /page with body ${JSON.stringify(req.body)}`
        );
        console.log("this is also a middleware hehe");
        next();
    });

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
