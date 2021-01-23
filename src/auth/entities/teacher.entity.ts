import { UserEntity } from './user.entity';
import { JuryEntity } from './../../gestion-soutenance/entities/jury.entity';
import { Column, Entity, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity('teacher-details')
export class TeacherEntity {

    @PrimaryGeneratedColumn()
    id:number

    @OneToOne(()=>UserEntity,user=>user.teacherDetails,{eager:true})
    userDetails : UserEntity

    @OneToMany(()=>JuryEntity,jury=>jury.president)
    presidentJuries: JuryEntity[]
    
    @ManyToMany(()=>JuryEntity,jury=>jury.members,{nullable:true})
    juries:JuryEntity[]

}