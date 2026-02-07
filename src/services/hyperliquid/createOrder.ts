import { hyperliquidOrderParams } from '../../types';
import { _sleep } from '../../helper';
import HyperliquidConnector from './client';

export const hyperliquidCreateOrder = async (
	orderParams: hyperliquidOrderParams
) => {
	let count = 0;
	const maxTries = 3;
	while (count <= maxTries) {
		try {
			const connector = HyperliquidConnector.build();
			if (!connector) return;

			const result = await connector.placeOrder(
				orderParams.assetIndex,
				orderParams.isBuy,
				orderParams.price,
				orderParams.size,
				orderParams.reduceOnly
			);

			if (result.status === 'err') {
				throw new Error(
					`Hyperliquid order error: ${result.response}`
				);
			}

			console.log(
				new Date() + ' placed order on Hyperliquid market:',
				orderParams.coin,
				'side:',
				orderParams.isBuy ? 'BUY' : 'SELL',
				'price:',
				orderParams.price,
				'size:',
				orderParams.size
			);

			return result;
		} catch (error) {
			count++;
			if (count == maxTries) {
				console.error(error);
			}
			await _sleep(5000);
		}
	}
};
