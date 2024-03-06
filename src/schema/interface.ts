import { Schema, Model, model } from "mongoose";

interface UserInterface {
    id: number;
    username: string;
    email: string;
    password: string;
    full_name: string;
    transaction: TransactionInterface[];
}

interface ProductInterface {
    id: number;
    name: string;
    description: string;
    price: number;
    image_url: string;
    stock: number;
    category: CategoryInterface;
    created_at: Date;
    updated_at: Date;
    transaction: TransactionInterface[];
}

interface TransactionInterface {
    id: number;
    user_id: number;
    product_id: number;
    quantity: number;
    total: number;
    created_at: Date;
    updated_at: Date;
    user: UserInterface;
    product: ProductInterface;
}

interface CategoryInterface {
    id: number;
    name: string;
    // description: string,
    product: ProductInterface[];
}

interface ProviderInterface {
    id: number;
    name: string;
    product: ProductInterface[];
}

interface ReviewInterface {
    id: number;
    product_id: number;
    user_id: number;
    rating: number;
    comment: string;
    created_at: Date;
    updated_at: Date;
    product: ProductInterface;
    user: UserInterface;
}

type UserModel = Model<UserInterface>;
type ProductModel = Model<ProductInterface>;
type TransactionModel = Model<TransactionInterface>;
type CategoryModel = Model<CategoryInterface>;
type ProviderModel = Model<ProviderInterface>;
type ReviewModel = Model<ReviewInterface>;

const UserSchema = new Schema<UserInterface, UserModel>({
    id: Number,
    username: String,
    email: String,
    password: String,
    full_name: String,
    transaction: [{ type: Schema.Types.ObjectId, ref: "Transaction" }],
});

const ProductSchema = new Schema<ProductInterface, ProductModel>({
    id: Number,
    name: String,
    description: String,
    price: Number,
    image_url: String,
    stock: Number,
    category: { type: Schema.Types.ObjectId, ref: "Category" },
    created_at: Date,
    updated_at: Date,
    transaction: [{ type: Schema.Types.ObjectId, ref: "Transaction" }],
});

const TransactionSchema = new Schema<TransactionInterface, TransactionModel>({
    id: Number,
    user_id: Number,
    product_id: Number,
    quantity: Number,
    total: Number,
    created_at: Date,
    updated_at: Date,
    user: { type: Schema.Types.ObjectId, ref: "User" },
    product: { type: Schema.Types.ObjectId, ref: "Product" },
});

const CategorySchema = new Schema<CategoryInterface, CategoryModel>({
    id: Number,
    name: String,
    product: [{ type: Schema.Types.ObjectId, ref: "Product" }],
});

const ProviderSchema = new Schema<ProviderInterface, ProviderModel>({
    id: Number,
    name: String,
    product: [{ type: Schema.Types.ObjectId, ref: "Product" }],
});

const ReviewSchema = new Schema<ReviewInterface, ReviewModel>({
    id: Number,
    product_id: Number,
    user_id: Number,
    rating: Number,
    comment: String,
    created_at: Date,
    updated_at: Date,
    product: { type: Schema.Types.ObjectId, ref: "Product" },
    user: { type: Schema.Types.ObjectId, ref: "User" },
});

const User: UserModel = model<UserInterface, UserModel>("User", UserSchema);

const Product: ProductModel = model<ProductInterface, ProductModel>(
    "Product",
    ProductSchema
);

const Transaction: TransactionModel = model<
    TransactionInterface,
    TransactionModel
>("Transaction", TransactionSchema);

const Category: CategoryModel = model<CategoryInterface, CategoryModel>(
    "Category",
    CategorySchema
);

const Provider: ProviderModel = model<ProviderInterface, ProviderModel>(
    "Provider",
    ProviderSchema
);

const Review: ReviewModel = model<ReviewInterface, ReviewModel>(
    "Review",
    ReviewSchema
);

export { User, Product, Transaction, Category, Provider, Review };

export type {
    UserInterface,
    ProductInterface,
    TransactionInterface,
    CategoryInterface,
    ProviderInterface,
    ReviewInterface,
    UserModel,
    ProductModel,
    TransactionModel,
    CategoryModel,
    ProviderModel,
    ReviewModel,
};
