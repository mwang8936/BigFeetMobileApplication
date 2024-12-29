import { DateTime } from 'luxon';

export interface UpdateVipPackageRequest {
	serial?: string;
	sold_amount?: number;
	commission_amount?: number;
	date?: DateTime;
	employee_ids?: number[];
}

export interface AddVipPackageRequest {
	serial: string;
	sold_amount: number;
	commission_amount: number;
	date: DateTime;
	employee_ids: number[];
}
