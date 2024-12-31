import { useEffect, useRef, useState } from 'react';
import { Text, View, StyleSheet, FlatList } from 'react-native';

import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';
import { RefreshControl, ScrollView } from 'react-native-gesture-handler';
import { BallIndicator } from 'react-native-indicators';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useIsFetching, useQueryClient } from '@tanstack/react-query';
import { Toast } from 'toastify-react-native';

import { schedulesQueryKey, userQueryKey } from '@/constants/Query';
import STORES from '@/constants/Stores';

import ReservationTag from '@/components/(tabs)/schedule/ReservationTag';
import SchedulerFooter from '@/components/(tabs)/schedule/SchedulerFooter';
import SchedulerHeader from '@/components/(tabs)/schedule/SchedulerHeader';
import YearMonthDayPicker from '@/components/(tabs)/schedule/YearMonthDayPicker';
import { ThemedLoadingSpinner } from '@/components/ThemedLoadingSpinner';

import { useScheduleDate } from '@/context-providers/ScheduleDateContext';

import { useThemeColor } from '@/hooks/colors/useThemeColor';
import { useUserSchedulesQuery } from '@/hooks/react-query/profile.hooks';

import Schedule from '@/models/Schedule.Model';

import { getTimeString } from '@/utils/string.utils';

export default function SchedulerScreen() {
	const { t } = useTranslation();

	const queryClient = useQueryClient();

	const { date, setDate } = useScheduleDate();

	const textColor = useThemeColor({}, 'text');

	const yellowRowColor = useThemeColor({}, 'yellowRow');

	const [headerHeight, setHeaderHeight] = useState(0);
	const [itemHeights, setItemHeights] = useState<number[]>([]);
	const [isSigning, setIsSigning] = useState(false);

	const scrollViewRef = useRef<ScrollView>(null);

	const schedulesQuery = useUserSchedulesQuery({ ...date });
	const schedules = schedulesQuery.data || [];

	if (schedulesQuery.isError) {
		Toast.error(t('Error Getting Schedules'));
	}

	const isLoading = schedulesQuery.isLoading;

	const isFetching = useIsFetching({
		queryKey: [
			userQueryKey,
			schedulesQueryKey,
			date.year,
			date.month,
			date.day,
		],
	});
	const onRefresh = async () => {
		queryClient.invalidateQueries({
			queryKey: [
				userQueryKey,
				schedulesQueryKey,
				date.year,
				date.month,
				date.day,
			],
		});
	};

	const schedule: Schedule | undefined = schedules[0];
	const reservations = schedule?.reservations || [];

	if (schedule) {
		if (schedule.start) {
			schedule.start = schedule.start.set({
				year: schedule.date.year,
				month: schedule.date.month,
				day: schedule.date.day,
			});
		}

		if (schedule.end) {
			schedule.end = schedule.end.set({
				year: schedule.date.year,
				month: schedule.date.month,
				day: schedule.date.day,
			});
		}
	}

	// TODO Fix Scrolling
	const data: { date: DateTime; name: string }[] = [];
	for (
		let currTime = STORES.start.set({ ...date });
		currTime <= STORES.end.set({ ...date });
		currTime = currTime.plus({ minutes: 30 })
	) {
		data.push({
			date: currTime,
			name: getTimeString(currTime),
		});
	}

	const scrollToItem = (index?: number) => {
		let height = 0;

		if (index) {
			height = headerHeight;
			for (let i = 0; i < index; i++) {
				height += itemHeights[i];
			}
		}

		scrollViewRef.current?.scrollTo({ animated: true, y: height, x: 0 });
	};

	useEffect(() => {
		let currentDate = DateTime.now().setZone('America/Los_Angeles');

		if (
			currentDate.year === date.year &&
			currentDate.month === date.month &&
			currentDate.day === date.day
		) {
			let indexToScrollTo = data.findIndex((item) => item.date > currentDate);
			if (indexToScrollTo === -1) {
				indexToScrollTo = data.length - 1;
			} else if (indexToScrollTo !== 0) {
				indexToScrollTo--;
			}

			const timeout = setTimeout(() => {
				scrollToItem(indexToScrollTo);
			}, 100);

			return () => clearTimeout(timeout);
		} else {
			const timeout = setTimeout(() => {
				scrollToItem();
			}, 100);

			return () => clearTimeout(timeout);
		}
	}, [date, headerHeight, itemHeights]);

	// Function to capture the height of each item
	const handleLayout = (index: number) => (event: any) => {
		const { height } = event.nativeEvent.layout;
		// Save the height for the specific index
		setItemHeights((prevHeights) => {
			const newHeights = [...prevHeights];
			newHeights[index] = height;
			return newHeights;
		});
	};

	const renderItem = ({
		item,
		index,
	}: {
		item: { date: DateTime; name: string };
		index: number;
	}) => {
		let backgroundColor = undefined;

		if (schedule) {
			if (schedule.start && schedule.end) {
				if (item.date < schedule.start || item.date > schedule.end) {
					backgroundColor = yellowRowColor;
				}
			} else if (schedule.start) {
				if (item.date < schedule.start) {
					backgroundColor = yellowRowColor;
				}
			} else if (schedule.end) {
				if (item.date > schedule.end) {
					backgroundColor = yellowRowColor;
				}
			}
		}

		return (
			<View
				style={[styles.item, { backgroundColor }]}
				onLayout={handleLayout(index)}
			>
				<Text style={[styles.text, { color: textColor }]}>{item.name}</Text>
			</View>
		);
	};

	const defaultItemHeight = 10 + 80 + 1 + 24;

	const getItemLayout = (_: any, index: number) => {
		// Use the dynamically stored height for each item
		const height = itemHeights[index] || defaultItemHeight; // Default height if not yet measured
		return { length: height, offset: height * index, index };
	};

	const generateReservations = () => {
		return reservations.map((reservation) => (
			<ReservationTag
				key={reservation.reservation_id}
				reservation={reservation}
				itemHeight={itemHeights.length > 0 ? itemHeights[0] : defaultItemHeight}
				offset={headerHeight}
			/>
		));
	};

	return (
		<SafeAreaProvider>
			<SafeAreaView style={styles.container} edges={['top']}>
				<ThemedLoadingSpinner
					indicator="ball"
					isLoading={isSigning}
					message={t('Signing Schedule...')}
				/>

				{isLoading ? (
					<BallIndicator color={textColor} />
				) : (
					<ScrollView
						ref={scrollViewRef}
						style={styles.container}
						refreshControl={
							<RefreshControl
								refreshing={Boolean(isFetching)}
								onRefresh={onRefresh}
							/>
						}
					>
						<FlatList
							style={{ width: '100%' }}
							scrollEnabled={false}
							data={data}
							renderItem={renderItem}
							keyExtractor={(item) =>
								(item.date.hour * 60 + item.date.minute).toString()
							}
							getItemLayout={getItemLayout}
							ListHeaderComponent={
								<SchedulerHeader
									schedule={schedule}
									setHeaderHeight={setHeaderHeight}
								/>
							}
							ListFooterComponent={
								<SchedulerFooter
									schedule={schedule}
									setLoading={setIsSigning}
								/>
							}
						/>

						{generateReservations()}
					</ScrollView>
				)}

				<YearMonthDayPicker
					year={date.year}
					setYear={(year: number) =>
						setDate({ year, month: date.month, day: date.day })
					}
					month={date.month}
					setMonth={(month: number) =>
						setDate({ year: date.year, month, day: date.day })
					}
					day={date.day}
					setDay={(day: number) =>
						setDate({ year: date.year, month: date.month, day })
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
	text: {
		fontSize: 20,
		fontWeight: 'bold',
	},
	button: {
		fontSize: 20,
		textDecorationLine: 'underline',
		color: '#fff',
	},
	item: {
		paddingLeft: 20,
		paddingTop: 10,
		paddingBottom: 80,
		borderBottomWidth: 1,
		borderColor: '#ccc',
	},
	overlayItem: {
		position: 'absolute', // Position the overlay item on top of FlatList
		left: '35%',
		width: '65%',
		backgroundColor: 'red',
		opacity: 0.5,
		padding: 10,
		zIndex: 1, // Ensure it stays on top of the FlatList
		borderColor: 'blue',
		borderWidth: 2,
		borderRadius: 10,
	},
	overlayText: {
		color: 'white',
		fontWeight: 'bold',
	},
});
