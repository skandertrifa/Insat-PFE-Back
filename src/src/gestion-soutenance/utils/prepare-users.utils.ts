import { CreateStudentDto } from '../../auth/dto/create-student';
import { CreateTeacherDto } from '../../auth/dto/create-teacher';
import { userRoleEnum } from "../../auth/entities/user.entity";
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


// prepare a single student for saving in the db 
export const prepareStudent = async (createStudentDto)=>{
        const {cin,idEtudiant,filiere} = createStudentDto
        const {nom,prenom,email} = createStudentDto
        const studentDetails = {cin,idEtudiant,filiere}
        const student = {nom,
        prenom,
        password:idEtudiant.toString(),
        email,
        role:userRoleEnum.USER,
        salt:await bcrypt.genSalt(),
        studentDetails}
        student.password = await bcrypt.hash(student.password,student.salt);
    return student
};

// prepare teachers for saving in the db 
export const prepareTeacher = async (createTeacherDto)=>{
        const {nom,prenom,email} = createTeacherDto
        const teacherDetails = {}
        const teacher = {nom,prenom,
        password:nom,
        email,
        salt:await bcrypt.genSalt(),
        teacherDetails,
        role:userRoleEnum.TEACHER
    }
    teacher.password = await bcrypt.hash(teacher.password,teacher.salt);
    return teacher
};

