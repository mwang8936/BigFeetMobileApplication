import { AxiosError } from 'axios';

export class CustomAPIError extends Error {
	title: string;
	messages: string[];
	path: string;
	status: number;
	statusText: string;
	request: any;

	constructor(error: AxiosError) {
		let title: string =
			(error.response?.data as any)?.error ?? 'Unidentified Error';
		let messages: string | string[] =
			(error.response?.data as any)?.messages ??
			'An Unidentified Error Occurred';
		let path: string = error.response?.config?.url ?? 'Missing URL path';
		let status: number = error.response?.status ?? error.status ?? 500;
		let statusText: string = error.response?.statusText ?? 'Unidentified Error';
		let request: any = error.config?.data ? JSON.parse(error.config.data) : {};

		// Pass the first message or a default message to the Error constructor
		super(Array.isArray(messages) ? messages.join(' / ') : messages);

		this.title = title;
		this.messages = Array.isArray(messages) ? messages : [messages];
		this.path = path;
		this.status = status;
		this.statusText = statusText;
		this.request = request;

		// Ensure the name of this error matches the class name
		this.name = 'CustomAPIError';

		// Maintain proper stack trace (only in V8 engines like Node.js)
		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, CustomAPIError);
		}
	}
}
