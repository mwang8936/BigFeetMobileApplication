import { DateTime } from 'luxon';

export default interface Customer {
	customer_id: number;
	phone_number: string | null;
	vip_serial: string | null;
	customer_name: string | null;
	notes: string | null;
	created_at: DateTime;
	updated_at: DateTime;
	deleted_at: DateTime | null;
}
