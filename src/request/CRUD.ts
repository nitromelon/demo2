import RequestChain from "./chain";

interface CRUD {
    post: RequestChain// create
    get: RequestChain // read
    put: RequestChain // update
    delete: RequestChain // delete;
}

export default CRUD;
