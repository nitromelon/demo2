import { OrderStatus } from "@prisma/client";
import { InnoEventType } from "../request/event";
import EventChain from "../request/eventchain";
import Class from "./class";

export type OrderPending = {
    status: OrderStatus;
    order_id: string;
};

export default class Order extends Class {
    override event = EventChain.new()
        .get(InnoEventType.Init, (e: string) => {
            console.log(`${e} Order is ready.`);
            this.inno_event.publish(InnoEventType.InitOrder, `${e} [Order]`);
        })
        .get(InnoEventType.CreateOrder, async (e: OrderPending) => {
            // simulate manual processing time by managers
            const random_processing_time = Math.floor(Math.random() * 10) + 1;
            await new Promise((resolve) =>
                setTimeout(resolve, random_processing_time * 1000)
            );

            let message = `[Order] Order ${e.order_id} is being`;
            let next_status: OrderStatus;

            // PoC for now
            switch (e.status) {
                case OrderStatus.PENDING:
                    message += " processed";
                    next_status = OrderStatus.PROCESSING;
                    break;
                case OrderStatus.PROCESSING:
                    message += " processed";
                    next_status = OrderStatus.DELIVERED;
                    break;
                case OrderStatus.DELIVERED:
                    message += " delivered";
                    next_status = OrderStatus.DELIVERED;
                    break;
                case OrderStatus.CANCELLED:
                    message += " canceled";
                    next_status = OrderStatus.DELIVERED;
                    break;
            }

            console.log(message);

            if (next_status === OrderStatus.DELIVERED) {
                console.log(`[Order] Order ${e.order_id} is completed`);
                this.inno_event.publish(InnoEventType.CreateInvoice, e);
            } else {
                // change state of order
                await this.db.order.update({
                    where: {
                        id: e.order_id,
                    },
                    data: {
                        status: next_status,
                    },
                });

                this.inno_event.publish(InnoEventType.CreateOrder, {
                    status: next_status,
                    order_id: e.order_id,
                });
            }
        });
}
