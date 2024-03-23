import RequestChain from "../../request/chain";
import App from "../app";

type category_data_json = {
    name: string;
}[];

type product_data_json = {
    name: string;
    description: string;
    price: number;
    image: string;
    priceHistory: number[];
}[];

type provider_data_json = {
    name: string;
}[];

type map_json = {
    id: string;
    category: string;
}[];

export default class UploadContent extends App {
    // read from category_data.json, product_data.json, provider_data.json
    category = require("./category_data.json") as category_data_json;
    product = require("./product_data.json") as product_data_json;
    provider = require("./provider_data.json") as provider_data_json;
    map = require("./map_data.json") as map_json;

    override post = RequestChain.create(async (_req, res) => {
        // insert into database
        let promises = [];

        for (let i = 0; i < this.category.length; i++) {
            promises.push(
                this.db.category.create({
                    data: {
                        name: this.category[i]!.name,
                    },
                })
            );
        }

        for (let i = 0; i < this.provider.length; i++) {
            promises.push(
                this.db.provider.create({
                    data: {
                        name: this.provider[i]!.name,
                    },
                })
            );
        }

        for (let i = 0; i < this.product.length; i++) {
            promises.push(
                this.db.product.create({
                    data: {
                        name: this.product[i]!.name,
                        description: this.product[i]!.description,
                        price: this.product[i]!.price,
                        image: this.product[i]!.image,
                        priceHistory: this.product[i]!.priceHistory,
                    },
                })
            );
        }

        // step 1: insert into database
        await Promise.all(promises).catch((err) => {
            console.error(err);
            res.status(500).json({ message: "Internal Server Error" });
            return;
        });

        // step 2: make relationship
        // get the image url, remove /static/img/, remove .jpg, extract to get the id, then map to the category
        let map = this.map;
        let product = await this.db.product.findMany();
        let category = await this.db.category.findMany();
        let yet_another_promises = [];

        for (let i = 0; i < product.length; i++) {
            let id = product[i]!.image!.replace("/static/img/", "").replace(
                ".jpg",
                ""
            );
            let category_id = map.find((x) => x!.id === id)!.category;
            yet_another_promises.push(
                this.db.product.update({
                    where: {
                        id: product[i]!.id,
                    },
                    data: {
                        Category: {
                            connect: {
                                id: category.find(
                                    (x) => x!.name === category_id
                                )!.id,
                            },
                        },
                    },
                })
            );
        }

        await Promise.all(yet_another_promises).catch((err) => {
            console.error(err);
            res.status(500).json({ message: "Internal Server Error" });
            return;
        });

        // step 3: another relationship from provider to product
        let provider = await this.db.provider.findMany();
        let product2 = await this.db.product.findMany();
        let yet_another_promises2 = [];

        for (let i = 0; i < product2.length; i++) {
            yet_another_promises2.push(
                this.db.product.update({
                    where: {
                        id: product2[i]!.id,
                    },
                    data: {
                        Provider: {
                            connect: {
                                id: provider[
                                    Math.floor(Math.random() * provider.length)
                                ]!.id,
                            },
                        },
                    },
                })
            );
        }

        await Promise.all(yet_another_promises2).catch((err) => {
            console.error(err);
            res.status(500).json({ message: "Internal Server Error" });
            return;
        });

        res.status(201).json({ message: "POST request to /upload_content" });
    });

    override get = RequestChain.create(async (_req, res) => {
        let product = await this.db.product.findMany({
            include: {
                Category: true,
                Provider: true,
            }
        });

        res.status(200).json({
            first_product_result: product[0],
        });
    });
}
