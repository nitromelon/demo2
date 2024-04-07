import App from "./app";
import RequestChain from "../request/chain";
import userType from "../middleware/user_type";
import { InnoEventType } from "../request/event";
import { OrderStatus } from "@prisma/client";
import { OrderPending } from "../class/order";

export default class OrderRoute extends App {
    // buy product with quantity
    override post = RequestChain.create(async (req, res) => {
        const acc_id = req.userId; // note that this is account, not user
        const product_id = req.body.product_id as string;
        const quantity = req.body.quantity as number;

        if (!product_id || !quantity || !acc_id) {
            res.status(400).json({ message: "Invalid request" });
            return;
        }

        const user = await this.db.account
            .findUnique({
                where: {
                    id: acc_id,
                },
            })
            .User();

        if (!user || user.length === 0) {
            res.status(400).json({ message: "Invalid request" });
            return;
        }

        // draft
        const order = await this.db.order.create({
            data: {
                quantity: quantity,
                productId: product_id,
                status: OrderStatus.PENDING,
                userId: user[0]!.id,
            },
        });

        res.status(200).json({
            message: {
                order_id: order.id,
                message: "Your order is being processed",
            },
        });

        const result: OrderPending = {
            status: OrderStatus.PENDING,
            order_id: order.id,
        };
        this.event.publish(InnoEventType.CreateOrder, result);
    }).add_middleware(userType);

    // Just get all history of orders because there is no need for manager
    // to monitor this
    override get = RequestChain.create(async (req, res) => {
        const acc_id = req.userId; // note that this is account, not user

        if (!acc_id) {
            res.status(400).json({ message: "Invalid request" });
            return;
        }

        const user = await this.db.account
            .findUnique({
                where: {
                    id: acc_id,
                },
            })
            .User();

        if (!user || user.length === 0) {
            res.status(400).json({ message: "Invalid request" });
            return;
        }

        const orders = await this.db.order.findMany({
            where: {
                userId: user[0]!.id,
            },

            include: {
                product: true,
            }
        });

        res.status(200).json(orders);
    }).add_middleware(userType);
}
