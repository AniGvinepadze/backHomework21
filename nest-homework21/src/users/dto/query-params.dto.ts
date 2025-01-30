import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class QuerryParams {
  @Transform(({ value }) => Number(value))
  @IsNumber()
  take: number = 30;
  @Transform(({ value }) => Number(value))
  @IsNumber()
  page: number = 1;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  ageFrom: number 

  @Transform(({ value }) => Number(value))
  @IsNumber()
  ageTo: number 
  
 

}
