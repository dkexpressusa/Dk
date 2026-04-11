import { Contact } from './types';

export const formatDate = (iso: string): string => {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};

export const formatDateOnly = (iso: string): string => {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const exportToCSV = (contacts: Contact[]): void => {
  const headers = ['이름', '연락처', '이메일', '문의유형', '문의내용', '상태', '관리자메모', '접수일시'];
  const rows = contacts.map(c => [
    c.name,
    c.phone || '',
    c.email,
    c.type || '',
    c.message.replace(/\n/g, ' '),
    c.status === 'unread' ? '미확인' : '확인완료',
    (c.admin_memo || '').replace(/\n/g, ' '),
    formatDate(c.created_at),
  ]);

  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n');

  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `dkexpress_contacts_${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};

export const TYPE_OPTIONS = ['전체', '한국 일반 택배', '귀국 이사', '배송 관련 문의', '예약문의', '가격문의', '기타'];

export const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  unread: { label: '미확인', color: 'bg-orange-100 text-orange-700' },
  read: { label: '확인완료', color: 'bg-emerald-100 text-emerald-700' },
};

export const getMonthlyStats = (contacts: Contact[]): { month: string; count: number }[] => {
  const map: Record<string, number> = {};
  contacts.forEach(c => {
    const d = new Date(c.created_at);
    const key = `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}`;
    map[key] = (map[key] || 0) + 1;
  });
  return Object.entries(map)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .map(([month, count]) => ({ month, count }));
};
