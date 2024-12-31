import AuthorizedAxiosInstance from '../AuthorizedAxiosInstance';

import { employeePath } from '@/constants/API';

import { GetEmployeesParam } from '@/models/params/Employee.Param';
import Employee from '@/models/Employee.Model';

export const getEmployees = async (
	params: GetEmployeesParam
): Promise<Employee[]> => {
	const response = await AuthorizedAxiosInstance.get(employeePath, { params });

	return response.data;
};
