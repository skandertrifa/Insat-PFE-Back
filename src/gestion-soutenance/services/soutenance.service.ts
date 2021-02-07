import { StudentEntity } from './../../auth/entities/student.entity';
import { SessionService } from '../../gestion-session/services/session.service';
import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { CreateSoutenanceDto } from '../dto/create-soutenance.dto';
import { UpdateSoutenanceDto } from '../dto/update-soutenance.dto';
import { SoutenanceEntity } from '../entities/soutenance.entity';
import { SalleService } from './salle.service';
import { SujetService } from './sujet.service';
import { JuryService } from './jury.service';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
const relations=["session","salle","sujet","jury"]

@Injectable()
export class SoutenanceService {
  
  constructor(
    @InjectRepository(SoutenanceEntity)
    private readonly soutenanceRepository: Repository<SoutenanceEntity>,
    @Inject(forwardRef(() => SalleService)) 
    private readonly salleService: SalleService,
    @Inject(forwardRef(() => SessionService)) 
    private readonly sessionService: SessionService,
    @Inject(forwardRef(() => SujetService)) 
    private readonly sujetService: SujetService,
    @Inject(forwardRef(() => JuryService)) 
    private readonly juryService: JuryService,

    @InjectRepository(StudentEntity)
    private readonly etudiantRepository: Repository<StudentEntity>,
  ) {}
  async getRelationEntities(dto)
  {
    const objects={}
    
    if (typeof dto.salleId!= "undefined")
      objects["salle"]= await this.salleService.findOne(dto.salleId)
    if (typeof dto.sessionId!= "undefined")
      objects["session"]= await this.sessionService.findOne(dto.sessionId)
    if (typeof dto.sujetId!= "undefined")
      objects["sujet"]= await this.sujetService.findOne(dto.sujetId)
    if (typeof dto.juryId!= "undefined")
      objects["jury"]= await this.juryService.findOne(dto.juryId)

    return objects
  }
  async create(createSoutenanceDto: CreateSoutenanceDto): Promise<Partial<SoutenanceEntity>> {
    
    const objects=await this.getRelationEntities(createSoutenanceDto)
    //console.log("objects : ",objects)
    const soutenance =  await this.soutenanceRepository.create({...createSoutenanceDto,...objects});
    soutenance.start = soutenance.dateDePassage;
    //console.log("soutenance creation : ",soutenance)
    return await this.soutenanceRepository.save(soutenance);
    
  }
  async length():Promise<number>{
    return this.soutenanceRepository.count()
  }

  async findAllPaginated(page:number,limit:number): Promise<any> {
    if(page<=0)
      page=1
    
    const soutenances=await this.soutenanceRepository.find({ relations: relations,skip:limit*(page-1),take:limit })
    for (const soutenance of soutenances){
      if(typeof soutenance.session != null && typeof soutenance.session != undefined )
        soutenance.session = await this.sessionService.findOne(soutenance.session.id);
      
      if(typeof soutenance.jury != null && typeof soutenance.jury != undefined )
        soutenance.jury = await this.juryService.findOne(soutenance.jury.id);
    }

    const paginationMeta= {
      "currentPage": page,
      "itemsPerPage": limit,
      "totalPages": Math.ceil(await this.length()/limit),
    }

    return {"items":soutenances,...paginationMeta}
  }

  async findAll(): Promise<SoutenanceEntity[]> {
    const Soutenances=await this.soutenanceRepository.find({ relations: relations})
    for (const soutenance of Soutenances){
      soutenance.start = soutenance.dateDePassage;
      soutenance.session = await this.sessionService.findOne(soutenance.session.id);
      soutenance.jury = await this.juryService.findOne(soutenance.jury.id);
    }
    return Soutenances
  }

  async findAllOfTeacher(idTeacher:number): Promise<SoutenanceEntity[]> {
    const Soutenances=await this.soutenanceRepository.find({ relations: relations})
    const teacherSoutenances = []
    for (const soutenance of Soutenances){
      soutenance.start = soutenance.dateDePassage;
      soutenance.session = await this.sessionService.findOne(soutenance.session.id);
      soutenance.jury = await this.juryService.findOne(soutenance.jury.id);
      if (soutenance.jury.president.id === idTeacher)
        { console.log('pres found')
          teacherSoutenances.push(soutenance)
        }
      for(let i=0;i<soutenance.jury.members.length;i++){
        if (soutenance.jury.members[i].id===idTeacher)
          {teacherSoutenances.push(soutenance)
            console.log('member found')
          break}
      }
    }
    return teacherSoutenances
  }

  

  async findOne(id: number): Promise<SoutenanceEntity> {
    const soutenance = await this.soutenanceRepository.findOne(id,{relations:relations});
    console.log("soutenance : ",soutenance)
    if (soutenance){
      soutenance.session = await this.sessionService.findOne(soutenance.session.id);
      soutenance.jury = await this.juryService.findOne(soutenance.jury.id);
      return soutenance
    }

      
    throw new NotFoundException(`La Soutenance d'id ${id} n'est pas disponible`);
  }

  async update(id: number, updateSoutenanceDto: UpdateSoutenanceDto): Promise<Partial<SoutenanceEntity>> {
    const objects=await this.getRelationEntities(updateSoutenanceDto)
    const soutenance = await this.soutenanceRepository.preload({
      id: +id,
      ...updateSoutenanceDto,
      ...objects
    });
    if (!soutenance) {
      new NotFoundException(`La Soutenance d'id ${id} n'existe pas`);
    }
    return await this.soutenanceRepository.save(soutenance)
  }

  async delete(id: number): Promise<UpdateResult> {
    
    return await this.soutenanceRepository.softDelete(id);
 
  }


  async getCatalogue() : Promise<any[]>{
 
    const result = await this.soutenanceRepository
    .query('SELECT soutenance.id as id,soutenance.titre as titre,session.name as session,\
    sujet.titre as sujetTitre,sujet.description as sujetDescription,user.nom as nomEtudiant,user.prenom as prenomEtudiant,`student-details`.`filiere`,\
    user1.nom as nomEncadrant, user1.prenom as prenomEncadrant\
    FROM `soutenance`,`sujet`,`session`,`user`,`student-details`,`teacher-details` ,`user`as user1\
    WHERE soutenance.sujetId=sujet.id AND\
    soutenance.sessionId=session.id and sujet.encadrantId=`teacher-details`.id AND sujet.id=`student-details`.sujetId AND (`student-details`.id= user.studentDetailsId AND `teacher-details`.id = user1.teacherDetailsId)')
    
    return result
    
    }
}
