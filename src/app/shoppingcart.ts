import App from "./app";
import RequestChain from "../request/chain";
import userType from "../middleware/user_type";
import { InnoEventType } from "../request/event";
import { UpdatingShoppingCart } from "../class/account/shoppingcartmanager";

export default class ShoppingCartRoute extends App {
    // buy product with quantity
    override post = RequestChain.create(async (req, res) => {
        const user_id = req.userId; // note that this is account, not user
        const product_id = req.body.product_id;
        const quantity = req.body.quantity;

        if (!product_id || !quantity || !user_id) {
            res.status(400).json({ message: "Invalid request" });
            return;
        }

        res.status(200).json({
            message:
                "Your choosen product will be added to your cart in no time",
        });

        this.event.publish(InnoEventType.AddToShoppingCart, {
            status: "pending",
            account_id: user_id,
            product_id: product_id,
            quantity: quantity,
        });
    }).add_middleware(userType);

    // List all product in user shopping cart
    override get = RequestChain.create(async (req, res) => {
        const user_id = req.userId;

        if (!user_id) {
            res.status(400).json({ message: "Invalid request" });
            return;
        }

        this.event.publish(InnoEventType.ListShoppingCart, {
            status: "pending",
            account_id: user_id,
            res: res,
        });
    }).add_middleware(userType);

    // update product with /:id
    override put = RequestChain.create(async (req, res) => {
        const user_id = req.userId;
        const product_id = req.params["id"];
        const cart_id = req.body.cart_id;
        const quantity = req.body.quantity;

        if (!product_id || !quantity || !user_id || !cart_id) {
            res.status(400).json({ message: "Invalid request" });
            return;
        }

        const forward: UpdatingShoppingCart = {
            status: "updating",
            user_id: user_id,
            cart_id: cart_id,
            product_id: product_id,
            quantity: quantity,
            res: res,
        };

        this.event.publish(InnoEventType.UpdateShoppingCart, forward);
    }).add_middleware(userType);

    // delete product with /:id
    override delete = RequestChain.create(async (req, res) => {
        const user_id = req.userId;
        const product_id = req.params["id"];
        const cart_id = req.body.cart_id;

        if (!product_id || !user_id || !cart_id) {
            res.status(400).json({ message: "Invalid request" });
            return;
        }

        this.event.publish(InnoEventType.RemoveFromShoppingCart, {
            status: "deleting",
            user_id: user_id,
            cart_id: cart_id,
            product_id: product_id,
            res: res,
        });
    }).add_middleware(userType);
}
