import React, { useState } from 'react';
import axios from 'axios';

const SOSButton = ({ onAlertSent }) => {
  const [sending, setSending] = useState(false);
  const [showManualForm, setShowManualForm] = useState(false);
  const [manualLat, setManualLat] = useState('24.8607');
  const [manualLng, setManualLng] = useState('67.0011');
  const [feedback, setFeedback] = useState(null);

  const dispatchSOS = async (latitude, longitude) => {
    setSending(true);
    setFeedback(null);
    const startTime = performance.now();

    try {
      const res = await axios.post('/api/alerts', {
        latitude: Number(latitude),
        longitude: Number(longitude),
      });
      const elapsedSec = ((performance.now() - startTime) / 1000).toFixed(2);
      setFeedback({
        type: 'success',
        message: `SOS Sent Successfully in ${elapsedSec}s! Responders have been notified with your GPS coordinates (${Number(
          latitude
        ).toFixed(4)}, ${Number(longitude).toFixed(4)}).`,
        mapsLink: res.data?.alert?.mapsLink,
      });
      setShowManualForm(false);
      if (onAlertSent) onAlertSent(res.data.alert);
    } catch (err) {
      setFeedback({
        type: 'error',
        message:
          err.response?.data?.message ||
          'Failed to dispatch SOS alert. Please try again.',
      });
    } finally {
      setSending(false);
    }
  };

  const handleSOSClick = () => {
    setFeedback(null);

    if (!navigator.geolocation) {
      setShowManualForm(true);
      setFeedback({
        type: 'warning',
        message:
          'Geolocation is not supported by your browser. Enter or confirm coordinates below.',
      });
      return;
    }

    setSending(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        dispatchSOS(position.coords.latitude, position.coords.longitude);
      },
      () => {
        setSending(false);
        setShowManualForm(true);
        setFeedback({
          type: 'warning',
          message:
            'GPS permission denied or unavailable. Confirm or enter your coordinates below to send SOS.',
        });
      },
      { enableHighAccuracy: true, timeout: 6000 }
    );
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualLat || !manualLng) return;
    dispatchSOS(manualLat, manualLng);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col items-center text-center">
      <h2 className="text-xl font-bold text-slate-900">
        Emergency SOS Dispatch
      </h2>
      <p className="text-sm text-slate-500 mt-1 max-w-md">
        Press the SOS button to immediately share your live GPS coordinates and
        medical summary with all active responders.
      </p>

      <div className="my-8">
        <button
          type="button"
          onClick={handleSOSClick}
          disabled={sending}
          aria-label="Send Emergency SOS Alert"
          className="sos-pulse w-36 h-36 rounded-full bg-red-600 hover:bg-red-700 active:scale-95 disabled:opacity-60 text-white font-extrabold text-3xl tracking-wider shadow-xl transition flex flex-col items-center justify-center focus:outline-none focus:ring-4 focus:ring-red-300"
        >
          <span>{sending ? '...' : 'SOS'}</span>
          <span className="text-xs font-medium tracking-normal mt-1 uppercase">
            {sending ? 'Sending' : 'Tap for Help'}
          </span>
        </button>
      </div>

      {feedback && (
        <div
          className={`w-full max-w-lg rounded-xl p-4 text-sm text-left mb-4 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
              : feedback.type === 'warning'
              ? 'bg-amber-50 border border-amber-200 text-amber-900'
              : 'bg-red-50 border border-red-200 text-red-900'
          }`}
        >
          <p className="font-medium">{feedback.message}</p>
          {feedback.mapsLink && (
            <a
              href={feedback.mapsLink}
              target="_blank"
              rel="noreferrer"
              className="inline-block mt-2 text-emerald-700 underline font-semibold"
            >
              Open Shared Google Maps Location →
            </a>
          )}
        </div>
      )}

      {showManualForm && (
        <form
          onSubmit={handleManualSubmit}
          className="w-full max-w-lg bg-slate-50 border border-slate-200 rounded-xl p-4 text-left space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-800">
              Manual Location Fallback
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setManualLat('24.8607');
                  setManualLng('67.0011');
                }}
                className="text-xs px-2 py-1 bg-white border border-slate-300 rounded hover:bg-slate-100"
              >
                Karachi Preset
              </button>
              <button
                type="button"
                onClick={() => {
                  setManualLat('24.9339');
                  setManualLng('67.1116');
                }}
                className="text-xs px-2 py-1 bg-white border border-slate-300 rounded hover:bg-slate-100"
              >
                NED/TIEST Preset
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Latitude
              </label>
              <input
                type="number"
                step="any"
                required
                value={manualLat}
                onChange={(e) => setManualLat(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Longitude
              </label>
              <input
                type="number"
                step="any"
                required
                value={manualLng}
                onChange={(e) => setManualLng(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={sending}
            className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold"
          >
            Send SOS with Manual Coordinates
          </button>
        </form>
      )}
    </div>
  );
};

export default SOSButton;