import { createContext, PropsWithChildren, useContext, useState } from 'react';

import { nowInBC } from '@/utils/timezone.utils';

interface YearMonth {
	year: number;
	month: number;
}

const PayrollDateContext = createContext<{
	date: YearMonth;
	setDate: (date: YearMonth) => void;
}>({
	date: { year: nowInBC().year, month: nowInBC().month },
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
		year: nowInBC().year,
		month: nowInBC().month,
	});

	return (
		<PayrollDateContext.Provider value={{ date, setDate }}>
			{children}
		</PayrollDateContext.Provider>
	);
}
