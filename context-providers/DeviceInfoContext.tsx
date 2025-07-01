import React, {
	createContext,
	PropsWithChildren,
	useContext,
	useEffect,
	useState,
} from 'react';
import * as Device from 'expo-device';

interface DeviceInfoContextProps {
	deviceId: string | null;
	deviceModel: string | null;
	deviceName: string | null;
}

const DeviceContext = createContext<DeviceInfoContextProps>({
	deviceId: null,
	deviceModel: null,
	deviceName: null,
});

export const useDeviceInfo = () => {
	const value = useContext(DeviceContext);
	if (process.env.NODE_ENV !== 'production') {
		if (!value) {
			throw new Error(
				'useDeviceInfo must be wrapped in a <DeviceInfoProvider />'
			);
		}
	}
	return value;
};

export function DeviceInfoProvider({ children }: PropsWithChildren) {
	const [deviceInfo, setDeviceInfo] = useState<DeviceInfoContextProps>({
		deviceId: null,
		deviceModel: null,
		deviceName: null,
	});

	useEffect(() => {
		const fetchDeviceInfo = async () => {
			try {
				setDeviceInfo({
					deviceId: Device.osInternalBuildId ?? null,
					deviceModel: Device.modelName ?? null,
					deviceName: Device.deviceName ?? null,
				});
			} catch (error) {
				console.error('Error fetching device info:', error);
			}
		};

		fetchDeviceInfo();
	}, []);

	return (
		<DeviceContext.Provider value={deviceInfo}>
			{children}
		</DeviceContext.Provider>
	);
}
