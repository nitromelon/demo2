import { InnoEventType } from "../../request/event";
import EventChain from "../../request/eventchain";
import Class from "../class";

export default class Admin extends Class {
    override event = EventChain.new().get(
        InnoEventType.InitUserManagement,
        (e: any) => console.log(`${e} Admin is ready.`)
    );
}
