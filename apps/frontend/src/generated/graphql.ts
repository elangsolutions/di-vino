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

export type AddProductInput = {
  _id?: InputMaybe<Scalars['String']['input']>;
  category: Scalars['String']['input'];
  details: Scalars['String']['input'];
  image?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  price: Scalars['Float']['input'];
};

export type Address = {
  __typename?: 'Address';
  city: Scalars['String']['output'];
  postalCode: Scalars['String']['output'];
  province: Scalars['String']['output'];
  street: Scalars['String']['output'];
};

export type CreateOrderDraftInput = {
  delivery: DeliveryInput;
  items: Array<OrderItemInput>;
  state: OrderState;
  userId: Scalars['String']['input'];
};

export type Delivery = {
  __typename?: 'Delivery';
  address?: Maybe<Address>;
  locationId?: Maybe<Scalars['String']['output']>;
  type: DeliveryType;
};

export type DeliveryInput = {
  address?: InputMaybe<AddAddressInput>;
  locationId?: InputMaybe<Scalars['String']['input']>;
  type: DeliveryType;
};

export enum DeliveryType {
  Address = 'ADDRESS',
  Pickup = 'PICKUP'
}

export type LoginInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addProduct: Product;
  createOrder: Order;
  createPaymentPreference: PaymentPreference;
  deleteProduct: Product;
  login: Scalars['String']['output'];
  register: Scalars['String']['output'];
};


export type MutationAddProductArgs = {
  input: AddProductInput;
};


export type MutationCreateOrderArgs = {
  input: CreateOrderDraftInput;
};


export type MutationCreatePaymentPreferenceArgs = {
  amount: Scalars['Float']['input'];
  description: Scalars['String']['input'];
  orderId: Scalars['String']['input'];
};


export type MutationDeleteProductArgs = {
  input: RemoveProductInput;
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationRegisterArgs = {
  input: RegisterInput;
};

export type Order = {
  __typename?: 'Order';
  _id: Scalars['ID']['output'];
  createdAt: Scalars['DateTime']['output'];
  delivery: Delivery;
  external_reference: Scalars['String']['output'];
  items: Array<OrderItem>;
  mpInitPoint?: Maybe<Scalars['String']['output']>;
  mpPreferenceId?: Maybe<Scalars['String']['output']>;
  mpQrData?: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  userId: Scalars['String']['output'];
};

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

export enum OrderState {
  Closed = 'CLOSED',
  Delivered = 'DELIVERED',
  Draft = 'DRAFT',
  Open = 'OPEN',
  Paid = 'PAID'
}

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
  category: Scalars['String']['output'];
  details?: Maybe<Scalars['String']['output']>;
  image?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  price: Scalars['Float']['output'];
  stock: Scalars['Float']['output'];
};

export type Query = {
  __typename?: 'Query';
  orders: Array<Order>;
  product: Product;
  products: Array<Product>;
};


export type QueryProductArgs = {
  id: Scalars['String']['input'];
};

export type RegisterInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type RemoveProductInput = {
  _id?: InputMaybe<Scalars['String']['input']>;
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
  AddProductInput: AddProductInput;
  Address: ResolverTypeWrapper<Address>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  CreateOrderDraftInput: CreateOrderDraftInput;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  Delivery: ResolverTypeWrapper<Delivery>;
  DeliveryInput: DeliveryInput;
  DeliveryType: DeliveryType;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  LoginInput: LoginInput;
  Mutation: ResolverTypeWrapper<{}>;
  Order: ResolverTypeWrapper<Order>;
  OrderItem: ResolverTypeWrapper<OrderItem>;
  OrderItemInput: OrderItemInput;
  OrderState: OrderState;
  PaymentPreference: ResolverTypeWrapper<PaymentPreference>;
  Product: ResolverTypeWrapper<Product>;
  Query: ResolverTypeWrapper<{}>;
  RegisterInput: RegisterInput;
  RemoveProductInput: RemoveProductInput;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AddAddressInput: AddAddressInput;
  AddProductInput: AddProductInput;
  Address: Address;
  Boolean: Scalars['Boolean']['output'];
  CreateOrderDraftInput: CreateOrderDraftInput;
  DateTime: Scalars['DateTime']['output'];
  Delivery: Delivery;
  DeliveryInput: DeliveryInput;
  Float: Scalars['Float']['output'];
  ID: Scalars['ID']['output'];
  LoginInput: LoginInput;
  Mutation: {};
  Order: Order;
  OrderItem: OrderItem;
  OrderItemInput: OrderItemInput;
  PaymentPreference: PaymentPreference;
  Product: Product;
  Query: {};
  RegisterInput: RegisterInput;
  RemoveProductInput: RemoveProductInput;
  String: Scalars['String']['output'];
};

export type AddressResolvers<ContextType = any, ParentType extends ResolversParentTypes['Address'] = ResolversParentTypes['Address']> = {
  city?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  postalCode?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  province?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  street?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type DeliveryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Delivery'] = ResolversParentTypes['Delivery']> = {
  address?: Resolver<Maybe<ResolversTypes['Address']>, ParentType, ContextType>;
  locationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['DeliveryType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  addProduct?: Resolver<ResolversTypes['Product'], ParentType, ContextType, RequireFields<MutationAddProductArgs, 'input'>>;
  createOrder?: Resolver<ResolversTypes['Order'], ParentType, ContextType, RequireFields<MutationCreateOrderArgs, 'input'>>;
  createPaymentPreference?: Resolver<ResolversTypes['PaymentPreference'], ParentType, ContextType, RequireFields<MutationCreatePaymentPreferenceArgs, 'amount' | 'description' | 'orderId'>>;
  deleteProduct?: Resolver<ResolversTypes['Product'], ParentType, ContextType, RequireFields<MutationDeleteProductArgs, 'input'>>;
  login?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationLoginArgs, 'input'>>;
  register?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationRegisterArgs, 'input'>>;
};

export type OrderResolvers<ContextType = any, ParentType extends ResolversParentTypes['Order'] = ResolversParentTypes['Order']> = {
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  delivery?: Resolver<ResolversTypes['Delivery'], ParentType, ContextType>;
  external_reference?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  items?: Resolver<Array<ResolversTypes['OrderItem']>, ParentType, ContextType>;
  mpInitPoint?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  mpPreferenceId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  mpQrData?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type OrderItemResolvers<ContextType = any, ParentType extends ResolversParentTypes['OrderItem'] = ResolversParentTypes['OrderItem']> = {
  price?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  productId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  quantity?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
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
  category?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  details?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  image?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  price?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  stock?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  orders?: Resolver<Array<ResolversTypes['Order']>, ParentType, ContextType>;
  product?: Resolver<ResolversTypes['Product'], ParentType, ContextType, RequireFields<QueryProductArgs, 'id'>>;
  products?: Resolver<Array<ResolversTypes['Product']>, ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Address?: AddressResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  Delivery?: DeliveryResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Order?: OrderResolvers<ContextType>;
  OrderItem?: OrderItemResolvers<ContextType>;
  PaymentPreference?: PaymentPreferenceResolvers<ContextType>;
  Product?: ProductResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
};

