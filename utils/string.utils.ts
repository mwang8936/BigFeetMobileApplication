import { Language } from '@/models/enums';
import { DateTime } from 'luxon';

export function moneyToString(money: number): string {
	if (Number.isInteger(money)) {
		// If the money amount is an integer, return it as a string without decimal places.
		return '$' + money.toString();
	} else {
		// If the money amount has decimal places, format it to two decimal places.
		return '$' + money.toFixed(2);
	}
}

export function getShortMonthString(
	monthNumber: number,
	language: Language = Language.ENGLISH
): string {
	if (monthNumber < 1 || monthNumber > 12) {
		throw new Error(
			'Invalid month number. Please provide a number between 1 and 12.'
		);
	}

	const date = new Date(2000, monthNumber - 1);

	let locale;
	if (language === Language.SIMPLIFIED_CHINESE) {
		locale = 'zh-CN';
	} else if (language === Language.TRADITIONAL_CHINESE) {
		locale = 'zh-TW';
	} else {
		locale = undefined;
	}

	return date.toLocaleDateString(locale, {
		month: 'short',
	});
}

export function getFullMonthString(
	monthNumber: number,
	language: Language = Language.ENGLISH
): string {
	if (monthNumber < 1 || monthNumber > 12) {
		throw new Error(
			'Invalid month number. Please provide a number between 1 and 12.'
		);
	}

	const date = new Date(2000, monthNumber - 1);

	let locale;
	if (language === Language.SIMPLIFIED_CHINESE) {
		locale = 'zh-CN';
	} else if (language === Language.TRADITIONAL_CHINESE) {
		locale = 'zh-TW';
	} else {
		locale = undefined;
	}

	return date.toLocaleDateString(locale, {
		month: 'long',
	});
}

export function getTimeString(time: DateTime): string {
	// Format the DateTime object into the desired 12-hour time format with AM/PM
	return time.toFormat('h:mm a');
}

export function hoursToString(hours: number): string {
	if (Number.isInteger(hours)) {
		// If the hours amount is an integer, return it as a string without decimal places.
		return hours.toString();
	} else {
		// If the hours amount has decimal places, format it to two decimal places.
		return hours.toFixed(2);
	}
}

export function padStringOrNumber(input: string | number): string {
	// Convert the input to a string
	const str = input.toString();

	// Check the length and pad if needed
	if (str.length < 3) {
		return ` ${str} `;
	}

	return str; // If the length is already 3 or more, return as is
}

export function percentageToString(percentage: number): string {
	const hundredPercentage = percentage * 100;

	if (Number.isInteger(hundredPercentage)) {
		// If the percentage is a whole number, return it as a string without decimal places.
		return `${hundredPercentage.toString()}%`;
	} else {
		// If the percentage has decimal places, format it to two decimal places.
		return `${hundredPercentage.toFixed(2)}%`;
	}
}
