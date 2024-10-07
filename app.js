import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import swaggerJsdoc from "swagger-jsdoc";
import { serve, setup } from "swagger-ui-express";
import { globalParams } from "./src/params.js";
import faucetTo from "./src/faucet.js";
import { isValidEthereumAddress } from "./src/utils/validate.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get("/", async function (req, res) {
  if (globalParams.ENABLE_UI) {
    res.sendFile(path.join(__dirname, "/claim.html"));
  } else {
    res.status(403).send("Forbidden");
  }
});

app.get("/faucet/claim/:address", async function (req, res) {
  const addressTo = req.params.address;

  try {
    if (!isValidEthereumAddress(addressTo)) {
      console.error("Error occurred: Invalid address");
      throw new Error("Invalid address");
    }

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

if (globalParams.ENABLE_SWAGGER) {
  // Swagger
  const options = {
    definition: {
      openapi: "3.1.0",
      info: {
        title: globalParams.FAUCET_NAME + " faucet",
        version: "0.1.0",
      },
    },
    apis: ["./routes/*.js"],
  };

  const specs = swaggerJsdoc(options);
  app.use("/swagger", serve, setup(specs, { explorer: false }));
}

app.listen(globalParams.APP_PORT, () => {
  console.log(
    globalParams.FAUCET_NAME +
      ` faucet app listening on port ${globalParams.APP_PORT}!`
  );
});
