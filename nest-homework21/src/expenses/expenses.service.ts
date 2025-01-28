import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Expense } from './schema/expense.schema';
import { isValidObjectId, Model } from 'mongoose';
import { User } from 'src/users/schema/user.schema';


@Injectable()
export class ExpensesService {
constructor(
  @InjectModel('expense') private expenseModel:Model<Expense>,
@InjectModel('user') private userModel:Model<User>
){}


  async create(createExpenseDto: CreateExpenseDto,userId:string) {
    const user = await this.userModel.findById(userId)
    if(!user) throw new NotFoundException('user not found')
    const newExpense =  await this.expenseModel.create({
  ...createExpenseDto,
  user:user._id
})
await this.userModel.findByIdAndUpdate(user._id,{
  $push:{expenses:newExpense._id}

})
return newExpense
  }

  findAll() {
    return this.expenseModel.find().populate({path:'user',select:'-expenses -createdAt -__v'})
  }

  async findOne(id: string) {
    if(!isValidObjectId(id)) throw new BadRequestException("Invalid id")
      const expense = await this.expenseModel.findById(id)
    if(!expense) throw new NotFoundException('expense not found')

    return  expense
  }

  async update(id: string, updateExpenseDto: UpdateExpenseDto) {
    if(!isValidObjectId(id)) throw new BadRequestException("Invalid id")
    const updateReq = await this.expenseModel.findByIdAndUpdate(id,updateExpenseDto,{new:true})
  if(!updateReq) throw new BadRequestException('expense was not updated')
    return updateReq
  }

  async remove(id: string,userId) {
    if(!isValidObjectId(id)) throw new BadRequestException("Invalid id")
    const deletedExpense = await this.expenseModel.findByIdAndDelete(id)
  if(!deletedExpense) throw new BadRequestException("expense was not deleted")
    await this.userModel.findByIdAndUpdate(userId,{$pull:{expenses:deletedExpense._id
  }})
    return deletedExpense
  }
}
