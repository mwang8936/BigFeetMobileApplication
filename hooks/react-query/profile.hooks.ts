import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';
import {
	QueryClient,
	useMutation,
	useQuery,
	useQueryClient,
} from '@tanstack/react-query';
import { Toast } from 'toastify-react-native';

import {
	changeProfilePassword,
	getProfile,
	getProfileAcupunctureReports,
	getProfilePayrolls,
	getProfileSchedules,
	signProfileSchedule,
	updateProfile,
} from '@/api/private/services/profile.service';

import {
	acupunctureReportsQueryKey,
	payrollsQueryKey,
	profileQueryKey,
	schedulesQueryKey,
	userQueryKey,
} from '@/constants/Query';

import { CustomAPIError } from '@/models/custom-errors/API.Error';
import {
	GetProfileAcupunctureReportsParam,
	GetProfilePayrollsParam,
	GetProfileSchedulesParam,
} from '@/models/params/Profile.Param';
import {
	ChangeProfilePasswordRequest,
	UpdateProfileRequest,
} from '@/models/requests/Profile.Request.Model';

import {
	AcupunctureReportQueryProp,
	MutationProp,
	PayrollQueryProp,
	QueryProp,
	ScheduleQueryProp,
} from './prop.hooks';

export const useUserQuery = ({ enabled = true }: QueryProp) => {
	return useQuery({
		queryKey: [userQueryKey, profileQueryKey],
		queryFn: getProfile,
		enabled,
		staleTime: 1000 * 60 * 15,
		gcTime: 1000 * 60 * 60,
		refetchOnReconnect: false,
		refetchOnWindowFocus: false,
		retry: 3,
	});
};

export const useUpdateUserLanguageMutation = ({ setLoading }: MutationProp) => {
	const { t } = useTranslation();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: { request: UpdateProfileRequest }) =>
			updateProfile(data.request),
		onMutate: async () => {
			if (setLoading) setLoading(true);
		},
		onSuccess: (_data, _variables, _context) => {
			queryClient.invalidateQueries({
				queryKey: [userQueryKey, profileQueryKey],
			});

			Toast.success(t('Language Updated Successfully'));
		},
		onError: (error: CustomAPIError, _variables, _context) => {
			console.error('Error Updating Language:', error);
			Toast.error(`${t('Error Updating Language')}: ${error.messages[0]}`);
		},
		onSettled: async () => {
			if (setLoading) setLoading(false);
		},
	});
};

export const useChangePasswordMutation = ({
	setLoading,
	onSuccess,
}: MutationProp) => {
	const { t } = useTranslation();

	return useMutation({
		mutationFn: (data: { request: ChangeProfilePasswordRequest }) =>
			changeProfilePassword(data.request),
		onMutate: async () => {
			if (setLoading) setLoading(true);
		},
		onSuccess: (_data, _variables, _context) => {
			if (onSuccess) onSuccess();
			Toast.success(t('Password Updated Successfully'));
		},
		onError: (error: CustomAPIError, _variables, _context) => {
			console.error('Error Updating Password:', error);
			Toast.error(`${t('Error Updating Password')}: ${error.messages[0]}`);
		},
		onSettled: async () => {
			if (setLoading) setLoading(false);
		},
	});
};

export const useSignProfileScheduleMutation = ({
	setLoading,
	onSuccess,
}: MutationProp) => {
	const { t } = useTranslation();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: { date: DateTime }) => signProfileSchedule(data.date),
		onMutate: async () => {
			if (setLoading) setLoading(true);
		},
		onSuccess: (data, _variables, _context) => {
			if (onSuccess) onSuccess();

			queryClient.invalidateQueries({
				queryKey: [
					userQueryKey,
					schedulesQueryKey,
					data.date.year,
					data.date.month,
					data.date.day,
				],
			});

			Toast.success(t('Schedule Signed Successfully'));
		},
		onError: (error: CustomAPIError, _variables, _context) => {
			console.error('Error Signing Schedule:', error);
			Toast.error(`${t('Error Signing Schedule')}: ${error.messages[0]}`);
		},
		onSettled: async () => {
			if (setLoading) setLoading(false);
		},
	});
};

