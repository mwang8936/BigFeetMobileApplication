import { DateTime } from 'luxon';

export interface GetProfileSchedulesParam {
	start?: DateTime;
	end?: DateTime;
}

export interface GetProfilePayrollsParam {
	start?: DateTime;
	end?: DateTime;
}

export interface GetProfileAcupunctureReportsParam {
	start?: DateTime;
	end?: DateTime;
}
