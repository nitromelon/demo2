import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";

// 1 is the highest priority, 4 is the lowest priority
export enum UserType {
    Admin,
    ProductManager,
    ShoppingCartManager,
    User,
}

const prisma = new PrismaClient();

const userType = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const token = req.header("Authorization")?.split(" ");
    // This is custom header: Email + hashpassword. Yes this is NOT a good practice.
    // but for the sake of simplicity, we will use this.
    if (!token || token.length !== 2) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    const [email, hashpassword] = token;

    const result = await prisma.account.findUnique({
        where: {
            email: email as string,
        },

        include: {
            User: true,
            Admin: true,
            ShoppingCartManager: true,
            ProductManager: true,
        },
    });

    if (!result || result.password !== hashpassword) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    if (result.Admin.length !== 0) req.userType = UserType.Admin;
    else if (result.ProductManager.length !== 0) req.userType = UserType.ProductManager;
    else if (result.ShoppingCartManager.length !== 0)
        req.userType = UserType.ShoppingCartManager;
    else req.userType = UserType.User;

    req.userId = result.id;

    next();
};

export default userType;