import { InnoEventType } from "./event";

class EventChain {
    subscribers: Map<InnoEventType, Function[]> = new Map();

    static new(): EventChain {
        return new EventChain();
    }

    get(event: InnoEventType, func: Function): EventChain {
        if (!this.subscribers.has(event)) {
            this.subscribers.set(event, []);
        }

        this.subscribers.get(event)?.push(func);
        return this;
    }

    export(): Map<InnoEventType, Function[]> {
        return this.subscribers;
    }
}

export default EventChain;
