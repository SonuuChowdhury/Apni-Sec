import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { UserRepository } from "../repositories/UserRepository";
import { IUser, UserIssues } from "../models/user.interface";

const DUMMY_HASH = bcrypt.hashSync("__DUMMY__", 10);

export class UserService {
  private jwtSecret: string;
  private userRepo: UserRepository;

  // Services for user authentication and management
  constructor(userRepo: UserRepository) {
    this.userRepo = userRepo;
    // Do not read JWT_SECRET here; load it lazily to avoid import-time errors
    this.jwtSecret = "";
  }

  private getJwtSecret(): string {
    const secret = process.env.JWT_SECRET || this.jwtSecret;
    if (!secret) throw new Error("JWT_SECRET not configured");
    return secret;
  }

  async register(data: IUser) {
    const { name, email, password, age, gender } = data;
    if (!name || !email || !password || gender === undefined) throw new Error("Required fields missing");

    const existing = await this.userRepo.findByEmail(email);
    if (existing) throw new Error("User already exists");

    const hashed = await bcrypt.hash(password, 10);

    const user = await this.userRepo.create({ name, email, password: hashed, age, gender });

    const token = jwt.sign({ id: (user as any)._id, email: user.email }, this.getJwtSecret(), { expiresIn: "7d" });

    // return user object without password
    const userObj = (user as any).toObject ? (user as any).toObject() : { ...user };
    if (userObj.password) delete userObj.password;

    return { message: "Registered", user: userObj, token };
  }

  async login(email: string, password: string) {
    if (!email || !password) throw new Error("Email and password required");

    const user = await this.userRepo.findByEmail(email);

    // Use dummy compare to mitigate timing attacks and avoid revealing whether the account exists
    const compareHash = user ? user.password : DUMMY_HASH;
    const isMatch = await bcrypt.compare(password, compareHash);

    if (!user || !isMatch) throw new Error("Invalid credentials");

    const token = jwt.sign({ id: (user as any)._id, email: user.email }, this.getJwtSecret(), { expiresIn: "7d" });

    const userObj = (user as any).toObject ? (user as any).toObject() : { ...user };
    if (userObj.password) delete userObj.password;

    return { message: "Logged in", user: userObj, token };
  }

  async getUserById(id: string) {
    const user = await this.userRepo.findById(id);
    if (!user) return null;

    const userObj = (user as any).toObject ? (user as any).toObject() : { ...user };
    if (userObj.password) delete userObj.password;

    return userObj;
  }

  async updateUserById(id: string, updateData: Partial<IUser>) {
    const user = await this.userRepo.findById(id);
    if (!user) return null;

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }
    const updatedUser = await this.userRepo.update(id, updateData);
    return updatedUser;
  }


// Services for issues
  async createIssue(issueData: Partial<UserIssues>) {
    if (!issueData.issueUserId || !issueData.issueTitle || !issueData.issueDescription || !issueData.issueType) {
      throw new Error("Required fields missing for issue creation");
    }
    const issue = await this.userRepo.createIssue(issueData);
    return issue;
  }

  async getIssuesByUserId(userId: string) {
    const issues = await this.userRepo.findIssuesByUserId(userId);
    return issues;
  }

  async updateIssue(issueId: string, updateData: Partial<UserIssues>) {
    const updatedIssue = await this.userRepo.updateIssue(issueId, updateData);
    return updatedIssue;
  }
}