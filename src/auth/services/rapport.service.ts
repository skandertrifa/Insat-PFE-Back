import { RapportPfeEntity } from '../../gestion-soutenance/entities/rapportPfe.entity';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RapportService {

    constructor(
        @InjectRepository(UserEntity)
        private userRepository : Repository<UserEntity>,
        @InjectRepository(RapportPfeEntity)
        private rapportPfeRepository : Repository<RapportPfeEntity>,

    ){

    }
    async updateRapportPfe(user:UserEntity,filePath){
        const newUser = await this.userRepository.findOne(user.id,{relations:['studentDetails']})
        console.log(newUser.studentDetails)
        console.log(newUser.studentDetails.sujet)
        //check that subjects was created by administration 
        if (newUser.studentDetails.sujet){
            //check deadline
            console.log('hayyyyyyyyyy')
            const deadline = newUser.studentDetails.sujet.dateLimiteDepot
            if (deadline<new Date())
                throw new NotAcceptableException(`Date dépot de votre rapport : ${deadline} est dépassé !`)
            else{
                const rapport = this.rapportPfeRepository.create()
                rapport.path = filePath
                newUser.studentDetails.sujet.rapportPfe = rapport
                return await this.userRepository.save(newUser)
            }
             
        }else{
            throw new NotAcceptableException('Vous ne disposez pas de sujet ! Vous ne pouvez pas uploader votre rapport !')

        }
        
        
    }
}
