import Constants from 'expo-constants';

const constants = Constants.expoConfig?.extra;

const API_BASE_URL = constants?.apiUrl ?? 'http://localhost:7000/api';

export default API_BASE_URL;

export const loginPath = 'login';
export const authenticatePath = 'authenticate';
export const acupunctureReportPath = 'acupuncture-report';
export const customerPath = 'customer';
export const employeePath = 'employee';
export const giftCardPath = 'gift-card';
export const payrollPath = 'payroll';
export const profilePath = 'profile';
export const reservationPath = 'reservation';
export const schedulePath = 'schedule';
export const servicePath = 'service';
export const vipPackagePath = 'vip-package';
