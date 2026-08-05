export type PaymentMode = 'live' | 'testing';

const parsePaymentMode = (value?: string): PaymentMode =>
  value === 'testing' ? 'testing' : 'live';

export default () => ({
  mongoUri: process.env.MONGO_URI,
  port: parseInt(process.env.PORT ?? '3000', 10),
  mpAccessToken: process.env.MP_ACCESS_TOKEN,
  mpPublicKey: process.env.MP_PUBLIC_KEY,
  /** Mercado Pago is off unless MP_ENABLED=true */
  mpEnabled: process.env.MP_ENABLED === 'true',
  /**
   * live: real Mercado Pago flow
   * testing: skip payment provider; orders are created as paid
   */
  paymentMode: parsePaymentMode(process.env.PAYMENT_MODE),
  divinoApp: process.env.DIVINO_APP,
  frontendUrls: process.env.FRONTEND_URLS || 'http://localhost:5173',
});
