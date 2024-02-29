import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Express } from "express";
import helmet from "helmet";
import { log } from "../middleware/log";
import { setHeader } from "../middleware/header";
import CRUD from "./CRUD";

// note: use signed cookies to prevent cookie tampering
// note2: separate code from now on

class InnoBE {
    app: Express;
    backendPort: number;
    frontendPort: number;
    address: string;

    constructor(
        app: Express,
        address: string,
        backendPort: number,
        frontendPort: number
    ) {
        this.app = app;
        this.address = address;
        this.backendPort = backendPort;
        this.frontendPort = frontendPort;
    }

    // make static constructor
    static create(
        app: Express,
        address: string,
        backendPort: number,
        frontendPort: number
    ): InnoBE {
        return new InnoBE(app, address, backendPort, frontendPort);
    }

    // middleware
    config(): InnoBE {
        this.app.use(cors({
            origin: `http://localhost:${this.frontendPort}`,
            credentials: true,
        }));
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(express.text({ limit: "1mb" }));
        this.app.use(cookieParser());
        this.app.use(helmet());

        // custom middleware
        this.app.use(log);
        this.app.use(setHeader);

        return this;
    }

    start(): InnoBE {
        this.app.listen(this.backendPort, this.address, () => {
            console.log(`Server is running on port ${this.backendPort}.`);
        });

        return this;
    }

    // plug-in CRUD function and route as input
    route(path: string, handlers: CRUD): InnoBE {
        // rewrite delete to del to avoid conflict with reserved keyword
        const { post, get, put, delete: del } = handlers;

        this.app.post(path, post);
        this.app.get(`${path}/:id`, get);
        this.app.put(`${path}/:id`, put);
        this.app.delete(`${path}/:id`, del);

        return this;
    }

    // default route: unmatched route
    catch(): InnoBE {
        this.app.all("*", (_req, res) => {
            res.status(404).json({ message: "Not Found" });
        })

        return this;
    }
}

export default InnoBE;
