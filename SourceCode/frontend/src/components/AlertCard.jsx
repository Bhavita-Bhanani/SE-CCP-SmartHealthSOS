import React from 'react';

const statusStyles = {
  pending: 'bg-red-100 text-red-800 border-red-200',
  'in-progress': 'bg-amber-100 text-amber-800 border-amber-200',
  resolved: 'bg-emerald-100 text-emerald-800 border-emerald-200',
};

const AlertCard = ({
  alert,
  onAccept,
  onResolve,
  onViewProfile,
  actionLoading,
}) => {
  const patientName =
    alert.patientId?.name || alert.patientName || 'Unknown Patient';
  const patientPhone =
    alert.patientId?.phone || alert.patientPhone || 'N/A';
  const patientUserId = alert.patientId?._id || alert.patientId;
  const createdTime = new Date(
    alert.createdAt || alert.timestamp
  ).toLocaleString();

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between gap-4">
      <div>
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {patientName}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Phone: <span className="font-medium text-slate-700">{patientPhone}</span>
            </p>
          </div>
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full border uppercase ${
              statusStyles[alert.status] || 'bg-slate-100 text-slate-700'
            }`}
          >
            {alert.status}
          </span>
        </div>

        <div className="mt-3 space-y-1.5 text-sm text-slate-600">
          <div>
            <span className="font-medium text-slate-700">Time:</span>{' '}
            {createdTime}
          </div>
          <div>
            <span className="font-medium text-slate-700">Coordinates:</span>{' '}
            {Number(alert.latitude).toFixed(4)},{' '}
            {Number(alert.longitude).toFixed(4)}
          </div>
          {alert.bloodType && (
            <div>
              <span className="font-medium text-slate-700">Blood Type:</span>{' '}
              <span className="font-bold text-red-600">{alert.bloodType}</span>
            </div>
          )}
          {alert.allergies?.length > 0 && (
            <div>
              <span className="font-medium text-slate-700">Allergies:</span>{' '}
              {alert.allergies.join(', ')}
            </div>
          )}
          {alert.responderId?.name && (
            <div>
              <span className="font-medium text-slate-700">Responder:</span>{' '}
              {alert.responderId.name}
            </div>
          )}
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
        {alert.mapsLink && (
          <a
            href={alert.mapsLink}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold transition"
          >
            Open Maps
          </a>
        )}

        {onViewProfile && patientUserId && (
          <button
            type="button"
            onClick={() => onViewProfile(patientUserId, patientName)}
            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition"
          >
            Health Profile
          </button>
        )}

        {alert.status === 'pending' && onAccept && (
          <button
            type="button"
            disabled={actionLoading}
            onClick={() => onAccept(alert._id || alert.alertId)}
            className="ml-auto px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white text-xs font-semibold transition"
          >
            Accept Alert
          </button>
        )}

        {alert.status === 'in-progress' && onResolve && (
          <button
            type="button"
            disabled={actionLoading}
            onClick={() => onResolve(alert._id || alert.alertId)}
            className="ml-auto px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-semibold transition"
          >
            Mark Resolved
          </button>
        )}
      </div>
    </div>
  );
};

export default AlertCard;