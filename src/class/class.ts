import InnoDB from "../request/database";

export default class Class {
    db = InnoDB.getSelf().getDB();
}