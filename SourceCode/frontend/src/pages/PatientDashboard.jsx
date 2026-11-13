import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';
import Navbar from '../components/Navbar';
import SOSButton from '../components/SOSButton';
import { API_BASE_URL } from '../context/AuthContext';

const PatientDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [profileRes, alertsRes] = await Promise.allSettled([
        axios.get('/api/health'),
        axios.get('/api/alerts/mine'),
      ]);

      if (profileRes.status === 'fulfilled') {
        setProfile(profileRes.value.data);
      } else {
        setProfile(null);
      }

      if (alertsRes.status === 'fulfilled') {
        setAlerts(alertsRes.value.data);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();

    const socket = io(API_BASE_URL);
    socket.on('alert-updated', ({ alertId, status }) => {
      setAlerts((prev) =>
        prev.map((a) => (a._id === alertId ? { ...a, status } : a))
      );
    });

    return () => socket.disconnect();
  }, [fetchData]);

  const statusBadge = {
    pending: 'bg-red-100 text-red-800',
    'in-progress': 'bg-amber-100 text-amber-800',
    resolved: 'bg-emerald-100 text-emerald-800',
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* SOS Dispatch Card */}
          <div className="lg:col-span-2">
            <SOSButton onAlertSent={() => fetchData()} />
          </div>

          {/* Health Profile & Emergency Contacts Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900">My Health Profile</h3>
                <Link
                  to="/health-profile"
                  className="text-xs font-semibold text-red-600 hover:underline"
                >
                  {profile ? 'Edit Profile' : 'Create Profile'}
                </Link>
              </div>

              {loading ? (
                <p className="text-sm text-slate-500">Loading profile...</p>
              ) : profile ? (
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500">Blood Type</span>
                    <span className="font-bold text-red-600 text-base">
                      {profile.bloodType}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-xs uppercase font-semibold">
                      Allergies
                    </span>
                    <p className="text-slate-800 mt-0.5">
                      {profile.allergies?.length
                        ? profile.allergies.join(', ')
                        : 'None listed'}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-xs uppercase font-semibold">
                      Chronic Conditions
                    </span>
                    <p className="text-slate-800 mt-0.5">
                      {profile.chronicConditions?.length
                        ? profile.chronicConditions.join(', ')
                        : 'None listed'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-slate-600">
                  <p className="mb-3">
                    No health profile saved yet. Add your blood type and
                    allergies so responders can assist you faster.
                  </p>
                  <Link
                    to="/health-profile"
                    className="inline-block px-4 py-2 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-700"
                  >
                    Set Up Health Profile
                  </Link>
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-slate-900">
                  Emergency Contacts ({profile?.emergencyContacts?.length || 0}/5)
                </h3>
                <Link
                  to="/health-profile"
                  className="text-xs font-semibold text-red-600 hover:underline"
                >
                  Manage
                </Link>
              </div>

              {profile?.emergencyContacts?.length > 0 ? (
                <ul className="divide-y divide-slate-100 text-sm">
                  {profile.emergencyContacts.map((c) => (
                    <li
                      key={c._id}
                      className="py-2 flex items-center justify-between"
                    >
                      <div>
                        <div className="font-medium text-slate-800">
                          {c.name}
                        </div>
                        <div className="text-xs text-slate-500">
                          {c.relationship || 'Contact'}
                        </div>
                      </div>
                      <span className="text-xs font-mono text-slate-700">
                        {c.phone}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-500">
                  No emergency contacts added yet.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Alert History Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="font-bold text-slate-900 mb-4">My SOS Alert History</h3>

          {alerts.length === 0 ? (
            <p className="text-sm text-slate-500">
              You have not triggered any SOS alerts yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
                    <th className="py-3 px-4">Date &amp; Time</th>
                    <th className="py-3 px-4">Coordinates</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Map</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {alerts.map((alert) => (
                    <tr key={alert._id}>
                      <td className="py-3 px-4 text-slate-700">
                        {new Date(alert.createdAt).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 font-mono text-xs text-slate-600">
                        {Number(alert.latitude).toFixed(4)},{' '}
                        {Number(alert.longitude).toFixed(4)}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase ${
                            statusBadge[alert.status] ||
                            'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {alert.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {alert.mapsLink && (
                          <a
                            href={alert.mapsLink}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 hover:underline text-xs font-semibold"
                          >
                            View Location
                          </a>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PatientDashboard;