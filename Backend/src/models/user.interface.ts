import { Types } from "mongoose";

export interface IUser{
    name: string;
    email:string;
    password:string
    age:number;
    gender:string;
}

export interface UserIssues{
    issueUserId: Types.ObjectId;
    issueId: Types.ObjectId;
    issueTitle: string;
    issueDescription: string;
    issueStatus: 'open' | 'in progress' | 'closed';
    issueType: 'Network Security' | 'Application Security' | 'Endpoint Security' | 'Identity & Access Management' | 'Zero Trust' | 'Threat Hunting' | 'Incident Response' | 'SOC Operations' | 'DevSecOps' | 'API Security';
    createdAt: Date;
    lastUpdatedAt: Date;
}