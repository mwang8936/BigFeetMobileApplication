import API_BASE_URL, { authenticatePath } from '@/constants/API';
import {
	createContext,
	PropsWithChildren,
	useContext,
	useEffect,
	useState,
} from 'react';
import Pusher from 'pusher-js/react-native';

const pusherCluster = process.env.EXPO_PUBLIC_PUSHER_CLUSTER;
const pusherKey = process.env.EXPO_PUBLIC_PUSHER_KEY;

const SocketIDContext = createContext<{
	pusher: Pusher | null;
	socketID: string;
	setSocketID: (socketID: string) => void;
}>({
	pusher: null,
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
	const [pusher, setPusher] = useState<Pusher | null>(null);

	useEffect(() => {
		if (!pusherCluster || !pusherKey) return;

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

		setPusher(pusher);

		return () => {
			pusher.disconnect();
		};
	}, []);

	return (
		<SocketIDContext.Provider
			value={{
				pusher,
				socketID,
				setSocketID,
			}}
		>
			{children}
		</SocketIDContext.Provider>
	);
}
