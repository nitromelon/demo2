import mongoose from "mongoose";
import CRUD from "../request/CRUD";
import InnoDB from "../request/database";
import RequestChain from "../request/chain";

class App implements CRUD {
    db: typeof mongoose | null = InnoDB.getSelf().getDB();
    post: RequestChain = RequestChain.default();
    get: RequestChain = RequestChain.default();
    put: RequestChain = RequestChain.default();
    delete: RequestChain = RequestChain.default();
}

export default App;
