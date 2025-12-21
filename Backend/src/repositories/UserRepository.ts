import { UserModel, UserIssuesModel} from "../models/user.model";
import { IUser, UserIssues } from "../models/user.interface";

export class UserRepository {

  // For user data management
  async create(user: IUser) {
    return await UserModel.create(user);
  }

  async findAll() {
    return await UserModel.find();
  }

  async findByEmail(email: string) {
    return await UserModel.findOne({ email });
  }

  async findById(id: string) {
    return await UserModel.findById(id);
  }

  async update(id: string, updateData: Partial<IUser>) {
    return await UserModel.findByIdAndUpdate(id, updateData, { new: true });
  }


  // for user issues management
  async createIssue(issue: Partial<UserIssues>) {
    return await UserIssuesModel.create(issue);
  }

  async findIssuesByUserId(userId: string) {
    return await UserIssuesModel.find({ issueUserId: userId });
  }

  async updateIssue(id: string, updateData: Partial<UserIssues>) {
    return await UserIssuesModel.findByIdAndUpdate(id, updateData, { new: true });
  }
}