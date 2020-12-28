import { Module } from '@nestjs/common';
import { AnneeModule } from './annee.module';

@Module({
  imports: [AnneeModule]
})
export class GestionAnneeModule {}
