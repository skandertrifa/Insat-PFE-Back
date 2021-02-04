import { IsEmail, IsOptional } from "class-validator";

export class UpdateTeacherDto {
    @IsOptional()
    nom:string;

    @IsOptional()
    prenom:string;
    
    @IsEmail()
    email: string;

}

