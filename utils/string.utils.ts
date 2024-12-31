import { DateTime } from 'luxon';

import { Language } from '@/models/enums';

/**
 * Converts a number representing money into a string format.
 *
 * This function takes a number representing an amount of money and converts it to a string,
 * prefixed with a dollar sign (`$`). If the input number is an integer, it returns the
 * number as a string without decimal places. If the input has decimal places, it returns
 * the number formatted with exactly two decimal places.
 *
 * @param {number} money - The amount of money to convert, represented as a number.
 *
 * @returns {string} - A string representing the money value, prefixed with a dollar sign (`$`).
 *                     If the number is an integer, it returns the number without decimal places.
 *                     If the number has decimals, it formats the number with two decimal places.
 *
 * @example
 * moneyToString(1234);     // "$1234"
 * moneyToString(1234.5);   // "$1234.50"
 * moneyToString(1234.75);  // "$1234.75"
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
 * This function takes a month number (1 for January, 12 for December) and converts it
 * into a short month name (e.g., "Jan" for January) based on the specified locale.
 * It ensures that the month number is valid (between 1 and 12) and uses JavaScript's
 * `toLocaleDateString` method to return the localized month name.
 *
 * @param {number} monthNumber - The month number (1 for January, 12 for December).
 * @param {Language} [language=Language.ENGLISH] - An optional locale string to format the month.
 *                                               Defaults to English (`'en-US'`).
 *
 * @returns {string} - A localized string representing the short month name (e.g., "Jan" for January).
 *
 * @throws {Error} - If the `monthNumber` is less than 1 or greater than 12, an error is thrown.
 *
 * @example
 * getShortMonthString(1);   // "Jan"
 * getShortMonthString(5);   // "May"
 * getShortMonthString(12);  // "Dec"
 *
 * // With a different language:
 * getShortMonthString(1, Language.SIMPLIFIED_CHINESE);  // "一月" (Chinese)
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
 * This function takes a month number (1 for January, 12 for December) and converts it
 * into the full month name (e.g., "January" for 1) based on the specified locale.
 * It ensures that the month number is valid (between 1 and 12) and uses JavaScript's
 * `toLocaleDateString` method to return the localized full month name.
 *
 * @param {number} monthNumber - The month number (1 for January, 12 for December).
 * @param {Language} [language=Language.ENGLISH] - An optional locale string to format the month.
 *                                               Defaults to English (`'en-US'`).
 *
 * @returns {string} - A localized string representing the full month name (e.g., "January").
 *
 * @throws {Error} - If the `monthNumber` is less than 1 or greater than 12, an error is thrown.
 *
 * @example
 * getFullMonthString(1);   // "January"
 * getFullMonthString(5);   // "May"
 * getFullMonthString(12);  // "December"
 *
 * // With a different language:
 * getFullMonthString(1, Language.SIMPLIFIED_CHINESE);  // "一月" (Chinese)
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

/**
 * Returns a formatted string representing the year and month in a specified language.
 *
 * This function takes a year and month as inputs and returns a string formatted as
 * "Month Year" (e.g., "January 2024"). The output language of the month name can
 * be customized based on the specified language. If no language is provided,
 * it defaults to English.
 *
 * @param {number} yearNumber - The year value (e.g., 2024).
 * @param {number} monthNumber - The month value (1-12). January is 1, February is 2, etc.
 * @param {Language} [language=Language.ENGLISH] - The language in which the month name should be displayed.
 *                              Can be one of the following:
 *                              - `Language.ENGLISH` (default): English
 *                              - `Language.SIMPLIFIED_CHINESE`: Simplified Chinese (zh-CN)
 *                              - `Language.TRADITIONAL_CHINESE`: Traditional Chinese (zh-TW)
 *                              Defaults to `Language.ENGLISH` if not provided.
 *
 * @returns {string} - A formatted string representing the year and month in the specified language.
 *                     Example output: "January 2024", "2024年1月", etc.
 *
 * @example
 * getYearMonthString(2024, 1, Language.ENGLISH); // "January 2024"
 * getYearMonthString(2024, 5, Language.SIMPLIFIED_CHINESE); // "2024年5月"
 * getYearMonthString(2024, 10, Language.TRADITIONAL_CHINESE); // "2024年10月"
 */
