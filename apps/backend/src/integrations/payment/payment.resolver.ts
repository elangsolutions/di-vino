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
            qrCode: preference.qrCode,
            qrCodeBase64: preference.qrCodeBase64,
            amount: preference.amount,
            description: preference.description,
            externalReference: preference.externalReference,
        };
    }
}
