import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import Navbar from '../components/Navbar';
import AlertCard from '../components/AlertCard';
import { useAuth, API_BASE_URL } from '../context/AuthContext';

const ResponderDashboard = () => {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);
  const [liveBanner, setLiveBanner] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Modal state for viewing patient health profile
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [profileModalTitle, setProfileModalTitle] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);

  const fetchActiveAlerts = useCallback(async () => {
    try {
      const res = await axios.get('/api/alerts/active');
      setAlerts(res.data);
    } catch (err) {
      setErrorMsg('Failed to load active alerts.');
    }
  }, []);

  useEffect(() => {
    fetchActiveAlerts();

    const socket = io(API_BASE_URL);

    socket.on('connect', () => {
      setSocketConnected(true);
      socket.emit('join-responder-room');
    });

    socket.on('disconnect', () => {
      setSocketConnected(false);
    });

    socket.on('new-alert', (payload) => {
      setLiveBanner(
        `NEW SOS ALERT from ${payload.patientName} (Blood Type: ${payload.bloodType})`
      );
      fetchActiveAlerts();
    });

    socket.on('alert-updated', () => {
      fetchActiveAlerts();
    });

    return () => socket.disconnect();
  }, [fetchActiveAlerts]);

  const handleAccept = async (alertId) => {
    setActionLoading(true);
    setErrorMsg('');
    try {
      await axios.patch(`/api/alerts/${alertId}/accept`);
      await fetchActiveAlerts();
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message || 'Unable to accept alert (may already be taken).'
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleResolve = async (alertId) => {
    setActionLoading(true);
    setErrorMsg('');
    try {
      await axios.patch(`/api/alerts/${alertId}/resolve`);
      await fetchActiveAlerts();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Unable to resolve alert.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleViewProfile = async (patientUserId, patientName) => {
    setProfileModalTitle(patientName);
    setSelectedProfile(null);
    setProfileLoading(true);
    try {
      const res = await axios.get(`/api/health/patient/${patientUserId}`);
      setSelectedProfile(res.data);
    } catch (err) {
      setSelectedProfile({ notFound: true });
    } finally {
      setProfileLoading(false);
    }
  };

  const pendingAlerts = alerts.filter((a) => a.status === 'pending');
  const myCases = alerts.filter(
    (a) =>
      a.status === 'in-progress' &&
      (a.responderId?._id === user?._id || a.responderId === user?._id)
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar socketConnected={socketConnected} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {liveBanner && (
          <div className="bg-red-600 text-white px-5 py-3.5 rounded-xl shadow-md flex items-center justify-between">
            <span className="font-bold text-sm">{liveBanner}</span>
            <button
              onClick={() => setLiveBanner(null)}
              className="text-xs bg-red-800 hover:bg-red-900 px-2.5 py-1 rounded"
            >
              Dismiss
            </button>
          </div>
        )}

        {errorMsg && (
          <div className="bg-amber-50 border border-amber-200 text-amber-900 px-4 py-3 rounded-xl text-sm">
            {errorMsg}
          </div>
        )}

        {/* Incoming Pending Alerts */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900">
              Incoming SOS Alerts ({pendingAlerts.length})
            </h2>
            <button
              onClick={fetchActiveAlerts}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100"
            >
              Refresh
            </button>
          </div>

          {pendingAlerts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-sm text-slate-500">
              No pending SOS alerts right now. Listening for real-time alerts...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {pendingAlerts.map((alert) => (
                <AlertCard
                  key={alert._id}
                  alert={alert}
                  onAccept={handleAccept}
                  onViewProfile={handleViewProfile}
                  actionLoading={actionLoading}
                />
              ))}
            </div>
          )}
        </section>

        {/* Responder Active Cases */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            My Active Cases ({myCases.length})
          </h2>

          {myCases.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-sm text-slate-500">
              You have no active cases in progress.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {myCases.map((alert) => (
                <AlertCard
                  key={alert._id}
                  alert={alert}
                  onResolve={handleResolve}
                  onViewProfile={handleViewProfile}
                  actionLoading={actionLoading}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Patient Health Profile Modal */}
      {(profileLoading || selectedProfile) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-lg text-slate-900">
                Health Profile: {profileModalTitle}
              </h3>
              <button
                onClick={() => setSelectedProfile(null)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            {profileLoading ? (
              <p className="text-sm text-slate-500">Loading medical record...</p>
            ) : selectedProfile?.notFound ? (
              <p className="text-sm text-slate-600">
                This patient has not created a health profile yet.
              </p>
            ) : (
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-semibold text-slate-700">
                    Blood Type:{' '}
                  </span>
                  <span className="font-bold text-red-600">
                    {selectedProfile.bloodType}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-slate-700">
                    Allergies:{' '}
                  </span>
                  {selectedProfile.allergies?.join(', ') || 'None'}
                </div>
                <div>
                  <span className="font-semibold text-slate-700">
                    Chronic Conditions:{' '}
                  </span>
                  {selectedProfile.chronicConditions?.join(', ') || 'None'}
                </div>
                <div>
                  <span className="font-semibold text-slate-700">
                    Medications:{' '}
                  </span>
                  {selectedProfile.medications?.join(', ') || 'None'}
                </div>
                <div>
                  <span className="font-semibold text-slate-700 block mb-1">
                    Emergency Contacts:
                  </span>
                  {selectedProfile.emergencyContacts?.length ? (
                    <ul className="space-y-1 text-xs bg-slate-50 p-3 rounded-lg">
                      {selectedProfile.emergencyContacts.map((c, idx) => (
                        <li key={idx}>
                          <strong>{c.name}</strong> ({c.relationship || 'Contact'}
                          ): {c.phone}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-slate-500">None listed</span>
                  )}
                </div>
              </div>
            )}

            <button
              onClick={() => setSelectedProfile(null)}
              className="w-full py-2 rounded-lg bg-slate-900 text-white text-sm font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResponderDashboard;