import { DateTime } from 'luxon';

import { PaymentMethod } from '../enums';

export interface UpdateGiftCardRequest {
	date?: DateTime;
	payment_method?: PaymentMethod;
	payment_amount?: number;
}

export interface AddGiftCardRequest {
	gift_card_id: string;
	date: DateTime;
	payment_method: PaymentMethod;
	payment_amount: number;
}
