import { NavLink } from 'react-router-dom';
import { Home, FileText, Users, X, DollarSign } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}
const navItems = [
  { href: '/', icon: Home, label: 'Dashboard', roles: ['requester', 'manager', 'finance'] },
  { href: '/requests', icon: FileText, label: 'My Requests', roles: ['requester'] },
  { href: '/approvals', icon: Users, label: 'Approvals', roles: ['manager'] },
  { href: '/disbursements', icon: DollarSign, label: 'Disbursements', roles: ['finance'] },
];
export function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const currentUser = useAppStore(state => state.currentUser);
  const filteredNavItems = navItems.filter(item => currentUser && item.roles.includes(currentUser.role));
  const sidebarContent = (
    <>
      <div className="flex items-center justify-between h-16 px-4 border-b border-blue-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-500 rounded-lg">
            <DollarSign className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">FloatFlow</h1>
        </div>
        <button
          type="button"
          className="lg:hidden text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          onClick={() => setSidebarOpen(false)}
        >
          <X className="h-6 w-6" />
        </button>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-1">
        {filteredNavItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.href}
            end
            className={({ isActive }) =>
              cn(
                'group flex items-center px-3 py-2.5 text-base font-medium rounded-md transition-all duration-200',
                isActive
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
              )
            }
            onClick={() => setSidebarOpen(false)}
          >
            <item.icon className="mr-3 h-5 w-5" aria-hidden="true" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </>
  );
  return (
    <>
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:z-20">
        <div className="flex flex-col flex-grow bg-white dark:bg-gray-800 border-r border-blue-100 dark:border-gray-700 overflow-y-auto">
          {sidebarContent}
        </div>
      </div>
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 z-40 flex flex-col lg:hidden"
          >
            {sidebarContent}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}