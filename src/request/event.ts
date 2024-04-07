import { None, Option, Some } from "ts-results";
// import InnoDB from "./database";

export enum InnoEventType {
    Init, // Bootstrap Process
    InitProductManager, // for class ProductManager to init Product
    InitShoppingCartManager, // for class ShoppingCartManager to init ShoppingCart
    InitShoppingCart, // for class ShoppingCart to init Product
    InitOrder, // for class Order to init InitSalesInvoice
    InitSalesInvoice, // for class SalesInvoice to init Payment and Receipt
    InitUserManagement, // for class UserManagement to init User (admin, user, product manager, shopping cart manager, etc)

    Account,
    Product,

    // this will change shopping cart and order
    AddToShoppingCart,
    ListShoppingCart,
    RemoveFromShoppingCart,
    UpdateShoppingCart, // for class Receipt

    // this will change invoice, then payment, then receipt
    CreateOrder,
    CreateInvoice, // for class Invoice
    PayInvoice, // for class Payment
}

export default class InnoEvent {
    static self: Option<InnoEvent> = None;
    subscribers: Map<InnoEventType, Function[]> = new Map();

    public static getSelf(): InnoEvent {
        if (InnoEvent.self.none) {
            InnoEvent.self = Some(new InnoEvent());
        }

        return InnoEvent.self.unwrap();
    }

    public subscribe(event: InnoEventType, callback: Function): void {
        if (!this.subscribers.has(event)) {
            this.subscribers.set(event, []);
        }

        this.subscribers.get(event)?.push(callback);
    }

    public publish(event: InnoEventType, data: any): void {
        if (this.subscribers.has(event)) {
            this.subscribers.get(event)?.forEach((callback) => {
                setImmediate(() => {
                    callback(data);
                });
            });
        }
    }
}
