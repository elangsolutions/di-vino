export default () => ({
  mongoUri: process.env.MONGO_URI,
  port: parseInt(process.env.PORT ?? '3000', 10),
  mpAccessToken: process.env.MP_ACCESS_TOKEN,
  mpPublicKey: process.env.MP_PUBLIC_KEY,
  /** Mercado Pago is off unless MP_ENABLED=true */
  mpEnabled: process.env.MP_ENABLED === 'true',
  divinoApp: process.env.DIVINO_APP,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
});
