import { DateTime } from 'luxon';

const STORES = {
	city: 'Coquitlam',
	beds: 4,
	start: DateTime.fromObject({ hour: 10 }, { zone: 'America/Los_Angeles' }),
	end: DateTime.fromObject(
		{ hour: 22, minute: 30 },
		{ zone: 'America/Los_Angeles' }
	),
	award_reservation_count: 40,
};

export default STORES;
