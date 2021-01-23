import { IsOptional } from "class-validator";


export class CreateSessionDto {
    dateDebut: Date;
    
    dateFin: Date;

    anneeId: number;
}
