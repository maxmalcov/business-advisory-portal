import { ServiceRequest } from '../types/serviceTypes';

export const mockRequests: ServiceRequest[] = [
  {
    id: '1',
    userId: 'user1',
    userName: 'John Smith',
    userEmail: 'john@example.com',
    serviceName: 'Tax Consulting',
    status: 'completed',
    requestDate: '2025-03-15T10:30:00Z',
    completionDate: '2025-03-22T14:45:00Z'
  },
  {
    id: '2',
    userId: 'user2',
    userName: 'Alice Johnson',
    userEmail: 'alice@example.com',
    serviceName: 'Business Plan Development',
    status: 'in_progress',
    requestDate: '2025-04-02T09:15:00Z',
    completionDate: null
  },
  {
    id: '3',
    userId: 'user3',
    userName: 'Robert Davis',
    userEmail: 'robert@example.com',
    serviceName: 'Tax Consulting',
    status: 'requested',
    requestDate: '2025-04-10T16:20:00Z',
    completionDate: null
  },
  {
    id: '4',
    userId: 'user4',
    userName: 'Emma Wilson',
    userEmail: 'emma@example.com',
    serviceName: 'Financial Analysis',
    status: 'cancelled',
    requestDate: '2025-02-25T11:00:00Z',
    completionDate: null
  },
  {
    id: '5',
    userId: 'user5',
    userName: 'Michael Brown',
    userEmail: 'michael@example.com',
    serviceName: 'Business Plan Development',
    status: 'completed',
    requestDate: '2025-03-05T13:40:00Z',
    completionDate: '2025-03-15T09:30:00Z'
  },
  {
    id: '6',
    userId: 'user1',
    userName: 'John Smith',
    userEmail: 'john@example.com',
    serviceName: 'Financial Analysis',
    status: 'completed',
    requestDate: '2025-01-10T14:20:00Z',
    completionDate: '2025-01-20T16:15:00Z'
  },
  {
    id: '7',
    userId: 'user6',
    userName: 'Sophia Lee',
    userEmail: 'sophia@example.com',
    serviceName: 'Tax Consulting',
    status: 'in_progress',
    requestDate: '2025-04-15T10:10:00Z',
    completionDate: null
  },
  {
    id: '8',
    userId: 'user7',
    userName: 'William Harris',
    userEmail: 'william@example.com',
    serviceName: 'Accounting Advisory',
    status: 'requested',
    requestDate: '2025-04-18T09:05:00Z',
    completionDate: null
  },
  {
    id: '9',
    userId: 'user8',
    userName: 'Olivia Martinez',
    userEmail: 'olivia@example.com',
    serviceName: 'Business Plan Development',
    status: 'completed',
    requestDate: '2025-02-10T15:30:00Z',
    completionDate: '2025-02-25T13:45:00Z'
  },
  {
    id: '10',
    userId: 'user9',
    userName: 'James Taylor',
    userEmail: 'james@example.com',
    serviceName: 'Tax Consulting',
    status: 'cancelled',
    requestDate: '2025-03-28T11:20:00Z',
    completionDate: null
  }
];
