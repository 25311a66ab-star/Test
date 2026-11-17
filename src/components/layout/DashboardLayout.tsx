import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  BarChart3,
  Bell,
  FileText,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Menu,
  Search,
  Settings,
  Sparkles,
  Users,
  X,
} from 'lucide-react';
import { BrandLogo } from '../ui/Primitives';
import { useApp } from '../../context/AppContext';
import { dataProvider } from '../../lib/data/provider';
import type { DateRangeKey, NotificationItem } from '../../lib/data/types';

const SIDEBAR_ITEMS = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard, exact: true },
  { to: '/dashboard/insights', label: 'AI Insights', icon: Sparkles },
  { to: '/dashboard/competitors', label: 'Competitors', icon: Users },
  { to: '/dashboard/campaigns', label: 'Campaigns', icon: Megaphone },
  { to: '/dashboard/reports', label: 'Reports', icon: FileText },
  { to: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, dateRange, setDateRange, globalSearch, setGlobalSearch, logout } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    dataProvider.getNotifications().then(setNotifications);
  }, [location.pathname]);

  const unreadCount = notifications.filter((n) => !n.readAt).length;

  const handleMarkAllRead = async () => {
    await dataProvider.markAllNotificationsRead();
    const updated = await dataProvider.getNotifications();
    setNotifications(updated);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const SidebarNav = ({ onNavigate }: { onNavigate?: () => void }) => (
    <div className="flex flex-col h-full">
      <div className="h-16 px-5 flex items-center justify-between border-b border-[#EEF0F4]">
        <Link to="/" onClick={onNavigate}>
          <BrandLogo size="sm" />
        </Link>
        {onNavigate && (
          <button
            type="button"
            onClick={onNavigate}
            className="lg:hidden p-1.5 rounded-lg text-[#4B5563] hover:bg-[#F8F9FB]"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <nav aria-label="Dashboard navigation" className="flex-1 p-3 space-y-1">
        {SIDEBAR_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = item.exact
            ? location.pathname === item.to
            : location.pathname.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? 'bg-[#E11D2E] text-white shadow-sm'
                  : 'text-[#4B5563] hover:text-[#0F1115] hover:bg-[#F8F9FB]'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#EEF0F4]">
        <div className="rounded-lg bg-[#F8F9FB] border border-[#EEF0F4] p-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#0F1115]">
            <BarChart3 className="w-4 h-4 text-[#E11D2E]" />
            <span>Demo Workspace</span>
          </div>
          <p className="text-xs text-[#4B5563] mt-1">
            Synthetic 90-day dataset active. Connect live APIs in production.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 bg-white border-r border-[#EEF0F4] fixed inset-y-0 left-0 z-30 no-print">
        <SidebarNav />
      </aside>

      {/* Mobile Sidebar Sheet */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex no-print">
          <div
            className="fixed inset-0 bg-[#0F1115]/40"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <aside className="relative w-64 max-w-[80vw] bg-white h-full shadow-xl z-10">
            <SidebarNav onNavigate={() => setMobileMenuOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main Content Wrapper */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Global Demo Mode Banner */}
        <div className="bg-[#0F1115] text-white px-4 py-1.5 text-xs flex items-center justify-between gap-4 no-print">
          <span className="truncate">
            Demo Data — not connected to live social accounts. Deterministic 90-day dataset for evaluation.
          </span>
          <Link to="/business" className="text-[#FFA24D] hover:underline whitespace-nowrap shrink-0">
            View Venture Financials
          </Link>
        </div>

        {/* Top Bar */}
        <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-[#EEF0F4] h-16 px-4 sm:px-6 flex items-center justify-between gap-4 no-print">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg text-[#0F1115] hover:bg-[#F8F9FB]"
              aria-label="Open navigation"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="relative max-w-xs w-full hidden sm:block">
              <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                placeholder="Search campaigns, competitors..."
                aria-label="Search workspace"
                className="w-full h-9 pl-9 pr-3 text-sm bg-[#F8F9FB] border border-[#E1E5EB] rounded-lg focus:bg-white focus:border-[#E11D2E] focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Date Range Filter */}
            <div
              role="group"
              aria-label="Date range filter"
              className="flex items-center bg-[#F8F9FB] border border-[#E1E5EB] rounded-lg p-0.5"
            >
              {(['7d', '30d', '90d'] as DateRangeKey[]).map((range) => (
                <button
                  key={range}
                  type="button"
                  onClick={() => setDateRange(range)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                    dateRange === range
                      ? 'bg-white text-[#0F1115] shadow-sm font-semibold'
                      : 'text-[#4B5563] hover:text-[#0F1115]'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setNotifOpen((v) => !v);
                  setProfileOpen(false);
                }}
                className="relative p-2 rounded-lg text-[#4B5563] hover:text-[#0F1115] hover:bg-[#F8F9FB]"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-[#E11D2E] text-white text-[10px] font-bold flex items-center justify-center tabular-nums">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl border border-[#E1E5EB] shadow-lg p-3 z-40">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#EEF0F4]">
                    <span className="text-xs font-bold text-[#0F1115]">Notifications</span>
                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={handleMarkAllRead}
                        className="text-xs text-[#2563EB] hover:underline"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="space-y-2 max-h-72 overflow-y-auto">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-2.5 rounded-lg text-xs ${
                          n.readAt ? 'bg-white' : 'bg-[#F8F9FB] border border-[#EEF0F4]'
                        }`}
                      >
                        <p className="font-semibold text-[#0F1115]">{n.title}</p>
                        <p className="text-[#4B5563] mt-0.5">{n.body}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Avatar Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setProfileOpen((v) => !v);
                  setNotifOpen(false);
                }}
                className="flex items-center gap-2 p-1 pr-2 rounded-lg hover:bg-[#F8F9FB]"
                aria-label="Account menu"
              >
                <span className="w-8 h-8 rounded-lg bg-brand-gradient text-white text-xs font-bold flex items-center justify-center">
                  {user?.avatarInitials ?? 'NR'}
                </span>
                <span className="hidden md:block text-xs font-semibold text-[#0F1115] max-w-[110px] truncate">
                  {user?.fullName ?? 'Demo User'}
                </span>
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl border border-[#E1E5EB] shadow-lg p-1.5 z-40">
                  <div className="px-3 py-2 border-b border-[#EEF0F4]">
                    <p className="text-xs font-bold text-[#0F1115] truncate">{user?.fullName}</p>
                    <p className="text-[11px] text-[#4B5563] truncate">{user?.email}</p>
                  </div>
                  <Link
                    to="/dashboard/settings"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs text-[#0F1115] hover:bg-[#F8F9FB] rounded-lg mt-1"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    Workspace Settings
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#DC2626] hover:bg-[#FEF2F2] rounded-lg"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1440px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
