import * as React from 'react';

import { DateTime } from 'luxon';

import Schedule from '@/models/Schedule.Model';

import CashOut from './footer/CashOut';
import Payout from './footer/Payout';
import Tips from './footer/Tips';
import Total from './footer/Total';
import Sign from './footer/Sign';
import VIP from './footer/VIP';
import { View } from 'react-native';
import { useThemeColor } from '@/hooks/colors/useThemeColor';

interface SchedulerFooterProp {
	schedule?: Schedule;
	setLoading(loading: boolean): void;
}

const SchedulerFooter: React.FC<SchedulerFooterProp> = ({
	schedule,
	setLoading,
}) => {
	const backgroundColor = useThemeColor({}, 'gridBackground');

	const reservations = schedule?.reservations || [];

	const completedReservations = reservations.filter((reservation) => {
		const start = reservation.reserved_date;
		const duration = reservation.time ?? reservation.service.time;
		const endDate = start.plus({ minutes: duration });

		const currentDate = DateTime.now().setZone('America/Los_Angeles');

		return endDate <= currentDate;
	});

	const vipPackages = schedule?.vip_packages || [];

	const award = schedule?.award ?? 0;

	return (
		<View style={{ backgroundColor, zIndex: 2 }}>
			<Total reservations={completedReservations} />

			<CashOut reservations={completedReservations} />

			<Tips reservations={completedReservations} />

			<VIP vipPackages={vipPackages} />

			<Payout
				reservations={completedReservations}
				vipPackages={vipPackages}
				award={award}
			/>

			{schedule && <Sign isSigned={schedule.signed} setLoading={setLoading} />}
		</View>
	);
};

export default SchedulerFooter;
