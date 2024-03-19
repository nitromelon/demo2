// package
import dotenv from "dotenv";
import InnoBE from "./request/request";
import InnoDB from "./request/database";
import Demo from "./app/demo";
import InnoWeb3 from "./request/web3";

dotenv.config();

// config env
const backendPort = process.env["BACKEND_PORT"];
const fronendPort = process.env["FRONTEND_PORT"];

if (!(backendPort && fronendPort)) {
    console.error(".env not found");
    process.exit(1);
}

InnoDB.getSelf();
InnoWeb3.getSelf();

// Todo:
// InnoWeb3

InnoBE.create("0.0.0.0", parseInt(backendPort), parseInt(fronendPort))
    .config()
    .route("/page", new Demo())
    .catch()
    .start();

import {ethers} from "ethers";
    const provider = new ethers.providers.JsonRpcProvider(
        "http://localhost:8545"
    );

async function createAccount() {
    // Create a new wallet instance with a random private key
    const wallet = ethers.Wallet.createRandom();
    // remove 0x
    const privateKey = wallet.privateKey.slice(2);

    // // Prepare the data for the POST request
    // const data = {
    //     jsonrpc: "2.0",
    //     method: "personal_importRawKey",
    //     params: [privateKey, "your_password"],
    //     id: 1,
    // };

    // // Send the POST request to the geth node
    // const response = await fetch("http://localhost:8545", {
    //     method: "POST",
    //     headers: {
    //         "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(data),
    // });

    // const responseData = await response.json();

    // // Return the new account's address
    // return JSON.stringify(responseData);

    console.log(`New account address: ${wallet.address}`);
    console.log(`New account private key: ${privateKey}`);
    console.log(`New account mnemonic: ${wallet.mnemonic.phrase}`);
    // get balance
    const wallet2 = new ethers.Wallet(privateKey, provider);
    const money = await wallet2.getBalance();
    console.log(`New account balance: ${ethers.utils.formatEther(money)} ETH`);
    
    // const admin_public_key = process.env["GETH_ACCOUNT_PUBLIC_KEY"];
    const admin_private_key = process.env["GETH_ACCOUNT_PRIVATE_KEY"];
    if (!admin_private_key) {
        console.error("GETH_ACCOUNT_PRIVATE_KEY not found");
        process.exit(1);
    }
    const admin_wallet = new ethers.Wallet(admin_private_key, provider);
    const admin_balance = await provider.getBalance(admin_wallet.address);
    console.log(`Admin balance: ${admin_balance}`);

    const transaction = {
        to: wallet.address,
        value: ethers.utils.parseEther("1000000"),
    };

    const tx = await admin_wallet.sendTransaction(transaction);
    console.log(`Transaction hash: ${tx.hash}`);

    const receipt = await tx.wait();
    console.log(`Transaction was mined in block ${receipt.blockNumber}`);

    // Check money of admin and new account
    const new_balance = await provider.getBalance(wallet.address);
    console.log(`New account balance: ${new_balance}`);

    const admin_balance_after = await provider.getBalance(admin_wallet.address);
    console.log(`Admin balance after: ${admin_balance_after}`);

    return privateKey;
}

createAccount()
    .then((address) => console.log(`New account address: ${address}`))
    .catch((error) =>
        console.error(`Error creating account: ${error.message}`)
    );