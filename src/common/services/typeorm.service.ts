import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  private host;
  private name;
  private user;
  private password;
  private port;
  constructor(private readonly configService: ConfigService) {
    const { host, name, user, password, port } =
      this.configService.get('database');
    this.host = host;
    this.name = name;
    this.user = user;
    this.password = password;
    this.port = port;
  }

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.host,
      port: this.port,
      database: this.name,
      username: this.user,
      password: this.password,
      entities: ['dist/**/*.entity.{ts,js}'],
      logger: 'advanced-console',
      synchronize: true, // never use TRUE in production!
      dropSchema: false,
      logging: false, // turn on for logging queries
    } as TypeOrmModuleOptions;
  }
}
