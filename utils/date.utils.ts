import { DateTime } from 'luxon';

import HOLIDAYS from '@/constants/Holidays';

/**
 * Returns true if given date falls on a B.C. statuary holiday, otherwise false.
 *
 * @param date - The date to check if it is a B.C. statuary holiday.
 * @returns A boolean representing if the date is a B.C. statuary holiday or not.
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
