// package
import dotenv from "dotenv";
import InnoBE from "./request/request";
import InnoDB from "./request/database";
// import Demo from "./app/demo";
import InnoWeb3 from "./request/web3";
import Wallet from "./app/wallet";
import WalletSend from "./app/wallet_send";
import User from "./app/user";
import UploadContent from "./app/upload_content/upload_content";
import contract from "../hardhat/artifacts/contracts/Transaction.sol/Transaction.json";
import Gallery from "./app/gallery";
import GalleryPage from "./app/gallery_page";
import Product from "./app/product";
import ProductRelated from "./app/product_related";
import MarketRate from "./app/market_rate";
import Search from "./app/search";

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

InnoWeb3.getSelf()
    .withURL(gethURL, gethPort)
    .withAdminPrivateKey(adminPrivateKey)
    .withSmartContract(contractAddress, contract.abi);

InnoBE.create("0.0.0.0", parseInt(backendPort), parseInt(fronendPort))
    .config()
    .route("/wallet", new Wallet())
    .route("/wallet/transactions", new WalletSend())
    .route("/user", new User())
    .route("/gallery", new Gallery())
    .route("/gallery/:category", new GalleryPage())
    .route("/product", new Product())
    .route("/product/:product/related", new ProductRelated())
    .route("/search", new Search())
    .route("/market_rate", new MarketRate())
    .route("/upload_content", new UploadContent()) // <- This one is to upload from json to mongodb | DEV ONLY
    .catch()
    .start();
