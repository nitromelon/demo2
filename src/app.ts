// package
import dotenv from "dotenv";
import InnoBE from "./request/request";
import InnoDB from "./request/database";
import Demo from "./app/demo";
// import UserID from "./app/user_id";
import User from "./app/user";

dotenv.config();

// config env
const backendPort = process.env["BACKEND_PORT"];
const fronendPort = process.env["FRONTEND_PORT"];
const gethURL = process.env["GETH_RPC_URL"];
const gethPort = process.env["GETH_PORT"];
const adminPrivateKey = process.env["GETH_ACCOUNT_PRIVATE_KEY"];
const contractAddress =
    process.env["GETH_SMART_CONTRACT_ACCOUNT_PUBLIC_ADDRESS"];

if (
    !(
        backendPort &&
        fronendPort &&
        gethURL &&
        gethPort &&
        adminPrivateKey &&
        contractAddress
    )
) {
    console.error(".env not found or invalid. Please check .env file.");
    process.exit(1);
}

InnoDB.getSelf();

InnoBE.create("0.0.0.0", parseInt(backendPort), parseInt(fronendPort))
    .config()
    .route("/demo", new Demo())
    .route("/user", new User())
    // .route("/user/id", new UserID())
    .catch()
    .start();
