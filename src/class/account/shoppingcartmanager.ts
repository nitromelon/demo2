import { Response } from "express";
import { InnoEventType } from "../../request/event";
import EventChain from "../../request/eventchain";
import Class from "../class";
import { ListingShoppingCart, ProcessingShoppingCart } from "../shoppingcart";

export type PendingShoppingCart = {
    status: "pending";
    account_id: string;
    product_id: string;
    quantity: number;
};

export type PendingShoppingCartList = {
    status: "pending";
    account_id: string;
    res: Response;
};

export type UpdatingShoppingCart = {
    status: "updating";
    user_id: string;
    cart_id: string;
    product_id: string;
    quantity: number;
    res: Response;
};

export type RemovingShoppingCart = {
    status: "deleting";
    user_id: string;
    cart_id: string;
    product_id: string;
    res: Response;
};

// For now this manager will also manage order
// as currently there is no significant difference between shopping cart and order
export default class ShoppingCartManager extends Class {
    createShoppingCart = async (e: PendingShoppingCart) => {
        if (e.status !== "pending") {
            return;
        }

        console.log(
            `[Shopping Cart Manager] Processing product ${e.product_id} to user ${e.account_id} shopping cart`
        );

        // get user id based on account id
        // this should be manually monitored by manager, but this time I will take the first manager id
        const [user, manager] = await Promise.all([
            this.db.user.findFirst({
                where: {
                    info: {
                        id: e.account_id,
                    },
                },
            }),
            this.db.shoppingCartManager.findFirst(),
        ]);

        if (!user || !manager) {
            console.error(
                `[Shopping Cart Manager] User with account id ${e.account_id} not found. Or manager not found.`
            );
            return;
        }

        const result: ProcessingShoppingCart = {
            status: "processing",
            user_id: user.id,
            manager_id: manager.id,
            product_id: e.product_id,
            quantity: e.quantity,
        };

        this.inno_event.publish(InnoEventType.AddToShoppingCart, result);
    };

    listShoppingCart = async (e: PendingShoppingCartList) => {
        if (e.status !== "pending") {
            return;
        }

        console.log(
            `[Shopping Cart Manager] Listing all product in user ${e.account_id} shopping cart`
        );

        // get user id based on account id
        // this should be manually monitored by manager, but this time I will take the first manager id
        const acc = await this.db.user.findFirst({
            where: {
                info: {
                    id: e.account_id,
                },
            },
        });

        if (!acc) {
            e.res.status(400).json({ message: "Invalid request" });
            console.error(
                `[Shopping Cart Manager] User with account id ${e.account_id} not found.`
            );
            return;
        }

        const forward: ListingShoppingCart = {
            status: "listing",
            user_id: acc.id,
            res: e.res,
        };

        this.inno_event.publish(InnoEventType.ListShoppingCart, forward);
    };

    updateShoppingCart = async (e: UpdatingShoppingCart) => {
        if (e.status !== "updating") {
            return;
        }

        console.log(
            `[Shopping Cart Manager] Updating product ${e.product_id} in user ${e.user_id} shopping cart`
        );

        const cart = await this.db.shoppingCart.findFirst({
            where: {
                id: e.cart_id,
            },
        });

        if (!cart) {
            e.res.status(400).json({ message: "Invalid request" });
            console.error(
                `[Shopping Cart Manager] Cart with id ${e.cart_id} not found.`
            );
            return;
        }

        const result = await this.db.shoppingCart.update({
            where: {
                id: e.cart_id,
            },
            data: {
                quantity: e.quantity,
            },
        });

        e.res.status(200).json({ data: result });
    };

    removeFromShoppingCart = async (e: RemovingShoppingCart) => {
        if (e.status !== "deleting") {
            return;
        }

        console.log(
            `[Shopping Cart Manager] Removing product ${e.product_id} from user ${e.user_id} shopping cart`
        );

        const cart = await this.db.shoppingCart.findFirst({
            where: {
                id: e.cart_id,
            },
        });

        if (!cart) {
            e.res.status(400).json({ message: "Invalid request" });
            console.error(
                `[Shopping Cart Manager] Cart with id ${e.cart_id} not found.`
            );
            return;
        }

        const result = await this.db.shoppingCart.delete({
            where: {
                id: e.cart_id,
            },
        });

        e.res.status(200).json({ data: result });
    };

    override event = EventChain.new()
        .get(InnoEventType.InitUserManagement, (e: string) => {
            console.log(`${e} Shopping Cart Manager is ready.`);
            this.inno_event.publish(
                InnoEventType.InitShoppingCartManager,
                `${e} [Shopping Cart Manager]`
            );
        })
        .get(InnoEventType.AddToShoppingCart, this.createShoppingCart)
        .get(InnoEventType.ListShoppingCart, this.listShoppingCart)
        .get(InnoEventType.UpdateShoppingCart, this.updateShoppingCart)
        .get(InnoEventType.RemoveFromShoppingCart, this.removeFromShoppingCart);
}
