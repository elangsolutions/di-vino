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
        @InjectModel(PaymentPreferenceModel.name) private paymentModel: Model<PaymentPreferenceModel>,
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

            // Generate QR code from init point using a QR code service
            const qrCodeBase64 = await this.generateQRCodeBase64(body.init_point || "");

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
                qrCode: body.init_point,
                qrCodeBase64: qrCodeBase64,
                amount: amount,
                description: description,
                externalReference: orderId,
            };
        } catch (error) {
            console.error("Error creando QR de pago:", error);
            throw error;
        }
    }

    private async generateQRCodeBase64(url: string): Promise<string> {
        try {
            // Use QR code service to generate base64 QR code
            const QRCode = await import("qrcode");
            return await QRCode.toDataURL(url);
        } catch (error) {
            console.error("Error generating QR code:", error);
            // Return a placeholder if QR generation fails
            return "";
        }
    }
}
