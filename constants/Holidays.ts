import { DateTime } from 'luxon';

import { getBCZoneForDay } from '@/utils/timezone.utils';

const HOLIDAYS: Record<number, DateTime[]> = {
	2024: [
		DateTime.fromObject(
			{ year: 2024, month: 1, day: 1 },
			{ zone: getBCZoneForDay(2024, 1, 1) }
		).startOf('day'), // New Year's Day
		DateTime.fromObject(
			{ year: 2024, month: 2, day: 19 },
			{ zone: getBCZoneForDay(2024, 2, 19) }
		).startOf('day'), // Family Day
		DateTime.fromObject(
			{ year: 2024, month: 3, day: 29 },
			{ zone: getBCZoneForDay(2024, 3, 29) }
		).startOf('day'), // Good Friday
		DateTime.fromObject(
			{ year: 2024, month: 5, day: 20 },
			{ zone: getBCZoneForDay(2024, 5, 20) }
		).startOf('day'), // Victoria Day
		DateTime.fromObject(
			{ year: 2024, month: 7, day: 1 },
			{ zone: getBCZoneForDay(2024, 7, 1) }
		).startOf('day'), // Canada Day
		DateTime.fromObject(
			{ year: 2024, month: 8, day: 5 },
			{ zone: getBCZoneForDay(2024, 8, 5) }
		).startOf('day'), // B.C. Day
		DateTime.fromObject(
			{ year: 2024, month: 9, day: 2 },
			{ zone: getBCZoneForDay(2024, 9, 2) }
		).startOf('day'), // Labour Day
		DateTime.fromObject(
			{ year: 2024, month: 9, day: 30 },
			{ zone: getBCZoneForDay(2024, 9, 30) }
		).startOf('day'), // National Day for Truth and Reconciliation
		DateTime.fromObject(
			{ year: 2024, month: 10, day: 14 },
			{ zone: getBCZoneForDay(2024, 10, 14) }
		).startOf('day'), // Thanksgiving Day
		DateTime.fromObject(
			{ year: 2024, month: 11, day: 11 },
			{ zone: getBCZoneForDay(2024, 11, 11) }
		).startOf('day'), // Remembrance Day
		DateTime.fromObject(
			{ year: 2024, month: 12, day: 25 },
			{ zone: getBCZoneForDay(2024, 12, 25) }
		).startOf('day'), // Christmas Day
	],
	2025: [
		DateTime.fromObject(
			{ year: 2025, month: 1, day: 1 },
			{ zone: getBCZoneForDay(2025, 1, 1) }
		).startOf('day'), // New Year's Day
		DateTime.fromObject(
			{ year: 2025, month: 2, day: 17 },
			{ zone: getBCZoneForDay(2025, 2, 17) }
		).startOf('day'), // Family Day
		DateTime.fromObject(
			{ year: 2025, month: 4, day: 18 },
			{ zone: getBCZoneForDay(2025, 4, 18) }
		).startOf('day'), // Good Friday
		DateTime.fromObject(
			{ year: 2025, month: 5, day: 19 },
			{ zone: getBCZoneForDay(2025, 5, 19) }
		).startOf('day'), // Victoria Day
		DateTime.fromObject(
			{ year: 2025, month: 7, day: 1 },
			{ zone: getBCZoneForDay(2025, 7, 1) }
		).startOf('day'), // Canada Day
		DateTime.fromObject(
			{ year: 2025, month: 8, day: 4 },
			{ zone: getBCZoneForDay(2025, 8, 4) }
		).startOf('day'), // B.C. Day
		DateTime.fromObject(
			{ year: 2025, month: 9, day: 1 },
			{ zone: getBCZoneForDay(2025, 9, 1) }
		).startOf('day'), // Labour Day
		DateTime.fromObject(
			{ year: 2025, month: 9, day: 30 },
			{ zone: getBCZoneForDay(2025, 9, 30) }
		).startOf('day'), // National Day for Truth and Reconciliation
		DateTime.fromObject(
			{ year: 2025, month: 10, day: 13 },
			{ zone: getBCZoneForDay(2025, 10, 13) }
		).startOf('day'), // Thanksgiving Day
		DateTime.fromObject(
			{ year: 2025, month: 11, day: 11 },
			{ zone: getBCZoneForDay(2025, 11, 11) }
		).startOf('day'), // Remembrance Day
		DateTime.fromObject(
			{ year: 2025, month: 12, day: 25 },
			{ zone: getBCZoneForDay(2025, 12, 25) }
		).startOf('day'), // Christmas Day
	],
	2026: [
		DateTime.fromObject(
			{ year: 2026, month: 1, day: 1 },
			{ zone: getBCZoneForDay(2026, 1, 1) }
		).startOf('day'), // New Year's Day
		DateTime.fromObject(
			{ year: 2026, month: 2, day: 16 },
			{ zone: getBCZoneForDay(2026, 2, 16) }
		).startOf('day'), // Family Day
		DateTime.fromObject(
			{ year: 2026, month: 4, day: 3 },
			{ zone: getBCZoneForDay(2026, 4, 3) }
		).startOf('day'), // Good Friday
		DateTime.fromObject(
			{ year: 2026, month: 5, day: 18 },
			{ zone: getBCZoneForDay(2026, 5, 18) }
		).startOf('day'), // Victoria Day
		DateTime.fromObject(
			{ year: 2026, month: 7, day: 1 },
			{ zone: getBCZoneForDay(2026, 7, 1) }
		).startOf('day'), // Canada Day
		DateTime.fromObject(
			{ year: 2026, month: 8, day: 3 },
			{ zone: getBCZoneForDay(2026, 8, 3) }
		).startOf('day'), // B.C. Day
		DateTime.fromObject(
			{ year: 2026, month: 9, day: 7 },
			{ zone: getBCZoneForDay(2026, 9, 7) }
		).startOf('day'), // Labour Day
		DateTime.fromObject(
			{ year: 2026, month: 9, day: 30 },
			{ zone: getBCZoneForDay(2026, 9, 30) }
		).startOf('day'), // National Day for Truth and Reconciliation
		DateTime.fromObject(
			{ year: 2026, month: 10, day: 12 },
			{ zone: getBCZoneForDay(2026, 10, 12) }
		).startOf('day'), // Thanksgiving Day
		DateTime.fromObject(
			{ year: 2026, month: 11, day: 11 },
			{ zone: getBCZoneForDay(2026, 11, 11) }
		).startOf('day'), // Remembrance Day
		DateTime.fromObject(
			{ year: 2026, month: 12, day: 25 },
			{ zone: getBCZoneForDay(2026, 12, 25) }
		).startOf('day'), // Christmas Day
	],
};

export default HOLIDAYS;
