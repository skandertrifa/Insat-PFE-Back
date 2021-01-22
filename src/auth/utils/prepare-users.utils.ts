import { userRoleEnum } from "../entities/user.entity";
import * as bcrypt from 'bcrypt';

export const changeKeys = async (jsonObject,newKeys)=>{
    const keys = Object.keys(jsonObject);
    for (var i = 0; i < keys.length; i++) {
        const newKey = newKeys[i]
        var temp = jsonObject[keys[i]]
        delete jsonObject[keys[i]];
        jsonObject[newKey] = temp;
            
      }
    return jsonObject
};

export const getUsers = async (data)=>{
    const users = []
    for (var i=0;i<data.length;i++){
        const {cin,idEtudiant,filiere} = data[i]
        const {nom,prenom,email} = data[i]
        const studentDetails = {cin,idEtudiant,filiere}
        const student = {nom,prenom,
        password:idEtudiant.toString(),
        email,
        role:userRoleEnum.USER,
        salt:await bcrypt.genSalt(),
        studentDetails
    }
    student.password = await bcrypt.hash(student.password,student.salt);
    users.push(student)
    }
    
    return users
};

