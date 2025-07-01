import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { StoresService } from './stores.service';
import { Store } from './entities/store.entity';
import { CreateStoreInput } from './dto/create-store.input';

@Resolver()
export class StoresResolver {
  constructor(
    private readonly storesService: StoresService, //
  ) {}

  @Mutation(() => Store)
  createStore(
    @Args('createStoreInput') createStoreInput: CreateStoreInput,
  ): Promise<Store> {
    return this.storesService.create({ createStoreInput });
  }
}
