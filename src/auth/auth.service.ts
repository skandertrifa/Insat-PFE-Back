import { studentsFileFilter } from './utils/file-uploads.utils';
import { studentsFileMetadata } from './utils/studentsFileMetadata.class';
import { ConflictException, Injectable, NotFoundException, NotAcceptableException } from '@nestjs/common';
import { UserRegisterDto } from './dto/user-register';
import * as bcrypt from 'bcrypt';
import * as xlsx from 'xlsx';
import { Repository } from 'typeorm';
import { UserEntity, userRoleEnum } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserLoginDto } from './dto/user-login';
import { JwtService } from '@nestjs/jwt';
import { StudentEntity } from './entities/student.entity';
import { changeKeys, getUsers } from './utils/prepare-users.utils';


@Injectable()
export class AuthService 
{
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
        @InjectRepository(StudentEntity)
        private studentRepository: Repository<StudentEntity>,
        private jwtService: JwtService
    ){}

    async register(userRegisterDto: UserRegisterDto): Promise<Partial<UserEntity>>{
        const user = this.userRepository.create({
            ...userRegisterDto
        });
        user.salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash(user.password,user.salt);
        try{
            await this.userRepository.save(user);
        }
        catch (e) {
            throw new ConflictException('email already exists');
        }

        return {
            id: user.id,
            nom: user.nom,
            prenom: user.prenom,
            email: user.email,
        };
    }


    async login(credentilas: UserLoginDto){
        const { email, password} = credentilas;
        const user = await this.userRepository.findOne({email});
        if (!user){
            throw new NotFoundException('email or password incorrent');
        }
        else{
            if ( await bcrypt.compare(password, user.password)){
                const payload = {
                    email: user.email,
                    nom: user.nom,
                    prenom: user.prenom
                };
                const jwt = this.jwtService.sign(payload);
                return { 
                    "access_token": jwt
                };
            }
            else{
                throw new NotFoundException('email or password wrong')
            }
        }
    }

    async generateStudents(metadata:studentsFileMetadata,filePath){

        const xlsxFile = xlsx.readFile(filePath)    
        const sheet = xlsxFile.Sheets[xlsxFile.SheetNames[0]] 
        var data = xlsx.utils.sheet_to_json(sheet,{raw:true,defval:null})
        // check that data not empty 
        if (data.length>0){
            //check that keys match what was sent with the post request
            if (JSON.stringify(Object.keys(data[0])) == 
            JSON.stringify(Object.values(metadata) )){
                try{
                await data.forEach(jsonObj=>changeKeys(jsonObj,Object.keys(metadata)))
                const users = await getUsers(data)
                return await this.userRepository.save(users)
                }catch(e){
                    throw new NotAcceptableException('Vérifier les entréss de votre fichier')
                }
            }else{
                throw new NotAcceptableException("Les noms de colonnes ne sont pas identiques")
            }
            
        }else{
            throw new NotAcceptableException("Fichier vide")
        }

}

 
    async updateRapportPfePath(user:UserEntity,filePath){
        const newUser = await this.userRepository.findOne(user.id)
        newUser.studentDetails.rapportPFEPath = filePath
        return await this.userRepository.save(newUser);
    }
}
