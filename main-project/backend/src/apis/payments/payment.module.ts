import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '../users/entities/user.entity';
import { Payment } from './entities/payment.entity';
import { PaymentsResolver } from './payment.resolver';
import { PaymentsService } from './payment.service';
import { IamportService } from '../iamport/iamport.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Payment, //
      User,
    ]),
  ],
  providers: [
    PaymentsResolver, //
    PaymentsService,
    IamportService,
  ],
})
export class PaymentsModule {}
