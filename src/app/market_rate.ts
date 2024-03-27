import RequestChain from "../request/chain";
import App from "./app";

export default class MarketRate extends App {
    override post = RequestChain.create((_req, res) => {
        res.status(200).send({ number: 1234.5 });
    });
}
