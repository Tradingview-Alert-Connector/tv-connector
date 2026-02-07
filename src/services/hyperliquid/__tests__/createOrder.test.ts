jest.mock('../../../helper', () => ({
	_sleep: jest.fn(() => Promise.resolve())
}));

const mockPlaceOrder = jest.fn();

jest.mock('../client', () => ({
	__esModule: true,
	default: {
		build: jest.fn(() => ({
			placeOrder: mockPlaceOrder
		}))
	}
}));

import { hyperliquidCreateOrder } from '../createOrder';
import { hyperliquidOrderParams } from '../../../types';
import HyperliquidConnector from '../client';

describe('hyperliquidCreateOrder', () => {
	const orderParams: hyperliquidOrderParams = {
		coin: 'BTC',
		isBuy: true,
		size: '0.01000',
		price: '52500',
		reduceOnly: false,
		assetIndex: 0
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('places order successfully and returns result', async () => {
		const mockResult = {
			status: 'ok',
			response: {
				type: 'order',
				data: {
					statuses: [
						{
							filled: {
								totalSz: '0.01',
								avgPx: '50100.0',
								oid: 12345
							}
						}
					]
				}
			}
		};
		mockPlaceOrder.mockResolvedValue(mockResult);

		const result = await hyperliquidCreateOrder(orderParams);

		expect(result).toEqual(mockResult);
		expect(mockPlaceOrder).toHaveBeenCalledWith(0, true, '52500', '0.01000', false);
	});

	it('returns undefined when connector build fails', async () => {
		(HyperliquidConnector.build as jest.Mock).mockReturnValueOnce(null);

		const result = await hyperliquidCreateOrder(orderParams);
		expect(result).toBeUndefined();
	});

	it('retries on failure up to maxTries', async () => {
		mockPlaceOrder
			.mockRejectedValueOnce(new Error('Network error'))
			.mockRejectedValueOnce(new Error('Network error'))
			.mockResolvedValueOnce({ status: 'ok', response: { data: { statuses: [{ filled: {} }] } } });

		const result = await hyperliquidCreateOrder(orderParams);
		expect(result.status).toBe('ok');
		expect(mockPlaceOrder).toHaveBeenCalledTimes(3);
	});

	it('throws on Hyperliquid error response and retries', async () => {
		mockPlaceOrder.mockResolvedValue({
			status: 'err',
			response: 'Insufficient margin'
		});

		const result = await hyperliquidCreateOrder(orderParams);

		// Should retry 3 times then return undefined (all fail)
		expect(result).toBeUndefined();
		expect(mockPlaceOrder).toHaveBeenCalledTimes(4); // initial + 3 retries
	});

	it('passes correct parameters to placeOrder', async () => {
		mockPlaceOrder.mockResolvedValue({ status: 'ok', response: { data: { statuses: [] } } });

		const sellParams: hyperliquidOrderParams = {
			coin: 'ETH',
			isBuy: false,
			size: '1.5000',
			price: '2850',
			reduceOnly: true,
			assetIndex: 1
		};

		await hyperliquidCreateOrder(sellParams);

		expect(mockPlaceOrder).toHaveBeenCalledWith(1, false, '2850', '1.5000', true);
	});
});
