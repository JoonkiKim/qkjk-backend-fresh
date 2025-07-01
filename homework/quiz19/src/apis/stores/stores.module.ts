import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoresResolver } from './stores.resolver';
import { StoresService } from './stores.service';
import { Store } from './entities/store.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Store, //
    ]),
  ],
  providers: [
    StoresResolver, //
    StoresService,
  ],
})
export class StoresModule {}
