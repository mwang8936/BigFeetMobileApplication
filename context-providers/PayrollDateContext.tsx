import { createContext, PropsWithChildren, useContext, useState } from 'react';

interface YearMonth {
	year: number;
	month: number;
}

const PayrollDateContext = createContext<{
	date: YearMonth;
	setDate: (date: YearMonth) => void;
}>({
	date: { year: new Date().getFullYear(), month: new Date().getMonth() + 1 },
	setDate: () => null,
});

export const usePayrollDate = () => {
	const value = useContext(PayrollDateContext);
	if (process.env.NODE_ENV !== 'production') {
		if (!value) {
			throw new Error(
				'usePayrollDate must be wrapped in a  <PayrollDateProvider />'
			);
		}
	}

	return value;
};

export function PayrollDateProvider({ children }: PropsWithChildren) {
	const [date, setDate] = useState<YearMonth>({
		year: new Date().getFullYear(),
		month: new Date().getMonth() + 1,
	});

	return (
		<PayrollDateContext.Provider value={{ date, setDate }}>
			{children}
		</PayrollDateContext.Provider>
	);
}
