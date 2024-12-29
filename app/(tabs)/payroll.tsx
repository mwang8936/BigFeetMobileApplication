import {
	useUserAcupunctureReportsQuery,
	useUserPayrollsQuery,
} from '@/hooks/react-query/profile.hooks';
import Swiper from 'react-native-swiper';
import { createContext, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, StyleSheet } from 'react-native';
import { RefreshControl, ScrollView } from 'react-native-gesture-handler';
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
import { usePayrollDate } from '@/context-providers/PayrollDateContext';
import AcupunctureReportTable from '@/components/(tabs)/payroll/AcupunctureReportTable';
import { useIsFetching, useQueryClient } from '@tanstack/react-query';
import { Toast } from 'toastify-react-native';
import {
	acupunctureReportsQueryKey,
	payrollsQueryKey,
	userQueryKey,
} from '@/constants/Query.constants';

export default function PayrollScreen() {
	const queryClient = useQueryClient();
	const { t } = useTranslation();

	const textColor = useThemeColor({}, 'text');

	const { date, setDate } = usePayrollDate();

	const payrollsQuery = useUserPayrollsQuery(date.year, date.month);
	const payrolls = payrollsQuery.data || [];

	const acupunctureReportsQuery = useUserAcupunctureReportsQuery(
		date.year,
		date.month
	);
	const acupunctureReports = acupunctureReportsQuery.data;

	if (payrollsQuery.isError) {
		Toast.error(t('Error Getting Payrolls'));
	}

	if (acupunctureReportsQuery.isError) {
		Toast.error(t('Error Getting Acupuncture Reports'));
	}

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

	const isAcupunctureReportFetching = useIsFetching({
		queryKey: [userQueryKey, acupunctureReportsQueryKey, date.year, date.month],
	});
	const isPayrollFetching = useIsFetching({
		queryKey: [userQueryKey, payrollsQueryKey, date.year, date.month],
	});

	const isFetching = isAcupunctureReportFetching && isPayrollFetching;
	const onRefresh = async () => {
		queryClient.invalidateQueries({
			queryKey: [
				userQueryKey,
				acupunctureReportsQueryKey,
				date.year,
				date.month,
			],
		});
		queryClient.invalidateQueries({
			queryKey: [userQueryKey, payrollsQueryKey, date.year, date.month],
		});
	};

	const payrollPart1 = payrolls.find(
		(payroll) => payroll.part === PayrollPart.PART_1
	);
	const payrollPart1Element = payrollPart1 && (
		<ScrollView
			key={payrollPart1.part}
			style={styles.scrollView}
			contentContainerStyle={styles.scrollViewContent}
			refreshControl={
				<RefreshControl
					refreshing={Boolean(isFetching)}
					onRefresh={onRefresh}
				/>
			}
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
			refreshControl={
				<RefreshControl
					refreshing={Boolean(isFetching)}
					onRefresh={onRefresh}
				/>
			}
		>
			{payrollElement(payrollPart2)}
		</ScrollView>
	);

	const acupunctureReport = acupunctureReports?.find(
		(acupunctureReport) =>
			acupunctureReport.year === date.year &&
			acupunctureReport.month === date.month
	);
	const acupunctureReportElement = acupunctureReport && (
		<ScrollView
			style={styles.scrollView}
			contentContainerStyle={styles.scrollViewContent}
			refreshControl={
				<RefreshControl
					refreshing={Boolean(isFetching)}
					onRefresh={onRefresh}
				/>
			}
		>
			<AcupunctureReportTable acupunctureReport={acupunctureReport} />
		</ScrollView>
	);

	const noPayrollsElement =
		!payrollPart1Element &&
		!payrollPart2Element &&
		!acupunctureReportElement ? (
			<ScrollView
				style={styles.scrollView}
				contentContainerStyle={styles.scrollViewContent}
				refreshControl={
					<RefreshControl
						refreshing={Boolean(isFetching)}
						onRefresh={onRefresh}
					/>
				}
			>
				<Text style={[styles.textContent, { color: textColor }]}>
					{t('No Payrolls')}
				</Text>
			</ScrollView>
		) : undefined;

	return (
		<SafeAreaProvider>
			<SafeAreaView style={styles.container} edges={['top']}>
				{isLoading ? (
					<BallIndicator color={textColor} />
				) : (
					<Swiper loop={false} dotColor={textColor}>
						{noPayrollsElement}
						{payrollPart1Element}
						{payrollPart2Element}
						{acupunctureReportElement}
					</Swiper>
				)}
				<YearMonthPicker
					year={date.year}
					setYear={(year: number) => setDate({ year, month: date.month })}
					month={date.month}
					setMonth={(month: number) => setDate({ year: date.year, month })}
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
