import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { IStoresServiceCreate } from './interfaces/store-service.interface';
import { Store } from './entities/store.entity';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(Store)
    private readonly storesRepository: Repository<Store>,
  ) {}

  create({ createStoreInput }: IStoresServiceCreate): Promise<Store> {
    return this.storesRepository.save({ ...createStoreInput });
  }
}
