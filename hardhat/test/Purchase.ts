// import { randomUUID } from "crypto";
import { ethers } from "ethers";
import contract from "../artifacts/contracts/Transaction.sol/Transaction.json";
// console.log(JSON.stringify(contract.abi));
let url = "http://localhost:8545";
// Provider
let provider = new ethers.JsonRpcProvider(url);

// signer = wallet of the user wanting to interact with the contract
let signer = new ethers.Wallet(
    "0xd2fc12cb407bad10c15d5ddbcf47ba5f4debc52d2a3386d6312cd624bf50ff88",
    provider
);
// signer.getAddress
// Signer

// Contract Address
let CONTRACT_ADDRESS = "0x3EC58e7Dfd46dD3337Ed3d897d34d90283eec65f";
// Contract
async function main() {
    let purchaseContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        contract.abi,
        signer
    );
    await purchaseContract
        // public address of the seller <- person who gets the money
        // 10 = id of the product
        .makePurchase("10", "0xedb399b9c44b7b71e4c6e6516787d3a94dc6a5f3")
        .then(async () => {
            console.log("success");
            let users = await purchaseContract.getPurchaseCount();
            console.log(users);
            // console.log(Number(users[0][1]));
            // const originalTimestamp = new Date(Number(users[0][1]) * 1000);
            // console.log(originalTimestamp);
        });
        

    setTimeout(async () => {
        let users = await purchaseContract.getPurchaseCount();
        console.log(users);
    }, 20000);

    // let user = await purchaseContract.users(signer.address)
    // console.log(user)
}
main();
