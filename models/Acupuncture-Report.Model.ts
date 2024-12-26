import { DateTime } from 'luxon';

import Employee from './Employee.Model';

export interface DataRow {
	date: DateTime;
	acupuncture: number;
	massage: number;
	insurance: number;
}

export default interface AcupunctureReport {
	year: number;
	month: number;
	employee: Employee;
	acupuncture_percentage: number;
	massage_percentage: number;
	insurance_percentage: number;
	data: DataRow[];
	created_at: DateTime;
	updated_at: DateTime;
}
