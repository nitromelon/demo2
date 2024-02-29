import { RequestHandler, Request, Response } from "express";

const defaultHandler: RequestHandler = (_req: Request, res: Response) =>
    res.status(404).json({ message: `Cannot ${_req.method} ${_req.url}` });

abstract class CRUD {
    post: RequestHandler = defaultHandler; // create
    get: RequestHandler = defaultHandler; // read
    put: RequestHandler = defaultHandler; // update
    delete: RequestHandler = defaultHandler; // delete;
}

export default CRUD;