export function getYearMonthString(
	yearNumber: number,
	monthNumber: number,
	language: Language = Language.ENGLISH
): string {
	// Create a new Date object using the provided year and month (note: month is zero-indexed)
	const date = new Date(yearNumber, monthNumber - 1);

	// Determine the appropriate locale based on the specified language
	let locale;
	if (language === Language.SIMPLIFIED_CHINESE) {
		locale = 'zh-CN'; // Simplified Chinese locale
	} else if (language === Language.TRADITIONAL_CHINESE) {
		locale = 'zh-TW'; // Traditional Chinese locale
	} else {
		locale = undefined; // Default to the system's locale (English if not specified)
	}

	// Format the date to a string in the desired locale and return it
	return date.toLocaleDateString(locale, {
		year: 'numeric', // Include the year as a numeric value
		month: 'long', // Include the month name as a long text (e.g., "January")
	});
}

/**
 * Converts a given date (year, month, day) into a localized date string.
 *
 * This function takes a year, month, and day number and converts them into a formatted
 * date string based on the specified locale. It uses JavaScript's `toLocaleDateString`
 * method to return the localized date string, which includes the year, month, day, and
 * weekday in short format.
 *
 * @param {number} yearNumber - The year of the date.
 * @param {number} monthNumber - The month of the date (1 for January, 12 for December).
 * @param {number} dayNumber - The day of the month.
 * @param {Language} [language=Language.ENGLISH] - An optional locale string to format the date.
 *                                               Defaults to English (`'en-US'`).
 *
 * @returns {string} - A localized string representing the date, including the year, month,
 *                     day, and weekday (e.g., "Mon, January 1, 2024").
 *
 * @throws {Error} - If the `monthNumber` is less than 1 or greater than 12, or if the
 *                   `dayNumber` is outside the valid range for the month, an error is thrown.
 *
 * @example
 * getDateString(2024, 1, 1);      // "Mon, January 1, 2024"
 * getDateString(2024, 12, 25);    // "Wed, December 25, 2024"
 * getDateString(2024, 5, 15);     // "Wed, May 15, 2024"
 *
 * // With a different language:
 * getDateString(2024, 1, 1, Language.SIMPLIFIED_CHINESE);  // "2024年1月1日, 星期一" (Chinese)
 */
export function getDateString(
	yearNumber: number,
	monthNumber: number,
	dayNumber: number,
	language: Language = Language.ENGLISH
): string {
	// Create a new Date object using the provided year, month, and day (note: month is zero-indexed)
	const date = new Date(yearNumber, monthNumber - 1, dayNumber);

	// Determine the appropriate locale based on the specified language
	let locale;
	if (language === Language.SIMPLIFIED_CHINESE) {
		locale = 'zh-CN'; // Simplified Chinese locale
	} else if (language === Language.TRADITIONAL_CHINESE) {
		locale = 'zh-TW'; // Traditional Chinese locale
	} else {
		locale = undefined; // Default to the system's locale (English if not specified)
	}

	// Format the date to a string in the desired locale and return it
	return date.toLocaleDateString(locale, {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		weekday: 'short',
	});
}

/**
 * Converts a DateTime object to a formatted string representing the time value.
 *
 * This function takes a `DateTime` object and formats it into a 12-hour time format,
 * including the hour, minute, and AM/PM indicator (e.g., "3:45 PM").
 *
 * @param {DateTime} time - The `DateTime` object to extract the time value from.
 *
 * @returns {string} - A formatted string representing the time value in the format
 *                     `h:mm a`, where:
 *                     - `h` is the hour (1-12),
 *                     - `mm` is the minutes (00-59),
 *                     - `a` is the AM/PM indicator (e.g., "PM").
 *
 * @example
 * const time = DateTime.now();
 * getTimeString(time); // "3:45 PM" (if the current time is 3:45 PM)
 *
 * // Example of formatting a specific DateTime:
 * const specificTime = DateTime.fromISO("2024-12-29T14:30:00");
 * getTimeString(specificTime); // "2:30 PM"
 */
export function getTimeString(time: DateTime): string {
	// Format the DateTime object into the desired 12-hour time format with AM/PM
	return time.toFormat('h:mm a');
}