export const useUserAcupunctureReportsQuery = ({
	enabled = true,
	year,
	month,
}: AcupunctureReportQueryProp) => {
	const date = DateTime.fromObject(
		{ year, month },
		{ zone: 'America/Los_Angeles' }
	).startOf('day');

	const params: GetProfileAcupunctureReportsParam = {
		start: date,
		end: date,
	};

	return useQuery({
		queryKey: [userQueryKey, acupunctureReportsQueryKey, year, month],
		queryFn: () => getProfileAcupunctureReports(params),
		enabled: enabled && date.isValid,
		staleTime: 1000 * 60 * 15,
		gcTime: 1000 * 60 * 60,
		refetchOnReconnect: false,
		refetchOnWindowFocus: false,
		retry: 3,
	});
};

export const useUserPayrollsQuery = ({
	enabled = true,
	year,
	month,
}: PayrollQueryProp) => {
	const date = DateTime.fromObject(
		{ year, month },
		{ zone: 'America/Los_Angeles' }
	).startOf('day');

	const params: GetProfilePayrollsParam = {
		start: date,
		end: date,
	};

	return useQuery({
		queryKey: [userQueryKey, payrollsQueryKey, year, month],
		queryFn: () => getProfilePayrolls(params),
		enabled: enabled && date.isValid,
		staleTime: 1000 * 60 * 15,
		gcTime: 1000 * 60 * 60,
		refetchOnReconnect: false,
		refetchOnWindowFocus: false,
		retry: 3,
	});
};

export const useUserSchedulesQuery = ({
	enabled = true,
	year,
	month,
	day,
}: ScheduleQueryProp) => {
	const date = DateTime.fromObject(
		{ year, month, day },
		{ zone: 'America/Los_Angeles' }
	).startOf('day');

	const params: GetProfileSchedulesParam = {
		start: date,
		end: date,
	};

	return useQuery({
		queryKey: [userQueryKey, schedulesQueryKey, year, month, day],
		queryFn: () => getProfileSchedules(params),
		enabled: enabled && date.isValid,
		staleTime: 1000 * 60 * 15,
		gcTime: 1000 * 60 * 60,
		refetchOnReconnect: false,
		refetchOnWindowFocus: false,
		retry: 3,
	});
};

export const prefetchUserPayrollsQuery = async (queryClient: QueryClient) => {
	let currentDate = DateTime.now();
	currentDate = currentDate.setZone('America/Los_Angeles', {
		keepLocalTime: true,
	}) as DateTime;

	if (!currentDate.isValid) return;

	const year = currentDate.year;
	const month = currentDate.month;

	const params: GetProfilePayrollsParam = {
		start: currentDate,
		end: currentDate,
	};

	await queryClient.prefetchQuery({
		queryKey: [userQueryKey, payrollsQueryKey, year, month],
		queryFn: () => getProfilePayrolls(params),
		staleTime: 0,
		gcTime: 1000 * 60 * 60,
		retry: 3,
	});
};

export const prefetchUserAcupunctureReportsQuery = async (
	queryClient: QueryClient
) => {
	let currentDate = DateTime.now();
	currentDate = currentDate.setZone('America/Los_Angeles', {
		keepLocalTime: true,
	}) as DateTime;

	if (!currentDate.isValid) return;

	const year = currentDate.year;
	const month = currentDate.month;

	const params: GetProfileAcupunctureReportsParam = {
		start: currentDate,
		end: currentDate,
	};

	await queryClient.prefetchQuery({
		queryKey: [userQueryKey, acupunctureReportsQueryKey, year, month],
		queryFn: () => getProfileAcupunctureReports(params),
		staleTime: 0,
		gcTime: 1000 * 60 * 60,
		retry: 3,
	});
};

export const prefetchUserSchedulesQuery = async (queryClient: QueryClient) => {
	let currentDate = DateTime.now();
	currentDate = currentDate.setZone('America/Los_Angeles', {
		keepLocalTime: true,
	}) as DateTime;

	if (!currentDate.isValid) return;

	const year = currentDate.year;
	const month = currentDate.month;
	const day = currentDate.day;

	const params: GetProfileSchedulesParam = {
		start: currentDate,
		end: currentDate,
	};

	await queryClient.prefetchQuery({
		queryKey: [userQueryKey, schedulesQueryKey, year, month, day],
		queryFn: () => getProfileSchedules(params),
		staleTime: 0,
		gcTime: 1000 * 60 * 60,
		retry: 3,
	});
};
