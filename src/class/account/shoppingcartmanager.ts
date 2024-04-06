import { InnoEventType } from "../../request/event";
import EventChain from "../../request/eventchain";
import Class from "../class";

export default class ShoppingCartManager extends Class {
    override event = EventChain.new().get(
        InnoEventType.InitUserManagement,
        (e: string) => {
            console.log(`${e} Shopping Cart Manager is ready.`);
            this.inno_event.publish(
                InnoEventType.InitShoppingCartManager,
                `${e} [Shopping Cart Manager]`
            );
        }
    );
}
