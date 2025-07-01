// pointTransactions.resolver.ts

import { UseGuards } from '@nestjs/common';
import { Args, Context, Int, Mutation, Resolver } from '@nestjs/graphql';
import { IContext } from 'src/commons/interfaces/context';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { PaymentsService } from './payment.service';
import { Payment } from './entities/payment.entity';

@Resolver()
export class PaymentsResolver {
  constructor(private readonly paymentsService: PaymentsService) {}

  @UseGuards(GqlAuthGuard('access'))
  @Mutation(() => Payment)
  createPayment(
    @Args('impUid') impUid: string, //
    @Args({ name: 'amount', type: () => Int }) amount: number,
    @Args('pay_method') pay_method: string,
    @Context() context: IContext, // 유저 정보를 가져오기 위해서 req안에 있는 user정보를 가져온다
  ): Promise<Payment> {
    const user = context.req.user;
    return this.paymentsService.createForPayment({
      impUid,
      amount,
      user,
      pay_method,
    });
  }

  // 결제에서는 결제취소도 '등록'으로 처리한다
  @UseGuards(GqlAuthGuard('access'))
  @Mutation(() => Payment)
  cancelPayment(
    @Args('impUid') impUid: string, //
    @Context() context: IContext,
  ) {
    const user = context.req.user;

    return this.paymentsService.cancel({ impUid, user });
  }
}
