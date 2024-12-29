import AuthorizedAxiosInstance from '../AuthorizedAxiosInstance';

import { giftCardPath } from '@/constants/API.constants';

import { GetGiftCardsParam } from '@/models/params/Gift-Card.Param';
import {
	AddGiftCardRequest,
	UpdateGiftCardRequest,
} from '@/models/requests/Gift-Card.Request';
import GiftCard from '@/models/Gift-Card.Model';

export const getGiftCards = async (
	params: GetGiftCardsParam
): Promise<GiftCard[]> => {
	const response = await AuthorizedAxiosInstance.get(giftCardPath, { params });

	return response.data;
};

export const updateGiftCard = async (
	gift_card_id: number,
	request: UpdateGiftCardRequest
): Promise<GiftCard> => {
	const response = await AuthorizedAxiosInstance.patch(
		`${giftCardPath}/${gift_card_id}`,
		request
	);

	return response.data;
};

export const addGiftCard = async (
	request: AddGiftCardRequest
): Promise<GiftCard> => {
	const response = await AuthorizedAxiosInstance.post(giftCardPath, request);

	return response.data;
};

export const deleteGiftCard = async (
	gift_card_id: number
): Promise<GiftCard> => {
	const response = await AuthorizedAxiosInstance.delete(
		`${giftCardPath}/${gift_card_id}`
	);

	return response.data;
};
