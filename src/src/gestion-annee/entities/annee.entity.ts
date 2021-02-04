import { SessionEntity } from './../../gestion-session/entities/session.entity';
import { Column, JoinColumn, OneToMany, PrimaryColumn } from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm';
import { Entity } from 'typeorm';
import { TimeStamp } from '../../generics/timestamp';

@Entity('Annee')
export class AnneeEntity  extends TimeStamp
{  
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({
        unique:true,
    })
    annee: number

    
    @OneToMany(() => SessionEntity, (session : SessionEntity) => session.annee,
    { nullable: true, onUpdate: 'CASCADE', })
    sessions: SessionEntity[];

}
