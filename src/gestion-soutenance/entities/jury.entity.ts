import { TeacherEntity } from "src/auth/entities/teacher.entity";
import { Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { TimeStamp } from 'src/generics/timestamp';

@Entity('jury')
export class JuryEntity extends TimeStamp {

    @PrimaryGeneratedColumn()
    id:number

    @ManyToOne(()=>TeacherEntity,teacher=>teacher.presidentJuries)
    president:TeacherEntity

    @ManyToMany(()=>TeacherEntity,teacher=>teacher.juries,{cascade:true,eager:true,nullable:false})
    @JoinTable()
    members:TeacherEntity[]

}
