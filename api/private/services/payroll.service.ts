import AuthorizedAxiosInstance from '../AuthorizedAxiosInstance';

import { payrollPath } from '@/constants/API.constants';

import { GetPayrollsParam } from '@/models/params/Payroll.Param';
import {
	AddPayrollRequest,
	UpdatePayrollRequest,
} from '@/models/requests/Payroll.Request.Model';
import { PayrollPart } from '@/models/enums';
import Payroll from '@/models/Payroll.Model';

export const getPayrolls = async (
	params: GetPayrollsParam
): Promise<Payroll[]> => {
	const response = await AuthorizedAxiosInstance.get(payrollPath, { params });

	return response.data;
};

export const updatePayroll = async (
	year: number,
	month: number,
	part: PayrollPart,
	employee_id: number,
	request: UpdatePayrollRequest
): Promise<Payroll> => {
	const response = await AuthorizedAxiosInstance.patch(
		`${payrollPath}/${year}/${month}/${part}/employee/${employee_id}`,
		{ request }
	);

	return response.data;
};

export const addPayroll = async (
	request: AddPayrollRequest
): Promise<Payroll> => {
	const response = await AuthorizedAxiosInstance.post(payrollPath, {
		request,
	});

	return response.data;
};

export const deletePayroll = async (
	year: number,
	month: number,
	part: PayrollPart,
	employee_id: number
): Promise<Payroll> => {
	const response = await AuthorizedAxiosInstance.delete(
		`${payrollPath}/${year}/${month}/${part}/employee/${employee_id}`
	);

	return response.data;
};

export const refreshPayroll = async (
	year: number,
	month: number,
	part: PayrollPart,
	employee_id: number
): Promise<Payroll> => {
	const response = await AuthorizedAxiosInstance.patch(
		`${payrollPath}/refresh/${year}/${month}/${part}/employee/${employee_id}`
	);

	return response.data;
};
