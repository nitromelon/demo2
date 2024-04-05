import { PrismaClient } from "@prisma/client";
import CRUD from "../request/CRUD";
import InnoDB from "../request/database";
import RequestChain from "../request/chain";
import InnoWeb3 from "../request/web3";

class App implements CRUD {
    // Database and Geth connection
    db = InnoDB.getSelf().getDB();
    web3 = InnoWeb3.getSelf();

    // CRUD
    post: RequestChain = RequestChain.default();
    get: RequestChain = RequestChain.default();
    put: RequestChain = RequestChain.default();
    delete: RequestChain = RequestChain.default();
}

export default App;
