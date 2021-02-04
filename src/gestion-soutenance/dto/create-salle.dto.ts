import { IsNotEmpty } from 'class-validator';

export class CreateSalleDto {
    @IsNotEmpty()
    code: string
}
