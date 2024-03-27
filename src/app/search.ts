import RequestChain from "../request/chain";
import App from "./app";

export default class Search extends App {
    override get = RequestChain.create(async (req, res) => {
        const keyword = req.params["id"];
        if (keyword === undefined) {
            res.status(400).json({ error: "Bad Request" });
            return;
        }

        const result = await this.db.product.findMany({
            where: {
                OR: [
                    { name: { contains: keyword } },
                    { description: { contains: keyword } },
                ],
            },

            select: {
                id: true,
                name: true,
                image: true,
                price: true,
                priceHistory: true,
            },
        });

        const data = result
            .map((product) => ({
                id: product.id,
                title: product.name,
                image: product.image ?? "",
                price: product.price,
                priceHistory: product.priceHistory,
            }))
            .sort(() => Math.random() - 0.5)
            .slice(0, 20);

        res.status(200).json(data);
    });
}
