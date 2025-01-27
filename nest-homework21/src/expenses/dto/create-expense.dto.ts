import { IsNotEmpty, IsString,  } from "class-validator";


export class CreateExpenseDto {
    @IsNotEmpty()
    @IsString()
    title:string

    @IsNotEmpty()
    @IsString()
    category:string
}
