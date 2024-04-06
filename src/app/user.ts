import { AccountSignIn, AccountSignUp } from "../class/usermanagement";
import RequestChain from "../request/chain";
import { InnoEventType } from "../request/event";
import App from "./app";

export default class User extends App {
    // signup
    override post = RequestChain.create(async (req, res) => {
        const username = req.body["username"];
        const password = req.body["password"];
        const email = req.body["email"];

        // res.status(201).json(result);
        const data: AccountSignUp = {
            method: "signup",
            target: "account",
            data: {
                username,
                password,
                email,
            },
            res,
        };

        this.event.publish(InnoEventType.Account, data);
    });

    // sign in
    override get = RequestChain.create(async (req, res) => {
        const email = req.params["id"];
        const password: string | undefined = req.query["password"] as string;
        const hashpassword: string | undefined = req.query[
            "hshpassword"
        ] as string;

        if (!email || !(password ? !hashpassword : hashpassword)) {
            res.status(400).json({ message: "Bad request" });
            return;
        }

        const data: AccountSignIn = {
            method: "signin",
            target: "account",
            data: {
                email,
                password,
                hashpassword,
            },
            res,
        };

        this.event.publish(InnoEventType.Account, data);
    });

    // update
    // override put = RequestChain.create(async (req, res) => {
    //     const email = req.params["id"];
    //     const password: string | undefined = req.query["password"] as string;
    // });

    // delete
    // override delete = RequestChain.create(async (req, res) => {
    //     const email = req.params["id"];
    //     const password: string | undefined = req.query["password"] as string;
    // });
}
