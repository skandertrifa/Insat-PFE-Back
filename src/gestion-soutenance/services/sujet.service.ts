import { SujetDto } from '../dto/sujet.dto';
import { SujetEntity } from '../entities/sujet.entity';
import { BadRequestException, ConflictException, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { StudentEntity } from 'src/auth/entities/student.entity';
import { TeacherEntity } from 'src/auth/entities/teacher.entity';
import { UserEntity } from 'src/auth/entities/user.entity';
import { SujetDtoUpdate } from '../dto/sujet.dto-updat';
import { FichePropositionPfeEntity } from '../entities/fichePropositionPfe.entity';
import { LettreAffectationPfeEntity } from '../entities/lettreAffectation.entity';
import { RapportPfeEntity } from '../entities/rapportPfe.entity';
import * as fs from "fs";
import { JuryEntity } from '../entities/jury.entity';

@Injectable()
export class SujetService {
    constructor(
        @InjectRepository(SujetEntity)
        private readonly sujetRepositroy: Repository<SujetEntity>,
        @InjectRepository(StudentEntity)
        private readonly etudiantRepository:Repository<StudentEntity>,
        @InjectRepository(TeacherEntity)
        private readonly enseignantRepository:Repository<TeacherEntity>,
        @InjectRepository(FichePropositionPfeEntity)
        private readonly fichePropositionPfeRepository:Repository<FichePropositionPfeEntity>,
        @InjectRepository(UserEntity)
        private readonly userRepository:Repository<UserEntity>,
        @InjectRepository(RapportPfeEntity)
        private rapportPfeRepository : Repository<RapportPfeEntity>,
        @InjectRepository(LettreAffectationPfeEntity)
        private readonly lettreAffecationPfeRepository:Repository<LettreAffectationPfeEntity>,
        @InjectRepository(TeacherEntity)
        private teacherRepository : Repository<TeacherEntity>,
        @InjectRepository(JuryEntity)
        private juryRepository : Repository<JuryEntity>,
    ){}

    async length():Promise<number>{
        return this.sujetRepositroy.count()
      }

    async create(sujetDto:SujetDto,
        user:UserEntity,
        filepath:string){

    try{
        
        const newUser = await this.userRepository.findOne(user.id,{relations:['studentDetails']})
        const etudiant = await this.etudiantRepository.findOne(newUser.studentDetails.id)
        //if user already have subject ? don'create one
        if (etudiant.sujet){
            throw new Error('Vous avez deja un sujet')
        }
        const ficheProp = await this.fichePropositionPfeRepository.create({path:filepath})
        const encadrant = await this.enseignantRepository.findOne(sujetDto.idEncadrant)
        if (!encadrant){
            throw new Error("idEncadrant Required ")
        }
        const sujet = await this.sujetRepositroy.create({
            etudiant:etudiant,
            fichePropositionPfe:ficheProp,
            description:sujetDto.description,
            titre:sujetDto.titre,
            encadrant:encadrant,
        });
        return await this.sujetRepositroy.save(sujet);
    }
    catch(e){
        if(e.errno==1062)
            throw new ConflictException(`Un Sujet de meme titre existe dejà.`);
        throw  new BadRequestException(e.message)
    }

}

    async findAll(): Promise<SujetEntity[]> {
        console.log('hello')
        const sujets=await this.sujetRepositroy.find();
        return sujets
      }

     
    async findAllPaginated(page:number): Promise<any> {
        if(page<=0)
            page=1
        const limit=10
        //const sujets=await this.sujetRepositroy.find({skip:limit*(page-1),take:limit })
        const sujets=await this.sujetRepositroy.createQueryBuilder('sujet')
        .leftJoinAndSelect("sujet.etudiant", "etudiant")
        .leftJoinAndSelect("sujet.rapportPfe", "rapportPfe")
        .leftJoinAndSelect("sujet.fichePropositionPfe", "fichePropositionPfe")
        .leftJoinAndSelect("sujet.lettreAffectationPfe", "lettreAffectationPfe")
        .leftJoinAndSelect("sujet.encadrant", "encadrant")
        .getMany();
        for(let i=0;i<sujets.length;i++){
            if (sujets[i].etudiant)
            sujets[i].etudiant = await this.etudiantRepository.findOne(sujets[i].etudiant.id);
            if (sujets[i].encadrant)
            sujets[i].encadrant = await this.enseignantRepository.findOne(sujets[i].encadrant.id);
        }
        const paginationMeta= {
            "currentPage": page,
            "itemsPerPage": limit,
            "totalPages": Math.ceil(await this.length()/limit),
        }
    
        return {"items":sujets,...paginationMeta}
        }

        async findOne(id:number): Promise<SujetEntity> {

            const sujet=await this.sujetRepositroy.createQueryBuilder('sujet')
            .leftJoinAndSelect("sujet.etudiant", "etudiant")
            .leftJoinAndSelect("sujet.rapportPfe", "rapportPfe")
            .leftJoinAndSelect("sujet.fichePropositionPfe", "fichePropositionPfe")
            .leftJoinAndSelect("sujet.lettreAffectationPfe", "lettreAffectationPfe")
            .leftJoinAndSelect("sujet.encadrant", "encadrant")
            .where('sujet.id=:id',{id:id})
            .getOne();

            
            if (sujet){
            sujet.etudiant = await this.etudiantRepository.findOne(sujet.etudiant.id);
            sujet.encadrant = await this.enseignantRepository.findOne(sujet.encadrant.id);
            }
            return sujet
            }
   
            async update(id:number,sujetDtoUpdate:SujetDtoUpdate):Promise<SujetEntity>{
                const sujet =  await this.sujetRepositroy.preload(
                    {
                    id:+id,
                    ...sujetDtoUpdate
                    }
                );
                if (!sujet) {
                    new NotFoundException(`La sujet d'id ${id} n'existe pas`);
                  }
                  await this.sujetRepositroy.save(sujet)
                  return this.findOne(id)
        
            }

    /* async findOneOfStudent(idStudent:number):Promise<SujetEntity>{
        
        const etudiant = await this.etudiantRepository.findOne(idStudent);
        if (etudiant.sujet){
            const sujetId = etudiant.sujet.id;
            const sujet=await this.sujetRepositroy.createQueryBuilder('sujet')
            .leftJoinAndSelect("sujet.etudiant", "etudiant")
            .leftJoinAndSelect("sujet.rapportPfe", "rapportPfe")
            .leftJoinAndSelect("sujet.fichePropositionPfe", "fichePropositionPfe")
            .leftJoinAndSelect("sujet.lettreAffectationPfe", "lettreAffectationPfe")
            .leftJoinAndSelect("sujet.encadrant", "encadrant")
            .where('sujet.id=:id',{id:sujetId})
            .getOne();
            
            if (sujet){
            sujet.etudiant = await this.etudiantRepository.findOne(sujet.etudiant.id);
            sujet.encadrant = await this.enseignantRepository.findOne(sujet.encadrant.id);
            }
            return sujet
            
        }else{
            throw new NotFoundException(`L'etudiant d'id ${idStudent} n'a pas de sujet`);
        }

    } */

    async findOneOfStudent(id:number):Promise<SujetEntity[]>{
        const sujets=await this.sujetRepositroy.find({
            relations :["encadrant","etudiant","soutenance",
            "soutenance.jury","soutenance.jury.president",
            "soutenance.salle","soutenance.session","soutenance.session.annee"],
            join : {alias: 'sujet',
            leftJoinAndSelect: { 
                etudiant: 'sujet.etudiant' ,
                etudiantDetails: 'etudiant.userDetails' 
            }
            
            },
            where: qb => {
            qb.where('etudiant.id = :idEtudiant', { idEtudiant: id })
            }
            
            } );
            return sujets
    }


    async findAllOfTeacher(id:number): Promise<SujetEntity[]> {
        const sujets=await this.sujetRepositroy.find({
            join : {
                alias: 'sujet',
                
             leftJoinAndSelect: { 
                 encadrant : 'sujet.encadrant',
                 encadrantUser : 'encadrant.userDetails',
                 soutenance: 'sujet.soutenance',
                 session: 'soutenance.session',
                 annee: 'session.annee',
                 salle : 'soutenance.salle',
                 jury : 'soutenance.jury',
                 president : 'jury.president',
                 presidentUser : 'president.userDetails',
                 members : 'jury.members',
                 membersUser : 'members.userDetails',
                 },
                 
            },
            where: qb => {
                qb.where( ':id = (members.id) ', { id: id }
                ).orWhere('president.id = :id', { id: id }
                ).orWhere('encadrant.id = :id', { id: id })
              },
            
              relations :["encadrant","etudiant",],
            
        } );
        for (const sujet of sujets)
        {
            if (sujet.soutenance !== null && sujet.soutenance.jury!==null ){
                sujet.soutenance.jury= await this.juryRepository.findOne(
                    sujet.soutenance.jury.id,
                    {relations : ["president"]})
            }
        }
        return sujets
        
 
      }


    async delete(id:number):Promise<UpdateResult> {
        return await this.sujetRepositroy.softDelete(id);
    }
 //etudinat ou admin download file
 async downloadFile(id: number,kind:string): Promise<Buffer> {
    let file = null
    if(kind == 'rapport'){
        file = await this.rapportPfeRepository.findOne({id});
    }else if (kind == 'lettre'){
        file = await this.lettreAffecationPfeRepository.findOne({id});
    }else if (kind =='ficheprop') {
        file = await this.fichePropositionPfeRepository.findOne({id});
    }
    if (!file) {
        throw new NotFoundException(`${kind} d'${id} n'est pas trouvé`);
    }

    const filepath = file.path;
    const pdf = await new Promise<Buffer>((resolve, reject) => {
        fs.readFile(filepath, {}, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
    return pdf;
}

// etudiant updates rapport
async updateRapportPfe(user:UserEntity,filePath){
    const newUser = await this.userRepository.findOne(user.id,{relations:['studentDetails']})
    //check that subjects was created
    if (newUser.studentDetails.sujet){
        //check deadline
        const deadline = newUser.studentDetails.sujet.dateLimiteDepot
        if (deadline && deadline<new Date())
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

// admin updates lettre affirmation
    async updateLettreAffirmation(id:number,filePath){
        const newSujet = await this.findOne(id)
        const lettreAffirmation = await this.lettreAffecationPfeRepository.create(
            {path:filePath}
        )
        newSujet.lettreAffectationPfe = lettreAffirmation
        console.log(newSujet)
        await this.sujetRepositroy.save(newSujet)
        return await this.findOne(id);

    }

    async findSujetById(id){
        const sujet=await this.sujetRepositroy.find({
            join : {
                alias: 'sujet',
                
             leftJoinAndSelect: { 
                 encadrant : 'sujet.encadrant',
                 encadrantUser : 'encadrant.userDetails',
                 soutenance: 'sujet.soutenance',
                 session: 'soutenance.session',
                 annee: 'session.annee',
                 salle : 'soutenance.salle',
                 jury : 'soutenance.jury',
                 president : 'jury.president',
                 presidentUser : 'president.userDetails',
                 members : 'jury.members',
                 membersUser : 'members.userDetails',
                 },
                 
            },
            where: qb => {
                qb.where( ':id = (sujet.id) ', { id: id })
              },
            
              relations :["encadrant","etudiant","soutenance",
            "soutenance.jury","soutenance.jury.president","soutenance.salle"],
            
        } );
        if (sujet.length===0)
            return {}
        return sujet[0]
    }
            
}
