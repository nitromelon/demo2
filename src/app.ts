// package
import dotenv from "dotenv";
import InnoBE from "./request/request";
import InnoDB from "./request/database";
import Demo from "./app/demo";

dotenv.config();

// config env
const backendPort = process.env["BACKEND_PORT"];
const fronendPort = process.env["FRONTEND_PORT"];

if (!(backendPort && fronendPort)) {
    console.error(".env not found");
    process.exit(1);
}

InnoDB.getSelf();

InnoBE.create("0.0.0.0", parseInt(backendPort), parseInt(fronendPort))
    .config()
    .route("/page", new Demo())
    .catch()
    .start();
