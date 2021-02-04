import { Transform } from "class-transformer";
import { IsBoolean, IsDate, IsNotEmpty, MinDate } from "class-validator";

export class SujetDtoUpdate {

    @Transform((x)=>new Date(x))
    @MinDate(new Date())
    dateLimiteDepot: Date;

    @IsBoolean()
    approved:boolean;

    @IsNotEmpty()
    titre: string;

    @IsNotEmpty()
    description: string;
}
