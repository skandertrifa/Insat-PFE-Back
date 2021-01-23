import { JoinColumn, OneToOne } from 'typeorm';


import { TimeStamp } from 'src/generics/timestamp';
import { SessionEntity } from 'src/gestion-session/entities/session.entity';

import { Column, ManyToOne } from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm';
import { Entity } from 'typeorm';
import { SalleEntity } from './salle.entity';
import { SujetEntity } from './sujet.entity';

@Entity('Soutenance')
export class SoutenanceEntity extends TimeStamp{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    titre: string;

    @Column({
        type:"date"
    })
    dateDePassage: Date;

    
    @ManyToOne(() => SessionEntity,(session : SessionEntity) => session.soutenances,
    { nullable: true, onUpdate: 'CASCADE', })
    session: SessionEntity;

    @ManyToOne(() => SalleEntity,(salle : SalleEntity) => salle.soutenances,
    { nullable: true, onUpdate: 'CASCADE', })
    salle: SalleEntity;

    @OneToOne(()=>SujetEntity,
    { nullable: true, onUpdate: 'CASCADE', })
    @JoinColumn()
    sujet:SujetEntity


    
}



