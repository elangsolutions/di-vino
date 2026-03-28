import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { MercadoPagoConfig, Preference } from "mercadopago";
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
            accessToken: this.configService.mpAccessToken!
        });
    }

    async createQRCode(amount: number, description: string, orderId: string) {
        if (!this.configService.mpEnabled) {
            throw new BadRequestException(
                "Mercado Pago está temporalmente deshabilitado.",
            );
        }

        try {

            const preference = new Preference(this.client);

            const preferenceData = {
                items: [
                    {
                        id: orderId,
                        title: description,
                        quantity: 1,
                        unit_price: Number(amount),
                        currency_id: "ARS",
                    },
                ],
                back_urls: {
                    success: `${this.configService.divinoApp}/checkout/${orderId}/success`,
                    failure: `${this.configService.divinoApp}/checkout/${orderId}/failure`,
                    pending: `${this.configService.divinoApp}/checkout/${orderId}/pending`,
                },
                auto_return: "approved",
            };

            const body = await preference.create({ body: preferenceData });

            await this.paymentModel.create({
                mpId: body.id,
                amount,
                description,
                initPoint: body.init_point,
                sandboxInitPoint: body.sandbox_init_point,
                operationType: body.operation_type,
                dateCreated: body.date_created,
                createdAt: new Date(),
                //orderId
            });

            return {
                id: body.id,
                initPoint: body.init_point,
                sandboxInitPoint: body.sandbox_init_point,
                operationType: body.operation_type,
                dateCreated: body.date_created,
            };
        } catch (error) {
            console.error("Error creando preferencia de pago:", error);
            throw error;
        }
    }
}
