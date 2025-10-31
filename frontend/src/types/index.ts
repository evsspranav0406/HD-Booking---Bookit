export interface Experience {
  _id: string;
  title: string;
  description: string;
  images: string[];
  price: number;
  duration: string;
  location: string;
  category: string;
  slots: Slot[];
  createdAt: string;
}

export interface Slot {
  date: string;
  time: string;
  available: boolean;
  maxParticipants: number;
  bookedCount: number;
}

export interface Booking {
  experienceId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  date: string;
  time: string;
  participants: number;
  promoCode?: string;
  discount: number;
  totalPrice: number;
  status: string;
  createdAt: string;
}

export interface PromoValidation {
  valid: boolean;
  discountType: string;
  discountValue: number;
  discountAmount: number;
  finalAmount: number;
}
