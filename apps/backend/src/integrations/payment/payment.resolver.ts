import { Resolver, Mutation, Args } from '@nestjs/graphql';
import mercadopago from 'mercadopago';
import {PaymentPreference} from "./dto/types";
import {ConfigService} from "../../config/config.service";



@Resolver()
export class PaymentResolver {
    @Mutation(() => PaymentPreference)
    async createPaymentPreference(
        @Args('amount') amount: number,
        @Args('description') description: string,
    ) {
        const preference = {
            items: [
                {
                    title: description,
                    quantity: 1,
                    unit_price: Number(amount),
                    currency_id: "ARS",
                },
            ],
            back_urls: {
                success: "https://tuapp.com/success",
                failure: "https://tuapp.com/failure",
                pending: "https://tuapp.com/pending",
            },
            auto_return: "approved",
        };

        const response = await mercadopago.preferences.create(preference);

        return {
            initPoint: response.body.init_point,
            id: response.body.id,
        };
    }
}
