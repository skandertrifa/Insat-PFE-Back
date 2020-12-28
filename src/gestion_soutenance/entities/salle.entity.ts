import { TimeStamp } from 'src/generics/timestamp';
import { Column } from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm';
import { Entity } from 'typeorm';

@Entity('Salle')
export class SalleEntity extends TimeStamp{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        unique:true,
    })
    code: string;

}
