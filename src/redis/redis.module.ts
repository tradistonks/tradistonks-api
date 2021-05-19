import { DynamicModule } from '@nestjs/common';
import {
  RedisModule as NestRedisModule,
  RedisModuleOptions,
} from 'nestjs-redis';

export const RedisModule: DynamicModule = NestRedisModule.forRootAsync({
  useFactory: (): RedisModuleOptions => {
    return {
      host: process.env.REDIS_HOST,
      port: +process.env.REDIS_PORT,
    };
  },
});
