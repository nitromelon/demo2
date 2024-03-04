import mongoose from "mongoose";
import CRUD from "../request/CRUD";
import InnoDB from "../request/database";
import { RequestHandler, Request, Response } from "express";

const defaultHandler: RequestHandler = (req: Request, res: Response) =>
    res.status(404).json({ message: `Cannot ${req.method} ${req.url}` });

class App implements CRUD {
    db: typeof mongoose | null = InnoDB.getSelf().getDB();
    post: RequestHandler = defaultHandler;
    get: RequestHandler = defaultHandler;
    put: RequestHandler = defaultHandler;
    delete: RequestHandler = defaultHandler;
}

export default App;
