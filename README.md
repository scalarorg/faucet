# faucet

## Prerequisites

node version >=18.0.0

## Installation

```sh
npm install
```

## Config

Duplicate `.env.example` into `.env` and input these values:

- PRIVATE_KEY: Private key of the source of fauceting ETH
- RPC_URL: rpc url of the fauceting chain
- DEFAULT_FAUCET_ETH_AMOUNT: The token faucet amount per request
- BASE_SCANNER_URL: Base URL of the transaction reviewing scanner
- APP_PORT: The port the faucet application application run on

## Run it (server side)

To start the application server

```
npm run start
```

To run the faucet example, please review the file `example/tryFaucet.js`, then use the following command

```
npm run tryFaucet
```

## Client request

An example of calling to the faucet API in developemt mode, with `<APP_PORT>` and `<address>` are custom values:

```
curl -s "http://localhost:<APP_PORT>/faucet/claim/<address>" | jq
```

The application UI can be review locally at the root route `http://localhost:<APP_PORT>/`
