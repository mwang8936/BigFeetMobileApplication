import { createContext, PropsWithChildren, useContext, useState } from 'react';

const SocketIDContext = createContext<{
	socketID: string;
	setSocketID: (socketID: string) => void;
}>({
	socketID: '',
	setSocketID: () => null,
});

//TODO add PUSHER

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
