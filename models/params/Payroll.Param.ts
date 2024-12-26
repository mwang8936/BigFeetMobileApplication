import { DateTime } from 'luxon';

export interface GetPayrollsParam {
	start?: DateTime;
	end?: DateTime;
	employee_ids?: number[];
}
