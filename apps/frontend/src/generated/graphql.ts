import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: any; output: any; }
};

export type AddAddressInput = {
  city: Scalars['String']['input'];
  postalCode: Scalars['String']['input'];
  province: Scalars['String']['input'];
  street: Scalars['String']['input'];
};

export type AddBoxPromotionInput = {
  _id?: InputMaybe<Scalars['String']['input']>;
  boxPrice: Scalars['Float']['input'];
  boxQuantity: Scalars['Int']['input'];
  categoryId?: InputMaybe<Scalars['String']['input']>;
  fromDate: Scalars['DateTime']['input'];
  name: Scalars['String']['input'];
  productId?: InputMaybe<Scalars['String']['input']>;
  scope: BoxPromotionScope;
  toDate: Scalars['DateTime']['input'];
};

export type AddCategoryInput = {
  _id?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type AddItemPriceInput = {
  _id?: InputMaybe<Scalars['String']['input']>;
  fromDate: Scalars['DateTime']['input'];
  price: Scalars['Float']['input'];
  productId: Scalars['String']['input'];
  promotionCodes?: InputMaybe<Array<Scalars['String']['input']>>;
  stock: Scalars['Int']['input'];
  toDate: Scalars['DateTime']['input'];
};

export type AddProductInput = {
  _id?: InputMaybe<Scalars['String']['input']>;
  category: Scalars['String']['input'];
  details: Scalars['String']['input'];
  image?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  price?: InputMaybe<Scalars['Float']['input']>;
  unitsPerBulk?: InputMaybe<Scalars['Int']['input']>;
};

export type AddPromotionCodeInput = {
  _id?: InputMaybe<Scalars['String']['input']>;
  code: Scalars['String']['input'];
  fromDate: Scalars['DateTime']['input'];
  percentage: Scalars['Float']['input'];
  productId?: InputMaybe<Scalars['String']['input']>;
  scope: PromotionScope;
  toDate: Scalars['DateTime']['input'];
};

export type Address = {
  __typename?: 'Address';
  city: Scalars['String']['output'];
  postalCode: Scalars['String']['output'];
  province: Scalars['String']['output'];
  street: Scalars['String']['output'];
};

export type BoxPromotion = {
  __typename?: 'BoxPromotion';
  _id: Scalars['ID']['output'];
  boxPrice: Scalars['Float']['output'];
  boxQuantity: Scalars['Int']['output'];
  categoryId?: Maybe<Scalars['String']['output']>;
  categoryName?: Maybe<Scalars['String']['output']>;
  fromDate: Scalars['DateTime']['output'];
  name: Scalars['String']['output'];
  productId?: Maybe<Scalars['String']['output']>;
  scope: BoxPromotionScope;
  toDate: Scalars['DateTime']['output'];
};

export type BoxPromotionApplication = {
  __typename?: 'BoxPromotionApplication';
  boxes: Scalars['Int']['output'];
  discountAmount: Scalars['Float']['output'];
  matchingQuantity: Scalars['Int']['output'];
  originalSubtotal: Scalars['Float']['output'];
  promotion: BoxPromotion;
  promotionalSubtotal: Scalars['Float']['output'];
  remainderQuantity: Scalars['Int']['output'];
};

export type BoxPromotionCartItemInput = {
  price: Scalars['Float']['input'];
  productId: Scalars['String']['input'];
  quantity: Scalars['Int']['input'];
};

export type BoxPromotionEvaluation = {
  __typename?: 'BoxPromotionEvaluation';
  applications: Array<BoxPromotionApplication>;
  discountAmount: Scalars['Float']['output'];
  finalTotal: Scalars['Float']['output'];
  originalTotal: Scalars['Float']['output'];
};

export enum BoxPromotionScope {
  Category = 'CATEGORY',
  Product = 'PRODUCT'
}

export type Category = {
  __typename?: 'Category';
  _id: Scalars['ID']['output'];
  description?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
};

export type CreateOrderDraftInput = {
  customerEmail: Scalars['String']['input'];
  customerName: Scalars['String']['input'];
  customerPhone: Scalars['String']['input'];
  delivery: DeliveryInput;
  items: Array<OrderItemInput>;
  userId: Scalars['String']['input'];
};

export type Delivery = {
  __typename?: 'Delivery';
  address?: Maybe<Address>;
  locationId?: Maybe<Scalars['String']['output']>;
  scheduledDate?: Maybe<Scalars['DateTime']['output']>;
  timeSlot?: Maybe<Scalars['String']['output']>;
  type: DeliveryType;
};

export type DeliveryInput = {
  address?: InputMaybe<AddAddressInput>;
  locationId?: InputMaybe<Scalars['String']['input']>;
  scheduledDate?: InputMaybe<Scalars['DateTime']['input']>;
  timeSlot?: InputMaybe<Scalars['String']['input']>;
  type: DeliveryType;
};

export enum DeliveryType {
  Address = 'ADDRESS',
  Pickup = 'PICKUP'
}

export type EvaluateBoxPromotionsInput = {
  items: Array<BoxPromotionCartItemInput>;
};

export type ItemPrice = {
  __typename?: 'ItemPrice';
  _id: Scalars['ID']['output'];
  createdAt: Scalars['DateTime']['output'];
  fromDate: Scalars['DateTime']['output'];
  price: Scalars['Float']['output'];
  productId: Scalars['String']['output'];
  promotionCodes?: Maybe<Array<Scalars['String']['output']>>;
  stock: Scalars['Int']['output'];
  toDate: Scalars['DateTime']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type LoginInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addCategory: Category;
  addItemPrice: ItemPrice;
  addProduct: Product;
  addPromotion: Promotion;
  createOrder: Order;
  createPaymentPreference: PaymentPreference;
  deleteCategory?: Maybe<Category>;
  deleteItemPrice?: Maybe<ItemPrice>;
  deleteProduct: Product;
  deletePromotion?: Maybe<Promotion>;
  login: Scalars['String']['output'];
  register: Scalars['String']['output'];
  reportOrderIssue: Order;
  updateOrderStatus: Order;
  validatePromotionCode: PromotionDiscountResult;
};


export type MutationAddPromotionArgs = {
  input: AddPromotionInput;
};


export type MutationAddCategoryArgs = {
  input: AddCategoryInput;
};


export type MutationAddItemPriceArgs = {
  input: AddItemPriceInput;
};


export type MutationAddProductArgs = {
  input: AddProductInput;
};


export type MutationAddPromotionCodeArgs = {
  input: AddPromotionCodeInput;
};


export type MutationCreateOrderArgs = {
  input: CreateOrderDraftInput;
};


export type MutationCreatePaymentPreferenceArgs = {
  amount: Scalars['Float']['input'];
  description: Scalars['String']['input'];
  orderId: Scalars['String']['input'];
};


export type MutationDeleteBoxPromotionArgs = {
  input: RemoveBoxPromotionInput;
};


export type MutationDeleteCategoryArgs = {
  input: RemoveCategoryInput;
};


export type MutationDeleteItemPriceArgs = {
  input: RemoveItemPriceInput;
};


export type MutationDeleteProductArgs = {
  input: RemoveProductInput;
};


export type MutationDeletePromotionCodeArgs = {
  input: RemovePromotionCodeInput;
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationRegisterArgs = {
  input: RegisterInput;
};


export type MutationReportOrderIssueArgs = {
  input: ReportOrderIssueInput;
};


export type MutationUpdateOrderStatusArgs = {
  input: UpdateOrderStatusInput;
};


export type MutationValidatePromotionCodeArgs = {
  input: ValidatePromotionCodeInput;
};

export type Order = {
  __typename?: 'Order';
  _id: Scalars['ID']['output'];
  allowedTransitions: Array<OrderStatus>;
  createdAt: Scalars['DateTime']['output'];
  customerEmail?: Maybe<Scalars['String']['output']>;
  customerName?: Maybe<Scalars['String']['output']>;
  customerPhone?: Maybe<Scalars['String']['output']>;
  delivery: Delivery;
  discountAmount?: Maybe<Scalars['Float']['output']>;
  external_reference: Scalars['String']['output'];
  issues: Array<OrderIssue>;
  items: Array<OrderItem>;
  mpInitPoint?: Maybe<Scalars['String']['output']>;
  mpPreferenceId?: Maybe<Scalars['String']['output']>;
  mpQrData?: Maybe<Scalars['String']['output']>;
  status: OrderStatus;
  updatedAt: Scalars['DateTime']['output'];
  userId: Scalars['String']['output'];
};

export type OrderIssue = {
  __typename?: 'OrderIssue';
  message?: Maybe<Scalars['String']['output']>;
  reason: OrderIssueReason;
  reportedAt: Scalars['DateTime']['output'];
};

export enum OrderIssueReason {
  Cancel = 'CANCEL',
  DateChange = 'DATE_CHANGE',
  Other = 'OTHER',
  OtherRecipient = 'OTHER_RECIPIENT'
}

export type OrderItem = {
  __typename?: 'OrderItem';
  price: Scalars['Float']['output'];
  productId: Scalars['String']['output'];
  quantity: Scalars['Float']['output'];
  title: Scalars['String']['output'];
};

export type OrderItemInput = {
  price: Scalars['Float']['input'];
  productId: Scalars['String']['input'];
  quantity: Scalars['Float']['input'];
  title: Scalars['String']['input'];
};

export enum OrderStatus {
  Cancelled = 'CANCELLED',
  Closed = 'CLOSED',
  Delivered = 'DELIVERED',
  Paid = 'PAID',
  PendingPayment = 'PENDING_PAYMENT',
  Preparing = 'PREPARING',
  Ready = 'READY'
}

export type PaymentConfig = {
  __typename?: 'PaymentConfig';
  bypassPayment: Scalars['Boolean']['output'];
  mode: Scalars['String']['output'];
};

export type PaymentPreference = {
  __typename?: 'PaymentPreference';
  amount: Scalars['Float']['output'];
  description: Scalars['String']['output'];
  externalReference: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  qrCode: Scalars['String']['output'];
  qrCodeBase64: Scalars['String']['output'];
};

export type Product = {
  __typename?: 'Product';
  _id: Scalars['ID']['output'];
  activeItemPrice?: Maybe<ItemPrice>;
  category: Scalars['String']['output'];
  details?: Maybe<Scalars['String']['output']>;
  image?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  /** @deprecated Use ItemPrice instead (supports scheduled/promotional pricing windows by date range). */
  price: Scalars['Float']['output'];
  stock: Scalars['Float']['output'];
  unitsPerBulk?: Maybe<Scalars['Int']['output']>;
};

export type PromotionCartItemInput = {
  price: Scalars['Float']['input'];
  productId: Scalars['String']['input'];
  quantity: Scalars['Int']['input'];
};

export type PromotionCode = {
  __typename?: 'PromotionCode';
  _id: Scalars['ID']['output'];
  code: Scalars['String']['output'];
  fromDate: Scalars['DateTime']['output'];
  percentage: Scalars['Float']['output'];
  productId?: Maybe<Scalars['String']['output']>;
  scope: PromotionScope;
  toDate: Scalars['DateTime']['output'];
};

export type PromotionDiscountResult = {
  __typename?: 'PromotionDiscountResult';
  discountAmount: Scalars['Float']['output'];
  finalTotal: Scalars['Float']['output'];
  message?: Maybe<Scalars['String']['output']>;
  originalTotal: Scalars['Float']['output'];
  promotion?: Maybe<Promotion>;
  valid: Scalars['Boolean']['output'];
};

export enum PromotionRewardType {
  FixedPrice = 'FIXED_PRICE',
  Percentage = 'PERCENTAGE'
}

export enum PromotionScope {
  Category = 'CATEGORY',
  Order = 'ORDER',
  Product = 'PRODUCT'
}

export enum PromotionType {
  Bulk = 'BULK',
  Product = 'PRODUCT',
  PromoCode = 'PROMO_CODE'
}

export type Promotion = {
  __typename?: 'Promotion';
  _id: Scalars['ID']['output'];
  categoryId?: Maybe<Scalars['String']['output']>;
  categoryName?: Maybe<Scalars['String']['output']>;
  code?: Maybe<Scalars['String']['output']>;
  fixedPrice?: Maybe<Scalars['Float']['output']>;
  fromDate: Scalars['DateTime']['output'];
  name: Scalars['String']['output'];
  percentage?: Maybe<Scalars['Float']['output']>;
  productId?: Maybe<Scalars['String']['output']>;
  rewardType: PromotionRewardType;
  scope?: Maybe<PromotionScope>;
  toDate: Scalars['DateTime']['output'];
  type: PromotionType;
};

export type AddPromotionInput = {
  _id?: InputMaybe<Scalars['String']['input']>;
  categoryId?: InputMaybe<Scalars['String']['input']>;
  code?: InputMaybe<Scalars['String']['input']>;
  fixedPrice?: InputMaybe<Scalars['Float']['input']>;
  fromDate: Scalars['DateTime']['input'];
  name: Scalars['String']['input'];
  percentage?: InputMaybe<Scalars['Float']['input']>;
  productId?: InputMaybe<Scalars['String']['input']>;
  rewardType: PromotionRewardType;
  scope?: InputMaybe<PromotionScope>;
  toDate: Scalars['DateTime']['input'];
  type: PromotionType;
};

export type PromotionApplicationResult = {
  __typename?: 'PromotionApplicationResult';
  boxes?: Maybe<Scalars['Int']['output']>;
  discountAmount: Scalars['Float']['output'];
  matchingQuantity: Scalars['Int']['output'];
  originalSubtotal: Scalars['Float']['output'];
  promotion: Promotion;
  promotionalSubtotal: Scalars['Float']['output'];
  remainderQuantity?: Maybe<Scalars['Int']['output']>;
  unitsPerBulk?: Maybe<Scalars['Int']['output']>;
};

export type PromotionEvaluation = {
  __typename?: 'PromotionEvaluation';
  applications: Array<PromotionApplicationResult>;
  discountAmount: Scalars['Float']['output'];
  finalTotal: Scalars['Float']['output'];
  originalTotal: Scalars['Float']['output'];
};

export type EvaluatePromotionsInput = {
  items: Array<PromotionCartItemInput>;
};

export type RemovePromotionInput = {
  _id: Scalars['String']['input'];
};

export type Query = {
  __typename?: 'Query';
  activeItemPrice?: Maybe<ItemPrice>;
  activePromotions: Array<Promotion>;
  availableProducts: Array<Product>;
  categories: Array<Category>;
  category: Category;
  evaluatePromotions: PromotionEvaluation;
  itemPrice?: Maybe<ItemPrice>;
  itemPrices: Array<ItemPrice>;
  itemPricesByProduct: Array<ItemPrice>;
  order: Order;
  orders: Array<Order>;
  paymentConfig: PaymentConfig;
  product: Product;
  products: Array<Product>;
  promotion?: Maybe<Promotion>;
  promotions: Array<Promotion>;
};


export type QueryActiveItemPriceArgs = {
  at?: InputMaybe<Scalars['DateTime']['input']>;
  productId: Scalars['String']['input'];
};


export type QueryAvailableProductsArgs = {
  at?: InputMaybe<Scalars['DateTime']['input']>;
};


export type QueryBoxPromotionArgs = {
  id: Scalars['String']['input'];
};


export type QueryEvaluatePromotionsArgs = {
  input: EvaluatePromotionsInput;
};


export type QueryPromotionArgs = {
  id: Scalars['String']['input'];
};


export type QueryCategoryArgs = {
  id: Scalars['String']['input'];
};


export type QueryEvaluateBoxPromotionsArgs = {
  input: EvaluateBoxPromotionsInput;
};


export type QueryItemPriceArgs = {
  id: Scalars['String']['input'];
};


export type QueryItemPricesByProductArgs = {
  productId: Scalars['String']['input'];
};


export type QueryOrderArgs = {
  id: Scalars['String']['input'];
};


export type QueryProductArgs = {
  id: Scalars['String']['input'];
};


export type QueryPromotionCodeArgs = {
  id: Scalars['String']['input'];
};

export type RegisterInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type RemoveBoxPromotionInput = {
  _id: Scalars['String']['input'];
};

export type RemoveCategoryInput = {
  _id: Scalars['String']['input'];
};

export type RemoveItemPriceInput = {
  _id: Scalars['String']['input'];
};

export type RemoveProductInput = {
  _id?: InputMaybe<Scalars['String']['input']>;
};

export type RemovePromotionCodeInput = {
  _id: Scalars['String']['input'];
};

export type ReportOrderIssueInput = {
  message?: InputMaybe<Scalars['String']['input']>;
  orderId: Scalars['String']['input'];
  reason: OrderIssueReason;
};

export type UpdateOrderStatusInput = {
  orderId: Scalars['String']['input'];
  status: OrderStatus;
};

export type ValidatePromotionCodeInput = {
  code: Scalars['String']['input'];
  items: Array<PromotionCartItemInput>;
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  AddAddressInput: AddAddressInput;
  AddCategoryInput: AddCategoryInput;
  AddItemPriceInput: AddItemPriceInput;
  AddProductInput: AddProductInput;
  AddPromotionCodeInput: AddPromotionCodeInput;
  Address: ResolverTypeWrapper<Address>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Category: ResolverTypeWrapper<Category>;
  CreateOrderDraftInput: CreateOrderDraftInput;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  Delivery: ResolverTypeWrapper<Delivery>;
  DeliveryInput: DeliveryInput;
  DeliveryType: DeliveryType;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  ItemPrice: ResolverTypeWrapper<ItemPrice>;
  LoginInput: LoginInput;
  Mutation: ResolverTypeWrapper<{}>;
  Order: ResolverTypeWrapper<Order>;
  OrderIssue: ResolverTypeWrapper<OrderIssue>;
  OrderIssueReason: OrderIssueReason;
  OrderItem: ResolverTypeWrapper<OrderItem>;
  OrderItemInput: OrderItemInput;
  OrderStatus: OrderStatus;
  PaymentConfig: ResolverTypeWrapper<PaymentConfig>;
  PaymentPreference: ResolverTypeWrapper<PaymentPreference>;
  Product: ResolverTypeWrapper<Product>;
  PromotionCartItemInput: PromotionCartItemInput;
  PromotionCode: ResolverTypeWrapper<PromotionCode>;
  PromotionDiscountResult: ResolverTypeWrapper<PromotionDiscountResult>;
  PromotionScope: PromotionScope;
  Query: ResolverTypeWrapper<{}>;
  RegisterInput: RegisterInput;
  RemoveCategoryInput: RemoveCategoryInput;
  RemoveItemPriceInput: RemoveItemPriceInput;
  RemoveProductInput: RemoveProductInput;
  RemovePromotionCodeInput: RemovePromotionCodeInput;
  ReportOrderIssueInput: ReportOrderIssueInput;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  UpdateOrderStatusInput: UpdateOrderStatusInput;
  ValidatePromotionCodeInput: ValidatePromotionCodeInput;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AddAddressInput: AddAddressInput;
  AddCategoryInput: AddCategoryInput;
  AddItemPriceInput: AddItemPriceInput;
  AddProductInput: AddProductInput;
  AddPromotionCodeInput: AddPromotionCodeInput;
  Address: Address;
  Boolean: Scalars['Boolean']['output'];
  Category: Category;
  CreateOrderDraftInput: CreateOrderDraftInput;
  DateTime: Scalars['DateTime']['output'];
  Delivery: Delivery;
  DeliveryInput: DeliveryInput;
  Float: Scalars['Float']['output'];
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  ItemPrice: ItemPrice;
  LoginInput: LoginInput;
  Mutation: {};
  Order: Order;
  OrderIssue: OrderIssue;
  OrderItem: OrderItem;
  OrderItemInput: OrderItemInput;
  PaymentConfig: PaymentConfig;
  PaymentPreference: PaymentPreference;
  Product: Product;
  PromotionCartItemInput: PromotionCartItemInput;
  PromotionCode: PromotionCode;
  PromotionDiscountResult: PromotionDiscountResult;
  Query: {};
  RegisterInput: RegisterInput;
  RemoveCategoryInput: RemoveCategoryInput;
  RemoveItemPriceInput: RemoveItemPriceInput;
  RemoveProductInput: RemoveProductInput;
  RemovePromotionCodeInput: RemovePromotionCodeInput;
  ReportOrderIssueInput: ReportOrderIssueInput;
  String: Scalars['String']['output'];
  UpdateOrderStatusInput: UpdateOrderStatusInput;
  ValidatePromotionCodeInput: ValidatePromotionCodeInput;
};

export type AddressResolvers<ContextType = any, ParentType extends ResolversParentTypes['Address'] = ResolversParentTypes['Address']> = {
  city?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  postalCode?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  province?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  street?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CategoryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Category'] = ResolversParentTypes['Category']> = {
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type DeliveryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Delivery'] = ResolversParentTypes['Delivery']> = {
  address?: Resolver<Maybe<ResolversTypes['Address']>, ParentType, ContextType>;
  locationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  scheduledDate?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  timeSlot?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['DeliveryType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ItemPriceResolvers<ContextType = any, ParentType extends ResolversParentTypes['ItemPrice'] = ResolversParentTypes['ItemPrice']> = {
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  fromDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  price?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  productId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  promotionCodes?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  stock?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  toDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  addCategory?: Resolver<ResolversTypes['Category'], ParentType, ContextType, RequireFields<MutationAddCategoryArgs, 'input'>>;
  addItemPrice?: Resolver<ResolversTypes['ItemPrice'], ParentType, ContextType, RequireFields<MutationAddItemPriceArgs, 'input'>>;
  addProduct?: Resolver<ResolversTypes['Product'], ParentType, ContextType, RequireFields<MutationAddProductArgs, 'input'>>;
  addPromotionCode?: Resolver<ResolversTypes['PromotionCode'], ParentType, ContextType, RequireFields<MutationAddPromotionCodeArgs, 'input'>>;
  createOrder?: Resolver<ResolversTypes['Order'], ParentType, ContextType, RequireFields<MutationCreateOrderArgs, 'input'>>;
  createPaymentPreference?: Resolver<ResolversTypes['PaymentPreference'], ParentType, ContextType, RequireFields<MutationCreatePaymentPreferenceArgs, 'amount' | 'description' | 'orderId'>>;
  deleteCategory?: Resolver<Maybe<ResolversTypes['Category']>, ParentType, ContextType, RequireFields<MutationDeleteCategoryArgs, 'input'>>;
  deleteItemPrice?: Resolver<Maybe<ResolversTypes['ItemPrice']>, ParentType, ContextType, RequireFields<MutationDeleteItemPriceArgs, 'input'>>;
  deleteProduct?: Resolver<ResolversTypes['Product'], ParentType, ContextType, RequireFields<MutationDeleteProductArgs, 'input'>>;
  deletePromotionCode?: Resolver<Maybe<ResolversTypes['PromotionCode']>, ParentType, ContextType, RequireFields<MutationDeletePromotionCodeArgs, 'input'>>;
  login?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationLoginArgs, 'input'>>;
  register?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationRegisterArgs, 'input'>>;
  reportOrderIssue?: Resolver<ResolversTypes['Order'], ParentType, ContextType, RequireFields<MutationReportOrderIssueArgs, 'input'>>;
  updateOrderStatus?: Resolver<ResolversTypes['Order'], ParentType, ContextType, RequireFields<MutationUpdateOrderStatusArgs, 'input'>>;
  validatePromotionCode?: Resolver<ResolversTypes['PromotionDiscountResult'], ParentType, ContextType, RequireFields<MutationValidatePromotionCodeArgs, 'input'>>;
};

export type OrderResolvers<ContextType = any, ParentType extends ResolversParentTypes['Order'] = ResolversParentTypes['Order']> = {
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  allowedTransitions?: Resolver<Array<ResolversTypes['OrderStatus']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  customerEmail?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  customerName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  customerPhone?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  delivery?: Resolver<ResolversTypes['Delivery'], ParentType, ContextType>;
  external_reference?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  issues?: Resolver<Array<ResolversTypes['OrderIssue']>, ParentType, ContextType>;
  items?: Resolver<Array<ResolversTypes['OrderItem']>, ParentType, ContextType>;
  mpInitPoint?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  mpPreferenceId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  mpQrData?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['OrderStatus'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type OrderIssueResolvers<ContextType = any, ParentType extends ResolversParentTypes['OrderIssue'] = ResolversParentTypes['OrderIssue']> = {
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  reason?: Resolver<ResolversTypes['OrderIssueReason'], ParentType, ContextType>;
  reportedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type OrderItemResolvers<ContextType = any, ParentType extends ResolversParentTypes['OrderItem'] = ResolversParentTypes['OrderItem']> = {
  price?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  productId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  quantity?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PaymentConfigResolvers<ContextType = any, ParentType extends ResolversParentTypes['PaymentConfig'] = ResolversParentTypes['PaymentConfig']> = {
  bypassPayment?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  mode?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PaymentPreferenceResolvers<ContextType = any, ParentType extends ResolversParentTypes['PaymentPreference'] = ResolversParentTypes['PaymentPreference']> = {
  amount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  externalReference?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  qrCode?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  qrCodeBase64?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProductResolvers<ContextType = any, ParentType extends ResolversParentTypes['Product'] = ResolversParentTypes['Product']> = {
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  activeItemPrice?: Resolver<Maybe<ResolversTypes['ItemPrice']>, ParentType, ContextType>;
  category?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  details?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  image?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  price?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  stock?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  unitsPerBulk?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PromotionCodeResolvers<ContextType = any, ParentType extends ResolversParentTypes['PromotionCode'] = ResolversParentTypes['PromotionCode']> = {
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  code?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  fromDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  percentage?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  productId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  scope?: Resolver<ResolversTypes['PromotionScope'], ParentType, ContextType>;
  toDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PromotionDiscountResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['PromotionDiscountResult'] = ResolversParentTypes['PromotionDiscountResult']> = {
  discountAmount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  finalTotal?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  originalTotal?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  promotionCode?: Resolver<Maybe<ResolversTypes['PromotionCode']>, ParentType, ContextType>;
  valid?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  activeItemPrice?: Resolver<Maybe<ResolversTypes['ItemPrice']>, ParentType, ContextType, RequireFields<QueryActiveItemPriceArgs, 'productId'>>;
  availableProducts?: Resolver<Array<ResolversTypes['Product']>, ParentType, ContextType, Partial<QueryAvailableProductsArgs>>;
  categories?: Resolver<Array<ResolversTypes['Category']>, ParentType, ContextType>;
  category?: Resolver<ResolversTypes['Category'], ParentType, ContextType, RequireFields<QueryCategoryArgs, 'id'>>;
  itemPrice?: Resolver<Maybe<ResolversTypes['ItemPrice']>, ParentType, ContextType, RequireFields<QueryItemPriceArgs, 'id'>>;
  itemPrices?: Resolver<Array<ResolversTypes['ItemPrice']>, ParentType, ContextType>;
  itemPricesByProduct?: Resolver<Array<ResolversTypes['ItemPrice']>, ParentType, ContextType, RequireFields<QueryItemPricesByProductArgs, 'productId'>>;
  order?: Resolver<ResolversTypes['Order'], ParentType, ContextType, RequireFields<QueryOrderArgs, 'id'>>;
  orders?: Resolver<Array<ResolversTypes['Order']>, ParentType, ContextType>;
  paymentConfig?: Resolver<ResolversTypes['PaymentConfig'], ParentType, ContextType>;
  product?: Resolver<ResolversTypes['Product'], ParentType, ContextType, RequireFields<QueryProductArgs, 'id'>>;
  products?: Resolver<Array<ResolversTypes['Product']>, ParentType, ContextType>;
  promotionCode?: Resolver<Maybe<ResolversTypes['PromotionCode']>, ParentType, ContextType, RequireFields<QueryPromotionCodeArgs, 'id'>>;
  promotionCodes?: Resolver<Array<ResolversTypes['PromotionCode']>, ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Address?: AddressResolvers<ContextType>;
  Category?: CategoryResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  Delivery?: DeliveryResolvers<ContextType>;
  ItemPrice?: ItemPriceResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Order?: OrderResolvers<ContextType>;
  OrderIssue?: OrderIssueResolvers<ContextType>;
  OrderItem?: OrderItemResolvers<ContextType>;
  PaymentConfig?: PaymentConfigResolvers<ContextType>;
  PaymentPreference?: PaymentPreferenceResolvers<ContextType>;
  Product?: ProductResolvers<ContextType>;
  PromotionCode?: PromotionCodeResolvers<ContextType>;
  PromotionDiscountResult?: PromotionDiscountResultResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
};

