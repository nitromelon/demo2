import { ProductStatus } from "@prisma/client";
import RequestChain from "../request/chain";
import App from "./app";

type HomeData = {
    categories: string[];
    header: {
        id: string;
        title: string;
        image: string; // for now: localhost + url
        price: number;
        priceHistory: number[];
    }[];
    body: {
        category: string;
        data: {
            id: string;
            title: string;
            image: string;
            price: number;
            priceHistory: number[];
        }[];
    }[];
};

type GalleryData = {
    category: string;
    data: {
        id: string;
        title: string;
        image: string;
        price: number;
        priceHistory: number[];
    }[];
};

export default class Gallery extends App {
    override post = RequestChain.create(async (_req, res) => {
        const categories = this.db.category.findMany({
            select: {
                name: true,
            },
        });

        const header = this.db.product.findMany({
            take: 8,
            orderBy: {
                createdAt: "desc",
            },
            select: {
                id: true,
                name: true,
                image: true,
                price: true,
                priceHistory: true,
            },
            where: {
                status: ProductStatus.SALE,
            },
        });

        const body = this.db.category.findMany({
            include: {
                products: {
                    take: 8,
                    orderBy: {
                        createdAt: "desc",
                    },
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        price: true,
                        priceHistory: true,
                    },
                    where: {
                        status: ProductStatus.SALE,
                    },
                },
            },
        });

        const [future1, future2, future3] = await Promise.all([
            categories,
            header,
            body,
        ]);

        const data: HomeData = {
            categories: future1.map((category) => category.name),
            header: future2.map((product) => ({
                id: product.id,
                title: product.name,
                image: product.image ?? "",
                price: product.price,
                priceHistory: product.priceHistory,
            })),
            body: future3.map((category) => ({
                category: category.name,
                data: category.products.map((product) => ({
                    id: product.id,
                    title: product.name,
                    image: product.image ?? "",
                    price: product.price,
                    priceHistory: product.priceHistory,
                })),
            })),
        };

        res.json(data);
    });

    override get = RequestChain.create(async (req, res) => {
        const param = req.params["id"];
        if (param === undefined) {
            res.status(400).send("Bad Request");
            return;
        }

        // list 20 products of that category = param
        const products = await this.db.product.findMany({
            where: {
                Category: {
                    name: param,
                },
                status: ProductStatus.SALE,
            },
            take: 20,
            orderBy: {
                createdAt: "desc",
            },
            select: {
                id: true,
                name: true,
                image: true,
                price: true,
                priceHistory: true,
            },
        });

        const data: GalleryData = {
            category: param,
            data: products.map((product) => ({
                id: product.id,
                title: product.name,
                image: product.image ?? "",
                price: product.price,
                priceHistory: product.priceHistory,
            })),
        };

        res.json(data);
    });
}
