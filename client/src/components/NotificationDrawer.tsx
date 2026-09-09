import React, { useState } from 'react';
import { Bell, X, CheckCheck, AlertCircle, Clock } from 'lucide-react';

export interface PlatformNotification {
  id: string;
  category: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: PlatformNotification[];
  onMarkAllRead: () => void;
  onNotificationClick: (id: string) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
  onNotificationClick,
}) => {
  const [filter, setFilter] = useState<'ALL' | 'UNREAD'>('ALL');

  if (!isOpen) return null;

  const filtered = notifications.filter((n) => (filter === 'UNREAD' ? !n.read : true));
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl p-6 flex flex-col justify-between">
          <div className="space-y-4 overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-red-100 text-red-600 rounded-xl">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Notifications</h2>
                  <span className="text-xs text-slate-500">
                    {unreadCount} unread emergency {unreadCount === 1 ? 'alert' : 'alerts'}
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center justify-between">
              <div className="inline-flex p-1 bg-slate-100 rounded-xl">
                <button
                  onClick={() => setFilter('ALL')}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                    filter === 'ALL'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All ({notifications.length})
                </button>
                <button
                  onClick={() => setFilter('UNREAD')}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                    filter === 'UNREAD'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Unread ({unreadCount})
                </button>
              </div>

              {unreadCount > 0 && (
                <button
                  onClick={onMarkAllRead}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  Mark all read
                </button>
              )}
            </div>

            {/* Notification List */}
            <div className="space-y-2 pt-2">
              {filtered.length === 0 ? (
                <div className="text-center py-12 text-slate-400 space-y-2">
                  <Bell className="w-8 h-8 mx-auto opacity-30" />
                  <p className="text-sm font-medium">No notifications in this view</p>
                </div>
              ) : (
                filtered.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onNotificationClick(item.id)}
                    className={`p-3.5 rounded-xl border transition cursor-pointer flex items-start space-x-3 ${
                      item.read
                        ? 'bg-white border-slate-200 hover:bg-slate-50'
                        : 'bg-red-50/50 border-red-200 hover:bg-red-50'
                    }`}
                  >
                    <div
                      className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                        item.read ? 'bg-slate-100 text-slate-500' : 'bg-red-100 text-red-600'
                      }`}
                    >
                      <AlertCircle className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-xs font-bold text-slate-900 truncate">
                          {item.title}
                        </h4>
                        {!item.read && (
                          <span className="w-2 h-2 rounded-full bg-red-600 shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-2">{item.message}</p>
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-2">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
