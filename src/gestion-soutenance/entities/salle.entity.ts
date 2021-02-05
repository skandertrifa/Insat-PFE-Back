import { TimeStamp } from 'src/generics/timestamp';
import { Column, OneToMany } from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm';
import { Entity } from 'typeorm';
import { SoutenanceEntity } from './soutenance.entity';

@Entity('salle')
export class SalleEntity extends TimeStamp{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        unique:true,
    })
    code: string;

    @OneToMany(() => SoutenanceEntity, (soutenance : SoutenanceEntity) => soutenance.salle,
    { nullable: true, onUpdate: 'CASCADE', })
    soutenances: SoutenanceEntity[];

}
