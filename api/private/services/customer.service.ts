import AuthorizedAxiosInstance from '../AuthorizedAxiosInstance';

import { customerPath } from '@/constants/API';

import { GetCustomersParam } from '@/models/params/Customer.Param';
import Customer from '@/models/Customer.Model';

export const getCustomers = async (
	params: GetCustomersParam
): Promise<Customer[]> => {
	const response = await AuthorizedAxiosInstance.get(customerPath, { params });

	return response.data;
};
