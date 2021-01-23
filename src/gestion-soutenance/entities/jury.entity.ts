import { TeacherEntity } from "src/auth/entities/teacher.entity";
import { Column, Entity, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { TimeStamp } from 'src/generics/timestamp';

@Entity('jury')
export class JuryEntity extends TimeStamp {

    @PrimaryGeneratedColumn()
    id:string

    @OneToOne(()=>TeacherEntity,{cascade:true,eager:true})
    president:TeacherEntity

    @ManyToMany(()=>TeacherEntity,teacher=>teacher.juries)
    teachers:TeacherEntity[]

}
