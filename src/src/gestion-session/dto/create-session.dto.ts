import { IsOptional } from "class-validator";


export class CreateSessionDto {
    name : string;

    dateDebut: Date;
    
    dateFin: Date;

    anneeId: number;
}
