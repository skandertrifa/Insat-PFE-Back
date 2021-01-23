import { TimeStamp } from 'src/generics/timestamp';
import { AnneeEntity } from 'src/gestion-annee/entities/annee.entity';
import { SoutenanceEntity } from 'src/gestion-soutenance/entities/soutenance.entity';
import { Column, ManyToOne, OneToMany } from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm';
import { Entity } from 'typeorm';


@Entity('Session')
export class SessionEntity extends TimeStamp{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type:"date"
    })
    dateDebut: Date;

    @Column({
        type:"date"
    })
    dateFin: Date;

    
    @ManyToOne(() => AnneeEntity,(annee : AnneeEntity) => annee.sessions,
    { nullable: false, onUpdate: 'CASCADE', })
    annee: AnneeEntity;

    @OneToMany(() => SoutenanceEntity, (soutenance : SoutenanceEntity) => soutenance.session,
    { nullable: true,onDelete: 'CASCADE', onUpdate: 'CASCADE', })
    soutenances: SoutenanceEntity[];

    
}
