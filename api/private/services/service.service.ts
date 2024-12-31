import AuthorizedAxiosInstance from '../AuthorizedAxiosInstance';

import { servicePath } from '@/constants/API';

import { GetServicesParam } from '@/models/params/Service.Param';
import Service from '@/models/Service.Model';

export const getServices = async (
	params: GetServicesParam
): Promise<Service[]> => {
	const response = await AuthorizedAxiosInstance.get(servicePath, { params });

	return response.data;
};
