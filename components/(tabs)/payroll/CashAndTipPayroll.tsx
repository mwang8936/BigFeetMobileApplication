import { ReactElement } from 'react';
import { FlatList, RefreshControlProps, StyleSheet, Text } from 'react-native';
import { DataTable } from 'react-native-paper';

import { useTranslation } from 'react-i18next';

import { usePayrollDate } from '@/context-providers/PayrollDateContext';
import { useThemeColor } from '@/hooks/colors/useThemeColor';
import { useUserQuery } from '@/hooks/react-query/profile.hooks';
import { PayrollPart } from '@/models/enums';
import Payroll from '@/models/Payroll.Model';
import { isHoliday } from '@/utils/date.utils';
import {
	getShortMonthString,
	moneyToString,
	padStringOrNumber,
} from '@/utils/string.utils';

export interface CashAndTipsPayrollProps {
	payroll: Payroll;
	refreshControl: ReactElement<RefreshControlProps>;
}

interface RowData {
	day: number;
	cash: number;
	tips: number;
	total: number;
}

const CashAndTipsPayroll: React.FC<CashAndTipsPayrollProps> = ({
	payroll,
	refreshControl,
}) => {
	const { t } = useTranslation();

	const { date } = usePayrollDate();

	const userQuery = useUserQuery({});
	const user = userQuery.data;

	const language = user?.language;

	const textColor = useThemeColor({}, 'text');

	const headerColor = useThemeColor({}, 'header');
	const rowColor = useThemeColor({}, 'row');
	const alternatingRowColor = useThemeColor({}, 'alternatingRow');
	const blueRowColor = useThemeColor({}, 'blueRow');
	const goldRowColor = useThemeColor({}, 'goldRow');

	const dateText =
		getShortMonthString(date.month, language) +
		' ' +
		(payroll.part === PayrollPart.PART_1 ? t('(1/2)') : t('(2/2)'));

	const days =
		payroll.part === PayrollPart.PART_1
			? Array.from({ length: 15 }, (_, i) => i + 1)
			: Array.from({ length: 16 }, (_, i) => i + 16);

	const data: RowData[] = days.map((day) => {
		const scheduleData = payroll.data.find((row) => row.date.day === day);

		if (scheduleData) {
			const totalSessions =
				scheduleData.acupuncture_sessions +
				scheduleData.body_sessions +
				scheduleData.feet_sessions;

			const requestedSessions =
				scheduleData.requested_acupuncture_sessions +
				scheduleData.requested_body_sessions +
				scheduleData.requested_feet_sessions;

			const holidayPay = isHoliday({
				year: date.year,
				month: date.month,
				day,
			})
				? 2 * totalSessions
				: 0;

			const cash =
				requestedSessions +
				holidayPay +
				scheduleData.award_amount +
				scheduleData.vip_amount +
				scheduleData.total_cash_out;

			const tips = scheduleData.tips * 0.9;

			return {
				day,
				cash,
				tips,
				total: cash + tips,
			};
		} else {
			return {
				day,
				cash: 0,
				tips: 0,
				total: 0,
			};
		}
	});

	const totalCash = data.reduce((sum, row) => sum + row.cash, 0);
	const totalTips = data.reduce((sum, row) => sum + row.tips, 0);
	const total = totalCash + totalTips;

	const titleElement = (title: string) => {
		return (
			<DataTable.Cell style={styles.title}>
				<Text
					adjustsFontSizeToFit
					numberOfLines={1}
					style={[styles.titleTextStyle, { color: textColor }]}
				>
					{title}
				</Text>
			</DataTable.Cell>
		);
	};

	const cellElement = (text: string | number) => {
		return (
			<DataTable.Cell style={styles.cell}>
				<Text
					adjustsFontSizeToFit
					numberOfLines={1}
					style={[styles.cellTextStyle, { color: textColor }]}
				>
					{padStringOrNumber(text)}
				</Text>
			</DataTable.Cell>
		);
	};

	const leftAlignBoldCellElement = (text: string | number) => {
		return (
			<DataTable.Cell>
				<Text
					adjustsFontSizeToFit
					numberOfLines={1}
					style={[styles.boldedCellTextStyle, { color: textColor }]}
				>
					{text}
				</Text>
			</DataTable.Cell>
		);
	};

	const boldCellElement = (text: string | number) => {
		return (
			<DataTable.Cell style={styles.cell}>
				<Text
					adjustsFontSizeToFit
					numberOfLines={1}
					style={[styles.boldedCellTextStyle, { color: textColor }]}
				>
					{text}
				</Text>
			</DataTable.Cell>
		);
	};

	const header = (
		<DataTable.Header
			style={[
				styles.header,
				{ backgroundColor: headerColor, borderBlockColor: textColor },
			]}
		>
			{titleElement(dateText)}

			{titleElement(t('Cash'))}

			{titleElement(t('Tips'))}

			{titleElement(t('Total'))}
		</DataTable.Header>
	);

	const renderItem = ({ item, index }: { item: RowData; index: number }) => (
		<DataTable.Row
			key={index}
			style={[
				styles.row,
				{
					backgroundColor: index % 2 === 0 ? alternatingRowColor : undefined,
					borderBlockColor: textColor,
				},
			]}
		>
			{cellElement(item.day)}

			{cellElement(moneyToString(item.cash))}

			{cellElement(moneyToString(item.tips))}

			{cellElement(moneyToString(item.total))}
		</DataTable.Row>
	);

	const footer = (
		<>
			<DataTable.Row
				style={[
					styles.sumRow,
					{ backgroundColor: blueRowColor, borderBlockColor: textColor },
				]}
			>
				{leftAlignBoldCellElement(t('SUM'))}

				{boldCellElement(moneyToString(totalCash))}

				{boldCellElement(moneyToString(totalTips))}

				{boldCellElement(moneyToString(total))}
			</DataTable.Row>

			<DataTable.Row
				style={[
					styles.chequeRow,
					{ backgroundColor: goldRowColor, borderBlockColor: textColor },
				]}
			>
				<DataTable.Cell
					textStyle={[styles.extraBoldedCellTextStyle, { color: textColor }]}
				>
					{t('CASH OUT')}
				</DataTable.Cell>

				<DataTable.Cell
					numeric
					textStyle={[styles.extraBoldedCellTextStyle, { color: textColor }]}
				>
					{moneyToString(total)}
				</DataTable.Cell>
			</DataTable.Row>
		</>
	);

	return (
		<DataTable style={[styles.table, { backgroundColor: rowColor }]}>
			<FlatList
				data={data}
				renderItem={renderItem}
				keyExtractor={(_, index) => index.toString()}
				refreshControl={refreshControl}
				ListHeaderComponent={header}
				ListFooterComponent={footer}
				stickyHeaderIndices={[0]}
			/>
		</DataTable>
	);
};

const styles = StyleSheet.create({
	table: {},
	header: {
		borderBottomWidth: 5,
	},
	title: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	titleTextStyle: {
		fontSize: 20,
		fontWeight: 'bold',
		marginVertical: 'auto',
		textAlign: 'center',
		paddingHorizontal: 8,
		paddingVertical: 16,
	},
	row: {},
	cell: { justifyContent: 'center', alignItems: 'center' },
	cellTextStyle: {
		fontSize: 20,
		paddingHorizontal: 8,
	},
	sumRow: {
		borderTopWidth: 2,
		borderBottomWidth: 1,
	},
	boldedCellTextStyle: {
		fontWeight: 'bold',
		fontSize: 20,
		paddingHorizontal: 4,
	},
	payPerRow: {
		borderTopWidth: 2,
		borderBottomWidth: 1,
	},
	totalRow: {
		borderTopWidth: 2,
		borderBottomWidth: 1,
	},
	chequeRow: {
		borderTopWidth: 4,
		borderBottomWidth: 1,
	},
	extraBoldedCellTextStyle: {
		fontWeight: '900',
		fontSize: 24,
		paddingHorizontal: 4,
	},
});

export default CashAndTipsPayroll;
