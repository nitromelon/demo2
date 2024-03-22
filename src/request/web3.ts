import { Option, Some, None, Result, Err, Ok } from "ts-results";
import { JsonRpcProvider, TransactionResponse, Wallet } from "ethers";

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

    getWallet(privateKey: string): Result<Wallet, string> {
        if (this.rpc === None) {
            return Err("rpc has not been initialized yet.");
        }

        return Ok(new Wallet(privateKey, this.rpc.unwrap()));
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
    ): Promise<Result<TransactionResponse, string>> {
        if (this.rpc === None) {
            return Err("rpc has not been initialized yet.");
        }

        //! Caution: Turn on geth miner in order to process the transaction
        return Ok(await from.sendTransaction({ to, value: amount }));
    }
}

export default InnoWeb3;
