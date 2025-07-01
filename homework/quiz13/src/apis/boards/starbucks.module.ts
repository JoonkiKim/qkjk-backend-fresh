import { Module } from '@nestjs/common';
import { StarbucksService } from './starbucks.service';
import { StarbucksResolver } from './starbucks.resolver';

@Module({
  imports: [],
  providers: [
    StarbucksResolver, //
    StarbucksService,
  ],
})
export class StarbucksModule {}
