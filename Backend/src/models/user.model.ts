import { Schema, model, Document } from "mongoose";
import { IUser, UserIssues } from "./user.interface";


export interface IUserDocument extends IUser, Document {}
const UserSchema =  new Schema<IUserDocument>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true }
    },{ timestamps: true })

export const UserModel = model<IUserDocument>("User", UserSchema);


// User Issues Schema
export interface UserIssuesDocument extends UserIssues, Document {}
const UserIssuesSchema = new Schema<UserIssuesDocument>({
    issueUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    issueTitle: { type: String, required: true },
    issueDescription: { type: String, required: true },
    issueStatus: { type: String, enum: ['open', 'in progress', 'closed'], default: 'open' },
    issueType: { type: String, enum: ['Network Security', 'Application Security', 'Endpoint Security', 'Identity & Access Management', 'Zero Trust', 'Threat Hunting', 'Incident Response', 'SOC Operations', 'DevSecOps', 'API Security'], required: true },
    createdAt: { type: Date, default: Date.now },
    lastUpdatedAt: { type: Date, default: Date.now }
});

export const UserIssuesModel = model<UserIssuesDocument>("UserIssues", UserIssuesSchema);