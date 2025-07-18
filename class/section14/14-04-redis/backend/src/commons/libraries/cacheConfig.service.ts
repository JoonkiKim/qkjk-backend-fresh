import { CacheModuleOptions, CacheOptionsFactory } from '@nestjs/cache-manager';
import { Injectable } from '@nestjs/common';
import redisStore from 'cache-manager-redis-store';

@Injectable()
export class CacheConfigService implements CacheOptionsFactory {
  createCacheOptions(): CacheModuleOptions {
    const config: CacheModuleOptions = {
      store: redisStore,
      host: 'my-redis', // 로컬호스트로 하려면 이 자리를 localhost로 바꾸면 된다
      port: 6379,
      ttl: 60,
    };
    return config;
  }
}
