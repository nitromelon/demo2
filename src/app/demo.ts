import App from "./app";
import RequestChain from "../request/chain";
import userType from "../middleware/user_type";

export default class Demo extends App {
    override post = RequestChain.create(async (_req, res) => {
        res.status(201).json({ message: "POST request to /page" });
        
    }).add_middleware(userType).add_middleware((req, _res, next) => {
        console.log("User type:", req.userType)
        console.log("User ID:", req.userId);
        next();
    });

    override get = RequestChain.create((req, res) => {
        res.status(200).json({
            message: `GET request to /page with id ${req.params["id"]}`,
        });
    });

    override put = RequestChain.create((_req, res) => {
        res.status(200).json({ message: "PUT request to /page" });
    });

    override delete = RequestChain.create((_req, res) => {
        res.status(200).json({ message: "DELETE request to /page" });
    });
}
