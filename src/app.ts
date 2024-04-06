// package
import dotenv from "dotenv";
import InnoBE from "./request/request";
import InnoDB from "./request/database";
import InnoEvent from "./request/event";
import Demo from "./app/demo";
import User from "./app/user";
import SalesInvoice from "./class/salesinvoice";
import ShoppingCart from "./class/shoppingcart";
import ShoppingCartManager from "./class/account/shoppingcartmanager";
import Payment from "./class/payment";
import Receipt from "./class/receipt";
import UserManagement from "./class/usermanagement";
import Product from "./class/product";
import ManageProduct from "./app/manageproduct";
import ProductManager from "./class/account/productmanager";
import PrerunAccounts from "./app/prerun/prerun_accounts";
import PrerunProducts from "./app/prerun/prerun_products";
import Admin from "./class/account/admin";
import UserAccount from "./class/account/user";

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
InnoEvent.getSelf();
InnoBE.create("0.0.0.0", parseInt(backendPort), parseInt(fronendPort))
    .config()

    // routes
    .route("/demo", new Demo())
    .route("/user", new User())
    .route("/product/management", new ManageProduct())
    .route("/prerun_accounts", new PrerunAccounts())
    .route("/prerun_products", new PrerunProducts())

    // event subcribers
    .subcribe(new UserManagement())
    .subcribe(new Admin())
    .subcribe(new UserAccount())
    .subcribe(new ProductManager())
    .subcribe(new ShoppingCartManager())
    .subcribe(new ShoppingCart())
    .subcribe(new Product())
    .subcribe(new SalesInvoice())
    .subcribe(new Payment())
    .subcribe(new Receipt())

    .catch()
    .start();
