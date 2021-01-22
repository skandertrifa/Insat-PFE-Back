import { IsDate } from 'class-validator';
import { TimeStamp } from 'src/generics/timestamp';
import { Column, JoinColumn, OneToOne } from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm';
import { Entity } from 'typeorm';
import { RapportPfeEntity } from './rapportPfe.entity';

@Entity('Sujet')
export class SujetEntity extends TimeStamp{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique:true})
    titre: string;

    @Column()
    @IsDate()
    dateLimiteDepot: Date;

    @Column()
    description: String;

    @OneToOne(()=>RapportPfeEntity,{cascade:true,eager:true})
    @JoinColumn()
    rapportPfe:RapportPfeEntity

}
