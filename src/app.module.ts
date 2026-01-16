import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationModule } from './application/application.module';
import { UserModule } from './user/user.module';
import { UploadcareService } from './uploadcare/uploadcare.service';
import { UploadcareModule } from './uploadcare/uploadcare.module';
import { ConfigModule } from '@nestjs/config';
import { InstagramModule } from './instagram/instagram.module';
// import { MercadoPagoModule } from './mercado-pago/mercado-pago.module';
// import { GoogleCalendarModule } from './google-calendar/google-calendar.module';
// import { GoogleOauthModule } from './google-oauth/google-oauth.module';
// import { ApplicationAccessModule } from './application-access/application-access.module';
import { JwtModule } from '@nestjs/jwt';

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
      // url: process.env.DATABASE_URL,

      entities: [__dirname + '/../**/*.entity{.ts,.js}'],

      // ✅ SOLO LOCAL
      synchronize: process.env.NODE_ENV !== 'production',

      // migrations settings (ver abajo)
      migrations: [__dirname + '/../migrations/*{.ts,.js}'],

      // logging opcional
      logging: process.env.NODE_ENV !== 'production',
      ssl:
        process.env.NODE_ENV === 'production'
          ? { rejectUnauthorized: false }
          : false,
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_TOKEN_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    ApplicationModule,
    UserModule,
    UploadcareModule,
    InstagramModule,
    // MercadoPagoModule,
    // GoogleCalendarModule,
    // GoogleOauthModule,
    // ApplicationAccessModule,
  ],
  controllers: [AppController],
  providers: [AppService, UploadcareService],
})
export class AppModule {}
