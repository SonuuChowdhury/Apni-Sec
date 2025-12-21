import { Schema, model, Document } from "mongoose";
import { IUser } from "./user.interface";

export interface IUserDocument extends IUser, Document {}

const UserSchema =  new Schema<IUserDocument>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true }
    },{ timestamps: true })

export const UserModel = model<IUserDocument>("User", UserSchema);
