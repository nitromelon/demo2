import { InnoEventType } from "../request/event";
import EventChain from "../request/eventchain";
import Class from "./class";

export default class ShoppingCart extends Class {
    override event = EventChain.new().get(
        InnoEventType.InitShoppingCartManager,
        (e: string) => {
            console.log(`${e} Shopping Cart is ready.`);
            this.inno_event.publish(
                InnoEventType.InitShoppingCart,
                `${e} [Shopping Cart]`
            );
        }
    );
}
