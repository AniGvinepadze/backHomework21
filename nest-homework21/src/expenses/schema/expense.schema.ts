import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { User } from "src/users/schema/user.schema";


@Schema()
export class Expense {
    @Prop({type : String})
    title:string

    @Prop({type : String})
    category:string

    @Prop({type:mongoose.Schema.Types.ObjectId,ref: User.name})
    user:mongoose.Schema.Types.ObjectId
}

export const expenseSchema = SchemaFactory.createForClass(Expense)