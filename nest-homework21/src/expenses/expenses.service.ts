import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Expense } from './schema/expense.schema';
import { isValidObjectId, Model } from 'mongoose';
import { error } from 'console';

@Injectable()
export class ExpensesService {

  constructor(@InjectModel('expense') private expenseModel:Model<Expense>){}

  async create(createExpenseDto: CreateExpenseDto) {
    const expense = await this.expenseModel.create(createExpenseDto)
    return expense
  }

  findAll() {
    return this.expenseModel.find()
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

  async remove(id: string) {
    if(!isValidObjectId(id)) throw new BadRequestException("Invalid id")
    const deletedExpense = await this.expenseModel.findByIdAndDelete(id)
  if(!deletedExpense) throw new BadRequestException("expense was not deleted")
    return deletedExpense
  }
}
