import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationModule } from './application/application.module';
import { UserModule } from './user/user.module';
import { Application } from './application/entity/application.entity';
import { UploadcareService } from './uploadcare/uploadcare.service';
import { UploadcareModule } from './uploadcare/uploadcare.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost', // Debe ser 'localhost' si NestJS corre fuera de Docker
      port: 5434,
      username: 'admin', // <--- Debe coincidir
      password: 'admin', // <--- Debe coincidir
      database: 'applications',
      autoLoadEntities: true,
      synchronize: true,
      entities: [Application],
    }),
    ApplicationModule,
    UserModule,
    UploadcareModule,
  ],
  controllers: [AppController],
  providers: [AppService, UploadcareService],
})
export class AppModule {}
