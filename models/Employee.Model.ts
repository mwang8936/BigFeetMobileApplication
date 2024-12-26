import { DateTime } from 'luxon';
import { Gender, Permissions, Role } from './enums';

export default interface Employee {
	employee_id: number;
	username: string;
	first_name: string;
	last_name: string;
	gender: Gender;
	role: Role;
	permissions: Permissions[];
	body_rate: number | null;
	feet_rate: number | null;
	acupuncture_rate: number | null;
	per_hour: number | null;
	created_at: DateTime;
	updated_at: DateTime;
	deleted_at: DateTime | null;
}
