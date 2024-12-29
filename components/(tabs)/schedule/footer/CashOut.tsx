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

interface CashOutProp {
	reservations: Reservation[];
}

const CashOut: React.FC<CashOutProp> = ({ reservations }) => {
	const { t } = useTranslation();

	const textColor = useThemeColor({}, 'text');

	const borderColor = useThemeColor({}, 'border');

	const cashOutReservations = reservations.filter(
		(reservation) => reservation.cash_out
	);
	cashOutReservations.sort(
		(a, b) => a.reserved_date.toMillis() - b.reserved_date.toMillis()
	);
	const cashOuts = cashOutReservations.map(
		(reservation) => reservation.cash_out as number
	);
	const cashOutTotal = cashOuts.reduce(
		(acc, curr) => acc + parseFloat(curr.toString()),
		0
	);

	const cashOutText =
		cashOuts.length === 0
			? ''
			: cashOuts.map((cashOut) => moneyToString(cashOut)).join(' + ') + ' = ';
	const cashOutTotalText = moneyToString(cashOutTotal);

	return (
		<View style={[styles.container, { borderBottomColor: borderColor }]}>
			<Text style={[styles.text, { color: textColor }]}>
				{t('Cash Out') + ':'}
			</Text>
			<Text
				adjustsFontSizeToFit
				numberOfLines={1}
				style={[styles.text, { color: textColor }]}
			>
				{cashOutText}
				<Text style={{ fontWeight: '800' }}>{cashOutTotalText}</Text>
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

export default CashOut;
