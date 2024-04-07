import { OrderStatus } from "@prisma/client";
import { InnoEventType } from "../request/event";
import EventChain from "../request/eventchain";
import Class from "./class";
import { OrderPending } from "./order";

export default class Payment extends Class {
    override event = EventChain.new()
        .get(InnoEventType.InitSalesInvoice, (e: string) => {
            console.log(`${e} Payment is ready.`);
        })
        .get(InnoEventType.PayInvoice, async (e: OrderPending) => {
            console.log(
                `[Payment] Order ${e.order_id} is being paid. Exporting the receipt...`
            );
            const time = new Date().toISOString();
            console.log(`[Payment] Order ${e.order_id} is paid at ${time}`);

            // update order status
            await this.db.order.update({
                where: {
                    id: e.order_id,
                },
                data: {
                    status: OrderStatus.DELIVERED,
                },
            });
        });
}
