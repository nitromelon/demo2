import { checkPassword, hashPassword } from "../function/bscript";
import RequestChain from "../request/chain";
import App from "./app";

export default class User extends App {
    override post = RequestChain.create(async (req, res) => {
        const username = req.body["username"];
        const password = req.body["password"];
        const email = req.body["email"];

        const result = await this.db.user.create({
            data: {
                username: username,
                password: await hashPassword(password),
                email: email,
            },
        });

        res.status(201).json(result);
    });

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

        const result = await this.db.user.findUnique({
            where: {
                email: email,
            },
            select: {
                username: true,
                password: true,
            },
        });

        if (
            result &&
            ((typeof password === "string" &&
                (await checkPassword(password, result.password))) ||
                result.password === hashpassword)
        ) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: "Not found" });
        }
    });
}
