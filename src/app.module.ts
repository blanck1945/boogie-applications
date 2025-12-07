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
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT) || 5432,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_DB,
      autoLoadEntities: true,
      // synchronize: true,
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
