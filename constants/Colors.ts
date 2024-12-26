/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

const iconColorLight = '#687076';
const iconColorDark = '#9BA1A6';

export const Colors = {
	light: {
		text: '#11181C',
		background: '#fff',
		disabledBackground: '#ccc',
		tint: tintColorLight,
		border: '#a3a3a3',
		icon: iconColorLight,
		tabIconDefault: iconColorLight,
		tabIconSelected: tintColorLight,
		blue: '#007BFF',
		green: '#28a745',
		modalBackground: '#D3D3D3',
		modalTitle: '#333',
		modalLabel: '#555',
		header: '#F4F4F4',
		row: '#F1F1F1',
		alternatingRow: '#E0E0E0',
		blueRow: '#63B3ED',
		greenRow: '#68D391',
		yellowRow: '#F6E05E',
		goldRow: '#D69E2E',
		grayRow: '#E2E8F0',
		redRow: '#F56565',
	},
	dark: {
		text: '#ECEDEE',
		background: '#151718',
		disabledBackground: '#555',
		tint: tintColorDark,
		border: '#2a2a2a',
		icon: iconColorDark,
		tabIconDefault: iconColorDark,
		tabIconSelected: tintColorDark,
		blue: '#0056b3',
		green: '#1c7430',
		modalBackground: '#1E1E1E',
		modalTitle: '#fff',
		modalLabel: '#ccc',
		header: '#0A0A0A',
		row: '#1E1E1E',
		alternatingRow: '#252525',
		blueRow: '#1E3A8A',
		greenRow: '#065F46',
		yellowRow: '#92400E',
		goldRow: '#D69E2E',
		grayRow: '#2D3748',
		redRow: '#E53E3E',
	},
};
