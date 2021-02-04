import { IsNotEmpty } from "class-validator";

export class teachersFileMetadata{
    @IsNotEmpty()
    nom: string;

    @IsNotEmpty()
    prenom: string;

    @IsNotEmpty()
    email: string;
}