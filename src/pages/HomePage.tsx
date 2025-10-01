import { useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { LoginPage } from './LoginPage';
import { AppLayout, FullScreenLoader } from '@/components/layout/AppLayout';
export function HomePage() {
  const currentUser = useAppStore((state) => state.currentUser);
  const isLoading = useAppStore((state) => state.isLoading);
  const fetchInitialData = useAppStore((state) => state.fetchInitialData);
  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);
  if (isLoading) {
    return <FullScreenLoader />;
  }
  if (!currentUser) {
    return <LoginPage />;
  }
  return <AppLayout />;
}