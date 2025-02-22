import { DateTime } from 'luxon';

import Customer from './Customer.Model';
import { Gender, TipMethod } from './enums';
import Service from './Service.Model';

export default interface Reservation {
	reservation_id: number;
	employee_id: number;
	date: DateTime;
	reserved_date: DateTime;
	service: Service;
	time: number | null;
	beds_required: number | null;
	customer: Customer | null;
	requested_gender: Gender | null;
	requested_employee: boolean;
	cash: number | null;
	machine: number | null;
	vip: number | null;
	gift_card: number | null;
	insurance: number | null;
	cash_out: number | null;
	tips: number | null;
	tip_method: TipMethod | null;
	message: string | null;
	created_by: string;
	created_at: DateTime;
	updated_by: string;
	updated_at: DateTime;
}
