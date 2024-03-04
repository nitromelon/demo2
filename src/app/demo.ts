import { Request, Response } from "express";
import App from "./app";

export default class Demo extends App {
    override post = (_req: Request, res: Response) => {
        if (this.db !== null) {
            console.log("Database is connected yay");
        }
        res.status(201).json({ message: "POST request to /page" });
    };

    override get = (req: Request, res: Response) => {
        res.status(200).json({
            message: `GET request to /page with id ${req.params["id"]}`,
        });
    };

    override put = (_req: Request, res: Response) => {
        res.status(200).json({ message: "PUT request to /page" });
    };

    override delete = (_req: Request, res: Response) => {
        res.status(200).json({ message: "DELETE request to /page" });
    };
}
