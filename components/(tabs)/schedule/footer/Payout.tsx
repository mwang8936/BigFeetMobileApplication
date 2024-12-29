import { useThemeColor } from '@/hooks/colors/useThemeColor';
import * as React from 'react';
import { useUserQuery } from '@/hooks/react-query/profile.hooks';
import Schedule from '@/models/Schedule.Model';
import { getTimeString, moneyToString } from '@/utils/string.utils';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { Text, View } from 'react-native';
import { DateTime } from 'luxon';
import Reservation from '@/models/Reservation.Model';
import { isHoliday } from '@/utils/date.utils';
import { useScheduleDate } from '@/context-providers/ScheduleDateContext';
import VipPackage from '@/models/Vip-Package.Model';
import { TipMethod } from '@/models/enums';

interface PayoutProp {
	reservations: Reservation[];
	vipPackages: VipPackage[];
	addAwards: boolean;
}

const Payout: React.FC<PayoutProp> = ({
	reservations,
	vipPackages,
	addAwards,
}) => {
	const { t } = useTranslation();

	const { date } = useScheduleDate();

	const textColor = useThemeColor({}, 'text');

	const borderColor = useThemeColor({}, 'border');

	const reservationSessions = reservations.filter(
		(reservation) =>
			reservation.service.body > 0 ||
			reservation.service.feet > 0 ||
			reservation.service.acupuncture > 0
	);

	const requestedSessions = reservationSessions.filter(
		(reservation) => reservation.requested_employee
	);

	const requestedTotal = requestedSessions
		.flatMap((reservation) => [
			reservation.service.acupuncture,
			reservation.service.feet,
			reservation.service.body,
		])
		.reduce((acc, curr) => acc + parseFloat(curr.toString()), 0);

	const holidayTotal = isHoliday(date)
		? reservationSessions
				.flatMap((reservation) => [
					reservation.service.acupuncture,
					reservation.service.feet,
					reservation.service.body,
				])
				.reduce((acc, curr) => acc + parseFloat(curr.toString()), 0) * 2
		: 0;

	const cashOutTotal = reservations
		.map((reservation) => reservation.cash_out ?? 0)
		.reduce((acc, curr) => acc + parseFloat(curr.toString()), 0);

	const tipReservations = reservations.filter(
		(reservation) =>
			(reservation.tip_method === TipMethod.HALF ||
				reservation.tip_method === TipMethod.MACHINE) &&
			reservation.tips !== null
	);
	const tipsTotal =
		tipReservations
			.map((reservation) => reservation.tips as number)
			.reduce((acc, curr) => acc + parseFloat(curr.toString()), 0) * 0.9;

	const vipPackagesCommissionTotal = vipPackages
		.map(
			(vipPackage) =>
				vipPackage.commission_amount / vipPackage.employee_ids.length
		)
		.reduce((acc, curr) => acc + parseFloat(curr.toString()), 0);

	const payoutTotal = moneyToString(
		requestedTotal +
			holidayTotal +
			cashOutTotal +
			tipsTotal +
			vipPackagesCommissionTotal
	);

	return (
		<View style={[styles.container, { borderBottomColor: borderColor }]}>
			<Text style={[styles.text, { color: textColor }]}>
				{t('Payout') + ':'}
				<Text style={{ fontWeight: '800' }}> {payoutTotal}</Text>
			</Text>
		</View>
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

export default Payout;
