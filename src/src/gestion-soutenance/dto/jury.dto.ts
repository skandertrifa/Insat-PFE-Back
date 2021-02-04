import { Transform } from "class-transformer";
import { IsDate, IsNotEmpty, MinDate } from "class-validator";
import { TeacherEntity } from "src/auth/entities/teacher.entity";

export class JuryDto {
    
    president:number
    members:number[]
}
