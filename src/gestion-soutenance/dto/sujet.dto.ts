import { Transform } from "class-transformer";
import { IsDate, IsNotEmpty, MinDate } from "class-validator";

export class SujetDto {
    @IsNotEmpty()
    titre: string;

    @IsNotEmpty()
    @Transform((x)=>new Date(x))
    @MinDate(new Date())
    dateLimiteDepot: Date;

    @IsNotEmpty()
    description: string;

    @IsNotEmpty()
    idEtudiant: number
}
