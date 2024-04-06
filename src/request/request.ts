import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Express } from "express";
import helmet from "helmet";
import compression from "compression";
import { log } from "../middleware/log";
import { setHeader } from "../middleware/header";
import CRUD from "./CRUD";
import Class from "../class/class";
import InnoEvent, { InnoEventType } from "../request/event";

// note: use signed cookies to prevent cookie tampering
// note2: separate code from now on

class InnoBE {
    app: Express;
    backendPort: number;
    frontendPort: number;
    address: string;
    event = InnoEvent.getSelf();

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
        address: string,
        backendPort: number,
        frontendPort: number
    ): InnoBE {
        return new InnoBE(express(), address, backendPort, frontendPort);
    }

    // middleware
    config(): InnoBE {
        this.app.use(
            cors({
                // origin: `http://localhost:${this.frontendPort}`,
                origin: `*`,
                credentials: true,
            })
        );
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(express.text({ limit: "1mb" }));
        this.app.use(cookieParser());
        this.app.use(helmet());
        this.app.use(compression());

        // custom middleware
        this.app.use(log);
        this.app.use(setHeader);

        return this;
    }

    start(): InnoBE {
        this.app.listen(this.backendPort, this.address, () => {
            console.log(`Server is running on port ${this.backendPort}.`);
        });

        // Start the bootstrap process
        this.event.publish(InnoEventType.Init, "[Bootstrap Process]");

        return this;
    }

    // plug-in CRUD function and route as input
    route(path: string, handlers: CRUD): InnoBE {
        // rewrite delete to del to avoid conflict with reserved keyword
        const { post, get, put, delete: del } = handlers;

        path = `/api${path}`;
        this.app.post(path, post.export());
        this.app.get(`${path}/:id`, get.export());
        this.app.put(`${path}/:id`, put.export());
        this.app.delete(`${path}/:id`, del.export());

        return this;
    }

    subcribe(sub: Class): InnoBE {
        sub.event.export().forEach((value, key) => {
            value.forEach((func) => {
                this.event.subscribe(key, func);
            });
        });
        return this;
    }

    // default route: unmatched route
    catch(): InnoBE {
        this.app.all("*", (_req, res) => {
            res.status(404).json({ message: "Not Found" });
        });

        return this;
    }
}

export default InnoBE;
