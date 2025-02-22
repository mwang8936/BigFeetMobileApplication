import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useTranslation } from 'react-i18next';

import STORES from '@/constants/Stores';

import { useScheduleDate } from '@/context-providers/ScheduleDateContext';

import { useThemeColor } from '@/hooks/colors/useThemeColor';

import { TipMethod } from '@/models/enums';
import Reservation from '@/models/Reservation.Model';
import VipPackage from '@/models/Vip-Package.Model';

import { isHoliday } from '@/utils/date.utils';
import { moneyToString } from '@/utils/string.utils';

interface PayoutProp {
	reservations: Reservation[];
	vipPackages: VipPackage[];
	award: number;
}

const Payout: React.FC<PayoutProp> = ({ reservations, vipPackages, award }) => {
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

	const payoutBeforeAward = moneyToString(
		requestedTotal +
			holidayTotal +
			cashOutTotal +
			tipsTotal +
			vipPackagesCommissionTotal
	);

	const awardMoney = Math.max(award - STORES.award_reservation_count, 0);

	const payoutTotal = moneyToString(
		requestedTotal +
			holidayTotal +
			cashOutTotal +
			tipsTotal +
			vipPackagesCommissionTotal +
			awardMoney
	);

	const payoutElement = () => {
		if (awardMoney > 0) {
			return (
				<Text style={[styles.text, { color: textColor }]}>
					{t('Payout') + ': ' + payoutBeforeAward + ' + '}
					<Text style={{ color: 'red' }}>{moneyToString(awardMoney)}</Text>
					<Text style={{ fontWeight: '800' }}>{' = ' + payoutTotal}</Text>
				</Text>
			);
		} else {
			return (
				<Text style={[styles.text, { color: textColor }]}>
					{t('Payout') + ':'}
					<Text style={{ fontWeight: '800' }}> {payoutTotal}</Text>
				</Text>
			);
		}
	};

	return (
		<View style={[styles.container, { borderBottomColor: borderColor }]}>
			{payoutElement()}
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
