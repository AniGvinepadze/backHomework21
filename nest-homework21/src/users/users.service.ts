import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { isValidObjectId, Model } from 'mongoose';
import { User } from './schema/user.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private usersModel: Model<User>) {}

  async create(createUserDto: CreateUserDto) {
    const existUser = await this.usersModel.findOne({
      email: createUserDto.email,
    });
    if (existUser) throw new BadRequestException('user already exists');

    const user = await this.usersModel.create(createUserDto);
    return user;
  }

  findAll() {
    return this.usersModel.find();
  }

  async findOne(id: string) {
    if (!isValidObjectId(id)) throw new BadRequestException('Invalid Id');
    const user = await this.usersModel.findById(id);
    if (!user) throw new NotFoundException('user not found');
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (!isValidObjectId(id)) throw new BadRequestException('Invalid Id');
    const updaateReq = await this.usersModel.findByIdAndUpdate(
      id,
      updateUserDto,
      { new: true },
    );
    if (!updaateReq) throw new BadRequestException('not found');
    return updaateReq;
  }

  async remove(id: string) {
    if (!isValidObjectId(id)) throw new BadRequestException('Invalid Id');
    const deletedUser = await this.usersModel.findByIdAndDelete(id);
    if (!deletedUser) throw new BadRequestException('user not found');
    return deletedUser;
  }
}
