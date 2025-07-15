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
	sign_schedule_event,
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
import { Permissions } from '@/models/enums';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/toast/useToast';

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

	const { t } = useTranslation();

	const { showPusherToast } = useToast();

	const queryClient = useQueryClient();
	const { data: user } = useUserQuery({});

	useEffect(() => {
		if (!user || !pusherCluster || !pusherKey) return;

		const employeeId = user.employee_id;
		const permissions = user.permissions;

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

		const handleReservationEvent = (
			eventMessage: ReservationEventMessage,
			event:
				| 'add-reservation-event'
				| 'update-reservation-event'
				| 'delete-reservation-event'
		) => {
			if (
				employeeId !== eventMessage.employee_id &&
				!permissions.includes(Permissions.PERMISSION_GET_SCHEDULE)
			)
				return;

			const time = eventMessage.time;
			const username = eventMessage.username;
			const createdBy = eventMessage.created_by;

			let eventTitle: string = '';
			let message: string = '';
			switch (event) {
				case add_reservation_event:
					eventTitle = t('Reservation Added Successfully');
					message = t('Reservation Added', {
						time,
						username,
						created_by: createdBy,
					});
					break;
				case update_reservation_event:
					eventTitle = t('Reservation Updated Successfully');
					message = t('Reservation Updated', {
						time,
						username,
						updated_by: createdBy,
					});
					break;
				case delete_reservation_event:
					eventTitle = t('Reservation Deleted Successfully');
					message = t('Reservation Deleted', {
						time,
						username,
						deleted_by: createdBy,
					});
					break;
			}

			showPusherToast(eventTitle, message);

			const { year, month, day } = DateTime.now().setZone(
				'America/Los_Angeles'
			);

			queryClient.invalidateQueries({
				queryKey: [userQueryKey, schedulesQueryKey, year, month, day],
			});
		};

		const handleScheduleEvent = (
			eventMessage: ScheduleEventMessage,
			event:
				| 'add-schedule-event'
				| 'update-schedule-event'
				| 'delete-schedule-event'
				| 'sign-schedule-event'
		) => {
			if (
				employeeId !== eventMessage.employee_id &&
				!permissions.includes(Permissions.PERMISSION_GET_SCHEDULE)
			)
				return;

			const username = eventMessage.username;

			let eventTitle: string = '';
			let message: string = '';
			switch (event) {
				case add_schedule_event:
					eventTitle = t('Schedule Added Successfully');
					message = t('Schedule Added', {
						username,
					});
					break;
				case update_schedule_event:
					eventTitle = t('Schedule Updated Successfully');
					message = t('Schedule Updated', {
						username,
					});
					break;
				case delete_schedule_event:
					eventTitle = t('Schedule Deleted Successfully');
					message = t('Schedule Deleted', {
						username,
					});
					break;
				case sign_schedule_event:
					eventTitle = t('Schedule Signed Successfully');
					message = t('Schedule Signed', {
						username,
					});
					break;
			}

			showPusherToast(eventTitle, message);

			const { year, month, day } = DateTime.now().setZone(
				'America/Los_Angeles'
			);

			queryClient.invalidateQueries({
				queryKey: [userQueryKey, schedulesQueryKey, year, month, day],
			});
		};

		const handleVipPackageEvent = (
			eventMessage: VipPackageEventMessage,
			event:
				| 'add-vip-package-event'
				| 'update-vip-package-event'
				| 'delete-vip-package-event'
		) => {
			if (
				eventMessage.employee_ids.includes(employeeId) &&
				!permissions.includes(Permissions.PERMISSION_GET_SCHEDULE)
			)
				return;

			const serial = eventMessage.serial;

			let eventTitle: string = '';
			let message: string = '';
			switch (event) {
				case add_vip_package_event:
					eventTitle = t('VIP Packaged Added Successfully');
					message = t('VIP Package Added', {
						serial,
					});
					break;
				case update_vip_package_event:
					eventTitle = t('VIP Packaged Updated Successfully');
					message = t('VIP Package Updated', {
						serial,
					});
					break;
				case delete_vip_package_event:
					eventTitle = t('VIP Packaged Deleted Successfully');
					message = t('VIP Package Deleted', {
						serial,
					});
					break;
			}

			showPusherToast(eventTitle, message);

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
				handleReservationEvent(reservationEventMessage, add_reservation_event)
		);
		channel.bind(
			update_reservation_event,
			(reservationEventMessage: ReservationEventMessage) =>
				handleReservationEvent(
					reservationEventMessage,
					update_reservation_event
				)
		);
		channel.bind(
			delete_reservation_event,
			(reservationEventMessage: ReservationEventMessage) =>
				handleReservationEvent(
					reservationEventMessage,
					delete_reservation_event
				)
		);

		// Schedule Events
		channel.bind(
			add_schedule_event,
			(scheduleEventMessage: ScheduleEventMessage) =>
				handleScheduleEvent(scheduleEventMessage, add_schedule_event)
		);
		channel.bind(
			update_schedule_event,
			(scheduleEventMessage: ScheduleEventMessage) =>
				handleScheduleEvent(scheduleEventMessage, update_schedule_event)
		);
		channel.bind(
			delete_schedule_event,
			(scheduleEventMessage: ScheduleEventMessage) =>
				handleScheduleEvent(scheduleEventMessage, delete_schedule_event)
		);
		channel.bind(
			sign_schedule_event,
			(scheduleEventMessage: ScheduleEventMessage) =>
				handleScheduleEvent(scheduleEventMessage, sign_schedule_event)
		);

		// VIP Package Events
		channel.bind(
			add_vip_package_event,
			(vipPackageEventMessage: VipPackageEventMessage) =>
				handleVipPackageEvent(vipPackageEventMessage, add_vip_package_event)
		);
		channel.bind(
			update_vip_package_event,
			(vipPackageEventMessage: VipPackageEventMessage) =>
				handleVipPackageEvent(vipPackageEventMessage, update_vip_package_event)
		);
		channel.bind(
			delete_vip_package_event,
			(vipPackageEventMessage: VipPackageEventMessage) =>
				handleVipPackageEvent(vipPackageEventMessage, delete_vip_package_event)
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
