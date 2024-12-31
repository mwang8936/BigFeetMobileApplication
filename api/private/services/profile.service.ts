import { DateTime } from 'luxon';

import AuthorizedAxiosInstance from '../AuthorizedAxiosInstance';

import { profilePath } from '@/constants/API';

import {
	GetProfileAcupunctureReportsParam,
	GetProfilePayrollsParam,
	GetProfileSchedulesParam,
} from '@/models/params/Profile.Param';
import {
	ChangeProfilePasswordRequest,
	UpdateProfileRequest,
} from '@/models/requests/Profile.Request.Model';
import AcupunctureReport from '@/models/Acupuncture-Report.Model';
import Payroll from '@/models/Payroll.Model';
import Schedule from '@/models/Schedule.Model';
import User from '@/models/User.Model';

export const getProfile = async (): Promise<User> => {
	const response = await AuthorizedAxiosInstance.get(profilePath);

	return response.data;
};

export const getProfileSchedules = async (
	params: GetProfileSchedulesParam
): Promise<Schedule[]> => {
	const response = await AuthorizedAxiosInstance.get(
		`${profilePath}/schedule`,
		{ params }
	);

	return response.data;
};

export const getProfilePayrolls = async (
	params: GetProfilePayrollsParam
): Promise<Payroll[]> => {
	const response = await AuthorizedAxiosInstance.get(`${profilePath}/payroll`, {
		params,
	});

	return response.data;
};

export const getProfileAcupunctureReports = async (
	params: GetProfileAcupunctureReportsParam
): Promise<AcupunctureReport[]> => {
	const response = await AuthorizedAxiosInstance.get(
		`${profilePath}/acupuncture-report`,
		{ params }
	);

	return response.data;
};

export const updateProfile = async (
	request: UpdateProfileRequest
): Promise<User> => {
	const response = await AuthorizedAxiosInstance.patch(profilePath, request);

	return response.data;
};

export const changeProfilePassword = async (
	request: ChangeProfilePasswordRequest
): Promise<User> => {
	const response = await AuthorizedAxiosInstance.patch(
		`${profilePath}/change_password`,
		request
	);

	return response.data;
};

export const signProfileSchedule = async (
	date: DateTime
): Promise<Schedule> => {
	const response = await AuthorizedAxiosInstance.patch(
		`${profilePath}/sign/${date.toISO()}`
	);

	return response.data;
};
