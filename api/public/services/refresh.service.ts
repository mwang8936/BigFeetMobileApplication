import UnauthorizedAxiosInstance from '../UnauthorizedAxiosInstance';

import { refreshPath } from '@/constants/API';

import { LoginResponse } from '@/models/requests/Login.Request.Model';

export const refresh = async (): Promise<LoginResponse> => {
	const response = await UnauthorizedAxiosInstance.post<LoginResponse>(
		refreshPath
	);

	return response.data;
};
