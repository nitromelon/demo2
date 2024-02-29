import { RequestHandler, Request, Response } from "express";

const defaultHandler: RequestHandler = (req: Request, res: Response) =>
    res.status(404).json({ message: `Cannot ${req.method} ${req.url}` });

abstract class CRUD {
    post: RequestHandler = defaultHandler; // create
    get: RequestHandler = defaultHandler; // read
    put: RequestHandler = defaultHandler; // update
    delete: RequestHandler = defaultHandler; // delete;
}

export default CRUD;
