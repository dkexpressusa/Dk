import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Contact, FilterState } from './types';
import { formatDateOnly, exportToCSV } from './utils';
import AdminHeader from './components/AdminHeader';
import StatsCards from './components/StatsCards';
import FilterBar from './components/FilterBar';
import ContactTable from './components/ContactTable';
import ContactDetailModal from './components/ContactDetailModal';
import ReviewsTab from './components/ReviewsTab';
import FAQTab from './components/FAQTab';

const PAGE_SIZE = 30;

type TabType = 'contacts' | 'reviews' | 'faq';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<TabType>('contacts');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Contact | null>(null);
  const [filter, setFilter] = useState<FilterState>({ status: 'all', type: '전체', search: '', dates: [] });
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [pendingReviewCount, setPendingReviewCount] = useState(0);
  const notificationSoundRef = useRef<AudioContext | null>(null);

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) {
        setContacts(data as Contact[]);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPendingReviewCount = useCallback(async () => {
    const { count } = await supabase
      .from('reviews')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');
    setPendingReviewCount(count || 0);
  }, []);

  useEffect(() => {
    fetchContacts();
    fetchPendingReviewCount();
  }, [fetchContacts, fetchPendingReviewCount]);

  useEffect(() => {
    const channel = supabase
      .channel('contacts-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'contacts' }, (payload) => {
        const newContact = payload.new as Contact;
        setContacts(prev => [newContact, ...prev]);
        if (Notification.permission === 'granted') {
          new Notification('새 문의가 접수되었습니다', {
            body: `${newContact.name}님의 문의가 접수되었습니다.`,
            icon: '/favicon.ico',
          });
        }
        playNotificationSound();
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'reviews' }, () => {
        fetchPendingReviewCount();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchPendingReviewCount]);

  useEffect(() => {
    if (Notification.permission === 'default') Notification.requestPermission();
  }, []);

  const playNotificationSound = () => {
    try {
      const ctx = new AudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      oscillator.frequency.setValueAtTime(880, ctx.currentTime);
      oscillator.frequency.setValueAtTime(660, ctx.currentTime + 0.1);
      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.4);
      notificationSoundRef.current = ctx;
    } catch { /* ignore */ }
  };

  const handleFilterChange = (partial: Partial<FilterState>) => {
    setFilter(prev => ({ ...prev, ...partial }));
    setPage(1);
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    const { error } = await supabase.from('contacts').update({ status: newStatus }).eq('id', id);
    if (!error) setContacts(prev => prev.map(c => c.id === id ? { ...c, status: newStatus as Contact['status'] } : c));
    setUpdatingId(null);
  };

  const handleOpenDetail = (c: Contact) => {
    setSelected(c);
    if (c.status === 'unread') handleStatusChange(c.id, 'read');
  };

  const handleUpdateContact = (updated: Contact) => {
    setContacts(prev => prev.map(c => c.id === updated.id ? updated : c));
    setSelected(updated);
  };

  const handleDeleteContact = (id: string) => {
    setContacts(prev => prev.filter(c => c.id !== id));
    setSelectedIds(prev => { const s = new Set(prev); s.delete(id); return s; });
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const s = new Set(prev);
      if (s.has(id)) s.delete(id); else s.add(id);
      return s;
    });
  };

  const handleSelectAll = () => {
    const filteredIds = filtered.map(c => c.id);
    const allSelected = filteredIds.every(id => selectedIds.has(id));
    setSelectedIds(allSelected ? new Set() : new Set(filteredIds));
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    const ids = Array.from(selectedIds);
    const { error } = await supabase.from('contacts').delete().in('id', ids);
    if (!error) {
      setContacts(prev => prev.filter(c => !selectedIds.has(c.id)));
      setSelectedIds(new Set());
      setIsEditMode(false);
    }
  };

  const handleToggleEditMode = () => {
    setIsEditMode(v => !v);
    setSelectedIds(new Set());
  };

  const filtered = contacts.filter(c => {
    const matchStatus = filter.status === 'all' || c.status === filter.status;
    const matchType = filter.type === '전체' || c.type === filter.type;
    const q = filter.search.toLowerCase();
    const matchSearch = !q || c.name.toLowerCase().includes(q) || (c.phone || '').toLowerCase().includes(q) || c.message.toLowerCase().includes(q);
    const matchDate = filter.dates.length === 0 || filter.dates.includes(formatDateOnly(c.created_at));
    return matchStatus && matchType && matchSearch && matchDate;
  });

  const paginatedContacts = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const unreadCount = contacts.filter(c => c.status === 'unread').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader unreadCount={unreadCount} />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-base sm:text-xl font-black text-gray-900">관리자 대시보드</h2>
          <button
            onClick={() => { fetchContacts(); fetchPendingReviewCount(); }}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg text-xs sm:text-sm font-medium text-gray-600 transition-colors cursor-pointer whitespace-nowrap"
          >
            <i className="ri-refresh-line"></i>
            <span className="hidden sm:inline">새로고침</span>
          </button>
        </div>

        <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1 w-full sm:w-fit mb-4 sm:mb-6">
          <button
            onClick={() => setActiveTab('contacts')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-colors cursor-pointer whitespace-nowrap ${activeTab === 'contacts' ? 'bg-[#1E3A8A] text-white' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <i className="ri-mail-line"></i>
            <span>문의 관리</span>
            {unreadCount > 0 && (
              <span className="bg-orange-500 text-white text-xs font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                {unreadCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-colors cursor-pointer whitespace-nowrap ${activeTab === 'reviews' ? 'bg-[#1E3A8A] text-white' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <i className="ri-star-line"></i>
            <span>후기 관리</span>
            {pendingReviewCount > 0 && (
              <span className="bg-yellow-400 text-white text-xs font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                {pendingReviewCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('faq')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-colors cursor-pointer whitespace-nowrap ${activeTab === 'faq' ? 'bg-[#1E3A8A] text-white' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <i className="ri-question-answer-line"></i>
            <span>FAQ 관리</span>
          </button>
        </div>

        {activeTab === 'contacts' && (
          <>
            <StatsCards contacts={contacts} />
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-gray-100">
                <h3 className="font-black text-gray-900 text-sm sm:text-base">문의 목록</h3>
              </div>
              <FilterBar
                filter={filter}
                onFilterChange={handleFilterChange}
                selectedIds={selectedIds}
                onBulkDelete={handleBulkDelete}
                onExportCSV={() => exportToCSV(filtered)}
                onSelectAll={handleSelectAll}
                totalFiltered={filtered.length}
                isEditMode={isEditMode}
                onToggleEditMode={handleToggleEditMode}
              />
              <ContactTable
                contacts={paginatedContacts}
                loading={loading}
                isEditMode={isEditMode}
                selectedIds={selectedIds}
                onToggleSelect={handleToggleSelect}
                onOpenDetail={handleOpenDetail}
                onStatusChange={handleStatusChange}
                updatingId={updatingId}
                page={page}
                pageSize={PAGE_SIZE}
                totalCount={filtered.length}
                onPageChange={setPage}
              />
            </div>
          </>
        )}

        {activeTab === 'reviews' && <ReviewsTab />}
        {activeTab === 'faq' && <FAQTab />}
      </div>

      {selected && (
        <ContactDetailModal
          contact={selected}
          onClose={() => setSelected(null)}
          onUpdate={handleUpdateContact}
          onDelete={handleDeleteContact}
        />
      )}
    </div>
  );
}
