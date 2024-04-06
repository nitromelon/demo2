import { InnoEventType } from "../request/event";
import EventChain from "../request/eventchain";
import Class from "./class";

export default class Receipt extends Class {
    override event = EventChain.new().get(
        InnoEventType.InitSalesInvoice,
        (e: string) => {
            console.log(`${e} Receipt is ready.`);
        }
    );
}
