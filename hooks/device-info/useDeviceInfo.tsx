import { useEffect, useState } from 'react';

import * as Device from 'expo-device';
import * as SecureStore from 'expo-secure-store';

import { v4 as uuidv4 } from 'uuid';

export const useDeviceInfo = () => {
	const [deviceInfo, setDeviceInfo] = useState({
		deviceId: '',
		deviceName: '',
		deviceModel: '',
	});

	useEffect(() => {
		const loadDeviceInfo = async () => {
			// Check if device ID exists in SecureStore
			let deviceId = await SecureStore.getItemAsync('device_id');
			if (!deviceId) {
				deviceId = uuidv4();
				await SecureStore.setItemAsync('device_id', deviceId);
			}

			setDeviceInfo({
				deviceId,
				deviceName: Device.deviceName || 'Unknown',
				deviceModel: Device.modelName || 'Unknown',
			});
		};

		loadDeviceInfo();
	}, []);

	return deviceInfo;
};
