import { Menu, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAppStore } from '@/lib/store';
import { ThemeToggle } from '@/components/ThemeToggle';
import { NewRequestModal } from '../dashboard/NewRequestModal';
interface HeaderProps {
  setSidebarOpen: (open: boolean) => void;
}
export function Header({ setSidebarOpen }: HeaderProps) {
  const currentUser = useAppStore(state => state.currentUser);
  const logout = useAppStore(state => state.logout);
  if (!currentUser) return null;
  return (
    <header className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm border-b border-blue-100 dark:border-gray-700">
      <button
        type="button"
        className="px-4 border-r border-blue-100 dark:border-gray-700 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>
      <div className="flex-1 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="flex-1 flex">
          {/* Search bar can go here if needed */}
        </div>
        <div className="ml-4 flex items-center md:ml-6 gap-2 sm:gap-4">
          {currentUser.role === 'requester' && <NewRequestModal />}
          <ThemeToggle className="relative" />
          <Button variant="ghost" size="icon" className="rounded-full">
            <Bell className="h-6 w-6" />
            <span className="sr-only">View notifications</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} />
                  <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel>
                <p className="font-medium">{currentUser.name}</p>
                <p className="text-xs text-gray-500">{currentUser.email}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}