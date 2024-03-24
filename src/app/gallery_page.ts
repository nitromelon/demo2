import { ProductStatus } from "@prisma/client";
import RequestChain from "../request/chain";
import App from "./app";

type GalleryData = {
    category: string;
    data: {
        id: string;
        title: string;
        image: string;
        price: number;
        priceHistory: number[]
    }[];
};

export default class GalleryPage extends App {
    // Show count of products of a category as page
    override post = RequestChain.create(async (req, res) => {
        const category = req.params["category"];
        if (category === undefined) {
            res.status(400).json({ error: "Bad Request" });
            return;
        }

        const count = await this.db.product.count({
            where: {
                Category: {
                    name: category,
                },

                status: ProductStatus.SALE,
            },
        });

        res.json({ count: count });
    });


    // Show 20 products of a category per page
    // Todo: add price and priceHistory
    override get = RequestChain.create(async (req, res) => {
        const category = req.params["category"];
        const page = Number(req.params["id"]);
        if (category === undefined || page === undefined || isNaN(page)) {
            res.status(400).json({ error: "Bad Request" });
            return;
        }

        // list 20 products of that category = param
        const products = await this.db.product.findMany({
            where: {
                Category: {
                    name: category,
                },

                status: ProductStatus.SALE,
            },
            take: 20,
            skip: 20 * (page - 1),
            orderBy: {
                createdAt: "desc",
            },
            select: {
                id: true,
                name: true,
                image: true,
                price: true,
                priceHistory: true
            },
        });

        const data: GalleryData = {
            category: category,
            data: products.map((product) => ({
                id: product.id,
                title: product.name,
                image: product.image ?? "",
                price: product.price,
                priceHistory: product.priceHistory
            })),
        };

        res.json(data);
    });
}
