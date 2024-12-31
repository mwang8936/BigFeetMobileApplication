import { DateTime } from 'luxon';

export interface GetVipPackagesParam {
	start?: DateTime;
	end?: DateTime;
	employee_ids?: number[];
}
