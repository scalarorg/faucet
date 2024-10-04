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

Other configs like using UI and faucet application port can be set in `config.json`

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

The application can be view at the route `/faucet/ui`

An example of calling to the faucet API in developemt mode, with `<dappPort>` and `<address>` are custom values:

```
curl -s "http://localhost:<dappPort>/faucet/claim/<address>" | jq
```
