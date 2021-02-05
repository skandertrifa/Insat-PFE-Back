import {IsEmail, IsEnum, IsNotEmpty, IsOptional} from "class-validator";
import { Filiere } from "../entities/student.entity";

export class UpdateStudentDto {
    @IsOptional()
    nom:string;

    @IsOptional()
    prenom:string;

    @IsOptional()
    cin: string

    @IsOptional()
    filiere: Filiere;

    @IsOptional()
    @IsEmail()
    email: string;

}

