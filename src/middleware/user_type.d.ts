import { UserType } from "./user_type";

declare global {
    namespace Express {
        interface Request {
            userType?: UserType;
            userId?: string;
        }
    }
}
