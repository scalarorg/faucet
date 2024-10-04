import { z } from "zod";

const stringToBooleanOfEnv = (str) => (str === "false" ? false : true);

const ProjectENVSchema = z.object({
  PRIVATE_KEY: z.string().default(""),
  RPC_URL: z.string().default(""),
  DEFAULT_FAUCET_ETH_AMOUNT: z.string().default(""),
  BASE_SCANNER_URL: z.string().default(""),
  ENABLE_UI: z.boolean().default(true),
  ENABLE_SWAGGER: z.boolean().default(true),
  APP_PORT: z.string().default(""),
  FAUCET_NAME: z.string().default("Faucet"),
});

export const globalParams = ProjectENVSchema.parse({
  PRIVATE_KEY: process.env.PRIVATE_KEY,
  RPC_URL: process.env.RPC_URL,
  DEFAULT_FAUCET_ETH_AMOUNT: process.env.DEFAULT_FAUCET_ETH_AMOUNT,
  BASE_SCANNER_URL: process.env.BASE_SCANNER_URL,
  ENABLE_UI: stringToBooleanOfEnv(process.env.ENABLE_UI),
  ENABLE_SWAGGER: stringToBooleanOfEnv(process.env.ENABLE_SWAGGER),
  APP_PORT: process.env.APP_PORT,
  FAUCET_NAME: process.env.FAUCET_NAME,
});
