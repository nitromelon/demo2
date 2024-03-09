import {
    RequestHandler,
    Request,
    Response,
    NextFunction,
    ErrorRequestHandler,
} from "express";

type Middleware = RequestHandler | ErrorRequestHandler;

const defaultHandler: RequestHandler = (req: Request, res: Response) =>
    res.status(404).json({ message: `Cannot ${req.method} ${req.url}` });

const asyncErrorHandler =
    (fn: RequestHandler): RequestHandler =>
    (req: Request, res: Response, next: NextFunction) =>
        Promise.resolve(fn(req, res, next)).catch(next);

const errorLog: ErrorRequestHandler = (
    err: any,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    console.error(err);
    res.status(err.status || 500).json({ message: "Internal Server Error" });
};

// This file is for chain request: middlewares then handler
class RequestChain {
    middlewares: RequestHandler[] = [];
    handler: RequestHandler;

    constructor(handler: RequestHandler) {
        this.handler = handler;
    }

    static create(handler: RequestHandler): RequestChain {
        return new RequestChain(asyncErrorHandler(handler));
    }

    static default(): RequestChain {
        return new RequestChain(defaultHandler);
    }

    add_middleware(middleware: RequestHandler): RequestChain {
        this.middlewares.push(asyncErrorHandler(middleware));
        return this;
    }

    export(): Middleware[] {
        return [...this.middlewares, this.handler, errorLog];
    }
}

export default RequestChain;
