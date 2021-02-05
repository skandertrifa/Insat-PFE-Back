import { TimeStamp } from 'src/generics/timestamp';
import { Column } from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm';
import { Entity } from 'typeorm';

@Entity('LettreAffectationPfe')
export class LettreAffectationPfeEntity extends TimeStamp{
    @PrimaryGeneratedColumn()
    id: number;
    @Column({unique:true})
    path: string;
}