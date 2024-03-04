// package
import dotenv from "dotenv";
import InnoBE from "./request/request";
import InnoDB from "./request/database";
import Demo from "./app/demo";

dotenv.config();

// config env
const backendPort = process.env["BACKEND_PORT"];
const fronendPort = process.env["FRONTEND_PORT"];

const user = process.env["MONGO_USER"];
const password = process.env["MONGO_PASSWORD"];
const dbName = process.env["MONGO_DATABASE"];

const host = process.env["DATABASE_HOST"];
const port = process.env["DATABASE_PORT"];

if (
    !(backendPort && fronendPort && user && password && dbName && host && port)
) {
    console.error(".env not found");
    process.exit(1);
}

async function main(
    backendPort: string,
    fronendPort: string,
    user: string,
    password: string,
    dbName: string,
    host: string,
    port: string
) {
    await InnoDB.getSelf().create(user, password, dbName, host, port);

    InnoBE.create("0.0.0.0", parseInt(backendPort), parseInt(fronendPort))
        .config()
        .route("/page", new Demo())
        .catch()
        .start();
}

main(backendPort, fronendPort, user, password, dbName, host, port);
