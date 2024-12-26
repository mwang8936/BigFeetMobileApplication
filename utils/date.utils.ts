import HOLIDAYS from '@/constants/Holidays';
import { DateTime } from 'luxon';

export function isHoliday(
	date: { year: number; month: number; day: number } | DateTime
): boolean {
	// Retrieve the year from the given date
	const year = date.year;

	// Check if there is a holiday list for the specified year
	if (HOLIDAYS[year]) {
		// Check if the given date matches any holiday in the list for that year

		return HOLIDAYS[year].some(
			(holiday) =>
				holiday.day === date.day && // Compare day
				holiday.month === date.month // Compare month
		);
	}

	// Return false if there are no holidays for the year or the date is not a holiday
	return false;
}
