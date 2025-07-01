import API_BASE_URL, { authenticatePath } from '@/constants/API';
import {
	createContext,
	PropsWithChildren,
	useContext,
	useEffect,
	useState,
} from 'react';
import Pusher, { Channel } from 'pusher-js/react-native';
import { useQueryClient } from '@tanstack/react-query';
import { useUserQuery } from '@/hooks/react-query/profile.hooks';
import {
	add_schedule_event,
	delete_schedule_event,
	ScheduleEventMessage,
	schedules_channel,
	update_schedule_event,
} from '@/models/events/schedule.events';
import {
	add_reservation_event,
	delete_reservation_event,
	ReservationEventMessage,
	update_reservation_event,
} from '@/models/events/reservation.events';
import { schedulesQueryKey, userQueryKey } from '@/constants/Query';
import { DateTime } from 'luxon';
import {
	add_vip_package_event,
	delete_vip_package_event,
	update_vip_package_event,
	VipPackageEventMessage,
} from '@/models/events/vip-package.events';

const pusherCluster = process.env.EXPO_PUBLIC_PUSHER_CLUSTER;
const pusherKey = process.env.EXPO_PUBLIC_PUSHER_KEY;

const SocketIDContext = createContext<{
	socketID: string;
	setSocketID: (socketID: string) => void;
}>({
	socketID: '',
	setSocketID: () => null,
});

export function useSocket() {
	const value = useContext(SocketIDContext);
	if (process.env.NODE_ENV !== 'production') {
		if (!value) {
			throw new Error('useSocket must be wrapped in a <SocketProvider />');
		}
	}

	return value;
}

export function SocketProvider({ children }: PropsWithChildren) {
	const [socketID, setSocketID] = useState('');

	const queryClient = useQueryClient();
	const { data: user } = useUserQuery({});

	useEffect(() => {
		if (!user || !pusherCluster || !pusherKey) return;

		const pusher = new Pusher(pusherKey, {
			cluster: pusherCluster,
			channelAuthorization: {
				endpoint: `${API_BASE_URL}/${authenticatePath}/pusher`,
				transport: 'ajax',
			},
		});

		pusher.connection.bind('connected', () => {
			setSocketID(pusher.connection.socket_id);
		});

		const channel: Channel = pusher.subscribe(schedules_channel);

		const handleEvent = (
			eventMessage:
				| ReservationEventMessage
				| ScheduleEventMessage
				| VipPackageEventMessage,
			event: string
		) => {
			// TODO create local notification

			const { year, month, day } = DateTime.now().setZone(
				'America/Los_Angeles'
			);

			queryClient.invalidateQueries({
				queryKey: [userQueryKey, schedulesQueryKey, year, month, day],
			});
		};

		// Reservation Events
		channel.bind(
			add_reservation_event,
			(reservationEventMessage: ReservationEventMessage) =>
				handleEvent(reservationEventMessage, add_reservation_event)
		);
		channel.bind(
			update_reservation_event,
			(reservationEventMessage: ReservationEventMessage) =>
				handleEvent(reservationEventMessage, update_reservation_event)
		);
		channel.bind(
			delete_reservation_event,
			(reservationEventMessage: ReservationEventMessage) =>
				handleEvent(reservationEventMessage, delete_reservation_event)
		);

		// Schedule Events
		channel.bind(
			add_schedule_event,
			(scheduleEventMessage: ScheduleEventMessage) =>
				handleEvent(scheduleEventMessage, add_schedule_event)
		);
		channel.bind(
			update_schedule_event,
			(scheduleEventMessage: ScheduleEventMessage) =>
				handleEvent(scheduleEventMessage, update_schedule_event)
		);
		channel.bind(
			delete_schedule_event,
			(scheduleEventMessage: ScheduleEventMessage) =>
				handleEvent(scheduleEventMessage, delete_schedule_event)
		);

		// VIP Package Events
		channel.bind(
			add_vip_package_event,
			(vipPackageEventMessage: VipPackageEventMessage) =>
				handleEvent(vipPackageEventMessage, add_vip_package_event)
		);
		channel.bind(
			update_vip_package_event,
			(vipPackageEventMessage: VipPackageEventMessage) =>
				handleEvent(vipPackageEventMessage, update_vip_package_event)
		);
		channel.bind(
			delete_vip_package_event,
			(vipPackageEventMessage: VipPackageEventMessage) =>
				handleEvent(vipPackageEventMessage, delete_vip_package_event)
		);

		return () => {
			channel.unbind_all();
			pusher.unsubscribe(channel.name);
			pusher.disconnect();
		};
	}, [user]);

	return (
		<SocketIDContext.Provider
			value={{
				socketID,
				setSocketID,
			}}
		>
			{children}
		</SocketIDContext.Provider>
	);
}
