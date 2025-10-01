export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
// --- FloatFlow Specific Types ---
export type UserRole = 'requester' | 'manager' | 'finance';
export type RequestStatus = 'pending' | 'approved' | 'rejected' | 'disbursed';
export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: UserRole;
}
export interface RequestHistoryItem {
  status: RequestStatus;
  timestamp: string; // ISO 8601 date string
  updatedBy: string; // User name
}
export interface PettyCashRequest {
  id: string;
  requesterId: string;
  amount: number;
  currency: 'USD' | 'EUR' | 'GBP';
  reason: string;
  status: RequestStatus;
  history: RequestHistoryItem[];
  createdAt: string; // ISO 8601 date string
  updatedAt: string; // ISO 8601 date string
}