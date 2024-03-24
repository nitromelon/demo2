import { ethers } from "hardhat";

async function main() {
    let PurChase = await ethers.getContractFactory("Transaction");
    let purChase = await PurChase.deploy();
    console.log(purChase.target.toString());
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
