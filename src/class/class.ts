import InnoDB from "../request/database";
import InnoEvent from "../request/event";
import EventChain from "../request/eventchain";

export default class Class {
    db = InnoDB.getSelf().getDB();
    inno_event = InnoEvent.getSelf(); // this should only be used for publishing events
    event = EventChain.new();
}
