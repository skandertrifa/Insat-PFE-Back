import { SujetEntity } from './../../gestion-soutenance/entities/sujet.entity';
import { UserEntity } from './user.entity';
import { JuryEntity } from './../../gestion-soutenance/entities/jury.entity';
import { Column, Entity, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { TimeStamp } from 'src/generics/timestamp';


@Entity('teacher-details')
export class TeacherEntity extends TimeStamp {

    @PrimaryGeneratedColumn()
    id:number

    @OneToOne(()=>UserEntity,user=>user.teacherDetails,{eager:true})
    userDetails : UserEntity
    @OneToMany(()=>JuryEntity,jury=>jury.president)
    presidentJuries: JuryEntity[]

    @OneToMany(()=>SujetEntity,sujet=>sujet.encadrant)
    sujetsEncadres: SujetEntity[]
    
    @ManyToMany(()=>JuryEntity,jury=>jury.members,{nullable:true})
    juries:JuryEntity[]
    
    to_json(){
        
    }
}
