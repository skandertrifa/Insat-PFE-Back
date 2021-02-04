import { Transform } from "class-transformer";
import { IsDate, IsNotEmpty, MinDate } from "class-validator";

export class SujetDto {
    @IsNotEmpty()
    titre: string;

    @IsNotEmpty()
    description: string;

    @IsNotEmpty()
    idEncadrant: number
}
