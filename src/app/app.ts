import CRUD from "../request/CRUD";
import InnoDB from "../request/database";
import RequestChain from "../request/chain";
import InnoEvent, { InnoEventType } from "../request/event";

class App implements CRUD {
    db = InnoDB.getSelf().getDB();
    event = InnoEvent.getSelf();

    // CRUD
    post: RequestChain = RequestChain.default();
    get: RequestChain = RequestChain.default();
    put: RequestChain = RequestChain.default();
    delete: RequestChain = RequestChain.default();

    pub(event: InnoEventType, data: any) {
        this.event.publish(event, data);
    }
}

export default App;
