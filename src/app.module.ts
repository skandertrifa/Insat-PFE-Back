import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { GestionAnneeModule } from './gestion-annee/gestion_annee.module';
import { GestionSessionModule } from './gestion-session/gestion_session.module';
import { GestionSoutenanceModule } from './gestion-soutenance/gestion_soutenance.module';
import * as dotenv from 'dotenv';
import { MulterModule } from '@nestjs/platform-express';
dotenv.config();

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads',
    }),
    TypeOrmModule.forRoot(
      {
        type: 'mysql',
        host: process.env.DB_HOST,
        port: 3306,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        entities: [
          //TodoEntity
          "dist/**/*.entity{.ts,.js}"
        ],
        synchronize: true,
        }
    ),
    AuthModule,
    GestionAnneeModule,
    GestionSessionModule,
    GestionSoutenanceModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
