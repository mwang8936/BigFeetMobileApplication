export interface QueryProp {
	enabled?: boolean;
	staleTime?: number; // In milliseconds
	refetchInterval?: number; // In milliseconds
	refetchIntervalInBackground?: boolean;
}

export interface MutationProp {
	setLoading?: (loading: boolean) => void;
	onError?: (error: string) => void;
	onSuccess?: () => void;
}

export interface AcupunctureReportQueryProp extends QueryProp {
	year: number;
	month: number;
}

export interface PayrollQueryProp extends QueryProp {
	year: number;
	month: number;
}

export interface ScheduleQueryProp extends QueryProp {
	year: number;
	month: number;
	day: number;
}
