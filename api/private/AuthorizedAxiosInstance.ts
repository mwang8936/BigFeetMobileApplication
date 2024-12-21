import axios, {
	AxiosError,
	AxiosInstance,
	AxiosResponse,
	InternalAxiosRequestConfig,
} from 'axios';

import * as SecureStore from 'expo-secure-store';

import { DateTime } from 'luxon';

import API_BASE_URL from '@/constants/API.constants';

// The Axios Instance used for making authorized API calls
const AuthorizedAxiosInstance: AxiosInstance = axios.create({
	baseURL: API_BASE_URL,
	timeout: 10000,
	headers: {
		'Content-Type': 'application/json',
	},
});

const onRequest = async (
	config: InternalAxiosRequestConfig
): Promise<InternalAxiosRequestConfig> => {
	// Attach API Access Token to request
	const accessToken = await SecureStore.getItemAsync('session');

	if (config.headers && accessToken) {
		config.headers.Authorization = `Bearer ${accessToken}`;
	}

	return config;
};

const onRequestError = (error: AxiosError): Promise<AxiosError> => {
	return Promise.reject(error);
};

AuthorizedAxiosInstance.interceptors.request.use(onRequest, onRequestError);

const parseDate = (input: string): DateTime | string => {
	// Check if the input is in 'yyyy-mm-dd' format
	if (/^\d{4}-\d{2}-\d{2}$/.test(input)) {
		// Parse as a date in the beginning of the day in PST (America/Los_Angeles)
		const isoDate = DateTime.fromISO(input, {
			zone: 'America/Los_Angeles',
		}).startOf('day');

		if (isoDate.isValid) {
			return isoDate;
		} else {
			return input;
		}
	}

	// Check if the input is in 'hh:mm:ss' format
	if (/^\d{2}:\d{2}:\d{2}$/.test(input)) {
		// Extract hours, minutes, and seconds
		const [hours, minutes, seconds] = input.split(':').map(Number);

		// Create a new DateTime for this time, assuming it's in PST (America/Los_Angeles)
		const time = DateTime.fromObject(
			{ hour: hours, minute: minutes, second: seconds },
			{ zone: 'America/Los_Angeles' }
		);

		if (time.isValid) {
			return time;
		} else {
			return input;
		}
	}

	// Otherwise, assume the input is in ISO 8601 or some other format and treat it as UTC
	const isoDate = DateTime.fromISO(input, { zone: 'utc' });

	if (isoDate.isValid) {
		return isoDate;
	} else {
		return input;
	}
};

const parseData = (data: any): any => {
	if (data) {
		if (Array.isArray(data)) {
			data.map((object) => parseData(object));
		} else {
			Object.keys(data).forEach((key) => {
				const property = data[key];

				if (typeof property === 'string') {
					// Check to see if the property is a date or a string
					data[key] = parseDate(property);
				} else if (typeof property === 'object') {
					// Recurse on the object properties
					data[key] = parseData(property);
				}
			});
		}
	}

	return data;
};

const onResponse = (response: AxiosResponse): AxiosResponse => {
	// Parse data before returning
	response.data = parseData(response.data);
	return response;
};

const onResponseError = (error: AxiosError): Promise<AxiosError> => {
	return Promise.reject(error);
};

AuthorizedAxiosInstance.interceptors.response.use(onResponse, onResponseError);

export default AuthorizedAxiosInstance;
