import CRUD from "../request/CRUD";
import { Request, Response } from "express";

export default class Demo extends CRUD {
    override post = (_req: Request, res: Response) => {
        res.status(201).json({ message: "POST request to /demo" });
    };

    override get = (_req: Request, res: Response) => {
        res.status(200).json({ message: "GET request to /demo" });
    };

    override put = (_req: Request, res: Response) => {
        res.status(200).json({ message: "PUT request to /demo" });
    };

    override delete = (_req: Request, res: Response) => {
        res.status(200).json({ message: "DELETE request to /demo" });
    };
}

export class Demo2 extends CRUD {
    override post = (_req: Request, res: Response) => {
        res.status(201).json({ message: "POST request to /demo2" });
    };

    override get = (_req: Request, res: Response) => {
        res.status(200).json({ message: "GET request to /demo2" });
    };

    override put = (_req: Request, res: Response) => {
        res.status(200).json({ message: "PUT request to /demo2" });
    };

    override delete = (_req: Request, res: Response) => {
        res.status(200).json({ message: "DELETE request to /demo2" });
    };
}