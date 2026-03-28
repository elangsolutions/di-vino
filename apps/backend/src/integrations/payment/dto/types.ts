import { ObjectType, Field, ID } from "@nestjs/graphql";

@ObjectType()
export class PaymentPreference {
    @Field(() => ID)
    id: string;

    @Field()
    initPoint: string;

    @Field({ nullable: true })
    sandboxInitPoint?: string;

    @Field({ nullable: true })
    operationType?: string;

    @Field({ nullable: true })
    dateCreated?: string;
}

