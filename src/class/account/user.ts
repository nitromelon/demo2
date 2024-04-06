import { Response } from "express";
import { InnoEventType } from "../../request/event";
import EventChain from "../../request/eventchain";
import Class from "../class";
import { AccountSignInInfo } from "../usermanagement";

export type UserSignUp = {
    method: "signup";
    target: "user";
    data: {
        id: string;
        username: string;
        password: string; // this should be hashed
        email: string;
    };
    res: Response;
};

export default class UserAccount extends Class {
    createUser = async (e: UserSignUp) => {
        if (e.target !== "user" || e.method !== "signup") return;
        // console.log("UserSignUp", e);
        const user = await this.db.user.create({
            data: {
                info: {
                    connect: {
                        id: e.data.id,
                    },
                },
            },

            select: {
                info: true,
            },
        });

        e.res.status(201).json(user.info);
    };

    signIn = async (e: AccountSignInInfo) => {
        if (e.target !== "user" || e.method !== "signin") return;
        e.res.status(200).json({ ...e.data, target: e.target });
    };

    override event = EventChain.new()
        .get(InnoEventType.InitUserManagement, (e: any) =>
            console.log(`${e} User is ready.`)
        )
        .get(InnoEventType.Account, this.createUser)
        .get(InnoEventType.Account, this.signIn);
}
