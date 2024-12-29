import AuthorizedAxiosInstance from '../AuthorizedAxiosInstance';

import { reservationPath } from '@/constants/API.constants';

import { GetReservationsParam } from '@/models/params/Reservation.Param';
import {
	AddReservationRequest,
	UpdateReservationRequest,
} from '@/models/requests/Reservation.Request.Model';
import Reservation from '@/models/Reservation.Model';

export const getReservations = async (
	params: GetReservationsParam
): Promise<Reservation[]> => {
	const response = await AuthorizedAxiosInstance.get(reservationPath, {
		params,
	});

	return response.data;
};

export const updateReservation = async (
	reservation_id: number,
	request: UpdateReservationRequest
): Promise<Reservation> => {
	const response = await AuthorizedAxiosInstance.patch(
		`${reservationPath}/${reservation_id}`,
		request
	);

	return response.data;
};

export const addReservation = async (
	request: AddReservationRequest
): Promise<Reservation> => {
	const response = await AuthorizedAxiosInstance.post(reservationPath, request);

	return response.data;
};

export const deleteReservation = async (
	reservation_id: number
): Promise<Reservation> => {
	const response = await AuthorizedAxiosInstance.delete(
		`${reservationPath}/${reservation_id}`
	);

	return response.data;
};
