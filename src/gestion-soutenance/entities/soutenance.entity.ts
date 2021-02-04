import { JoinColumn, OneToOne } from 'typeorm';


import { TimeStamp } from 'src/generics/timestamp';
import { SessionEntity } from 'src/gestion-session/entities/session.entity';

import { Column, ManyToOne } from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm';
import { Entity } from 'typeorm';
import { SalleEntity } from './salle.entity';
import { SujetEntity } from './sujet.entity';
import { JuryEntity } from './jury.entity';

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

    @ManyToOne(() => JuryEntity,(jury : JuryEntity) => jury.soutenances,
    { nullable: true, onUpdate: 'CASCADE', })
    jury: JuryEntity;

    @OneToOne(()=>SujetEntity,
    { nullable: true, onUpdate: 'CASCADE', })
    @JoinColumn()
    sujet:SujetEntity


    
}



