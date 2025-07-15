import { useColorScheme } from 'react-native';
import { Toast } from 'toastify-react-native';
import { ToastShowParams } from 'toastify-react-native/utils/interfaces';

export const useToast = () => {
	const colorScheme = useColorScheme();
	const isDarkMode = colorScheme === 'dark';

	const config: ToastShowParams = {
		theme: isDarkMode ? 'dark' : 'light',
	};

	const showSuccessToast = (title: string, message?: string) => {
		Toast.show({
			...config,
			type: 'success',
			text1: title,
			text2: message,
		});
	};

	const showErrorToast = (title: string, message?: string) => {
		Toast.show({
			...config,
			type: 'error',
			text1: title,
			text2: message,
		});
	};

	const showPusherToast = (event: string, message?: string) => {
		Toast.show({
			...config,
			type: 'success',
			text1: event,
			text2: message,
			autoHide: false,
		});
	};

	return {
		showSuccessToast,
		showErrorToast,
		showPusherToast,
	};
};
