import { RequestHandler, Request, Response } from "express";

abstract class CRUD {
    defaultHandler: RequestHandler = (req: Request, res: Response) =>
        res.status(404).json({ message: `Cannot ${req.method} ${req.url}` });
    post: RequestHandler = this.defaultHandler; // create
    get: RequestHandler = this.defaultHandler; // read
    put: RequestHandler = this.defaultHandler; // update
    delete: RequestHandler = this.defaultHandler; // delete;
}

export default CRUD;
