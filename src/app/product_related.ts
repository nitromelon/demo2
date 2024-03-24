import { ProductStatus } from "@prisma/client";
import RequestChain from "../request/chain";
import App from "./app";

type RelatedProduct = {
    id: string;
    title: string;
    price: number;
    priceHistory: number[];
    image: string;
}[];

export default class ProductRelated extends App {
    // Show 20 products of a category per page
    override post = RequestChain.create(async (req, res) => {
        const product_id = req.params["product"];
        if (product_id === undefined) {
            res.status(400).json({ error: "Bad Request" });
            return;
        }

        // get product's priceHistory, calculate the average price, and the latest price, then search for products with similar category and similar last price
        const product = await this.db.product.findUnique({
            where: {
                id: product_id,
            },
        });

        if (!product) {
            res.status(404).json({ message: "Product not found" });
            return;
        }

        const similarProducts = await this.db.category.findMany({
            where: {
                id: product.categoryId ?? "",
            },
            include: {
                products: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        price: true,
                        priceHistory: true,
                        image: true,
                    },
                    where: {
                        price: {
                            gte: product.price - 10,
                            lte: product.price + 10,
                        },

                        status: ProductStatus.SALE,
                    },

                    take: 8,
                },
            },
        });

        const relatedProducts: RelatedProduct = [];
        similarProducts.forEach((category) => {
            category.products.forEach((product) => {
                relatedProducts.push({
                    id: product.id,
                    title: product.name,
                    price: product.price,
                    priceHistory: product.priceHistory,
                    image: product.image ?? "",
                });
            });
        });

        res.json(relatedProducts);
    });
}
