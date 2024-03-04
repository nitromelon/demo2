import { RequestHandler } from "express";

interface CRUD {
    post: RequestHandler // create
    get: RequestHandler // read
    put: RequestHandler // update
    delete: RequestHandler // delete;
}

export default CRUD;
