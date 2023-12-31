import "dotenv/config";
import ms from "ms";

const { env } = process;

const appConfig = {
  isDev: env.NODE_ENV === "development",
  mongoDbUri: env.dbUri || "",
  environment: env.NODE_ENV,
  port: Number(env.PORT) || 9002,
  hashPepper: env.pepper,
  authConfigs: {
    saltRounds: 10,
    jwtSecret: env.jwtSecret || "",
    sessionLifespan: ms("2days"),
    maxInactivity: ms("12h"),
  },
  seedData: {
    userName: env.userName,
    password: env.password,
    role: env.role,
    email: env.email,
  },
  paystackSecretKey: env.paystack_secret,
  paystackPublicKey: env.paystack_public_key,
  MESSAGE_BROKER_URL: env.message_broker_url,
  EXCHANGE_NAME: "SHOP_EXPLORE",
  CUSTOMER_BINDING_KEY: "CUSTOMER_SERVICE",
  SHOPPING_BINDING_KEY: "SHOPPING_SERVICE",
  QUEUE_NAME: "SHOPEXPLORE_QUEUE",
};

export default appConfig;
