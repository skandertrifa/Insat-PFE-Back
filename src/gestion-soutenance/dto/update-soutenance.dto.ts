import { PartialType } from '@nestjs/mapped-types';
import { CreateSoutenanceDto } from './create-soutenance.dto';

export class UpdateSoutenanceDto extends PartialType(CreateSoutenanceDto) {}
