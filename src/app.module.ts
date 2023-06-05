import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from '@common/config/configuration';
import { LoanModule } from '@loan/loan.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from '@common/services/typeorm.service';
import { EnvironmentVariables } from '@common/config/env.validation';
import { transformAndValidateSync } from 'class-transformer-validator';
import { UserModule } from '@user/user.module';
import { CommonModule } from '@common/common.module';
import { AuthMiddlware } from '@common/middlewares/auth.middleware';
import { CheckAdminMiddlware } from '@common/middlewares/check-admin.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    CommonModule,
    LoanModule,
    UserModule,
  ],
  providers: [
    {
      provide: EnvironmentVariables,
      useValue: transformAndValidateSync(EnvironmentVariables, process.env),
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddlware).exclude('/user/login').forRoutes('*');
    consumer
      .apply(CheckAdminMiddlware)
      .exclude('/user/login')
      .forRoutes('/user', '/loan/approve');
  }
}
