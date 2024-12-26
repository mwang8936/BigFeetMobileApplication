import { DateTime } from 'luxon';

export interface GetAcupunctureReportsParam {
	start?: DateTime;
	end?: DateTime;
	employee_ids?: number[];
}
