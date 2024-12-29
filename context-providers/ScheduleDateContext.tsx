import { createContext, PropsWithChildren, useContext, useState } from 'react';

interface YearMonthDay {
	year: number;
	month: number;
	day: number;
}

const ScheduleDateContext = createContext<{
	date: YearMonthDay;
	setDate: (date: YearMonthDay) => void;
}>({
	date: {
		year: new Date().getFullYear(),
		month: new Date().getMonth() + 1,
		day: new Date().getDate(),
	},
	setDate: () => null,
});

export const useScheduleDate = () => {
	const value = useContext(ScheduleDateContext);
	if (process.env.NODE_ENV !== 'production') {
		if (!value) {
			throw new Error(
				'useScheduleDate must be wrapped in a  <ScheduleDateProvider />'
			);
		}
	}

	return value;
};

export function ScheduleDateProvider({ children }: PropsWithChildren) {
	const [date, setDate] = useState<YearMonthDay>({
		year: new Date().getFullYear(),
		month: new Date().getMonth() + 1,
		day: new Date().getDate(),
	});

	return (
		<ScheduleDateContext.Provider value={{ date, setDate }}>
			{children}
		</ScheduleDateContext.Provider>
	);
}
