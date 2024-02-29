import { Request, Response, NextFunction } from "express";

export const setHeader =
    (_req: Request, res: Response, next: NextFunction) => {
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
        next();
    };
