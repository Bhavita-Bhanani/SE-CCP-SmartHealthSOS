import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');

  // Users state
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Alerts state
  const [alerts, setAlerts] = useState([]);
  const [totalToday, setTotalToday] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const [feedback, setFeedback] = useState('');

  const fetchUsers = useCallback(async (pageNum = 1) => {
    try {
      const res = await axios.get(`/api/admin/users?page=${pageNum}`);
      setUsers(res.data.users);
      setPage(res.data.page);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      setFeedback('Failed to fetch users.');
    }
  }, []);

  const fetchAlerts = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      if (fromDate) params.append('from', fromDate);
      if (toDate) params.append('to', toDate);

      const res = await axios.get(`/api/admin/alerts?${params.toString()}`);
      setAlerts(res.data.alerts);
      setTotalToday(res.data.totalToday || 0);
    } catch (err) {
      setFeedback('Failed to fetch alerts.');
    }
  }, [statusFilter, fromDate, toDate]);

  useEffect(() => {
    fetchUsers(page);
  }, [fetchUsers, page]);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      await axios.patch(`/api/admin/users/${userId}/status`, {
        isActive: !currentStatus,
      });
      setFeedback(`User ${!currentStatus ? 'activated' : 'deactivated'}.`);
      fetchUsers(page);
    } catch (err) {
      setFeedback('Failed to update user status.');
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await axios.patch(`/api/admin/users/${userId}/role`, { role: newRole });
      setFeedback('User role updated.');
      fetchUsers(page);
    } catch (err) {
      setFeedback('Failed to update user role.');
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`/api/admin/users/${userId}`);
      setFeedback('User deleted.');
      fetchUsers(page);
    } catch (err) {
      setFeedback('Failed to delete user.');
    }
  };

  const resolvedCount = alerts.filter((a) => a.status === 'resolved').length;
  const pendingCount = alerts.filter((a) => a.status === 'pending').length;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Admin Control Panel
            </h1>
            <p className="text-sm text-slate-500">
              Manage portal accounts, roles, and system-wide SOS alerts
            </p>
          </div>

          <div className="inline-flex rounded-xl bg-white border border-slate-200 p-1">
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                activeTab === 'users'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              User Management
            </button>
            <button
              onClick={() => setActiveTab('alerts')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                activeTab === 'alerts'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Alert Monitoring
            </button>
          </div>
        </div>

        {feedback && (
          <div className="bg-blue-50 border border-blue-200 text-blue-900 px-4 py-3 rounded-xl text-sm flex items-center justify-between">
            <span>{feedback}</span>
            <button
              onClick={() => setFeedback('')}
              className="text-xs font-bold underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <span className="text-xs font-semibold uppercase text-slate-500">
              Total Alerts Today
            </span>
            <div className="text-3xl font-extrabold text-slate-900 mt-1">
              {totalToday}
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <span className="text-xs font-semibold uppercase text-slate-500">
              Pending Alerts (Filtered)
            </span>
            <div className="text-3xl font-extrabold text-red-600 mt-1">
              {pendingCount}
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <span className="text-xs font-semibold uppercase text-slate-500">
              Resolved Alerts (Filtered)
            </span>
            <div className="text-3xl font-extrabold text-emerald-600 mt-1">
              {resolvedCount}
            </div>
          </div>
        </div>

        {activeTab === 'users' ? (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="py-3.5 px-4">Name</th>
                    <th className="py-3.5 px-4">Email</th>
                    <th className="py-3.5 px-4">Phone</th>
                    <th className="py-3.5 px-4">Role</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((u) => (
                    <tr key={u._id}>
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {u.name}
                      </td>
                      <td className="py-3 px-4 text-slate-600">{u.email}</td>
                      <td className="py-3 px-4 text-slate-600">{u.phone}</td>
                      <td className="py-3 px-4">
                        <select
                          value={u.role}
                          onChange={(e) =>
                            handleRoleChange(u._id, e.target.value)
                          }
                          className="border border-slate-300 rounded-md px-2 py-1 text-xs bg-white capitalize"
                        >
                          <option value="patient">patient</option>
                          <option value="responder">responder</option>
                          <option value="admin">admin</option>
                        </select>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                            u.isActive
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {u.isActive ? 'Active' : 'Deactivated'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => handleToggleStatus(u._id, u.isActive)}
                          className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold"
                        >
                          {u.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(u._id)}
                          className="px-2.5 py-1 rounded bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <span>
                  Page {page} of {totalPages}
                </span>
                <div className="space-x-2">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="px-3 py-1 rounded border border-slate-300 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="px-3 py-1 rounded border border-slate-300 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Filters */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  From Date
                </label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  To Date
                </label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setStatusFilter('');
                    setFromDate('');
                    setToDate('');
                  }}
                  className="w-full py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold"
                >
                  Reset Filters
                </button>
              </div>
            </div>

            {/* Alerts Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500">
                    <tr>
                      <th className="py-3.5 px-4">Patient</th>
                      <th className="py-3.5 px-4">Responder</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4">Created At</th>
                      <th className="py-3.5 px-4">Location</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {alerts.map((a) => (
                      <tr key={a._id}>
                        <td className="py-3 px-4 font-medium text-slate-900">
                          {a.patientId?.name || 'Unknown'}
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          {a.responderId?.name || 'Unassigned'}
                        </td>
                        <td className="py-3 px-4 uppercase text-xs font-semibold">
                          {a.status}
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          {new Date(a.createdAt).toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
                          {a.mapsLink && (
                            <a
                              href={a.mapsLink}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-600 hover:underline text-xs font-semibold"
                            >
                              Open Map
                            </a>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;