import checkJWT from "../middleware/jwt";
import RequestChain from "../request/chain";
import App from "./app";

export default class User extends App {
    // sign up
    override post = RequestChain.create(async (req, res) => {
        // create user with info in req.body
        const sub = req.auth?.payload.sub;
        const username: string | undefined = req.body.username;
        const email: string | undefined = req.body.email;
        if (!sub || !username || !email) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const data = {
            sub: sub,
            username: username,
            email: email,
        };

        const user = await this.db.user.create({ data });
        res.status(201).json(user);
    }).add_middleware(checkJWT);

    // sign in
    override get = RequestChain.create(async (req, res) => {
        // get user info in param "id" and double check with JWT
        const sub = req.auth?.payload.sub;
        const param_sub = req.params["id"];
        if (!sub || !param_sub || sub !== param_sub) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        // get user info from database
        const user = await this.db.user.findUnique({ where: { sub } });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        res.status(200).json(user);
    }).add_middleware(checkJWT);
}
