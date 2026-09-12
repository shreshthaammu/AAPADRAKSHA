import React, { useState } from "react";
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Trash2,
  CheckCheck
} from "lucide-react";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  unread: boolean;
  type: "CRITICAL" | "ALERT" | "INFO";
}

interface NotificationsPageProps {
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
  onClearAll: () => void;
  onToggleRead: (id: string) => void;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({
  notifications,
  onMarkAllRead,
  onClearAll,
  onToggleRead
}) => {
  const [filter, setFilter] = useState<"ALL" | "UNREAD">("ALL");

  const filtered = notifications.filter(n => (filter === "UNREAD" ? n.unread : true));

  return (
    <div id="notifications-page" className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Emergency Alerts & Notifications Center
            </h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
              {notifications.filter(n => n.unread).length} Unread
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Automated civil defense dispatches, radar cloud alerts, and shelter status updates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onMarkAllRead}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors"
          >
            <CheckCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>Mark All Read</span>
          </button>
          <button
            onClick={onClearAll}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-red-50 hover:text-red-600 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 text-xs">
        <button
          onClick={() => setFilter("ALL")}
          className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
            filter === "ALL"
              ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
          }`}
        >
          All Notifications ({notifications.length})
        </button>
        <button
          onClick={() => setFilter("UNREAD")}
          className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
            filter === "UNREAD"
              ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
          }`}
        >
          Unread Only ({notifications.filter(n => n.unread).length})
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <h3 className="font-bold text-slate-800 dark:text-slate-200">No new alerts</h3>
            <p className="text-xs text-slate-400 mt-1">You are up to date on all disaster bulletins.</p>
          </div>
        ) : (
          filtered.map(item => {
            const isCrit = item.type === "CRITICAL";

            return (
              <div
                key={item.id}
                onClick={() => onToggleRead(item.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                  item.unread
                    ? isCrit
                      ? "bg-red-50/70 dark:bg-red-950/30 border-red-300 dark:border-red-900 ring-1 ring-red-500/20"
                      : "bg-blue-50/50 dark:bg-blue-950/20 border-blue-300 dark:border-blue-900"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-75"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2.5 rounded-xl shrink-0 ${
                      isCrit
                        ? "bg-red-600 text-white"
                        : "bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400"
                    }`}
                  >
                    {isCrit ? <ShieldAlert className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                        {item.title}
                      </h4>
                      {item.unread && (
                        <span className="w-2 h-2 rounded-full bg-blue-600" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                      {item.message}
                    </p>
                    <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                      {item.time}
                    </span>
                  </div>
                </div>

                <button
                  onClick={e => {
                    e.stopPropagation();
                    onToggleRead(item.id);
                  }}
                  className="text-xs text-slate-400 hover:text-blue-600 shrink-0 font-semibold"
                >
                  {item.unread ? "Mark Read" : "Unread"}
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
