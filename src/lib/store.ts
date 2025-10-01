import { create } from 'zustand';
import { User, PettyCashRequest, RequestStatus } from '@shared/types';
import { api } from './api-client';
import { toast } from 'sonner';
interface AppState {
  currentUser: User | null;
  users: User[];
  requests: PettyCashRequest[];
  isLoading: boolean;
  error: string | null;
  fetchInitialData: () => Promise<void>;
  login: (userId: string) => void;
  logout: () => void;
  addRequest: (request: Omit<PettyCashRequest, 'id' | 'requesterId' | 'history' | 'createdAt' | 'updatedAt' | 'status'>) => Promise<void>;
  updateRequestStatus: (requestId: string, status: RequestStatus) => Promise<void>;
}
export const useAppStore = create<AppState>((set, get) => ({
  currentUser: null,
  users: [],
  requests: [],
  isLoading: true,
  error: null,
  fetchInitialData: async () => {
    try {
      set({ isLoading: true, error: null });
      const [users, requests] = await Promise.all([
        api<User[]>('/api/users'),
        api<PettyCashRequest[]>('/api/requests'),
      ]);
      set({ users, requests, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch initial data';
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
    }
  },
  login: (userId: string) => {
    const user = get().users.find(u => u.id === userId);
    if (user) {
      set({ currentUser: user });
    } else {
      console.error(`Login failed: User with ID ${userId} not found.`);
      toast.error("Login failed: Could not find the selected user.");
    }
  },
  logout: () => {
    set({ currentUser: null });
  },
  addRequest: async (newRequestData) => {
    const currentUser = get().currentUser;
    if (!currentUser) throw new Error('You must be logged in to create a request.');
    try {
      const newRequest = await api<PettyCashRequest>('/api/requests', {
        method: 'POST',
        body: JSON.stringify({
          ...newRequestData,
          requesterId: currentUser.id,
        }),
      });
      set(state => ({ requests: [newRequest, ...state.requests] }));
      toast.success('New request created successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create request.';
      toast.error(errorMessage);
      throw error; // Re-throw to be caught in the component
    }
  },
  updateRequestStatus: async (requestId, status) => {
    try {
      const currentUser = get().currentUser;
      if (!currentUser) throw new Error('You must be logged in to update a request.');
      const updatedRequest = await api<PettyCashRequest>(`/api/requests/${requestId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status, updatedById: currentUser.id }),
      });
      set(state => ({
        requests: state.requests.map(req => (req.id === requestId ? updatedRequest : req)),
      }));
      toast.success(`Request status updated to ${status}.`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update request status.';
      toast.error(errorMessage);
    }
  },
}));