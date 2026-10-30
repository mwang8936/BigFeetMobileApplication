import { DateTime } from 'luxon';

import { getBCZone } from '@/utils/timezone.utils';

const STORES = {
	city: 'Coquitlam',
	beds: 4,
	start: DateTime.fromObject({ hour: 8 }, { zone: getBCZone() }),
	end: DateTime.fromObject(
		{ hour: 22, minute: 30 },
		{ zone: getBCZone() }
	),
	award_reservation_count: 40,
};

export default STORES;
