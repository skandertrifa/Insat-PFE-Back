import { Filiere } from '../../auth/entities/student.entity';
import { IsEmail, IsEnum, IsNotEmpty } from "class-validator";

export class studentsFileMetadata{
    @IsNotEmpty()
    nom: string;

    @IsNotEmpty()
    prenom: string;


    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    cin: string

    @IsNotEmpty()
    idEtudiant: string

    @IsNotEmpty()
    filiere: string;
}