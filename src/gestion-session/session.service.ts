import { Repository } from 'typeorm';
import { SessionEntity } from './entities/session.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { UpdateResult } from 'typeorm';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(SessionEntity)
    private readonly sessionRepository: Repository<SessionEntity>
  ) {}
  async create(createSessionDto: CreateSessionDto): Promise<Partial<SessionEntity>> {
    const session =  this.sessionRepository.create({...createSessionDto});
    return await this.sessionRepository.save(session);
    
  }
  

  async findAll(): Promise<Partial<SessionEntity[]>> {
    const sessions=await this.sessionRepository.find()
    return sessions
  }

  async findOne(id: number): Promise<Partial<SessionEntity>> {
    const sessions = await this.sessionRepository.find({id});
    if (sessions[0])
      return sessions[0]
    throw new NotFoundException(`La session d'id ${id} n'est pas disponible`);
  }

  async update(id: number, updateSessionDto: UpdateSessionDto): Promise<Partial<SessionEntity>> {
    const session = await this.sessionRepository.preload({
      id: +id,
      ...updateSessionDto
    });
    if (!session) {
      new NotFoundException(`La session d'id ${id} n'existe pas`);
    }
    return await this.sessionRepository.save(session)
  }

  async delete(id: number): Promise<UpdateResult> {
    
    return await this.sessionRepository.softDelete(id);
 
  }
}
