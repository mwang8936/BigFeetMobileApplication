import { Option } from '@/components/ThemedDropdown';

import {
	Gender,
	Language,
	PaymentMethod,
	PayrollOption,
	Role,
	ServiceColor,
	TipMethod,
} from '@/models/enums';

function capitalizeWords(inputString: string) {
	return inputString
		.split(' ') // Split the string into words
		.map(
			(word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() // Capitalize the first letter and lowercase the rest
		)
		.join(' '); // Join the words back into a single string
}

export const colorDropDownItems: Option[] = [
	{ value: null, label: 'No Color Selected', icon: 'remove-circle-sharp' },
	{ value: ServiceColor.RED, label: capitalizeWords(ServiceColor.RED) },
	{ value: ServiceColor.BLUE, label: capitalizeWords(ServiceColor.BLUE) },
	{
		value: ServiceColor.YELLOW,
		label: capitalizeWords(ServiceColor.YELLOW),
	},
	{
		value: ServiceColor.GREEN,
		label: capitalizeWords(ServiceColor.GREEN),
	},
	{
		value: ServiceColor.ORANGE,
		label: capitalizeWords(ServiceColor.ORANGE),
	},
	{
		value: ServiceColor.PURPLE,
		label: capitalizeWords(ServiceColor.PURPLE),
	},
	{ value: ServiceColor.GRAY, label: capitalizeWords(ServiceColor.GRAY) },
	{
		value: ServiceColor.BLACK,
		label: capitalizeWords(ServiceColor.BLACK),
	},
];

export const genderDropDownItems: Option[] = [
	{ value: null, label: 'No Gender Selected', icon: 'remove-circle-sharp' },
	{
		value: Gender.MALE,
		label: capitalizeWords(Gender.MALE),
		icon: 'male-sharp',
	},
	{
		value: Gender.FEMALE,
		label: capitalizeWords(Gender.FEMALE),
		icon: 'female-sharp',
	},
];

export const languageDropDownItems: Option[] = [
	{ value: null, label: 'No Language Selected', icon: 'remove-circle-sharp' },
	{ value: Language.ENGLISH, label: 'English' },
	{
		value: Language.SIMPLIFIED_CHINESE,
		label: '简体中文',
	},
	{
		value: Language.TRADITIONAL_CHINESE,
		label: '繁體中文',
	},
];

export const monthDropDownItems: Option[] = [
	{ value: null, label: 'No Month Selected' },
	{ value: 1, label: 'January' },
	{ value: 2, label: 'February' },
	{ value: 3, label: 'March' },
	{ value: 4, label: 'April' },
	{ value: 5, label: 'May' },
	{ value: 6, label: 'June' },
	{ value: 7, label: 'July' },
	{ value: 8, label: 'August' },
	{ value: 9, label: 'September' },
	{ value: 10, label: 'October' },
	{ value: 11, label: 'November' },
	{ value: 12, label: 'December' },
];

export const paymentMethodDropDownItems: Option[] = [
	{ value: null, label: 'No Payment Method Selected' },
	{ value: PaymentMethod.CASH, label: capitalizeWords(PaymentMethod.CASH) },
	{
		value: PaymentMethod.MACHINE,
		label: capitalizeWords(PaymentMethod.MACHINE),
	},
];

export const payrollOptionDropDownItems: Option[] = [
	{ value: null, label: 'No Payroll Option Selected' },
	{
		value: PayrollOption.ACUPUNCTURIST,
		label: capitalizeWords(PayrollOption.ACUPUNCTURIST),
	},
	{
		value: PayrollOption.RECEPTIONIST,
		label: capitalizeWords(PayrollOption.RECEPTIONIST),
	},
	{
		value: PayrollOption.STORE_EMPLOYEE,
		label: capitalizeWords(PayrollOption.STORE_EMPLOYEE),
	},
	{
		value: PayrollOption.STORE_EMPLOYEE_WITH_TIPS_AND_CASH,
		label: capitalizeWords(PayrollOption.STORE_EMPLOYEE_WITH_TIPS_AND_CASH),
	},
];

export const roleDropDownItems: Option[] = [
	{ value: null, label: 'No Role Selected', icon: 'remove-circle-sharp' },
	{ value: Role.STORE_EMPLOYEE, label: capitalizeWords(Role.STORE_EMPLOYEE) },
	{ value: Role.ACUPUNCTURIST, label: capitalizeWords(Role.ACUPUNCTURIST) },
	{ value: Role.RECEPTIONIST, label: capitalizeWords(Role.RECEPTIONIST) },
	{ value: Role.MANAGER, label: capitalizeWords(Role.MANAGER) },
	{ value: Role.DEVELOPER, label: capitalizeWords(Role.DEVELOPER) },
	{ value: Role.OTHER, label: capitalizeWords(Role.OTHER) },
];

export const tipMethodDropDownItems: Option[] = [
	{ value: null, label: 'No Tip Method Selected' },
	{ value: TipMethod.CASH, label: capitalizeWords(TipMethod.CASH) },
	{ value: TipMethod.HALF, label: capitalizeWords(TipMethod.HALF) },
	{ value: TipMethod.MACHINE, label: capitalizeWords(TipMethod.MACHINE) },
];
