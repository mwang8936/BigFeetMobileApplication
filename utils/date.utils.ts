import { DateTime } from 'luxon';

import HOLIDAYS from '@/constants/Holidays';

/**
 * Checks if a given date falls on a statutory holiday in British Columbia (B.C.).
 *
 * This function compares the given date against a list of statutory holidays for the specified
 * year and determines whether the date matches any of the holidays. It assumes that the holidays
 * are defined in the `HOLIDAYS` object by year.
 *
 * @param {Object | DateTime} date - The date to check if it is a statutory holiday. The date can either be:
 *  - An object with `year`, `month`, and `day` properties (e.g., `{ year: 2024, month: 12, day: 25 }`).
 *  - A `DateTime` object (from a library like Luxon) which has `year`, `month`, and `day` properties.
 *
 * @returns {boolean} - A boolean indicating whether the given date is a statutory holiday in B.C.
 *                      `true` if the date is a holiday, `false` otherwise.
 *
 * Example usage:
 * const result = isHoliday({ year: 2024, month: 12, day: 25 });
 * console.log(result); // true if Dec 25, 2024 is a statutory holiday in B.C., otherwise false.
 */
export function isHoliday(
	date: { year: number; month: number; day: number } | DateTime
): boolean {
	// Retrieve the year from the given date
	const year = date.year;

	// Check if there is a holiday list for the specified year
	const holidays = HOLIDAYS[year];
	if (holidays) {
		// Check if the given date matches any holiday in the list for that year
		return holidays.some(
			(holiday) =>
				holiday.day === date.day && // Compare day
				holiday.month === date.month // Compare month
		);
	}

	// Return false if there are no holidays for the year or the date is not a holiday
	return false;
}
