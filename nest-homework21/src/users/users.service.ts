import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { isValidObjectId, Model } from 'mongoose';
import { User } from './schema/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { faker } from '@faker-js/faker';
import { QuerryParams } from './dto/query-params.dto';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(@InjectModel('user') private usersModel: Model<User>) {}

  async onModuleInit() {
    const count = await this.usersModel.countDocuments();

    if (count === 0) {
      const userList = [];

      for (let i = 0; i < 30_000; i++) {
        const user = {
          name: faker.commerce.productName(),
          desc: faker.commerce.productDescription,
          age: faker.number.int({ min: 1, max: 100 }),
        };
        userList.push(user);
      }
      console.log(userList.length, 'length');
      await this.usersModel.insertMany(userList);
      console.log('inserted');
    }
  }

  deleteAll() {
    return this.usersModel.deleteMany();
  }

  async create(createUserDto: CreateUserDto) {
    const existUser = await this.usersModel.findOne({
      email: createUserDto.email,
    });
    if (existUser) throw new BadRequestException('user already exists');

    const user = await this.usersModel.create(createUserDto);
    return user;
  }

  async findAll({ page, take }: QuerryParams) {
    const limit = Math.min(take, 30);

    return this.usersModel
      .find()
      .skip((page - 1) * limit)
      .limit(limit)
      .populate({ path: 'expenses', select: '-user' });
  }

  async getUser({ ageFrom, ageTo}: QuerryParams) {
    const findByage = await this.usersModel.find({ age: 10 });

    if (!findByage) return { $gte: ageFrom, $lte: ageTo };
    
    

    return findByage
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

  async addPost(userId, expensesId) {
    const updateUser = await this.usersModel.findByIdAndUpdate(userId, {
      $push: { expenses: expensesId },
    });
    return updateUser;
  }
}
