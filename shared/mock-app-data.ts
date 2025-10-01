import { User, PettyCashRequest } from './types';
import { subDays, formatISO } from 'date-fns';
export const MOCK_USERS: User[] = [
  {
    id: 'user-requester-1',
    name: 'Alex Doe',
    email: 'alex.doe@example.com',
    avatarUrl: 'https://i.pravatar.cc/150?u=alex',
    role: 'requester',
  },
  {
    id: 'user-manager-1',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    avatarUrl: 'https://i.pravatar.cc/150?u=jane',
    role: 'manager',
  },
  {
    id: 'user-finance-1',
    name: 'Sam Wilson',
    email: 'sam.wilson@example.com',
    avatarUrl: 'https://i.pravatar.cc/150?u=sam',
    role: 'finance',
  },
];
const now = new Date();
export const MOCK_REQUESTS: PettyCashRequest[] = [
  {
    id: 'req-1',
    requesterId: 'user-requester-1',
    amount: 50.0,
    currency: 'USD',
    reason: 'Office supplies for the new quarter.',
    status: 'pending',
    createdAt: formatISO(subDays(now, 1)),
    updatedAt: formatISO(subDays(now, 1)),
    history: [
      { status: 'pending', timestamp: formatISO(subDays(now, 1)), updatedBy: 'Alex Doe' },
    ],
  },
  {
    id: 'req-2',
    requesterId: 'user-requester-1',
    amount: 120.5,
    currency: 'USD',
    reason: 'Team lunch for project completion celebration.',
    status: 'approved',
    createdAt: formatISO(subDays(now, 3)),
    updatedAt: formatISO(subDays(now, 2)),
    history: [
      { status: 'pending', timestamp: formatISO(subDays(now, 3)), updatedBy: 'Alex Doe' },
      { status: 'approved', timestamp: formatISO(subDays(now, 2)), updatedBy: 'Jane Smith' },
    ],
  },
  {
    id: 'req-3',
    requesterId: 'user-requester-1',
    amount: 75.0,
    currency: 'EUR',
    reason: 'Software subscription renewal.',
    status: 'disbursed',
    createdAt: formatISO(subDays(now, 10)),
    updatedAt: formatISO(subDays(now, 5)),
    history: [
      { status: 'pending', timestamp: formatISO(subDays(now, 10)), updatedBy: 'Alex Doe' },
      { status: 'approved', timestamp: formatISO(subDays(now, 8)), updatedBy: 'Jane Smith' },
      { status: 'disbursed', timestamp: formatISO(subDays(now, 5)), updatedBy: 'Sam Wilson' },
    ],
  },
  {
    id: 'req-4',
    requesterId: 'user-requester-1',
    amount: 25.0,
    currency: 'USD',
    reason: 'Client coffee meeting.',
    status: 'rejected',
    createdAt: formatISO(subDays(now, 4)),
    updatedAt: formatISO(subDays(now, 3)),
    history: [
      { status: 'pending', timestamp: formatISO(subDays(now, 4)), updatedBy: 'Alex Doe' },
      { status: 'rejected', timestamp: formatISO(subDays(now, 3)), updatedBy: 'Jane Smith' },
    ],
  },
  {
    id: 'req-5',
    requesterId: 'user-requester-1',
    amount: 250.0,
    currency: 'GBP',
    reason: 'Emergency repair for office printer.',
    status: 'approved',
    createdAt: formatISO(subDays(now, 6)),
    updatedAt: formatISO(subDays(now, 5)),
    history: [
      { status: 'pending', timestamp: formatISO(subDays(now, 6)), updatedBy: 'Alex Doe' },
      { status: 'approved', timestamp: formatISO(subDays(now, 5)), updatedBy: 'Jane Smith' },
    ],
  },
];