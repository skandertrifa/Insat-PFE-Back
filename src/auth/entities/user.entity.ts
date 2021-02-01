import { TeacherEntity } from './teacher.entity';
import { StudentEntity } from './student.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { TimeStamp } from './../../generics/timestamp';
import { classToPlain, Exclude } from 'class-transformer';

export enum userRoleEnum {
    ADMIN = 'admin',
    USER = 'user',
    TEACHER = 'teacher'
}

@Entity('user')
export class UserEntity extends TimeStamp{

    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    nom: string

    @Column()
    prenom: string

    @Column({
        unique: false
    })
    email: string;
    
    @Exclude()
    @Column()
    password: string;

    @Exclude()
    @Column()
    salt: string;

    @Column({
        type: 'enum',
        enum: userRoleEnum,
        default: userRoleEnum.USER
    })
    role: string

    @OneToOne(()=>StudentEntity,student=>student.userDetails,{cascade:['soft-remove','recover','insert','update','remove'],onDelete:'CASCADE',onUpdate:'CASCADE'})
    @JoinColumn()
    studentDetails : StudentEntity

    @OneToOne(()=>TeacherEntity,teacher=>teacher.userDetails,{cascade:true,onDelete:'CASCADE',onUpdate:'CASCADE'})
    @JoinColumn()
    teacherDetails : TeacherEntity

    toJSON() {
        return classToPlain(this);
      }
}
