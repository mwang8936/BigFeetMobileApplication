import {
	useUserAcupunctureReportsQuery,
	useUserPayrollsQuery,
} from '@/hooks/react-query/profile.hooks';
import Swiper from 'react-native-swiper';
import { createContext, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { PayrollOption, PayrollPart } from '@/models/enums';

import { BallIndicator } from 'react-native-indicators';
import YearMonthPicker from '@/components/(tabs)/payroll/YearMonthPicker';
import { useThemeColor } from '@/hooks/colors/useThemeColor';
import StoreEmployeePayroll from '@/components/(tabs)/payroll/StoreEmployeePayroll';
import Payroll from '@/models/Payroll.Model';
import StoreEmployeeWithCashAndTipsPayroll from '@/components/(tabs)/payroll/StoreEmployeeWithCashAndTipsPayroll';
import AcupuncturistPayroll from '@/components/(tabs)/payroll/AcupuncturistPayroll';
import ReceptionistPayroll from '@/components/(tabs)/payroll/ReceptionistPayroll';
import { usePayrollYearMonth } from '@/context-providers/PayrollYearMonthContext';
import AcupunctureReportTable from '@/components/(tabs)/payroll/AcupunctureReportTable';

export default function PayrollScreen() {
	const { t } = useTranslation();

	const textColor = useThemeColor({}, 'text');

	const { yearMonth, setYearMonth } = usePayrollYearMonth();

	const payrollsQuery = useUserPayrollsQuery(yearMonth.year, yearMonth.month);
	const payrolls = payrollsQuery.data || [];

	const acupunctureReportsQuery = useUserAcupunctureReportsQuery(
		yearMonth.year,
		yearMonth.month
	);
	const acupunctureReports = acupunctureReportsQuery.data;

	const isLoading =
		payrollsQuery.isLoading || acupunctureReportsQuery.isLoading;

	const payrollElement = (payroll: Payroll) => {
		switch (payroll.option) {
			case PayrollOption.ACUPUNCTURIST:
				return <AcupuncturistPayroll payroll={payroll} />;
			case PayrollOption.RECEPTIONIST:
				return <ReceptionistPayroll payroll={payroll} />;
			case PayrollOption.STORE_EMPLOYEE:
				return <StoreEmployeePayroll payroll={payroll} />;
			case PayrollOption.STORE_EMPLOYEE_WITH_TIPS_AND_CASH:
				return <StoreEmployeeWithCashAndTipsPayroll payroll={payroll} />;
			default:
				return <StoreEmployeePayroll payroll={payroll} />;
		}
	};

	const payrollPart1 = payrolls.find(
		(payroll) => payroll.part === PayrollPart.PART_1
	);
	const payrollPart1Element = payrollPart1 && (
		<ScrollView
			key={payrollPart1.part}
			style={styles.scrollView}
			contentContainerStyle={styles.scrollViewContent}
		>
			{payrollElement(payrollPart1)}
		</ScrollView>
	);

	const payrollPart2 = payrolls.find(
		(payroll) => payroll.part === PayrollPart.PART_2
	);
	const payrollPart2Element = payrollPart2 && (
		<ScrollView
			key={payrollPart2.part}
			style={styles.scrollView}
			contentContainerStyle={styles.scrollViewContent}
		>
			{payrollElement(payrollPart2)}
		</ScrollView>
	);

	const acupunctureReport = acupunctureReports?.find(
		(acupunctureReport) =>
			acupunctureReport.year === yearMonth.year &&
			acupunctureReport.month === yearMonth.month
	);
	const acupunctureReportElement = acupunctureReport && (
		<ScrollView
			style={styles.scrollView}
			contentContainerStyle={styles.scrollViewContent}
		>
			<AcupunctureReportTable acupunctureReport={acupunctureReport} />
		</ScrollView>
	);

	const noPayrollsElement =
		!payrollPart1Element &&
		!payrollPart2Element &&
		!acupunctureReportElement ? (
			<Text style={[styles.textContent, { color: textColor }]}>
				{t('No Payrolls')}
			</Text>
		) : undefined;

	return (
		<SafeAreaProvider>
			<SafeAreaView style={styles.container} edges={['top']}>
				{isLoading ? (
					<BallIndicator />
				) : (
					<Swiper loop={false} dotColor={textColor}>
						{noPayrollsElement}
						{payrollPart1Element}
						{payrollPart2Element}
						{acupunctureReportElement}
					</Swiper>
				)}
				<YearMonthPicker
					year={yearMonth.year}
					setYear={(year: number) =>
						setYearMonth({ year, month: yearMonth.month })
					}
					month={yearMonth.month}
					setMonth={(month: number) =>
						setYearMonth({ year: yearMonth.year, month })
					}
				/>
			</SafeAreaView>
		</SafeAreaProvider>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	scrollView: {
		flex: 1,
	},
	scrollViewContent: {
		flexGrow: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	textContent: {
		fontSize: 40,
		fontWeight: 'bold',
		margin: 'auto',
	},
});
