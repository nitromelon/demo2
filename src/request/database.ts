// import mongoose from "mongoose";

// // Singleton class to handle the database connection
// // create() will be called once in the main function
// // then getDB will be called to get the database connection
// // |-> Location: app/app.ts (class App)
// // Note: every sub-app will have to extend App to get the database connection
// class InnoDB {
//     static self: InnoDB | null = null;
//     mongoose: typeof mongoose | null = null;

//     static getSelf(): InnoDB {
//         if (InnoDB.self === null) {
//             InnoDB.self = new InnoDB();
//         }
//         return InnoDB.self;
//     }

//     async create(
//         user: string,
//         password: string,
//         dbName: string,
//         host: string,
//         port: string
//     ): Promise<void> {
//         const url = `mongodb://${user}:${password}@${host}:${port}/${dbName}`;
//         try {
//             console.log("Connecting to database");
//             this.mongoose = await mongoose.connect(url);
//             console.log("Database connected");
//         } catch (e) {
//             console.error("Database connection failed");
//             console.error(e);
//             this.mongoose = null;
//         }
//     }

//     getDB(): typeof mongoose | null {
//         return this.mongoose;
//     }
// }

// export default InnoDB;
