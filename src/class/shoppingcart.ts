import { Response } from "express";
import { InnoEventType } from "../request/event";
import EventChain from "../request/eventchain";
import Class from "./class";

export type ProcessingShoppingCart = {
    status: "processing";
    user_id: string;
    manager_id: string;
    product_id: string;
    quantity: number;
};

export type ListingShoppingCart = {
    status: "listing";
    user_id: string;
    res: Response;
};

export default class ShoppingCart extends Class {
    processShoppingCart = async (e: ProcessingShoppingCart) => {
        if (e.status !== "processing") {
            return;
        }

        console.log(
            `[Shopping Cart] Adding product ${e.product_id} to user ${e.user_id} shopping cart`
        );

        await this.db.user.update({
            where: {
                id: e.user_id,
            },

            data: {
                ShoppingCart: {
                    create: {
                        productId: e.product_id,
                        quantity: e.quantity,
                        managerId: e.manager_id,
                    },
                },
            },
        });

        console.log(
            `[Shopping Cart] Product ${e.product_id} added to user ${e.user_id} shopping cart by manager ${e.manager_id}`
        );
    };

    override event = EventChain.new()
        .get(InnoEventType.InitShoppingCartManager, (e: string) => {
            console.log(`${e} Shopping Cart is ready.`);
            this.inno_event.publish(
                InnoEventType.InitShoppingCart,
                `${e} [Shopping Cart]`
            );
        })
        .get(InnoEventType.AddToShoppingCart, this.processShoppingCart)
        .get(InnoEventType.ListShoppingCart, async (e: ListingShoppingCart) => {
            if (e.status !== "listing") {
                return;
            }

            console.log(
                `[Shopping Cart] Listing product in user ${e.user_id} shopping cart`
            );

            const products = await this.db.user
                .findUnique({
                    where: {
                        id: e.user_id,
                    },
                })
                .ShoppingCart(
                    {
                        include: {
                            product: true,
                        }
                    }
                );

            if (!products) {
                e.res.status(400).json({ message: "Invalid request" });
                console.error(
                    `[Shopping Cart] User with id ${e.user_id} not found.`
                );
                return;
            }

            e.res.status(200).json(products);
        });
}
