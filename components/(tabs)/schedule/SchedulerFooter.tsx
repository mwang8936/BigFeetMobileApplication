import { useThemeColor } from '@/hooks/colors/useThemeColor';
import * as React from 'react';
import { useUserQuery } from '@/hooks/react-query/profile.hooks';
import Schedule from '@/models/Schedule.Model';
import { getTimeString, moneyToString } from '@/utils/string.utils';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { Text, View } from 'react-native';
import { DateTime } from 'luxon';
import Total from './footer/Total';
import CashOut from './footer/CashOut';
import Tips from './footer/Tips';
import VIP from './footer/VIP';
import Payout from './footer/Payout';
import Sign from './footer/Sign';

interface SchedulerFooterProp {
	schedule?: Schedule;
}

const SchedulerFooter: React.FC<SchedulerFooterProp> = ({ schedule }) => {
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
		<>
			<Total reservations={completedReservations} />
			<CashOut reservations={completedReservations} />
			<Tips reservations={completedReservations} />
			<VIP vipPackages={vipPackages} />
			<Payout
				reservations={completedReservations}
				vipPackages={vipPackages}
				award={award}
			/>
			{schedule && <Sign isSigned={schedule.signed} />}
		</>
	);
};

const styles = StyleSheet.create({
	container: {
		height: 'auto',
		padding: 20,
		borderBottomWidth: 5,
	},
	text: {
		fontSize: 20,
		fontWeight: 'bold',
	},
});

export default SchedulerFooter;
