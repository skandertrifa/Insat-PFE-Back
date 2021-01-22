import { StudentEntity } from './student.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { TimeStamp } from './../../generics/timestamp';

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
        unique: true
    })
    email: string;

    @Column()
    password: string;

    @Column()
    salt: string;

    @Column({
        type: 'enum',
        enum: userRoleEnum,
        default: userRoleEnum.USER
    })
    role: string

    @OneToOne(()=>StudentEntity,{cascade:true,eager:true})
    @JoinColumn()
    studentDetails : StudentEntity
}
