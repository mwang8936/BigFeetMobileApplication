import { DateTime } from 'luxon';

export interface GetReservationsParam {
	start?: DateTime;
	end?: DateTime;
	employee_ids?: string[];
}
