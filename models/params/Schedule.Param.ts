import { DateTime } from 'luxon';

export interface GetSchedulesParam {
	start?: DateTime;
	end?: DateTime;
	employee_ids?: number[];
}
