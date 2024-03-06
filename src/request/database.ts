// Note: every sub-app will have to extend App to get the database connection

import { PrismaClient } from "@prisma/client";

class InnoDB {
    static self: InnoDB | null = null;
    prisma: PrismaClient = new PrismaClient();

    static getSelf(): InnoDB {
        if (InnoDB.self === null) {
            InnoDB.self = new InnoDB();
        }
        return InnoDB.self;
    }

    getDB(): PrismaClient {
        return this.prisma;
    }
}

export default InnoDB;
