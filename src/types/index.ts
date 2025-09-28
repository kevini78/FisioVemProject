export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  userType: 'patient' | 'physiotherapist';
  profileImage?: string;
  createdAt: Date;
}

export interface Patient extends User {
  userType: 'patient';
  medicalHistory?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export interface Physiotherapist extends User {
  userType: 'physiotherapist';
  specialties: string[];
  credentials: string[];
  experience: number;
  pricePerSession: number;
  rating: number;
  totalReviews: number;
  availability: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
  }[];
  isVerified: boolean;
  bio?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  physiotherapistId: string;
  date: Date;
  duration: number; // in minutes
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  price: number;
  address: string;
  notes?: string;
  createdAt: Date;
}

export interface Review {
  id: string;
  appointmentId: string;
  patientId: string;
  physiotherapistId: string;
  rating: number; // 1-5
  comment: string;
  createdAt: Date;
}

export type UserType = 'patient' | 'physiotherapist';

export interface AppState {
  currentUser: User | null;
  userType: UserType | null;
  isAuthenticated: boolean;
  currentScreen: string;
}