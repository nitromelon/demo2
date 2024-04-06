import userType, { UserType } from "../../middleware/user_type";
import RequestChain from "../../request/chain";
import { InnoEventType } from "../../request/event";
import App from "../app";

const product1 = [
    {
        name: "Kale",
        description: "Super green packed with nutrients",
        price: 1.1,
    },
    {
        name: "Sweet Potato",
        description: "High in vitamin A and fiber",
        price: 0.8,
    },
    {
        name: "Walnuts",
        description: "Great source of Omega-3 fatty acids",
        price: 3.5,
    },
    {
        name: "Greek Yogurt",
        description: "High in protein and probiotics",
        price: 1.3,
    },
    {
        name: "Olive Oil",
        description: "Heart-healthy fat, great for cooking",
        price: 4.0,
    },
    {
        name: "Flaxseeds",
        description: "Rich in fiber and a good source of Omega-3 fats",
        price: 2.2,
    },
    {
        name: "Garlic",
        description: "Adds flavor to dishes and has medicinal properties",
        price: 0.9,
    },
    {
        name: "Ginger",
        description:
            "Can help with digestion and has anti-inflammatory effects",
        price: 1.4,
    },
    {
        name: "Lentils",
        description: "High in fiber and a good source of plant-based protein",
        price: 1.8,
    },
    {
        name: "Oats",
        description: "Whole grain, good for heart health",
        price: 0.7,
    },
];

const product2 = [
    {
        name: "Spinach",
        description: "High in iron and vitamins",
        price: 1.2,
    },
    {
        name: "Almonds",
        description: "Good source of vitamin E and magnesium",
        price: 3.0,
    },
    {
        name: "Salmon",
        description: "Rich in Omega-3 fatty acids",
        price: 5.0,
    },
    {
        name: "Blueberries",
        description: "Packed with antioxidants",
        price: 2.5,
    },
    {
        name: "Broccoli",
        description: "Nutrient-dense and high in fiber",
        price: 1.0,
    },
    {
        name: "Chia Seeds",
        description: "High in fiber and Omega-3 fatty acids",
        price: 2.8,
    },
    {
        name: "Green Tea",
        description: "Contains antioxidants and may boost metabolism",
        price: 1.5,
    },
    {
        name: "Quinoa",
        description: "High in protein and gluten-free",
        price: 2.0,
    },
    {
        name: "Avocado",
        description: "Healthy fat and high in potassium",
        price: 3.2,
    },
    {
        name: "Berries",
        description: "Rich in antioxidants and vitamins",
        price: 2.3,
    },
];

const product3 = [
    {
        name: "Eggs",
        description: "Great source of protein and nutrients",
        price: 1.0,
    },
    {
        name: "Chicken Breast",
        description: "Lean protein, low in fat",
        price: 3.0,
    },
    {
        name: "Turkey",
        description: "Lean protein, good source of B vitamins",
        price: 4.0,
    },
    {
        name: "Cottage Cheese",
        description: "High in protein and calcium",
        price: 1.5,
    },
    {
        name: "Greek Yogurt",
        description: "High in protein and probiotics",
        price: 1.3,
    },
    {
        name: "Tuna",
        description: "Rich in Omega-3 fatty acids",
        price: 2.5,
    },
    {
        name: "Lean Beef",
        description: "Good source of iron and protein",
        price: 3.5,
    },
    {
        name: "Brown Rice",
        description: "Whole grain, good source of carbs",
        price: 0.8,
    },
    {
        name: "Sweet Potato",
        description: "High in vitamin A and fiber",
        price: 0.8,
    },
    {
        name: "Beans",
        description: "High in fiber and plant-based protein",
        price: 1.2,
    },
];

export default class PrerunProducts extends App {
    override post = RequestChain.create(async (req, res) => {
        const id = req.userId;
        const role = req.userType;

        // For simplicity, we will only allow Product Managers to add products. Todo: Add admin role
        if (
            role === undefined ||
            role !== UserType.ProductManager ||
            id === undefined
        ) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        // filter product that duplicates name (only name)
        const products = [...product1, ...product2, ...product3].filter(
            (product, index, self) =>
                index ===
                self.findIndex(
                    (p) => p.name.toLowerCase() === product.name.toLowerCase()
                )
        );

        // get product manager id based on his/her account id
        const productManager = await this.db.productManager.findMany({
            where: { accountId: id },
        });

        const productManagerId = productManager[0]?.id;

        if (!productManagerId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const result = await Promise.all(
            products.map(async (p) => {
                return this.db.product.create({
                    data: {
                        name: p.name,
                        description: p.description,
                        price: p.price,
                        productManager: {
                            connect: { id: productManagerId },
                        },
                    },

                    include: {
                        productManager: {
                            include: { info: { select: { username: true } } },
                        },
                    },
                });
            })
        );

        res.json({ message: "Products has been added." });

        result
            .map((product) => {
                return {
                    method: "notify",
                    data: {
                        id: product.id,
                        name: product.name,
                        description: product.description,
                        price: product.price,
                    },
                    productManagerName: product.productManager.info.username,
                };
            })
            .forEach((product) => {
                this.event.publish(InnoEventType.Product, product);
            });
    }).add_middleware(userType);

    override get = RequestChain.create(async (_req, res) => {
        const products = await this.db.product.findMany({
            select: {
                id: true,
                name: true,
                description: true,
                price: true,
            },
        });

        res.json({ products });
    });
}
