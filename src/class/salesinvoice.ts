import { InnoEventType } from "../request/event";
import EventChain from "../request/eventchain";
import Class from "./class";
import { OrderPending } from "./order";

export default class SalesInvoice extends Class {
    override event = EventChain.new()
        .get(InnoEventType.InitOrder, (e: string) => {
            console.log(`${e} Sales Invoice is ready.`);
            this.inno_event.publish(
                InnoEventType.InitSalesInvoice,
                `${e} [Sales Invoice]`
            );
        })
        .get(InnoEventType.CreateInvoice, async (e: OrderPending) => {
            console.log(
                `[Sales Invoice] Creating invoice for order ${e.order_id}`
            );
            const time = new Date().toISOString();
            console.log(
                `[Sales Invoice] Invoice for order ${e.order_id} is created at ${time}`
            );

            this.inno_event.publish(InnoEventType.PayInvoice, e);
        });
}
