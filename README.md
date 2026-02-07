# Tradingview-Alert-Connector

Tradingview-Alert-Connector is a free and noncustodial tool for you to Integrate tradingView alert and execute automated trading for perpetual futures DEXes.

Currently supports [dYdX](https://dydx.exchange/), [Perpetual Protocol](https://perp.com/), and [Hyperliquid](https://hyperliquid.xyz/).

# Docs

https://tv-connector.gitbook.io/docs/

# Video Tutorial

For dYdX:
https://www.youtube.com/watch?v=I8hB2O2-xx4

For Perpetual Protocol:
https://youtu.be/YqrOZW_mnUM

# Supported Exchanges

| Exchange | Network | Type |
|----------|---------|------|
| dYdX | Ethereum L1 / StarkEx | Perpetual Futures |
| Perpetual Protocol | Optimism L2 | Perpetual Futures |
| Hyperliquid | Hyperliquid L1 | Perpetual Futures |

# Prerequisites

- TradingView Account at least Pro plan

https://www.tradingview.com/gopro/

- dYdX, Perpetual Protocol, or Hyperliquid account with collateral already in place

# Installation

```bash
git clone https://github.com/junta/tradingview-alert-connector.git
cd tradingview-alert-connector
npm install --force
```

# Quick Start

- rename .env.sample to .env
- fill environment variables in .env (see [full tutorial](https://tv-connector.gitbook.io/docs/setuup/running-on-local-pc#steps))

### Environment Variables

For dYdX:
```
ETH_ADDRESS=
STARK_PUBLIC_KEY=
STARK_PRIVATE_KEY=
API_KEY=
API_PASSPHRASE=
API_SECRET=
```

For Perpetual Protocol:
```
PERPETUAL_PRIVATE_KEY=
```

For Hyperliquid:
```
HYPERLIQUID_PRIVATE_KEY=
```

Optional:
```
TRADINGVIEW_PASSPHRASE=
SENTRY_DNS=
```

### with Docker

```bash
docker-compose build
docker-compose up -d
```

### without Docker

```bash
yarn start
```

# TradingView Alert Format

Set your TradingView alert webhook URL to your server's address (e.g., `http://your-server:3000/`) and use JSON format for the alert message:

### For Hyperliquid

```json
{
  "exchange": "hyperliquid",
  "strategy": "MyStrategy",
  "market": "BTC",
  "size": 0.01,
  "order": "buy",
  "price": {{close}},
  "position": "long",
  "reverse": false
}
```

The `market` field accepts multiple formats: `"BTC"`, `"BTC-USD"`, `"BTC-PERP"`, or `"BTC_USD"`.

### For dYdX

```json
{
  "exchange": "dydx",
  "strategy": "MyStrategy",
  "market": "BTC-USD",
  "size": 0.01,
  "order": "buy",
  "price": {{close}},
  "position": "long",
  "reverse": false
}
```

### For Perpetual Protocol

```json
{
  "exchange": "perpetual",
  "strategy": "MyStrategy",
  "market": "BTC",
  "size": 0.01,
  "order": "buy",
  "price": {{close}},
  "position": "long",
  "reverse": false
}
```

### Order Sizing Options

Instead of a fixed `size`, you can use:
- `"sizeUsd": 1000` - Size in USD value (converted to base asset at current price)
- `"sizeByLeverage": 2` - Percentage of account equity as leverage

# Testing

```bash
npm test
```

## Disclaimer

This project is hosted under an MIT OpenSource License. This tool does not guarantee users' future profit and users have to use this tool on their own responsibility.
