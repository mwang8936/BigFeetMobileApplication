import * as React from 'react';
import { StyleSheet, Text } from 'react-native';
import { DataTable } from 'react-native-paper';

import { useTranslation } from 'react-i18next';

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
import { usePayrollDate } from '@/context-providers/PayrollDateContext';

interface StoreEmployeeWithCashAndTipsPayrollProp {
	payroll: Payroll;
}

interface RowData {
	day: number;
	body: number;
	feet: number;
	tips: number;
	cash: number;
}

const StoreEmployeeWithCashAndTipsPayroll: React.FC<
	StoreEmployeeWithCashAndTipsPayrollProp
> = ({ payroll }) => {
	const { t } = useTranslation();

	const { date } = usePayrollDate();

	const userQuery = useUserQuery();
	const user = userQuery.data;

	const language = user?.language;

	const textColor = useThemeColor({}, 'text');

	const headerColor = useThemeColor({}, 'header');
	const rowColor = useThemeColor({}, 'row');
	const alternatingRowColor = useThemeColor({}, 'alternatingRow');
	const blueRowColor = useThemeColor({}, 'blueRow');
	const greenRowColor = useThemeColor({}, 'greenRow');
	const yellowRowColor = useThemeColor({}, 'yellowRow');
	const goldRowColor = useThemeColor({}, 'goldRow');
	const grayRowColor = useThemeColor({}, 'grayRow');
	const redRowColor = useThemeColor({}, 'redRow');

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
				scheduleData.vip_amount +
				scheduleData.total_cash_out;

			return {
				day,
				body: scheduleData.body_sessions + scheduleData.acupuncture_sessions,
				feet: scheduleData.feet_sessions,
				tips: scheduleData.tips,
				cash,
			};
		} else {
			return {
				day,
				body: 0,
				feet: 0,
				tips: 0,
				cash: 0,
			};
		}
	});

	const bodyRate = payroll.employee.body_rate ?? 0;
	const feetRate = payroll.employee.feet_rate ?? 0;

	const totalBodySessions = data
		.map((row) => row.body)
		.reduce((acc, curr) => acc + parseFloat(curr.toString()), 0);
	const totalFeetSessions = data
		.map((row) => row.feet)
		.reduce((acc, curr) => acc + parseFloat(curr.toString()), 0);

	const totalBodyMoney = totalBodySessions * bodyRate;
	const totalFeetMoney = totalFeetSessions * feetRate;

	const totalTips = data
		.map((row) => row.tips)
		.reduce((acc, curr) => acc + parseFloat(curr.toString()), 0);

	const totalCash = data
		.map((row) => row.cash)
		.reduce((acc, curr) => acc + parseFloat(curr.toString()), 0);

	const total = totalBodyMoney + totalFeetMoney + totalTips + totalCash;

	const chequeAmount = payroll.cheque_amount || total;

	const totalAfterCheque = total - chequeAmount;

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

	return (
		<DataTable style={[styles.table, { backgroundColor: rowColor }]}>
			<DataTable.Header
				style={[
					styles.header,
					{ backgroundColor: headerColor, borderBlockColor: textColor },
				]}
			>
				{titleElement(dateText)}
				{titleElement(t('Body'))}
				{titleElement(t('Feet'))}
				{titleElement(t('Tips'))}
				{titleElement(t('Cash'))}
			</DataTable.Header>

			{data.map((row, index) => (
				<DataTable.Row
					key={index}
					style={[
						styles.row,
						{
							backgroundColor:
								index % 2 === 0 ? alternatingRowColor : undefined,
							borderBlockColor: textColor,
						},
					]}
				>
					{cellElement(row.day)}
					{cellElement(row.body)}
					{cellElement(row.feet)}
					{cellElement(moneyToString(row.tips))}
					{cellElement(moneyToString(row.cash))}
				</DataTable.Row>
			))}

			<DataTable.Row
				style={[
					styles.sumRow,
					{ backgroundColor: blueRowColor, borderBlockColor: textColor },
				]}
			>
				{leftAlignBoldCellElement(t('SUM'))}
				{boldCellElement(totalBodySessions)}
				{boldCellElement(totalFeetSessions)}
				{boldCellElement(moneyToString(totalTips))}
				{boldCellElement(moneyToString(totalCash))}
			</DataTable.Row>

			<DataTable.Row
				style={[
					styles.payPerRow,
					{ backgroundColor: greenRowColor, borderBlockColor: textColor },
				]}
			>
				{leftAlignBoldCellElement(t('PAY/PER'))}
				{boldCellElement(moneyToString(bodyRate) + '/B')}
				{boldCellElement(moneyToString(feetRate) + '/F')}
				{boldCellElement('-')}
				{boldCellElement('-')}
			</DataTable.Row>

			<DataTable.Row
				style={[
					styles.totalRow,
					{ backgroundColor: yellowRowColor, borderBlockColor: textColor },
				]}
			>
				{leftAlignBoldCellElement(t('TOTAL/PER'))}
				{boldCellElement(moneyToString(totalBodyMoney))}
				{boldCellElement(moneyToString(totalFeetMoney))}
				{boldCellElement(moneyToString(totalTips))}
				{boldCellElement(moneyToString(totalCash))}
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
					{t('TOTAL')}
				</DataTable.Cell>

				<DataTable.Cell
					numeric
					textStyle={[styles.extraBoldedCellTextStyle, { color: textColor }]}
				>
					{moneyToString(total)}
				</DataTable.Cell>
			</DataTable.Row>

			{totalAfterCheque > 0 && (
				<>
					<DataTable.Row
						style={[
							styles.chequeRow,
							{ backgroundColor: grayRowColor, borderBlockColor: textColor },
						]}
					>
						<DataTable.Cell
							textStyle={[
								styles.extraBoldedCellTextStyle,
								{ color: textColor },
							]}
						>
							{t('CHEQUE')}
						</DataTable.Cell>

						<DataTable.Cell
							numeric
							textStyle={[
								styles.extraBoldedCellTextStyle,
								{ color: textColor },
							]}
						>
							{moneyToString(chequeAmount)}
						</DataTable.Cell>
					</DataTable.Row>

					<DataTable.Row
						style={[
							styles.chequeRow,
							{ backgroundColor: redRowColor, borderBlockColor: textColor },
						]}
					>
						<DataTable.Cell
							textStyle={[
								styles.extraBoldedCellTextStyle,
								{ color: textColor },
							]}
						>
							{t('CASH OUT')}
						</DataTable.Cell>

						<DataTable.Cell
							numeric
							textStyle={[
								styles.extraBoldedCellTextStyle,
								{ color: textColor },
							]}
						>
							{moneyToString(totalAfterCheque)}
						</DataTable.Cell>
					</DataTable.Row>
				</>
			)}
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
		fontSize: 16,
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

export default StoreEmployeeWithCashAndTipsPayroll;
