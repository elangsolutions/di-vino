import {InputType, Field} from '@nestjs/graphql';
import {OrderIssueReason} from "../order.schema";


@InputType()
export class ReportOrderIssueInput {
    @Field()
    orderId: string;

    @Field(() => OrderIssueReason)
    reason: OrderIssueReason;

    @Field({ nullable: true })
    message?: string;
}
