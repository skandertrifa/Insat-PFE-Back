import { IsDate } from 'class-validator';
import { TimeStamp } from 'src/generics/timestamp';
import { Column } from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm';
import { Entity } from 'typeorm';

@Entity('Sujet')
export class SujetEntity extends TimeStamp{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique:true})
    titre: string;

    @Column()
    @IsDate()
    dateDepot: Date;

    @Column()
    description: String;


}
