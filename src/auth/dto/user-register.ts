import { IsEmail, IsNotEmpty } from "class-validator";

export class UserRegisterDto {

    @IsNotEmpty()
    nom: string;

    @IsNotEmpty()
    prenom: string;

    @IsNotEmpty()
    password: string;

    @IsEmail()
    email: string;
}