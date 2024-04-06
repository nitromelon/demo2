import { InnoEventType } from "../../request/event";
import EventChain from "../../request/eventchain";
import Class from "../class";

export type ProductManagerAdd = {
    method: "add";
    data: {
        name: string;
        description: string;
        price: number;
        // image?: string;
    };
    id: string;
};

export type ProductManagerAddNotify = {
    method: "notify";
    data: {
        id: string;
        name: string;
        description: string;
        price: number;
    };
    productManagerName: string;
};

export default class ProductManager extends Class {
    // This one is to find existing product by name
    async getAvailableProduct(name: string) {
        const result = await this.db.product.findUnique({
            where: {
                name: name,
            },

            select: {
                id: true,
            },
        });

        if (!result) {
            return false;
        } else {
            return true;
        }
    }

    // get user role = admin or product manager
    async getUserRole(id: string) {
        const result = await this.db.admin.findUnique({
            where: {
                id: id,
            },

            select: {
                ProductManager: {
                    select: {
                        id: true,
                    },
                    take: 1,
                },
            },
        });

        return result;
    }

    override event = EventChain.new()
        .get(InnoEventType.InitUserManagement, (e: string) => {
            console.log(`${e} ProductManager is ready.`);
            this.inno_event.publish(
                InnoEventType.InitProductManager,
                `${e} [ProductManager]`
            );
        })
        .get(InnoEventType.Product, async (e: ProductManagerAdd) => {
            if (e.method !== "add") {
                return;
            }

            let result = false;
            let admin_id = null;

            try {
                [result, admin_id] = await Promise.all([
                    this.getAvailableProduct(e.data.name),
                    this.getUserRole(e.id),
                ]);
            } catch (error) {
                console.error(
                    `[ProductManager] Error when checking product: ${error}`
                );
                return;
            }

            if (result) {
                console.log(
                    `[ProductManager] Product already exists: ${e.data.name}`
                );
                return;
            }

            try {
                const product = await this.db.product.create({
                    data: {
                        name: e.data.name,
                        description: e.data.description,
                        price: e.data.price,
                        productManager: {
                            connect: {
                                // Safety: Must have at least one product manager and one admin
                                id:
                                    admin_id === null
                                        ? e.id
                                        : (admin_id.ProductManager[0] as any)
                                              .id,
                            },
                        },
                    },

                    include: {
                        productManager: {
                            include: {
                                info: {
                                    select: {
                                        username: true,
                                    },
                                },
                            },
                        },
                    },
                });

                console.log(
                    `[ProductManager] Product has been added: ${product.name} ${
                        admin_id === null ? "" : "by admin"
                    }`
                );

                const result: ProductManagerAddNotify = {
                    method: "notify",
                    data: {
                        id: product.id,
                        name: product.name,
                        description: product.description,
                        price: product.price,
                    },
                    productManagerName: product.productManager.info.username,
                };

                this.inno_event.publish(InnoEventType.Product, result);
            } catch (error) {
                console.error(
                    `[ProductManager] Error when adding product:\n ${error}`
                );
            }
        });
}
