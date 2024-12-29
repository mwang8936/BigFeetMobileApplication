import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { DataTable } from 'react-native-paper';

import { useTranslation } from 'react-i18next';

import { DateTime } from 'luxon';

import { usePayrollDate } from '@/context-providers/PayrollDateContext';

import { useThemeColor } from '@/hooks/colors/useThemeColor';
import { useUserQuery } from '@/hooks/react-query/profile.hooks';

import { PayrollPart } from '@/models/enums';
import Payroll from '@/models/Payroll.Model';

import { isHoliday } from '@/utils/date.utils';
import {
	getShortMonthString,
	getTimeString,
	hoursToString,
	moneyToString,
	padStringOrNumber,
} from '@/utils/string.utils';

interface ReceptionistPayrollProp {
	payroll: Payroll;
}

interface RowData {
	day: number;
	start: DateTime | null;
	end: DateTime | null;
	hours: number;
	body: number;
	feet: number;
	hours_minus_sessions: number;
	holiday: boolean;
	total_hours: number;
}
const ReceptionistPayroll: React.FC<ReceptionistPayrollProp> = ({
	payroll,
}) => {
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

	const [isMinimized, setIsMinimized] = useState(true);

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
			const start = scheduleData.start;
			const end = scheduleData.end;

			const hours =
				start !== null && end !== null ? end.diff(start, 'hours').hours : 0;

			const body =
				scheduleData.body_sessions + scheduleData.acupuncture_sessions;
			const feet = scheduleData.feet_sessions;

			const hours_minus_sessions = Math.max(hours - body - feet, 0);

			const holiday = isHoliday({
				year: date.year,
				month: date.month,
				day,
			});

			const total_hours = Math.max(
				holiday ? 1.5 * hours_minus_sessions : hours_minus_sessions,
				0
			);

			return {
				day,
				start,
				end,
				hours,
				body,
				feet,
				hours_minus_sessions,
				holiday,
				total_hours,
			};
		} else {
			return {
				day,
				start: null,
				end: null,
				hours: 0,
				body: 0,
				feet: 0,
				hours_minus_sessions: 0,
				holiday: isHoliday({
					year: date.year,
					month: date.month,
					day,
				}),
				total_hours: 0,
			};
		}
	});

	const bodyRate = payroll.employee.body_rate ?? 0;
	const feetRate = payroll.employee.feet_rate ?? 0;
	const hourlyRate = payroll.employee.per_hour ?? 0;

	const totalBodySessions = data
		.map((row) => row.body)
		.reduce((acc, curr) => acc + parseFloat(curr.toString()), 0);
	const totalFeetSessions = data
		.map((row) => row.feet)
		.reduce((acc, curr) => acc + parseFloat(curr.toString()), 0);
	const totalHours = data
		.map((row) => row.hours)
		.reduce((acc, curr) => acc + parseFloat(curr.toString()), 0);
	const totalHoursMinusSessions = data
		.map((row) => row.hours_minus_sessions)
		.reduce((acc, curr) => acc + parseFloat(curr.toString()), 0);
	const totalHoursFinal = data
		.map((row) => row.total_hours)
		.reduce((acc, curr) => acc + parseFloat(curr.toString()), 0);

	const totalBodyMoney = totalBodySessions * bodyRate;
	const totalFeetMoney = totalFeetSessions * feetRate;
	const totalHourlyMoney = totalHoursFinal * hourlyRate;

	const cheque = totalBodyMoney + totalFeetMoney + totalHourlyMoney;

	const titleElement = (title: string, numberOfLines: number = 1) => {
		return (
			<DataTable.Cell style={styles.title}>
				<Text
					adjustsFontSizeToFit
					numberOfLines={numberOfLines}
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

	const minimizedTable = () => {
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
					{titleElement(t('Total Hours'), 2)}
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
						{cellElement(hoursToString(row.total_hours))}
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
					{boldCellElement(hoursToString(totalHoursFinal))}
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
					{boldCellElement(moneyToString(hourlyRate) + '/hr')}
				</DataTable.Row>

				<DataTable.Row
					style={[
						styles.totalRow,
						{ backgroundColor: yellowRowColor, borderBlockColor: textColor },
					]}
				>
					{leftAlignBoldCellElement(t('TOTAL'))}
					{boldCellElement(moneyToString(totalBodyMoney))}
					{boldCellElement(moneyToString(totalFeetMoney))}
					{boldCellElement(moneyToString(totalHourlyMoney))}
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
						{t('CHEQUE')}
					</DataTable.Cell>

					<DataTable.Cell
						numeric
						textStyle={[styles.extraBoldedCellTextStyle, { color: textColor }]}
					>
						{moneyToString(cheque)}
					</DataTable.Cell>
				</DataTable.Row>
			</DataTable>
		);
	};

	const fullTable = () => {
		return (
			<DataTable style={[styles.table, { backgroundColor: rowColor }]}>
				<DataTable.Header
					style={[
						styles.header,
						{ backgroundColor: headerColor, borderBlockColor: textColor },
					]}
				>
					{titleElement(dateText)}
					{titleElement(t('Start'))}
					{titleElement(t('End'))}
					{titleElement(t('Hours'))}
					{titleElement(t('Body'))}
					{titleElement(t('Feet'))}
					{titleElement(t('Counted Hours'), 2)}
					{titleElement(t('Holiday Rate'), 2)}
					{titleElement(t('Total Hours'), 2)}
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
						{cellElement(row.start ? getTimeString(row.start) : '-')}
						{cellElement(row.end ? getTimeString(row.end) : '-')}
						{cellElement(hoursToString(row.hours))}
						{cellElement(row.body)}
						{cellElement(row.feet)}
						{cellElement(hoursToString(row.hours_minus_sessions))}
						{cellElement(row.holiday ? '× 1.5' : '× 1')}
						{cellElement(hoursToString(row.total_hours))}
					</DataTable.Row>
				))}

				<DataTable.Row
					style={[
						styles.sumRow,
						{ backgroundColor: blueRowColor, borderBlockColor: textColor },
					]}
				>
					{leftAlignBoldCellElement(t('SUM'))}
					{boldCellElement('-')}
					{boldCellElement('-')}
					{boldCellElement(hoursToString(totalHours))}
					{boldCellElement(totalBodySessions)}
					{boldCellElement(totalFeetSessions)}
					{boldCellElement(hoursToString(totalHoursMinusSessions))}
					{boldCellElement('-')}
					{boldCellElement(hoursToString(totalHoursFinal))}
				</DataTable.Row>

				<DataTable.Row
					style={[
						styles.payPerRow,
						{ backgroundColor: greenRowColor, borderBlockColor: textColor },
					]}
				>
					{leftAlignBoldCellElement(t('PAY/PER'))}
					{boldCellElement('-')}
					{boldCellElement('-')}
					{boldCellElement('-')}
					{boldCellElement(moneyToString(bodyRate) + '/B')}
					{boldCellElement(moneyToString(feetRate) + '/F')}
					{boldCellElement('-')}
					{boldCellElement('-')}
					{boldCellElement(moneyToString(hourlyRate) + '/hr')}
				</DataTable.Row>

				<DataTable.Row
					style={[
						styles.totalRow,
						{ backgroundColor: yellowRowColor, borderBlockColor: textColor },
					]}
				>
					{leftAlignBoldCellElement(t('TOTAL'))}
					{boldCellElement('-')}
					{boldCellElement('-')}
					{boldCellElement('-')}
					{boldCellElement(moneyToString(totalBodyMoney))}
					{boldCellElement(moneyToString(totalFeetMoney))}
					{boldCellElement('-')}
					{boldCellElement('-')}
					{boldCellElement(moneyToString(totalHourlyMoney))}
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
						{t('CHEQUE')}
					</DataTable.Cell>

					<DataTable.Cell
						numeric
						textStyle={[styles.extraBoldedCellTextStyle, { color: textColor }]}
					>
						{moneyToString(cheque)}
					</DataTable.Cell>
				</DataTable.Row>
			</DataTable>
		);
	};

	return (
		<TouchableOpacity
			onLongPress={() => setIsMinimized(!isMinimized)}
			activeOpacity={1}
			style={styles.wrapper}
		>
			{isMinimized ? minimizedTable() : fullTable()}
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	wrapper: {
		width: '100%',
	},
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

export default ReceptionistPayroll;
