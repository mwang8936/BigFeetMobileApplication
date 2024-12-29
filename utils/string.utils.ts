import { Language } from '@/models/enums';
import { DateTime } from 'luxon';

/**
 * Converts a number representing money into a string format.
 *
 * @param money - The amount of money to convert, represented as a number.
 *
 * @returns A string representing the money value. If the money amount is an integer,
 *         it returns the number as a string without decimal places. If the amount has
 *         decimal places, it returns the number formatted to two decimal places.
 */
export function moneyToString(money: number): string {
	if (Number.isInteger(money)) {
		// If the money amount is an integer, return it as a string without decimal places.
		return '$' + money.toString();
	} else {
		// If the money amount has decimal places, format it to two decimal places.
		return '$' + money.toFixed(2);
	}
}

/**
 * Converts a given month number into a localized short month string.
 *
 * @param monthNumber - The month to use for the date (1 for January, 12 for December).
 * @param locale - Optional. The locale string to format the month (default is 'en-US').
 * @returns string - A formatted string representing the short month name (e.g., "Jan" for January).
 *
 * This function first validates the provided month number to ensure it is between 1 and 12.
 * It then creates a Date object using an arbitrary year (2000) and the provided month,
 * adjusting the month index (0-11) since JavaScript Date months are zero-indexed.
 * Finally, it converts the Date object into a localized string using toLocaleDateString with the
 * specified locale and options to display the short month name.
 *
 * Example usage:
 * const result = getShortMonthString(1); // "Jan"
 */
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

/**
 * Converts a given month number into a localized full month string.
 *
 * @param monthNumber - The month to use for the date (1 for January, 12 for December).
 * @param locale - Optional. The locale string to format the month (default is 'en-US').
 * @returns string - A formatted string representing the full month name.
 *
 * This function first validates the provided month number to ensure it is between 1 and 12.
 * It then creates a Date object using an arbitrary year (2000) and the provided month,
 * adjusting the month index (0-11) since JavaScript Date months are zero-indexed.
 * Finally, it converts the Date object into a localized string using toLocaleDateString with the
 * specified locale and options to display the full month name.
 *
 * Example usage:
 * const result = getFullMonthString(1); // "January"
 */
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

export function getYearMonthString(
	yearNumber: number,
	monthNumber: number,
	language: Language = Language.ENGLISH
): string {
	const date = new Date(yearNumber, monthNumber - 1);

	let locale;
	if (language === Language.SIMPLIFIED_CHINESE) {
		locale = 'zh-CN';
	} else if (language === Language.TRADITIONAL_CHINESE) {
		locale = 'zh-TW';
	} else {
		locale = undefined;
	}

	return date.toLocaleDateString(locale, {
		year: 'numeric',
		month: 'long',
	});
}

export function getDateString(
	yearNumber: number,
	monthNumber: number,
	dayNumber: number,
	language: Language = Language.ENGLISH
): string {
	const date = new Date(yearNumber, monthNumber - 1, dayNumber);

	let locale;
	if (language === Language.SIMPLIFIED_CHINESE) {
		locale = 'zh-CN';
	} else if (language === Language.TRADITIONAL_CHINESE) {
		locale = 'zh-TW';
	} else {
		locale = undefined;
	}

	return date.toLocaleDateString(locale, {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		weekday: 'short',
	});
}

/**
 * Converts a DateTime to the string time format.
 *
 * @param time - The DateTime to extract the time value from.
 *
 * @returns A formatted string representing the time value of the input DateTime.
 */
export function getTimeString(time: DateTime): string {
	// Format the DateTime object into the desired 12-hour time format with AM/PM
	return time.toFormat('h:mm a');
}

/**
 * Converts a number representing hours into a string format.
 *
 * @param hours - The amount of hours to convert, represented as a number.
 *
 * @returns A string representing the hours value. If the hours amount is an integer,
 *         it returns the number as a string without decimal places. If the amount has
 *         decimal places, it returns the number formatted to two decimal places.
 */
export function hoursToString(hours: number): string {
	if (Number.isInteger(hours)) {
		// If the hours amount is an integer, return it as a string without decimal places.
		return hours.toString();
	} else {
		// If the hours amount has decimal places, format it to two decimal places.
		return hours.toFixed(2);
	}
}

/**
 * Pads any text or number with one whitespapce on both sides if the length is less than 3.
 *
 * @param input - The input to pad.
 *
 * @returns The input as it is if it already has length greater than 3. Otherwise returns
 * 			the string with a white space on both sides.
 */
export function padStringOrNumber(input: string | number): string {
	// Convert the input to a string
	const str = input.toString();

	// Check the length and pad if needed
	if (str.length < 3) {
		return ` ${str} `;
	}

	return str; // If the length is already 3 or more, return as is
}

/**
 * Converts a decimal percentage to a string representation in whole or two decimal places.
 *
 * @param percentage - The percentage to convert, represented as a number (e.g., 0.25 for 25%).
 *
 * @returns A string representing the percentage. If the converted percentage is an integer,
 *          it returns the number as a string without decimal places. If the percentage has
 *          decimal places, it returns the number formatted to two decimal places.
 *
 * Example usage:
 * const result = percentageToString(0.2575); // "25.75"
 * const result = percentageToString(0.3); // "30"
 * const result = percentageToString(1); // "100"
 */
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

export function formatPhoneNumber(
	phoneNumber: string,
	hidden: boolean = true
): string {
	// Remove all non-digit characters
	const cleaned = phoneNumber.replace(/\D/g, '');

	if (cleaned.length !== 10) {
		throw new Error('Invalid phone number.');
	}

	if (hidden) {
		return `(***) ***-${cleaned.slice(6, 10)}`;
	} else {
		return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(
			6,
			10
		)}`;
	}
}

export function formatLivePhoneNumber(phoneNumber: string): string {
	// Remove all non-digit characters
	const cleaned = phoneNumber.replace(/\D/g, '');

	// Handle different lengths of digits and apply formatting
	if (cleaned.length <= 3) {
		return `${cleaned}`;
	} else if (cleaned.length <= 6) {
		return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
	} else if (cleaned.length <= 10) {
		return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(
			6,
			10
		)}`;
	} else {
		return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(
			6,
			10
		)}`;
	}
}
