import { Option, Some, None, Result, Err, Ok } from "ts-results";
import { BigNumberish, JsonRpcProvider, Wallet } from "ethers";

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
    adminPrivateKey: Option<string> = None;

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
        this.adminPrivateKey = Some(privateKey);
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

    getBalance(address: string): Result<Promise<BigNumberish>, string> {
        if (this.rpc === None) {
            return Err("rpc has not been initialized yet.");
        }

        return Ok(this.rpc.unwrap().getBalance(address));
    }

    getBalanceOfAdmin(): Result<Promise<BigNumberish>, string> {
        if (this.adminPrivateKey === None) {
            return Err("admin private key has not been initialized yet.");
        }

        return this.getBalance(
            this.getWallet(this.adminPrivateKey.unwrap()).unwrap().address
        );
    }
}

export default InnoWeb3;
