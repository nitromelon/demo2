import { UserSignUp } from "./account/user";
import { InnoEventType } from "../request/event";
import EventChain from "../request/eventchain";
import Class from "./class";
import { checkPassword, hashPassword } from "../function/bscript";
import { Response } from "express";

// For now I will forward to user as signup process
// is not yet implemented for any account type but user
export type AccountSignUp = {
    method: "signup";
    target: "account";
    data: {
        username: string;
        password: string;
        email: string;
    };
    res: Response;
};

export type AccountSignIn = {
    method: "signin";
    target: "account";
    data: {
        email: string;
        // Safety: password or hashpassword should be provided at a time
        password?: string;
        hashpassword?: string;
    };
    res: Response;
};

export type AccountSignInInfo = {
    method: "signin";
    target: "admin" | "user" | "productmanager" | "shoppingcartmanager";
    data: {
        email: string;
        username: string;
        password: string;
    };
    res: Response;
};

export default class UserManagement extends Class {
    // this is for signup
    checkExist = async (e: AccountSignUp) => {
        if (e.target !== "account" || e.method !== "signup") return;

        // check user exist
        const dup_acc = await this.db.account.findUnique({
            where: {
                username: e.data.username,
                email: e.data.email,
            },
        });

        if (dup_acc) {
            e.res.status(400).json({ message: "Account already exist." });
            return;
        }

        const hashedPassword = await hashPassword(e.data.password);

        const account = await this.db.account.create({
            data: {
                username: e.data.username,
                password: hashedPassword,
                email: e.data.email,
            },
        });

        const data: UserSignUp = {
            method: "signup",
            target: "user",
            data: account,
            res: e.res,
        };

        this.inno_event.publish(InnoEventType.Account, data);
    };

    signIn = async (e: AccountSignIn) => {
        if (e.target !== "account" || e.method !== "signin") return;

        const result = await this.db.account.findUnique({
            where: {
                email: e.data.email,
            },

            include: {
                User: true,
                Admin: true,
                ShoppingCartManager: true,
                ProductManager: true,
            },
        });

        if (
            result &&
            ((typeof e.data.password === "string" &&
                (await checkPassword(e.data.password, result.password))) ||
                result.password === e.data.hashpassword)
        ) {
            let target:
                | "admin"
                | "user"
                | "productmanager"
                | "shoppingcartmanager";

            if (result.User.length !== 0) {
                target = "user";
            } else if (result.Admin.length !== 0) {
                target = "admin";
            } else if (result.ShoppingCartManager.length !== 0) {
                target = "shoppingcartmanager";
            } else if (result.ProductManager.length !== 0) {
                target = "productmanager";
            } else {
                e.res.status(404).json({ message: "Not found" });
                return;
            }

            const data: AccountSignInInfo = {
                method: "signin",
                target,
                data: {
                    email: result.email,
                    username: result.username,
                    password: result.password,
                },
                res: e.res,
            };

            this.inno_event.publish(InnoEventType.Account, data);
        } else {
            e.res.status(404).json({ message: "Not found" });
        }
    };

    override event = EventChain.new()
        .get(InnoEventType.Init, (e: any) => {
            console.log(`${e} UserManagement is ready.`);
            this.inno_event.publish(
                InnoEventType.InitUserManagement,
                `${e} [User Management]`
            );
        })
        .get(InnoEventType.Account, this.checkExist)
        .get(InnoEventType.Account, this.signIn);
}
