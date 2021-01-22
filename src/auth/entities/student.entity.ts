import { SujetEntity } from './../../gestion-soutenance/entities/sujet.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

export enum Filiere{
    GL ="GL",
    IIA = "IIA",
    IMI = "IMI",
    RT = "RT",
    CH = "CH",
    BIO = "BIO"}

@Entity('student-details')
export class StudentEntity {

    @PrimaryGeneratedColumn()
    id:string

    @Column({unique:true})
    cin: string

    @Column({unique:true})
    idEtudiant: string

    @Column({
        type:'enum',
        enum: Filiere
    })
    filiere: string;

    @OneToOne(()=>SujetEntity,{cascade:true,eager:true})
    @JoinColumn()
    sujet:SujetEntity

}
