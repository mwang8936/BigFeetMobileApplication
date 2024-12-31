import AuthorizedAxiosInstance from '../AuthorizedAxiosInstance';

import { schedulePath } from '@/constants/API';

import { GetSchedulesParam } from '@/models/params/Schedule.Param';
import {
	AddScheduleRequest,
	SignScheduleRequest,
	UpdateScheduleRequest,
} from '@/models/requests/Schedule.Request.Model';
import Schedule from '@/models/Schedule.Model';
import { DateTime } from 'luxon';

export const geSchedules = async (
	params: GetSchedulesParam
): Promise<Schedule[]> => {
	const response = await AuthorizedAxiosInstance.get(schedulePath, {
		params,
	});

	return response.data;
};

export const updateSchedule = async (
	date: DateTime,
	employee_id: number,
	request: UpdateScheduleRequest
): Promise<Schedule> => {
	const response = await AuthorizedAxiosInstance.patch(
		`${schedulePath}/${date.toISO()}/employee/${employee_id}`,
		request
	);

	return response.data;
};

export const signSchedule = async (
	date: DateTime,
	employee_id: number,
	request: SignScheduleRequest
): Promise<Schedule> => {
	const response = await AuthorizedAxiosInstance.patch(
		`${schedulePath}/${date.toISO()}/employee/${employee_id}/sign`,
		request
	);

	return response.data;
};

export const addSchedule = async (
	request: AddScheduleRequest
): Promise<Schedule> => {
	const response = await AuthorizedAxiosInstance.post(schedulePath, request);

	return response.data;
};
