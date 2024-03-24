import dotenv from "dotenv";
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

dotenv.config({
    path: "../.env",
});

const url = process.env["GETH_RPC_URL"] || "localhost";
const port = process.env["GETH_PORT"] || "8545";
const chainId = process.env["GETH_NETWORK_ID"] || "1214";
const admin_private_key = process.env["GETH_ACCOUNT_PRIVATE_KEY"] || "";

const config: HardhatUserConfig = {
    solidity: "0.8.24",
    networks: {
        geth: {
            url: `http://${url}:${port}`,
            chainId: parseInt(chainId),
            accounts: [admin_private_key],
        },
    },
};

export default config;
