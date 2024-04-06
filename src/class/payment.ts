import { InnoEventType } from "../request/event";
import EventChain from "../request/eventchain";
import Class from "./class";

export default class Payment extends Class {
    override event = EventChain.new().get(
        InnoEventType.InitSalesInvoice,
        (e: string) => {
            console.log(`${e} Payment is ready.`);
        }
    );
}
