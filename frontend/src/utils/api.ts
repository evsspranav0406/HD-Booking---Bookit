import axios from 'axios';
import type { Experience, Booking, PromoValidation } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const experiencesApi = {
  getAll: () => api.get<Experience[]>('/experiences'),
  getById: (id: string) => api.get<Experience>(`/experiences/${id}`),
};

export const bookingsApi = {
  create: (booking: Omit<Booking, 'createdAt' | 'status'>) =>
    api.post<{ message: string; bookingId: string }>('/bookings', booking),
};

export const promoApi = {
  validate: (code: string, totalAmount: number) =>
    api.post<PromoValidation>('/promo/validate', { code, totalAmount }),
};

export default api;
