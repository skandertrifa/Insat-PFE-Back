import { JuryEntity } from './../../gestion-soutenance/entities/jury.entity';
import { Column, Entity, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity('teacher-details')
export class TeacherEntity {

    @PrimaryGeneratedColumn()
    id:string

    @ManyToMany(()=>JuryEntity,jury=>jury.teachers)
    juries:JuryEntity[]

}
