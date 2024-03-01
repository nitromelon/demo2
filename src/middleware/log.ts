import { Request, Response, NextFunction } from "express";

export const log = (req: Request, _res: Response, next: NextFunction) => {
    console.log(
        `Request: ${req.method} ${req.url} ${JSON.stringify(req.body)}`
    );
    next();
};
