import { TimeStamp } from 'src/generics/timestamp';
import { Column } from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm';
import { Entity } from 'typeorm';

@Entity('Session')
export class SessionEntity extends TimeStamp{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type:"date"
    })
    dateDebut: Date;

    @Column({
        type:"date"
    })
    dateFin: Date;
}
