import { ObjectType, Field, ID, Float } from "@nestjs/graphql";

@ObjectType()
export class PaymentPreference {
    @Field(() => ID)
    id: string;

    @Field()
    qrCode: string;

    @Field()
    qrCodeBase64: string;

    @Field(() => Float)
    amount: number;

    @Field()
    description: string;

    @Field()
    externalReference: string;
}

