import RequestChain from "../request/chain";
import App from "./app";

export default class UserID extends App {
    override get = RequestChain.create(async (req, res) => {
        const username = req.params["id"];

        if (!username) {
            res.status(400).json({ message: "Bad request" });
            return;
        }

        const result = this.db.user.findUnique({
            where: {
                username: username,
            },

            select: {
                username: true,
                password: true,
            },
        });

        if (result) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: "Not found" });
        }
    });
}
