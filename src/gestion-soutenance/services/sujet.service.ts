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

    async findOneOfStudent(idStudent:number):Promise<SujetEntity[]>{
        const studentSujet = await this.userRepository.query(
            'SELECT \
            sujet.titre as titreSujet , sujet.description as sujetDescription, \
            sujet.dateLimiteDepot as SujetdateLimiteDepot,`student-details`.filiere as filiereEtudiant, \
            user1.nom as nomEncadrant ,user1.prenom as prenomEncadrant , user1.email as emailEncadrant, \
            user.nom as nomEtudiant , user.prenom as prenomEtudiant, user.email as emailEtudiant,\
            session.name as nomSession,\
            salle.code as codeSalle,\
            soutenance.titre as titreSoutenance,\
            soutenance.dateDePassage,\
            presidentUser.nom as nomPresidentJury , presidentUser.prenom as prenomPresidentJury , presidentUser.email as emailPresidentJury,\
            member1User.nom as nomMember1Jury , member1User.prenom as prenomMember1Jury , member1User.email as emailMember1Jury,\
            member2User.nom as nomMember2Jury , member2User.prenom as prenomMember2Jury , member2User.email as emailMember2Jury\
            FROM \
            `soutenance`,`sujet`,`session`,`user`,`student-details`,`teacher-details` , salle ,jury , `jury_members_teacher-details` as member1,\
            `jury_members_teacher-details` as member2,\
            `user`as user1,\
            `user`as presidentUser, `teacher-details` as president,\
            `user`as member1User, `teacher-details` as member1Details,\
            `user`as member2User, `teacher-details` as member2Details\
            WHERE soutenance.sujetId=sujet.id AND soutenance.salleId=salle.id AND soutenance.sessionId=session.id and sujet.encadrantId=`teacher-details`.id AND sujet.id=`student-details`.sujetId AND (`student-details`.id= user.studentDetailsId AND `teacher-details`.id = user1.teacherDetailsId) \
            AND presidentUser.teacherDetailsId=president.id AND president.id=jury.presidentId\
            AND member1User.teacherDetailsId=member1Details.id AND member1Details.id=member1.teacherDetailsId\
            AND member2User.teacherDetailsId=member2Details.id AND member2Details.id=member2.teacherDetailsId\
            AND soutenance.juryId=jury.id and jury.id=member1.juryId and jury.id=member2.juryId and member1.teacherDetailsId>member2.teacherDetailsId'
            +
            ' And `student-details`.id='+`${idStudent}`  
        )

        return studentSujet 
    }
    async findAllOfTeacher(idTeacher:number): Promise<SujetEntity[]> {
        const teacherSujets = await this.teacherRepository.query(
            'SELECT \
            sujet.titre as titreSujet , sujet.description as sujetDescription, \
            sujet.dateLimiteDepot as SujetdateLimiteDepot, `student-details`.filiere as filiereEtudiant, \
            user1.nom as nomEncadrant ,user1.prenom as prenomEncadrant , user1.email as emailEncadrant, \
            user.nom as nomEtudiant , user.prenom as prenomEtudiant, user.email as emailEtudiant,\
            session.name as nomSession,\
            salle.code as codeSalle,\
            soutenance.titre as titreSoutenance,\
            soutenance.dateDePassage,\
            presidentUser.nom as nomPresidentJury , presidentUser.prenom as prenomPresidentJury , presidentUser.email as emailPresidentJury,\
            member1User.nom as nomMember1Jury , member1User.prenom as prenomMember1Jury , member1User.email as emailMember1Jury,\
            member2User.nom as nomMember2Jury , member2User.prenom as prenomMember2Jury , member2User.email as emailMember2Jury\
            FROM \
            `soutenance`,`sujet`,`session`,`user`,`student-details`,`teacher-details` , salle ,jury , `jury_members_teacher-details` as member1,\
            `jury_members_teacher-details` as member2,\
            `user`as user1,\
            `user`as presidentUser, `teacher-details` as president,\
            `user`as member1User, `teacher-details` as member1Details,\
            `user`as member2User, `teacher-details` as member2Details\
            WHERE soutenance.sujetId=sujet.id AND soutenance.salleId=salle.id AND soutenance.sessionId=session.id and sujet.encadrantId=`teacher-details`.id AND sujet.id=`student-details`.sujetId AND (`student-details`.id= user.studentDetailsId AND `teacher-details`.id = user1.teacherDetailsId) \
            AND presidentUser.teacherDetailsId=president.id AND president.id=jury.presidentId\
            AND member1User.teacherDetailsId=member1Details.id AND member1Details.id=member1.teacherDetailsId\
            AND member2User.teacherDetailsId=member2Details.id AND member2Details.id=member2.teacherDetailsId\
            AND soutenance.juryId=jury.id and jury.id=member1.juryId and jury.id=member2.juryId and member1.teacherDetailsId>member2.teacherDetailsId'
            +
            ` AND (member1.teacherDetailsId = ${idTeacher} 
             OR member2.teacherDetailsId = ${idTeacher} 
             OR sujet.encadrantId=${idTeacher} OR presidentUser.id = ${idTeacher} )`
        )
        


        return teacherSujets
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
}
