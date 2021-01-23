import { IsOptional } from 'class-validator';

export class UpdateSessionDto {
    @IsOptional()
    dateDebut: Date;

    @IsOptional()
    dateFin: Date;

    @IsOptional()
    anneeId: number;
}
