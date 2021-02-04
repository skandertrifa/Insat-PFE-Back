import { IsEmail, IsEnum, IsNotEmpty } from "class-validator";
import { Filiere } from "../entities/student.entity";

export class CreateTeacherDto {
    @IsNotEmpty()
    nom:string;

    @IsNotEmpty()
    prenom:string;
    
    @IsEmail()
    email: string;

}

