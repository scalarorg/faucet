import fs from "fs";
import axios from "axios";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import swaggerJsdoc from "swagger-jsdoc";
import { serve, setup } from "swagger-ui-express";
import { DirectSecp256k1HdWallet, coin, coins } from "@cosmjs/proto-signing";
import bech32 from "bech32";
import pkg from "@cosmjs/stargate";
import { globalParams } from "./src/params.js";
import faucetTo from "./src/faucet.js";
import { hash } from "crypto";
const {
  assertIsDeliverTxSuccess,
  SigningStargateClient,
  defaultRegistryTypes,
  GasPrice,
} = pkg;

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let rawdata = fs.readFileSync("config.json");
let config = JSON.parse(rawdata);

function checkBech32Address(address) {
  try {
    bech32.decode(address);
    return true;
  } catch (error) {
    return false;
  }
}
function checkBech32Prefix(address) {
  try {
    const { prefix } = bech32.decode(address);
    if (prefix === config.prefix) {
      return true;
    }
  } catch (error) {
    return false;
  }
}

app.get("/faucet/ui", async function (req, res) {
  if (config.enableUi) {
    res.sendFile(path.join(__dirname, "/claim.html"));
  } else {
    res.status(403).send("Forbidden");
  }
});

app.get("/faucet/available", async function (req, res) {
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(config.mnemonic, {
    prefix: config.prefix,
  });
  const [firstAccount] = await wallet.getAccounts();

  const account = await axios.get(
    config.lcdUrl +
      "/cosmos/bank/v1beta1/spendable_balances/" +
      firstAccount.address
  );
  let available = 0;
  account.data.balances.forEach(function (balance) {
    if (balance.denom == config.denom) {
      available = balance.amount;
    }
  });
  res.json({
    available: available,
  });
});

app.get("/faucet/last-claim", async function (req, res) {
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(config.mnemonic, {
    prefix: config.prefix,
  });
  const [firstAccount] = await wallet.getAccounts();

  const resultSender = await axios(
    config.lcdUrl +
      "/cosmos/tx/v1beta1/txs?events=message.sender=%27" +
      firstAccount.address +
      "%27&limit=10&order_by=2"
  );
  res.json({
    lastclaim: resultSender.data,
  });
});

app.get("/faucet/claim/:address", async function (req, res) {
  const addressTo = req.params.address;

  try {
    const result = await faucetTo(
      addressTo,
      globalParams.DEFAULT_FAUCET_ETH_AMOUNT
    );

    res.json({
      value: result.value.toString(),
      hash: result.hash,
      base_scanner_url: globalParams.BASE_SCANNER_URL,
    });
  } catch (error) {
    // Handle any errors that occur during the request
    console.error("Error occurred:", error.message);

    res.status(500).json({
      success: false,
      message: "An error occurred while processing the faucet request.",
      error: error.message, // Optionally, you can send the error message for debugging
    });
  }
});

if (config.enableSwagger) {
  // Swagger
  const options = {
    definition: {
      openapi: "3.1.0",
      info: {
        title: config.name + " faucet",
        version: "0.1.0",
      },
    },
    apis: ["./routes/*.js"],
  };

  const specs = swaggerJsdoc(options);
  app.use("/", serve, setup(specs, { explorer: false }));
}

app.listen(config.dappPort, () => {
  console.log(config.name + ` faucet app listening on port ${config.dappPort}`);
});
