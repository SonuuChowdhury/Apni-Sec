import { UserModel } from "../models/user.model";
import { IUser } from "../models/user.interface";

export class UserRepository {
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
}