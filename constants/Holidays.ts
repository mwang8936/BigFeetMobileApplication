import { DateTime } from 'luxon';

const HOLIDAYS: Record<number, DateTime[]> = {
	2024: [
		DateTime.fromObject(
			{ year: 2024, month: 1, day: 1 },
			{ zone: 'America/Los_Angeles' }
		).startOf('day'), // New Year's Day
		DateTime.fromObject(
			{ year: 2024, month: 2, day: 19 },
			{ zone: 'America/Los_Angeles' }
		).startOf('day'), // Family Day
		DateTime.fromObject(
			{ year: 2024, month: 3, day: 29 },
			{ zone: 'America/Los_Angeles' }
		).startOf('day'), // Good Friday
		DateTime.fromObject(
			{ year: 2024, month: 5, day: 20 },
			{ zone: 'America/Los_Angeles' }
		).startOf('day'), // Victoria Day
		DateTime.fromObject(
			{ year: 2024, month: 7, day: 1 },
			{ zone: 'America/Los_Angeles' }
		).startOf('day'), // Canada Day
		DateTime.fromObject(
			{ year: 2024, month: 8, day: 5 },
			{ zone: 'America/Los_Angeles' }
		).startOf('day'), // B.C. Day
		DateTime.fromObject(
			{ year: 2024, month: 9, day: 2 },
			{ zone: 'America/Los_Angeles' }
		).startOf('day'), // Labour Day
		DateTime.fromObject(
			{ year: 2024, month: 9, day: 30 },
			{ zone: 'America/Los_Angeles' }
		).startOf('day'), // National Day for Truth and Reconciliation
		DateTime.fromObject(
			{ year: 2024, month: 10, day: 14 },
			{ zone: 'America/Los_Angeles' }
		).startOf('day'), // Thanksgiving Day
		DateTime.fromObject(
			{ year: 2024, month: 11, day: 11 },
			{ zone: 'America/Los_Angeles' }
		).startOf('day'), // Remembrance Day
		DateTime.fromObject(
			{ year: 2024, month: 12, day: 25 },
			{ zone: 'America/Los_Angeles' }
		).startOf('day'), // Christmas Day
	],
	2025: [
		DateTime.fromObject(
			{ year: 2025, month: 1, day: 1 },
			{ zone: 'America/Los_Angeles' }
		).startOf('day'), // New Year's Day
		DateTime.fromObject(
			{ year: 2025, month: 2, day: 17 },
			{ zone: 'America/Los_Angeles' }
		).startOf('day'), // Family Day
		DateTime.fromObject(
			{ year: 2025, month: 4, day: 18 },
			{ zone: 'America/Los_Angeles' }
		).startOf('day'), // Good Friday
		DateTime.fromObject(
			{ year: 2025, month: 5, day: 19 },
			{ zone: 'America/Los_Angeles' }
		).startOf('day'), // Victoria Day
		DateTime.fromObject(
			{ year: 2025, month: 7, day: 1 },
			{ zone: 'America/Los_Angeles' }
		).startOf('day'), // Canada Day
		DateTime.fromObject(
			{ year: 2025, month: 8, day: 4 },
			{ zone: 'America/Los_Angeles' }
		).startOf('day'), // B.C. Day
		DateTime.fromObject(
			{ year: 2025, month: 9, day: 1 },
			{ zone: 'America/Los_Angeles' }
		).startOf('day'), // Labour Day
		DateTime.fromObject(
			{ year: 2025, month: 9, day: 30 },
			{ zone: 'America/Los_Angeles' }
		).startOf('day'), // National Day for Truth and Reconciliation
		DateTime.fromObject(
			{ year: 2025, month: 10, day: 13 },
			{ zone: 'America/Los_Angeles' }
		).startOf('day'), // Thanksgiving Day
		DateTime.fromObject(
			{ year: 2025, month: 11, day: 11 },
			{ zone: 'America/Los_Angeles' }
		).startOf('day'), // Remembrance Day
		DateTime.fromObject(
			{ year: 2025, month: 12, day: 25 },
			{ zone: 'America/Los_Angeles' }
		).startOf('day'), // Christmas Day
	],
};

export default HOLIDAYS;
