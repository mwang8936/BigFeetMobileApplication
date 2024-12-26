import { DateTime } from 'luxon';

import { PaymentMethod } from './enums';

export default interface GiftCard {
	gift_card_id: string;
	date: DateTime;
	payment_method: PaymentMethod;
	payment_amount: number;
	created_at: DateTime;
	updated_at: DateTime;
}
