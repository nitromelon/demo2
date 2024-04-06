import { hashPassword } from "../../function/bscript";
import RequestChain from "../../request/chain";
import App from "../app";

export default class PrerunAccounts extends App {
    override post = RequestChain.create(async (_req, res) => {
        const hashedPasswords = await Promise.all([
            hashPassword("shopping_cart_manager"),
            hashPassword("product_manager"),
            hashPassword("admin"),
        ]);

        const [acc1, acc2, acc3] = await Promise.all([
            this.db.account.create({
                data: {
                    username: "shopping_cart_manager",
                    password: hashedPasswords[0],
                    email: "shopcart@gmail.com",
                },
            }),

            this.db.account.create({
                data: {
                    username: "product_manager",
                    password: hashedPasswords[2],
                    email: "productmanager@gmail.com",
                },
            }),
            this.db.account.create({
                data: {
                    username: "admin",
                    password: hashedPasswords[1],
                    email: "admin@gmail.com",
                },
            }),
        ]);

        const admin = await this.db.admin.create({
            data: {
                accountId: acc3.id,
            },
        });

        await Promise.all([
            this.db.productManager.create({
                data: {
                    accountId: acc2.id,
                    adminId: admin.id,
                },
            }),
            this.db.shoppingCartManager.create({
                data: {
                    accountId: acc1.id,
                    adminId: admin.id,
                },
            }),
        ]);

        res.status(201).json({ message: "Accounts has been created." });
    });

    override get = RequestChain.create(async (_req, res) => {
        const accounts = await this.db.account.findMany({
            select: {
                id: true,
                username: true,
                email: true,
                password: true,
            },
        });

        res.json({ accounts });
    });
}
