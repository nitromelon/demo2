import App from "./app";
import RequestChain from "../request/chain";
// import userType from "../middleware/user_type";

export default class ProductRoute extends App {
    override post = RequestChain.create(async (_req, res) => {
        // fetch all product from db
        const products = await this.db.product.findMany();
        res.status(200).json(products);
    });
}
