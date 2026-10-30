import { DateTime } from 'luxon';

/**
 * BC stopped changing its clocks in 2026 and now stays on UTC-7 all year, while
 * America/Los_Angeles keeps falling back to UTC-8. Devices with older tz data
 * still have America/Vancouver falling back at 2AM on 2026-11-01, so from that
 * moment on a fixed UTC-7 zone is used instead of trusting the tz database.
 * Before it, America/Vancouver is correct with any tz data.
 */
const BC_PERMANENT_TIME_START = DateTime.fromISO('2026-11-01T09:00:00Z'); // 2AM UTC-7

// A fixed offset zone that luxon handles itself, without the device's tz data.
const BC_PERMANENT_TIME_ZONE = 'UTC-7';

const BC_HISTORICAL_TIME_ZONE = 'America/Vancouver';

/**
 * Returns the time zone to use for a given instant in BC.
 *
 * @param {DateTime} dateTime - The instant to get the time zone for. Defaults to now.
 *
 * @returns {string} - A zone name luxon accepts.
 */
export function getBCZone(dateTime: DateTime = DateTime.now()): string {
	return dateTime.toMillis() >= BC_PERMANENT_TIME_START.toMillis()
		? BC_PERMANENT_TIME_ZONE
		: BC_HISTORICAL_TIME_ZONE;
}

/**
 * Returns the time zone to use for a BC calendar day, for when the day is known
 * but the instant is not yet (e.g. finding the start of that day).
 *
 * @param {number} year - The year of the day.
 * @param {number} month - The month of the day (1 for January, 12 for December).
 * @param {number} day - The day of the month. Defaults to the first.
 *
 * @returns {string} - A zone name luxon accepts.
 */
export function getBCZoneForDay(
	year: number,
	month: number,
	day: number = 1
): string {
	return Date.UTC(year, month - 1, day) >= Date.UTC(2026, 10, 1)
		? BC_PERMANENT_TIME_ZONE
		: BC_HISTORICAL_TIME_ZONE;
}

/**
 * Converts an instant into BC time.
 *
 * @param {DateTime} dateTime - The instant to convert.
 *
 * @returns {DateTime} - The same instant, set to the BC time zone.
 */
export function toBCTime(dateTime: DateTime): DateTime {
	return dateTime.setZone(getBCZone(dateTime));
}

/**
 * Returns the current time in BC.
 *
 * @returns {DateTime} - The current instant, set to the BC time zone.
 */
export function nowInBC(): DateTime {
	return toBCTime(DateTime.now());
}
