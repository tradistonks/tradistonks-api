// import { DynamicModule } from '@nestjs/common';
// import ConnectRedis from 'connect-redis';
// import session from 'express-session';
// import { RedisService } from 'nestjs-redis';
// import {
//   NestSessionOptions,
//   SessionModule as NestSessionModule,
// } from 'nestjs-session';
// import { RedisModule } from '../redis/redis.module';

// const RedisStore = ConnectRedis(session);

// export const SessionModule: DynamicModule = NestSessionModule.forRootAsync({
//   imports: [RedisModule],
//   inject: [RedisService],
//   useFactory: (redisService: RedisService): NestSessionOptions => {
//     const redisClient = redisService.getClient();
//     const store = new RedisStore({ client: redisClient });
//     return {
//       session: {
//         store,
//         name: process.env.SESSION_COOKIE_NAME,
//         secret: process.env.SESSION_SECRET,
//         saveUninitialized: true,
//         resave: false,
//         proxy: process.env.API_TRUST_PROXY === 'true',
//         cookie: {
//           domain: process.env.CLIENT_EXTERNAL_DOMAIN,
//           httpOnly: false,
//           maxAge: 365 * 24 * 60 * 60 * 1000,
//           secure: process.env.SESSION_COOKIE_SECURE === 'true',
//           sameSite: 'lax',
//         },
//       },
//     };
//   },
// });
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import ConnectRedis from 'connect-redis';
import { RedisService } from 'nestjs-redis';
import session from 'express-session';

const RedisStore = ConnectRedis(session);

@Injectable()
export class SessionMiddleware implements NestMiddleware {
  constructor(private redisService: RedisService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const redisClient = this.redisService.getClient();
    const store = new RedisStore({ client: redisClient });

    session({
      store,
      name: process.env.SESSION_COOKIE_NAME,
      secret: process.env.SESSION_SECRET,
      saveUninitialized: true,
      resave: false,
      proxy: process.env.API_TRUST_PROXY === 'true',
      cookie: {
        domain: process.env.CLIENT_EXTERNAL_DOMAIN,
        httpOnly: false,
        maxAge: 365 * 24 * 60 * 60 * 1000,
        secure: process.env.SESSION_COOKIE_SECURE === 'true',
        sameSite: 'lax',
      },
    })(req, res, next);
  }
}
