import { SujetEntity } from './../../gestion-soutenance/entities/sujet.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from './user.entity';
import { TimeStamp } from 'src/generics/timestamp';

export enum Filiere{
    GL ="GL",
    IIA = "IIA",
    IMI = "IMI",
    RT = "RT",
    CH = "CH",
    BIO = "BIO"}

@Entity('student-details')
export class StudentEntity extends TimeStamp {

    @PrimaryGeneratedColumn()
    id:number

    @Column({unique:true})
    cin: string

    @Column({unique:true})
    idEtudiant: string

    @Column({
        type:'enum',
        enum: Filiere
    })
    filiere: string;

    @OneToOne(()=>UserEntity,user=>user.studentDetails)
    userDetails : UserEntity
    
    @OneToOne(()=>SujetEntity,{cascade:true,eager:true})
    @JoinColumn()
    sujet:SujetEntity

}
