import { IsDate, IsInt, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class AnneeDto {
    
    /*@IsNotEmpty()
    @Type(() => Date)
    @IsDate()
    annee: Date*/
    @IsNotEmpty()
    @IsInt()
    annee: number

}