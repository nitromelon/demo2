import { RequestHandler, Request, Response } from "express";

const defaultHandler: RequestHandler = (req: Request, res: Response) =>
    res.status(404).json({ message: `Cannot ${req.method} ${req.url}` });

// This file is for chain request: middlewares then handler
class RequestChain {
    middlewares: RequestHandler[] = [];
    handler: RequestHandler;

    constructor(handler: RequestHandler) {
        this.handler = handler;
    }

    static create(handler: RequestHandler): RequestChain {
        return new RequestChain(handler);
    }

    static default(): RequestChain {
        return new RequestChain(defaultHandler);
    }

    add_middleware(middleware: RequestHandler): RequestChain {
        this.middlewares.push(middleware);
        return this;
    }

    export(): RequestHandler[] {
        return [...this.middlewares, this.handler]
    }
}

export default RequestChain;
