# BinaryOptionsArbBotEVM

## Description

Attempting to arbitrage different binary options on an EVM chain; in particular the MVP focuses on arbitraging options on the price of BNB/USD over a 5 minute period.

## Methodology

The 'bot' listens for particular events being emitted by the contracts of interest; when the bot detects two games that have commenced within a period of X seconds it waits until they are about to lock. - (X is configurable by an environment variable, and defaults to 10 seconds).

When the game is about to lock, the odds are calculated. If it is possible to hedge one bet against the other, the bot will automatically place the bets.

## Running during development

1. Install NodeJS & Yarn on your system
2. `cd` into this folder
3. `yarn install`
4. Sign up for a BSC Websocket enabled RPC endpoint here: getblock.io, add this to .env as `RPC_URL`
5. `yarn dev`
