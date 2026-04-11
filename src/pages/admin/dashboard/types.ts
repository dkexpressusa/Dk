export interface Contact {
  id: string;
  name: string;
  phone: string | null;
  email: string;
  type: string | null;
  message: string;
  status: 'unread' | 'read';
  admin_memo: string | null;
  created_at: string;
}

export type FilterStatus = 'all' | 'unread' | 'read';

export interface FilterState {
  status: FilterStatus;
  type: string;
  search: string;
  dates: string[];
}
