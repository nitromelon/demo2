// Note: every sub-app will have to extend App to get the database connection
import { Option, Some, None } from "ts-results";
import { PrismaClient } from "@prisma/client";

class InnoDB {
    static self: Option<InnoDB> = None;
    prisma: PrismaClient = new PrismaClient();

    static getSelf(): InnoDB {
        if (InnoDB.self === None) {
            InnoDB.self = Some(new InnoDB());
        }
        return InnoDB.self.unwrap();
    }

    getDB(): PrismaClient {
        return this.prisma;
    }
}

export default InnoDB;
