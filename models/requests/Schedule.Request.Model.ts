import { DateTime } from 'luxon';

export interface UpdateScheduleRequest {
	is_working?: boolean;
	on_call?: boolean;
	start?: DateTime | null;
	end?: DateTime | null;
	priority?: number | null;
	add_award?: boolean;
}

export interface SignScheduleRequest {
	password: string;
}

export interface AddScheduleRequest {
	date: DateTime;
	employee_id: number;
	is_working?: boolean;
	on_call?: boolean;
	start?: DateTime | null;
	end?: DateTime | null;
	priority?: number | null;
	add_award?: boolean;
}
