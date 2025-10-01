import { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { PettyCashRequest, RequestStatus } from '@shared/types';
import { useAppStore } from '@/lib/store';
import { format, parseISO } from 'date-fns';
import { MoreHorizontal, ArrowUpDown, Check, X, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';
const statusConfig: Record<RequestStatus, { color: string; darkColor: string; label: string }> = {
  pending: { color: 'bg-yellow-100 text-yellow-800', darkColor: 'dark:bg-yellow-900/50 dark:text-yellow-300', label: 'Pending' },
  approved: { color: 'bg-blue-100 text-blue-800', darkColor: 'dark:bg-blue-900/50 dark:text-blue-300', label: 'Approved' },
  rejected: { color: 'bg-red-100 text-red-800', darkColor: 'dark:bg-red-900/50 dark:text-red-300', label: 'Rejected' },
  disbursed: { color: 'bg-green-100 text-green-800', darkColor: 'dark:bg-green-900/50 dark:text-green-300', label: 'Disbursed' },
};
function TableSkeleton() {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead><Skeleton className="h-5 w-24" /></TableHead>
            <TableHead><Skeleton className="h-5 w-32" /></TableHead>
            <TableHead><Skeleton className="h-5 w-20" /></TableHead>
            <TableHead><Skeleton className="h-5 w-24" /></TableHead>
            <TableHead><Skeleton className="h-5 w-20" /></TableHead>
            <TableHead><Skeleton className="h-5 w-16" /></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell><Skeleton className="h-5 w-28" /></TableCell>
              <TableCell><Skeleton className="h-5 w-40" /></TableCell>
              <TableCell><Skeleton className="h-5 w-24" /></TableCell>
              <TableCell><Skeleton className="h-5 w-28" /></TableCell>
              <TableCell><Skeleton className="h-5 w-24" /></TableCell>
              <TableCell><Skeleton className="h-8 w-8" /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
export function RequestsTable() {
  const { requests, currentUser, users, updateRequestStatus, isLoading } = useAppStore();
  const [filter, setFilter] = useState<RequestStatus | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sort, setSort] = useState<{ key: keyof PettyCashRequest; direction: 'asc' | 'desc' }>({ key: 'createdAt', direction: 'desc' });
  const usersById = useMemo(() => new Map(users.map(u => [u.id, u])), [users]);
  const filteredAndSortedRequests = useMemo(() => {
    let result = requests;
    if (currentUser?.role === 'requester') {
      result = result.filter(r => r.requesterId === currentUser.id);
    } else if (currentUser?.role === 'manager') {
      result = result.filter(r => r.status === 'pending');
    } else if (currentUser?.role === 'finance') {
      result = result.filter(r => r.status === 'approved');
    }
    if (filter !== 'all' && currentUser?.role === 'requester') {
      result = result.filter(r => r.status === filter);
    }
    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      result = result.filter(r =>
        r.reason.toLowerCase().includes(lowercasedTerm) ||
        usersById.get(r.requesterId)?.name.toLowerCase().includes(lowercasedTerm)
      );
    }
    return [...result].sort((a, b) => {
      const valA = a[sort.key];
      const valB = b[sort.key];
      if (valA < valB) return sort.direction === 'asc' ? -1 : 1;
      if (valA > valB) return sort.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [requests, currentUser, filter, searchTerm, sort, usersById]);
  const handleSort = (key: keyof PettyCashRequest) => {
    setSort(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };
  const renderActions = (request: PettyCashRequest) => {
    if (!currentUser) return null;
    const managerActions = (
      <>
        <DropdownMenuItem onClick={() => updateRequestStatus(request.id, 'approved')}>
          <Check className="mr-2 h-4 w-4" /> Approve
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => updateRequestStatus(request.id, 'rejected')}>
          <X className="mr-2 h-4 w-4" /> Reject
        </DropdownMenuItem>
      </>
    );
    const financeActions = (
      <DropdownMenuItem onClick={() => updateRequestStatus(request.id, 'disbursed')}>
        <DollarSign className="mr-2 h-4 w-4" /> Mark as Disbursed
      </DropdownMenuItem>
    );
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>View Details</DropdownMenuItem>
          {currentUser.role === 'manager' && request.status === 'pending' && managerActions}
          {currentUser.role === 'finance' && request.status === 'approved' && financeActions}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };
  const SortableHeader = ({ columnKey, children }: { columnKey: keyof PettyCashRequest; children: React.ReactNode }) => (
    <TableHead>
      <Button variant="ghost" onClick={() => handleSort(columnKey)}>
        {children}
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    </TableHead>
  );
  const getTableTitle = () => {
    switch (currentUser?.role) {
      case 'requester': return 'My Requests';
      case 'manager': return 'Requests for Approval';
      case 'finance': return 'Requests for Disbursement';
      default: return 'All Requests';
    }
  };
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <h2 className="text-2xl font-semibold">{getTableTitle()}</h2>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Input
            placeholder="Search by reason or requester..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:max-w-xs"
          />
          {currentUser?.role === 'requester' && (
            <Select value={filter} onValueChange={(value) => setFilter(value as any)}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="disbursed">Disbursed</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
      </div>
      {isLoading ? (
        <TableSkeleton />
      ) : (
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <SortableHeader columnKey="requesterId">Requester</SortableHeader>
                <SortableHeader columnKey="reason">Reason</SortableHeader>
                <SortableHeader columnKey="amount">Amount</SortableHeader>
                <SortableHeader columnKey="createdAt">Date</SortableHeader>
                <SortableHeader columnKey="status">Status</SortableHeader>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedRequests.length > 0 ? (
                filteredAndSortedRequests.map((request) => (
                  <TableRow key={request.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="font-medium">{usersById.get(request.requesterId)?.name || 'Unknown'}</TableCell>
                    <TableCell className="max-w-xs truncate">{request.reason}</TableCell>
                    <TableCell>{new Intl.NumberFormat('en-US', { style: 'currency', currency: request.currency }).format(request.amount)}</TableCell>
                    <TableCell>{format(parseISO(request.createdAt), 'MMM d, yyyy')}</TableCell>
                    <TableCell>
                      <Badge className={cn('font-semibold', statusConfig[request.status].color, statusConfig[request.status].darkColor)}>
                        {statusConfig[request.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell>{renderActions(request)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No requests found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}