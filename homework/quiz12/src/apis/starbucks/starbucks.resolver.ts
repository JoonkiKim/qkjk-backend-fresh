import { Query, Resolver } from '@nestjs/graphql';
import { StarbucksService } from './starbucks.service';

@Resolver()
export class StarbucksResolver {
  constructor(
    private readonly starbucksService: StarbucksService, //
  ) {}

  @Query(() => String)
  fetchStartbucks(): string {
    return this.starbucksService.answer();
  }
}
