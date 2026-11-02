import { createContext, PropsWithChildren, useContext, useState } from 'react';

import { nowInBC } from '@/utils/timezone.utils';

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
		year: nowInBC().year,
		month: nowInBC().month,
		day: nowInBC().day,
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
		year: nowInBC().year,
		month: nowInBC().month,
		day: nowInBC().day,
	});

	return (
		<ScheduleDateContext.Provider value={{ date, setDate }}>
			{children}
		</ScheduleDateContext.Provider>
	);
}
