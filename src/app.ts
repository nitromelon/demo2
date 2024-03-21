// package
import dotenv from "dotenv";
import InnoBE from "./request/request";
import InnoDB from "./request/database";
import Demo from "./app/demo";
import InnoWeb3 from "./request/web3";
import Wallets from "./app/wallets";

dotenv.config();

// config env
const backendPort = process.env["BACKEND_PORT"];
const fronendPort = process.env["FRONTEND_PORT"];
const gethURL = process.env["GETH_RPC_URL"];
const gethPort = process.env["GETH_PORT"];
const adminPrivateKey = process.env["GETH_ACCOUNT_PRIVATE_KEY"];

if (!(backendPort && fronendPort && gethURL && gethPort && adminPrivateKey)) {
    console.error(".env not found or invalid. Please check .env file.");
    process.exit(1);
}

InnoDB.getSelf();

InnoWeb3.getSelf()
    .withURL(gethURL, gethPort)
    .withAdminPrivateKey(adminPrivateKey);

InnoBE.create("0.0.0.0", parseInt(backendPort), parseInt(fronendPort))
    .config()
    .route("/wallets", new Wallets())
    // .route("/signup", new Demo()) // post request with username and password
    // .route("/login", new Demo())
    .route("/page", new Demo())
    .catch()
    .start();
