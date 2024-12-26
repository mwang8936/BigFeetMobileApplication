import { createContext, PropsWithChildren, useContext, useState } from 'react';

// Define the structure of the year-month object
interface YearMonth {
	year: number;
	month: number;
}

// Create a context with default values
const PayrollYearMonthContext = createContext<{
	yearMonth: YearMonth;
	setYearMonth: React.Dispatch<React.SetStateAction<YearMonth>>;
} | null>(null);

// Custom Hook to use the context
export const usePayrollYearMonth = () => {
	const context = useContext(PayrollYearMonthContext);
	if (!context) {
		throw new Error(
			'usePayrollYearMonth must be used within a PayrollYearMonthProvider'
		);
	}
	return context;
};

export function PayrollYearMonthProvider({ children }: PropsWithChildren) {
	const [yearMonth, setYearMonth] = useState<YearMonth>({
		year: new Date().getFullYear(),
		month: new Date().getMonth() + 1,
	});

	return (
		<PayrollYearMonthContext.Provider value={{ yearMonth, setYearMonth }}>
			{children}
		</PayrollYearMonthContext.Provider>
	);
}
