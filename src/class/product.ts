import { InnoEventType } from "../request/event";
import EventChain from "../request/eventchain";
import Class from "./class";
import { ProductManagerAddNotify } from "./account/productmanager";

export default class Product extends Class {
    getDescription(product: ProductManagerAddNotify): string {
        return product.data.description;
    }
    override event = EventChain.new()
        .get(InnoEventType.InitProductManager, (e: string) => {
            console.log(`${e} Product is ready.`);
        })
        .get(InnoEventType.Product, async (e: ProductManagerAddNotify) => {
            if (e.method !== "notify") {
                return;
            }

            console.log(
                `[Product] ${e.data.name} has been added by ${
                    e.productManagerName
                }: ${this.getDescription(e)}`
            );
        });
}