/**
 * Converts a number representing hours into a string format.
 *
 * This function takes a number representing hours and returns it as a string.
 * If the number of hours is an integer, the string will not include any decimal places.
 * If the number has decimal places, it will be formatted to two decimal places.
 *
 * @param {number} hours - The amount of hours to convert, represented as a number.
 *
 * @returns {string} - A string representing the hours value. If the hours amount is an integer,
 *                     it returns the number as a string without decimal places.
 *                     If the amount has decimal places, it returns the number formatted to two decimal places.
 *
 * Example usage:
 * const result = hoursToString(5); // Outputs: "5"
 * const formattedResult = hoursToString(5.75); // Outputs: "5.75"
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
 * Pads any text or number with one whitespace on both sides if the length is less than 3.
 *
 * This function ensures that the input (whether a string or number) has a minimum length of 3 by
 * adding a single whitespace character to both the left and right sides of the input if the
 * length of the input is less than 3. If the input already has a length of 3 or more,
 * it returns the input as-is without modification.
 *
 * @param {string | number} input - The input (string or number) to pad.
 *
 * @returns {string} - The input with a whitespace on both sides if its length is less than 3,
 *                     otherwise returns the input as it is.
 *
 * Example usage:
 * const result = padStringOrNumber(5); // Outputs: " 5 "
 * const formattedResult = padStringOrNumber("12"); // Outputs: " 12 "
 * const noPaddingResult = padStringOrNumber("123"); // Outputs: "123"
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
 * This function takes a decimal value representing a percentage (e.g., 0.25 for 25%) and converts it
 * into a string format. If the resulting percentage is a whole number, the function returns it without
 * decimal places. If the percentage has decimal places, it returns the value formatted to two decimal places.
 *
 * @param {number} percentage - The decimal representation of the percentage to convert (e.g., 0.25 for 25%).
 *
 * @returns {string} - A string representing the percentage. If the percentage is a whole number,
 *                     it returns the number without decimal places. If the percentage has decimal
 *                     places, it returns the number formatted to two decimal places.
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

/**
 * Formats a phone number into a string with or without hiding the first part.
 *
 * This function takes a 10-digit phone number as a string and formats it either with the first part hidden
 * (default behavior) or with the full number visible. The function first removes any non-digit characters from
 * the input phone number. If the input phone number is not 10 digits long, it throws an error.
 *
 * @param {string} phoneNumber - The phone number to format, which may contain non-digit characters.
 * @param {boolean} [hidden=true] - If true, hides the first part of the phone number (default behavior).
 *                                   If false, the full phone number is displayed.
 *
 * @returns {string} - A formatted phone number. If `hidden` is true, the result is in the format `(***) ***-XXXX`.
 *                     If `hidden` is false, the result is in the format `(XXX) XXX-XXXX`.
 *
 * @throws {Error} - Throws an error if the phone number is not exactly 10 digits long after removing non-digit characters.
 *
 * Example usage:
 * const result1 = formatPhoneNumber('123-456-7890'); // "(***) ***-7890"
 * const result2 = formatPhoneNumber('123-456-7890', false); // "(123) 456-7890"
 */
export function formatPhoneNumber(
	phoneNumber: string,
	hidden: boolean = true
): string {
	// Remove all non-digit characters
	const cleaned = phoneNumber.replace(/\D/g, '');

	// Validate that the cleaned phone number has exactly 10 digits
	if (cleaned.length !== 10) {
		throw new Error('Invalid phone number.');
	}

	// Format the phone number depending on whether it's hidden
	if (hidden) {
		return `(***) ***-${cleaned.slice(6, 10)}`;
	} else {
		return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(
			6,
			10
		)}`;
	}
}

/**
 * Formats a phone number dynamically as the user types, applying different formatting
 * based on the length of the phone number.
 *
 * This function removes all non-digit characters from the provided phone number
 * and formats it progressively as the user enters the digits. It applies the following formats:
 * - After 3 digits: "(XXX)"
 * - After 6 digits: "(XXX) XXX"
 * - After 10 digits: "(XXX) XXX-XXXX"
 *
 * If more than 10 digits are provided, it still formats the number up to the first 10 digits.
 *
 * @param {string} phoneNumber - The phone number to format, which may contain non-digit characters.
 *
 * @returns {string} - A formatted phone number string that dynamically adjusts based on the number of digits entered.
 *
 * Example usage:
 * const result1 = formatLivePhoneNumber('123'); // "123"
 * const result2 = formatLivePhoneNumber('12345'); // "(123) 45"
 * const result3 = formatLivePhoneNumber('1234567890'); // "(123) 456-7890"
 * const result4 = formatLivePhoneNumber('123456789012'); // "(123) 456-7890" (only the first 10 digits are used)
 */
export function formatLivePhoneNumber(phoneNumber: string): string {
	// Remove all non-digit characters
	const cleaned = phoneNumber.replace(/\D/g, '');

	// Handle different lengths of digits and apply formatting
	if (cleaned.length <= 3) {
		// Format for first 3 digits
		return `${cleaned}`;
	} else if (cleaned.length <= 6) {
		// Format for up to 6 digits
		return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
	} else if (cleaned.length <= 10) {
		// Format for up to 10 digits
		return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(
			6,
			10
		)}`;
	} else {
		// Format for more than 10 digits (up to 10 digits are used)
		return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(
			6,
			10
		)}`;
	}
}
