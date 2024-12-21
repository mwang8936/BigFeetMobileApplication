import UnauthorizedAxiosInstance from '../UnauthorizedAxiosInstance';

import { loginPath } from '@/constants/API.constants';

import {
	LoginRequest,
	LoginResponse,
} from '@/models/requests/Login.Request.Model';

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
	const response = await UnauthorizedAxiosInstance.post<LoginResponse>(
		loginPath,
		data
	);

	return response.data;
};
