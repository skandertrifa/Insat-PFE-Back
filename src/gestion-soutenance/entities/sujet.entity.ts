import { StudentEntity } from './../../auth/entities/student.entity';
import { IsDate, IsOptional } from 'class-validator';
import { TimeStamp } from 'src/generics/timestamp';
import { Column, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm';
import { Entity } from 'typeorm';
import { RapportPfeEntity } from './rapportPfe.entity';
import { TeacherEntity } from 'src/auth/entities/teacher.entity';
import { FichePropositionPfeEntity } from './fichePropositionPfe.entity';
import { LettreAffectationPfeEntity } from './lettreAffectation.entity';

@Entity('sujet')
export class SujetEntity extends TimeStamp{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique:true})
    titre: string;

    @Column({default:null,nullable:true})
    @IsDate()
    @IsOptional()
    dateLimiteDepot: Date;

    @Column({default:false})
    approved: boolean;


    @Column()
    description: string;

    @OneToOne(()=>RapportPfeEntity,{cascade:true})
    @JoinColumn()
    rapportPfe:RapportPfeEntity

    @OneToOne(()=>StudentEntity,etudiant=>etudiant.sujet)
    etudiant:StudentEntity

    @OneToOne(()=>FichePropositionPfeEntity,{cascade:true})
    @JoinColumn()
    fichePropositionPfe:FichePropositionPfeEntity

    @OneToOne(()=>LettreAffectationPfeEntity,{cascade:true})
    @JoinColumn()
    lettreAffectationPfe:LettreAffectationPfeEntity

    @ManyToOne(()=>TeacherEntity,teacher=>teacher.sujetsEncadres)
    encadrant:TeacherEntity

}
