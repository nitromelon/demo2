import { InnoEventType } from "../request/event";
import EventChain from "../request/eventchain";
import Class from "./class";
import { OrderPending } from "./order";

export default class Receipt extends Class {
    override event = EventChain.new()
        .get(InnoEventType.InitSalesInvoice, (e: string) => {
            console.log(`${e} Receipt is ready.`);
        })
        .get(InnoEventType.PayInvoice, async (e: OrderPending) => {
            console.log(`[Receipt] Order ${e.order_id} is being paid. Exporting the receipt...`);
            const time = new Date().toISOString();
            console.log(`[Receipt] Order ${e.order_id} is paid at ${time}`);
        });
}
