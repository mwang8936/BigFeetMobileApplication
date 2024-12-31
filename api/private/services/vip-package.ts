import AuthorizedAxiosInstance from '../AuthorizedAxiosInstance';

import { vipPackagePath } from '@/constants/API';

import { GetVipPackagesParam } from '@/models/params/Vip-Package.Param';
import {
	AddVipPackageRequest,
	UpdateVipPackageRequest,
} from '@/models/requests/Vip-Package.Request.Model';
import VipPackage from '@/models/Vip-Package.Model';

export const getVipPackages = async (
	params: GetVipPackagesParam
): Promise<VipPackage[]> => {
	const response = await AuthorizedAxiosInstance.get(vipPackagePath, {
		params,
	});

	return response.data;
};

export const updateVipPackage = async (
	vip_package_id: number,
	request: UpdateVipPackageRequest
): Promise<VipPackage> => {
	const response = await AuthorizedAxiosInstance.patch(
		`${vipPackagePath}/${vip_package_id}`,
		request
	);

	return response.data;
};

export const addVipPackage = async (
	request: AddVipPackageRequest
): Promise<VipPackage> => {
	const response = await AuthorizedAxiosInstance.post(vipPackagePath, request);

	return response.data;
};

export const deleteVipPackage = async (
	vip_package_id: number
): Promise<VipPackage> => {
	const response = await AuthorizedAxiosInstance.delete(
		`${vipPackagePath}/${vip_package_id}`
	);

	return response.data;
};
