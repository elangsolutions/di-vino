import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { MercadoPagoConfig, Order } from "mercadopago";
import {PaymentPreferenceModel} from "./payment.schema";
import {ConfigService} from "../../config/config.service"; // tu schema de pagos en Mongo

@Injectable()
export class PaymentService {
    client:MercadoPagoConfig;
    constructor(
        @InjectModel("Payment") private paymentModel: Model<PaymentPreferenceModel>,
        private readonly configService: ConfigService,
    ) {
        this.client = new MercadoPagoConfig({
            accessToken: this.configService.mpAccessToken
        });
    }

    async createQRCode(amount: number, description: string, orderId: string) {

        try {

            const order = new Order(this.client);

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
                    success: `${DIVINO_APP}/checkout/${orderId}/success`,
                    failure: `${DIVINO_APP}/checkout/${orderId}/failure`,
                    pending: `${DIVINO_APP}/checkout/${orderId}/pending`,
                },
                auto_return: "approved",
            };

            const { body } = await this.client.preferences.create(preference);

            await this.paymentModel.create({
                mpId: body.id,
                amount,
                description,
                initPoint: body.init_point,
                status: body.status,
                createdAt: new Date(),
                //orderId
            });

            return {
                id: body.id,
                initPoint: body.init_point,
                sandboxInitPoint: body.sandbox_init_point,
                status: body.status,
                operationType: body.operation_type,
                dateCreated: body.date_created,
            };
        } catch (error) {
            console.error("Error creando preferencia de pago:", error);
            throw error;
        }
    }
}
