import {Module} from "@nestjs/common";
import {ConfigModule} from "../../config/config.module";
import {MongooseModule} from "@nestjs/mongoose";
import {PaymentResolver} from "./payment.resolver";
import {PaymentService} from "./payment.service";
import {PaymentPreferenceModel, PaymentSchema} from "./payment.schema";

@Module({
    imports: [
        ConfigModule,
        MongooseModule.forFeature([{name: PaymentPreferenceModel.name, schema: PaymentSchema}]),
    ],
    providers: [PaymentResolver, PaymentService],
    exports: [PaymentService],
})
export class PaymentModule {}
