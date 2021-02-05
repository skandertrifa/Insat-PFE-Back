import { SujetEntity } from './../../gestion-soutenance/entities/sujet.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from './user.entity';

export enum Filiere{
    GL ="GL",
    IIA = "IIA",
    IMI = "IMI",
    RT = "RT",
    CH = "CH",
    BIO = "BIO"}

@Entity('event')
export class EventEntity {

    @PrimaryGeneratedColumn()
    id:number

    @Column({unique:true})
    title: string

    @Column({unique:true})
    color: string

    @Column({
        type:'enum',
        enum: Filiere
    })
    actions: string;

    @OneToOne(()=>UserEntity,user=>user.studentDetails)
    userDetails : UserEntity
    
    @OneToOne(()=>SujetEntity,{cascade:true,eager:true})
    @JoinColumn()
    sujet:SujetEntity

}
