import { IsEmail, IsEnum, IsNotEmpty } from "class-validator";
import { Filiere } from "../entities/student.entity";

export class CreateStudentDto {
    @IsNotEmpty()
    nom:string;

    @IsNotEmpty()
    prenom:string;
    
    @IsNotEmpty()
    cin: string
    
    @IsNotEmpty()
    idEtudiant: string
    
    @IsEnum(Filiere)
    filiere: Filiere;

    
    @IsEmail()
    email: string;

}

