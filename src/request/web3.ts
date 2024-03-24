import { Option, Some, None, Result, Err, Ok } from "ts-results";
import {
    BaseContractMethod,
    JsonRpcProvider,
    TransactionResponse,
    Wallet,
    ethers,
} from "ethers";
import { Contract } from "ethers";

type newWallet = {
    address: string;
    privateKey: string;
};

// public address store in database
// private key to not store in database
// the same as mnemonic
class InnoWeb3 {
    static self: Option<InnoWeb3> = None;
    rpc: Option<JsonRpcProvider> = None;
    // etherscanProvider = new CustomEtherscanProvider();
    smartContract: Option<{
        address: string;
        abi: any[];
    }> = None;
    adminWallet: Option<Wallet> = None;

    static getSelf(): InnoWeb3 {
        if (InnoWeb3.self === None) {
            InnoWeb3.self = Some(new InnoWeb3());
        }

        return InnoWeb3.self.unwrap();
    }

    withURL(rpcURL: string, port: string): InnoWeb3 {
        const url = `http://${rpcURL}:${port}`;
        this.rpc = Some(new JsonRpcProvider(url));
        return this;
    }

    withAdminPrivateKey(privateKey: string): InnoWeb3 {
        this.adminWallet = Some(this.getWallet(privateKey).unwrap());
        return this;
    }

    withSmartContract(address: string, abi: any[]): InnoWeb3 {
        this.smartContract = Some({ address, abi });
        return this;
    }

    getWallet(privateKey: string): Result<Wallet, string> {
        if (this.rpc === None) {
            return Err("rpc has not been initialized yet.");
        }

        return Ok(new Wallet(privateKey, this.rpc.unwrap()));
    }

    getSmartContract(signer: Wallet): Result<Contract, string> {
        if (this.smartContract === None) {
            return Err("smart contract has not been initialized yet.");
        }

        return Ok(
            new Contract(
                this.smartContract.unwrap().address,
                this.smartContract.unwrap().abi,
                signer
            )
        );
    }

    createWallet(): Result<newWallet, string> {
        if (this.rpc === None) {
            return Err("rpc has not been initialized yet.");
        }

        const wallet = Wallet.createRandom().connect(this.rpc.unwrap());
        const address = wallet.address;
        const privateKey = wallet.privateKey;

        return Ok({ address, privateKey });
    }

    async getBalance(address: string): Promise<Result<bigint, string>> {
        if (this.rpc === None) {
            return Err("rpc has not been initialized yet.");
        }

        return Ok(await this.rpc.unwrap().getBalance(address));
    }

    async transfer(
        from: Wallet,
        to: string,
        amount: bigint
    ): Promise<TransactionResponse> {
        //! Caution: Turn on geth miner in order to process the transaction
        return await from.sendTransaction({ to, value: amount });
    }

    async setPurchase(
        from: Contract, // this is the one who get the product, and thus, send the money
        to: string, // this is the one who sell the product, and thus, receive the money
        product_id: string // this is the product id
    ): Promise<Option<BaseContractMethod<any[], any, any>>> {
        const purchase = from["makePurchase"];
        if (purchase === undefined) {
            return None;
        }

        return await purchase(product_id, to, {
            gasPrice: ethers.parseUnits("500", "gwei"),
        });
    }

    async getPurchaseCount(
        from: Contract
    ): Promise<Option<BaseContractMethod<any[], any, any>>> {
        const count = from["getUserPurchases"];
        if (count === undefined) {
            return None;
        }

        return count();
    }

    // wait till the transaction is mined
    // async waitTransaction(transaction: TransactionResponse): Promise<void> {
    //     await transaction.wait();
    // }
}

export default InnoWeb3;
