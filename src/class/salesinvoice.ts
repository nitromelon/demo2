import { InnoEventType } from "../request/event";
import EventChain from "../request/eventchain";
import Class from "./class";

export default class SalesInvoice extends Class {
    override event = EventChain.new().get(InnoEventType.Init, (e: string) => {
        console.log(`${e} Sales Invoice is ready.`);
        this.inno_event.publish(
            InnoEventType.InitSalesInvoice,
            `${e} [Sales Invoice]`
        );
    });
}
