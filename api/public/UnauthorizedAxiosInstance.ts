import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { DateTime } from 'luxon';

import API_BASE_URL, { dateKeys } from '@/constants/API.constants';
import { CustomAPIError } from '@/models/custom-errors/API.Error';

// The Axios Instance used for making unauthorized API calls (login, authenticate, etc.)
const UnauthorizedAxiosInstance: AxiosInstance = axios.create({
	baseURL: API_BASE_URL,
	timeout: 10000,
	headers: {
		'Content-Type': 'application/json',
	},
});

const parseDate = (input: string): DateTime | string => {
	// Check if the input is in 'yyyy-mm-dd' format
	if (/^\d{4}-\d{2}-\d{1,2}$/.test(input)) {
		// Pad a 0 before the day value if it is single digit
		const normalizedInput = input.replace(/-(\d)$/, '-0$1');

		// Parse as a date in the beginning of the day in PST (America/Los_Angeles)
		const isoDate = DateTime.fromISO(normalizedInput, {
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
			data.forEach((object) => parseData(object));
		} else {
			Object.keys(data).forEach((key) => {
				const property = data[key];

				if (typeof property === 'string' && dateKeys.has(key)) {
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

const onResponseError = (error: AxiosError): Promise<CustomAPIError> => {
	const APIError = new CustomAPIError(error);
	return Promise.reject(APIError);
};

UnauthorizedAxiosInstance.interceptors.response.use(
	onResponse,
	onResponseError
);

export default UnauthorizedAxiosInstance;
