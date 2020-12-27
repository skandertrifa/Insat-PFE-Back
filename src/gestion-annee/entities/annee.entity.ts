import { Column } from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm';
import { Entity } from 'typeorm';
import { TimeStamp } from '../../generics/timestamp';

@Entity('Annee')
export class AnneeEntity  extends TimeStamp
{  
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({
        unique:true,
    })
    annee: number
    /*@Column({
        unique:true,
        type:"date"
    })
    annee: Date*/

}
