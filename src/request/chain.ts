import { RequestHandler, Request, Response, NextFunction } from "express";

const defaultHandler: RequestHandler = (req: Request, res: Response) =>
    res.status(404).json({ message: `Cannot ${req.method} ${req.url}` });

const asyncErrorHandler =
    (fn: RequestHandler): RequestHandler =>
    (req: Request, res: Response, next: NextFunction) =>
        Promise.resolve(fn(req, res, next)).catch(next);

const errorLog: any = (err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
};

// This file is for chain request: middlewares then handler
class RequestChain {
    middlewares: RequestHandler[] = [];
    handler: RequestHandler;
    errorHandler = errorLog as RequestHandler;

    constructor(handler: RequestHandler) {
        this.handler = asyncErrorHandler(handler);
    }

    static create(handler: RequestHandler): RequestChain {
        return new RequestChain(handler);
    }

    static default(): RequestChain {
        return new RequestChain(defaultHandler);
    }

    add_middleware(middleware: RequestHandler): RequestChain {
        this.middlewares.push(asyncErrorHandler(middleware));
        return this;
    }

    export(): RequestHandler[] {
        return [...this.middlewares, this.handler, this.errorHandler];
    }
}

export default RequestChain;
