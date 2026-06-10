import React from 'react';
import { Bell, AlertTriangle, CheckCircle, Flame } from 'lucide-react';
import { Notification } from '../../../types';

interface StatsProps {
  notifications: Notification[];
}

export default function NotificationStats({ notifications }: StatsProps) {
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const criticalCount = notifications.filter((n) => n.severity === 'critical' && !n.isRead).length;
  const warningsCount = notifications.filter((n) => n.severity === 'warning' && !n.isRead).length;
  const totalCount = notifications.length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* KPI 1: Unread Alerts */}
      <div id="kpi-unread" className="sys-card-base hover:shadow-md transition-all duration-300">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h5 className="sys-kpi-label">Unread Alerts</h5>
            <div className="sys-kpi-value select-none mt-1">{unreadCount}</div>
          </div>
          <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
            <Bell size={22} className={unreadCount > 0 ? "animate-bounce" : ""} />
          </div>
        </div>
        <p className="sys-kpi-desc">Across all operational nodes</p>
      </div>

      {/* KPI 2: Action Required */}
      <div id="kpi-critical" className="sys-card-base hover:shadow-md transition-all duration-300">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h5 className="sys-kpi-label">Critical Alerts</h5>
            <div className="sys-kpi-value text-red-650 mt-1 select-none">{criticalCount}</div>
          </div>
          <div className="p-3 bg-red-50 rounded-xl text-red-500">
            <Flame size={22} className={criticalCount > 0 ? "animate-pulse" : ""} />
          </div>
        </div>
        <p className="sys-kpi-desc">Require immediate attention</p>
      </div>

      {/* KPI 3: Warnings Pending */}
      <div id="kpi-warnings" className="sys-card-base hover:shadow-md transition-all duration-300">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h5 className="sys-kpi-label">Active Warnings</h5>
            <div className="sys-kpi-value text-amber-600 mt-1 select-none">{warningsCount}</div>
          </div>
          <div className="p-3 bg-amber-50 rounded-xl text-amber-500">
            <AlertTriangle size={22} />
          </div>
        </div>
        <p className="sys-kpi-desc">Medium severity cautions</p>
      </div>

      {/* KPI 4: Total Documented logs */}
      <div id="kpi-total" className="sys-card-base hover:shadow-md transition-all duration-300">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h5 className="sys-kpi-label">Archived Event Logs</h5>
            <div className="sys-kpi-value text-slate-700 mt-1 select-none">{totalCount}</div>
          </div>
          <div className="p-3 bg-teal-50 rounded-xl text-teal-600">
            <CheckCircle size={22} />
          </div>
        </div>
        <p className="sys-kpi-desc">Total historic traces in database</p>
      </div>
    </div>
  );
}
