import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";

const config: HardhatUserConfig = {
    solidity: "0.8.24",
    networks: {
        geth: {
            url: "http://localhost:8545",
            chainId: 1214,
        },
    },
};

export default config;
