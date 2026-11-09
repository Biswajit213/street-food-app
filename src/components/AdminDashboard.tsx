import React, { useState, useEffect } from 'react';
import {
  Shield,
  Users,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Megaphone,
  Check,
  X,
  Search,
  FileText,
  UserX,
  Award
} from 'lucide-react';
import { User, ModerationReport, Announcement } from '../types';

interface AdminDashboardProps {
  currentUser: User;
  onRefreshData: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  onRefreshData,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'reports' | 'users' | 'announcements' | 'rules'>('overview');
  const [stats, setStats] = useState({
    totalMembers: 0,
    totalVendors: 0,
    totalPosts: 0,
    activeDiscussions: 0,
    reportedCount: 0,
    safetyScore: 98,
  });

  const [reports, setReports] = useState<ModerationReport[]>([]);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [userSearch, setUserSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Announcement form
  const [ancTitle, setAncTitle] = useState('');
  const [ancContent, setAncContent] = useState('');
  const [ancCategory, setAncCategory] = useState<'Official' | 'Rule Update' | 'Vendor Alert' | 'Event'>('Official');
  const [ancPinned, setAncPinned] = useState(true);
  const [ancSuccessMsg, setAncSuccessMsg] = useState('');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, reportsRes, usersRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/reports'),
        fetch('/api/admin/users'),
      ]);

      const statsData = await statsRes.json();
      const reportsData = await reportsRes.json();
      const usersData = await usersRes.json();

      if (statsData.success) setStats(statsData.stats);
      if (reportsData.success) setReports(reportsData.reports);
      if (usersData.success) setUsersList(usersData.users);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReportAction = async (reportId: string, action: 'approve' | 'dismiss' | 'delete_post') => {
    try {
      const res = await fetch(`/api/admin/reports/${reportId}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (data.success) {
        setReports(reports.map(r => r.id === reportId ? { ...r, status: action === 'dismiss' ? 'dismissed' : 'resolved' } : r));
        onRefreshData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateUserRole = async (userId: string, newRole: string, isVerified: boolean) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole, isVerifiedVendor: isVerified }),
      });
      const data = await res.json();
      if (data.success) {
        setUsersList(usersList.map(u => u.id === userId ? data.user : u));
        onRefreshData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePublishAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ancTitle || !ancContent) return;

    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: ancTitle,
          content: ancContent,
          category: ancCategory,
          pinned: ancPinned,
          authorName: currentUser.name,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setAncSuccessMsg('Announcement successfully published to community feed!');
        setAncTitle('');
        setAncContent('');
        setTimeout(() => setAncSuccessMsg(''), 4000);
        onRefreshData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredUsers = usersList.filter(u =>
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.username.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.location.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <div className="p-6 bg-slate-900 text-white rounded-2xl shadow-sm border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#FF6B35] uppercase tracking-wider mb-1">
            <Shield className="w-4 h-4" /> Platform Moderation & Safety Center
          </div>
          <h2 className="text-xl font-extrabold">Admin & Moderator Portal</h2>
          <p className="text-xs text-slate-400 mt-1">Logged in as {currentUser.name} ({currentUser.role})</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap gap-1 bg-slate-800/80 p-1 rounded-xl">
          {(['overview', 'reports', 'users', 'announcements', 'rules'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors ${
                activeTab === tab ? 'bg-[#FF6B35] text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 bg-white dark:bg-[#1c1c1f] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-bold text-slate-400 uppercase">Total Platform Members</span>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{stats.totalMembers}</div>
              <span className="text-[11px] text-emerald-500 font-semibold mt-1 block">+12 this week</span>
            </div>
            <div className="p-5 bg-white dark:bg-[#1c1c1f] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-bold text-slate-400 uppercase">Verified Vendors</span>
              <div className="text-2xl font-extrabold text-amber-500 mt-1">{stats.totalVendors}</div>
              <span className="text-[11px] text-slate-400 mt-1 block">Active stall profiles</span>
            </div>
            <div className="p-5 bg-white dark:bg-[#1c1c1f] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-bold text-slate-400 uppercase">Pending Moderation Queue</span>
              <div className="text-2xl font-extrabold text-rose-500 mt-1">{stats.reportedCount}</div>
              <span className="text-[11px] text-rose-400 font-semibold mt-1 block">Requires admin review</span>
            </div>
            <div className="p-5 bg-white dark:bg-[#1c1c1f] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-bold text-slate-400 uppercase">Community Safety Score</span>
              <div className="text-2xl font-extrabold text-emerald-400 mt-1">{stats.safetyScore}%</div>
              <span className="text-[11px] text-emerald-500 font-semibold mt-1 block">High compliance</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Reports Moderation Queue */}
      {activeTab === 'reports' && (
        <div className="bg-white dark:bg-[#1c1c1f] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-500" />
            Reported Content Queue
          </h3>

          {reports.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400">No reported posts in queue.</div>
          ) : (
            <div className="space-y-3">
              {reports.map((rep) => (
                <div key={rep.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-slate-900 dark:text-white">{rep.postTitle}</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        rep.status === 'pending' ? 'bg-rose-100 text-rose-600' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {rep.status}
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300">Reason: {rep.reason}</p>
                    <span className="text-[10px] text-slate-400">Reported by {rep.reporterName} · {rep.timestamp}</span>
                  </div>

                  {rep.status === 'pending' && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleReportAction(rep.id, 'dismiss')}
                        className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-300"
                      >
                        Dismiss
                      </button>
                      <button
                        onClick={() => handleReportAction(rep.id, 'delete_post')}
                        className="px-3 py-1.5 rounded-lg bg-rose-600 text-white font-semibold hover:bg-rose-700"
                      >
                        Delete Post
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Users Management */}
      {activeTab === 'users' && (
        <div className="bg-white dark:bg-[#1c1c1f] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-[#FF6B35]" /> User & Vendor Account Roles
            </h3>

            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {filteredUsers.map((u) => (
              <div key={u.id} className="py-3 flex items-center justify-between text-xs gap-3">
                <div className="flex items-center gap-3">
                  <img src={u.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-900 dark:text-white">{u.name}</span>
                      {u.isVerifiedVendor && <CheckCircle2 className="w-3.5 h-3.5 text-[#FF6B35]" />}
                    </div>
                    <span className="text-[10px] text-slate-400">@{u.username} · {u.location}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={u.role}
                    onChange={(e) => handleUpdateUserRole(u.id, e.target.value, u.isVerifiedVendor)}
                    className="px-2 py-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-xs font-semibold"
                  >
                    <option value="Member">Member</option>
                    <option value="Vendor">Vendor</option>
                    <option value="Moderator">Moderator</option>
                    <option value="Admin">Admin</option>
                  </select>

                  <button
                    onClick={() => handleUpdateUserRole(u.id, u.role, !u.isVerifiedVendor)}
                    className={`px-2.5 py-1 rounded text-[11px] font-semibold border ${
                      u.isVerifiedVendor ? 'border-amber-400 bg-amber-50 text-amber-600' : 'border-slate-200 text-slate-500'
                    }`}
                  >
                    {u.isVerifiedVendor ? 'Verified' : 'Verify Vendor'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Official Announcements */}
      {activeTab === 'announcements' && (
        <div className="bg-white dark:bg-[#1c1c1f] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-[#FF6B35]" /> Publish Official Community Announcement
          </h3>

          {ancSuccessMsg && (
            <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-semibold flex items-center gap-2">
              <Check className="w-4 h-4" /> {ancSuccessMsg}
            </div>
          )}

          <form onSubmit={handlePublishAnnouncement} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Announcement Title</label>
              <input
                type="text"
                required
                placeholder="e.g. City Council Approves Vendor Permit Extensions"
                value={ancTitle}
                onChange={(e) => setAncTitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Announcement Content</label>
              <textarea
                required
                rows={4}
                placeholder="Details of official announcement or guideline change..."
                value={ancContent}
                onChange={(e) => setAncContent(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={ancPinned}
                  onChange={(e) => setAncPinned(e.target.checked)}
                  className="w-4 h-4 text-[#FF6B35]"
                />
                <span>Pin to Top of Community Feed</span>
              </label>

              <button
                type="submit"
                className="px-5 py-2 bg-[#FF6B35] text-white font-bold rounded-xl hover:bg-[#e05a2b]"
              >
                Publish Announcement
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 5: Community Rules */}
      {activeTab === 'rules' && (
        <div className="bg-white dark:bg-[#1c1c1f] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 text-xs">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">StreetBites Community Guidelines</h3>
          <div className="space-y-3 text-slate-700 dark:text-slate-300">
            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <strong className="text-slate-900 dark:text-white block mb-1">1. Respectful Vendor Collaboration</strong>
              Keep discussions constructive. We are all small business owners navigating tough daily challenges.
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <strong className="text-slate-900 dark:text-white block mb-1">2. Transparent Ingredient Pricing</strong>
              Report accurate daily prices at your local city wholesalers without intentional exaggeration.
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <strong className="text-slate-900 dark:text-white block mb-1">3. Clear Labeling for Supplier Affiliates</strong>
              Any post promoting equipment or ingredient suppliers must include #Sponsored.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
