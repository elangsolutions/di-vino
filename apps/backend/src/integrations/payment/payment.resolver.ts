import { BadRequestException } from '@nestjs/common';
import { Resolver, Mutation, Args } from '@nestjs/graphql';
import {PaymentPreference} from "./dto/types";
import {PaymentService} from "./payment.service";



@Resolver()
export class PaymentResolver {
    constructor(private readonly paymentService: PaymentService) {}

    @Mutation(() => PaymentPreference)
    async createPaymentPreference(
        @Args('amount') amount: number,
        @Args('description') description: string,
        @Args('orderId') orderId: string,
    ) {
        const preference = await this.paymentService.createQRCode(
            amount,
            description,
            orderId,
        );

        return {
            id: preference.id,
            initPoint: preference.initPoint,
            sandboxInitPoint: preference.sandboxInitPoint,
            operationType: preference.operationType,
            dateCreated: preference.dateCreated,
        };
    }
}
