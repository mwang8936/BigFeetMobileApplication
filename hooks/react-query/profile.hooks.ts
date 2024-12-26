import {
	getProfile,
	getProfileAcupunctureReports,
	getProfilePayrolls,
	getProfileSchedules,
	updateProfile,
} from '@/api/private/services/profile.service';
import {
	GetProfileAcupunctureReportsParam,
	GetProfilePayrollsParam,
} from '@/models/params/Profile.Param';
import { UpdateProfileRequest } from '@/models/requests/Profile.Request.Model';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { DateTime } from 'luxon';

export const userQueryKey = 'user';

export const useUserQuery = (enabled: boolean = true) => {
	return useQuery({
		queryKey: [userQueryKey],
		queryFn: getProfile,
		enabled,
		staleTime: 1000 * 60 * 15,
		gcTime: 1000 * 60 * 60,
		refetchOnReconnect: false,
		refetchOnWindowFocus: false,
		retry: 3,
	});
};

export const useUpdateUserLanguageMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: { request: UpdateProfileRequest }) =>
			updateProfile(data.request),
		onSuccess: (_data, variables, context) => {
			queryClient.invalidateQueries({ queryKey: [userQueryKey] });

			// const updatedLanguage = variables.request.language;

			// if (updatedLanguage)
			// 	i18n.changeLanguage(getLanguageFile(updatedLanguage));

			// if (onSuccess) onSuccess();

			// successToast(context.toastId, t('Profile Updated Successfully'));
		},
		onError: (error, _variables, context) => {
			// if (setError) setError(error.message);
			// if (context)
			// 	errorToast(
			// 		context.toastId,
			// 		t('Failed to Update Profile'),
			// 		error.message
			// 	);
		},
	});
};
export const useUserAcupunctureReportsQuery = (year: number, month: number) => {
	const date = DateTime.fromObject(
		{ year, month },
		{ zone: 'America/Los_Angeles' }
	).startOf('day');

	const params: GetProfileAcupunctureReportsParam = {
		start: date,
		end: date,
	};

	return useQuery({
		queryKey: [userQueryKey, 'acupuncture-reports', year, month],
		queryFn: () => getProfileAcupunctureReports(params),
		staleTime: 1000 * 60 * 15,
		gcTime: 1000 * 60 * 60,
		refetchOnReconnect: false,
		refetchOnWindowFocus: false,
		retry: 3,
	});
};

export const useUserPayrollsQuery = (year: number, month: number) => {
	const date = DateTime.fromObject(
		{ year, month },
		{ zone: 'America/Los_Angeles' }
	).startOf('day');

	const params: GetProfilePayrollsParam = {
		start: date,
		end: date,
	};

	return useQuery({
		queryKey: [userQueryKey, 'payrolls', year, month],
		queryFn: () => getProfilePayrolls(params),
		staleTime: 1000 * 60 * 15,
		gcTime: 1000 * 60 * 60,
		refetchOnReconnect: false,
		refetchOnWindowFocus: false,
		retry: 3,
	});
};

export const useUserSchedulesQuery = (
	year: number,
	month: number,
	day: number
) => {
	return useQuery({
		queryKey: [userQueryKey, 'schedules'],
		queryFn: () => getProfileSchedules,
		staleTime: 1000 * 60 * 15,
		gcTime: 1000 * 60 * 60,
		refetchOnReconnect: false,
		refetchOnWindowFocus: false,
		retry: 3,
	});
};
