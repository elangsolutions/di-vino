import { ObjectType, Field, ID } from "@nestjs/graphql";
import { Prop } from "@nestjs/mongoose";

@ObjectType()
export class PaymentPreferenceModel {
    @Field(() => ID)
    id: string;

    @Field()
    @Prop()
    initPoint: string;

    @Field({ nullable: true })
    @Prop()
    sandboxInitPoint?: string;

    @Field({ nullable: true })
    @Prop()
    status?: string;

    @Field({ nullable: true })
    @Prop()
    operationType?: string;

    @Field({ nullable: true })
    @Prop()
    dateCreated?: string;
}
