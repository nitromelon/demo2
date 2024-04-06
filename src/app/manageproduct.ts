// import { checkPassword, hashPassword } from "../function/bscript";
import userType, { UserType } from "../middleware/user_type";
import RequestChain from "../request/chain";
import { InnoEventType } from "../request/event";
import App from "./app";

export default class ManageProduct extends App {
    // Add new products to the database (originally catalogue but we will simplify it to product db instead)
    override post = RequestChain.create(async (req, res) => {
        const { name, description, price } = req.body;
        if (
            !name ||
            !description ||
            !price ||
            typeof name !== "string" ||
            typeof description !== "string" ||
            typeof price !== "number"
        ) {
            res.status(400).json({ message: "Bad Request" });
            return;
        }

        // Add product to the database
        res.json({
            message: "Product information has been added. Wait to be approved.",
        });

        this.event.publish(InnoEventType.Product, {
            method: "add",
            data: {
                name,
                description,
                price,
            },
            id: req.userId,
        });
    })
        .add_middleware(userType)
        .add_middleware(async (req, res, next) => {
            switch (req.userType) {
                case UserType.Admin:
                case UserType.ProductManager:
                    next();
                    break;
                default:
                    res.status(401).json({ message: "Unauthorized" });
                    break;
            }

            if (!req.userId) {
                res.status(401).json({ message: "Unauthorized" });
                return;
            }

            next();
        });

    // override put = RequestChain.create(async (req, res) => {
    // });
}
