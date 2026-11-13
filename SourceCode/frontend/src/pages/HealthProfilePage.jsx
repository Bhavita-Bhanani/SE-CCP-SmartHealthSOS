import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const BLOOD_TYPES = [
  'Unknown',
  'A+',
  'A-',
  'B+',
  'B-',
  'AB+',
  'AB-',
  'O+',
  'O-',
];

const HealthProfilePage = () => {
  const [bloodType, setBloodType] = useState('Unknown');
  const [allergiesText, setAllergiesText] = useState('');
  const [conditionsText, setConditionsText] = useState('');
  const [medicationsText, setMedicationsText] = useState('');
  const [contacts, setContacts] = useState([]);
  const [hasProfile, setHasProfile] = useState(false);

  const [contactForm, setContactForm] = useState({
    name: '',
    phone: '',
    relationship: '',
  });

  const [statusMsg, setStatusMsg] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await axios.get('/api/health');
        const p = res.data;
        setHasProfile(true);
        setBloodType(p.bloodType || 'Unknown');
        setAllergiesText((p.allergies || []).join(', '));
        setConditionsText((p.chronicConditions || []).join(', '));
        setMedicationsText((p.medications || []).join(', '));
        setContacts(p.emergencyContacts || []);
      } catch (err) {
        if (err.response?.status !== 404) {
          setStatusMsg({
            type: 'error',
            text: 'Failed to load health profile.',
          });
        }
      }
    };
    loadProfile();
  }, []);

  const parseCommaList = (str) =>
    str
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatusMsg(null);
    try {
      const res = await axios.put('/api/health', {
        bloodType,
        allergies: parseCommaList(allergiesText),
        chronicConditions: parseCommaList(conditionsText),
        medications: parseCommaList(medicationsText),
      });
      setHasProfile(true);
      setContacts(res.data.profile.emergencyContacts || []);
      setStatusMsg({ type: 'success', text: 'Health profile saved successfully.' });
    } catch (err) {
      setStatusMsg({
        type: 'error',
        text: err.response?.data?.message || 'Could not save health profile.',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAddContact = async (e) => {
    e.preventDefault();
    setStatusMsg(null);
    try {
      // Auto-create base health profile if patient adds contact first
      if (!hasProfile) {
        await axios.put('/api/health', {
          bloodType,
          allergies: parseCommaList(allergiesText),
          chronicConditions: parseCommaList(conditionsText),
          medications: parseCommaList(medicationsText),
        });
        setHasProfile(true);
      }

      const res = await axios.post('/api/health/contacts', contactForm);
      setContacts(res.data.contacts);
      setContactForm({ name: '', phone: '', relationship: '' });
      setStatusMsg({ type: 'success', text: 'Emergency contact added.' });
    } catch (err) {
      setStatusMsg({
        type: 'error',
        text: err.response?.data?.message || 'Failed to add contact.',
      });
    }
  };

  const handleDeleteContact = async (contactId) => {
    setStatusMsg(null);
    try {
      const res = await axios.delete(`/api/health/contacts/${contactId}`);
      setContacts(res.data.contacts);
      setStatusMsg({ type: 'success', text: 'Emergency contact removed.' });
    } catch (err) {
      setStatusMsg({
        type: 'error',
        text: err.response?.data?.message || 'Failed to remove contact.',
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Health Profile &amp; Emergency Contacts
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Keep your critical medical information updated for first responders.
          </p>
        </div>

        {statusMsg && (
          <div
            className={`p-4 rounded-xl text-sm font-medium border ${
              statusMsg.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            {statusMsg.text}
          </div>
        )}

        {/* Medical Info Form */}
        <form
          onSubmit={handleProfileSave}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4"
        >
          <h2 className="text-lg font-bold text-slate-900">
            Medical Details
          </h2>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Blood Type
            </label>
            <select
              value={bloodType}
              onChange={(e) => setBloodType(e.target.value)}
              className="w-full sm:w-48 px-3.5 py-2 rounded-lg border border-slate-300 text-sm bg-white"
            >
              {BLOOD_TYPES.map((bt) => (
                <option key={bt} value={bt}>
                  {bt}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Allergies (comma-separated)
            </label>
            <input
              type="text"
              value={allergiesText}
              onChange={(e) => setAllergiesText(e.target.value)}
              placeholder="Penicillin, Peanuts"
              className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Chronic Conditions (comma-separated)
            </label>
            <input
              type="text"
              value={conditionsText}
              onChange={(e) => setConditionsText(e.target.value)}
              placeholder="Diabetes Type 2, Asthma"
              className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Current Medications (comma-separated)
            </label>
            <input
              type="text"
              value={medicationsText}
              onChange={(e) => setMedicationsText(e.target.value)}
              placeholder="Metformin 500mg"
              className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition"
          >
            {saving ? 'Saving...' : 'Save Health Profile'}
          </button>
        </form>

        {/* Emergency Contacts Management */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Emergency Contacts ({contacts.length} / 5)
              </h2>
              <p className="text-xs text-slate-500">
                Add up to 5 trusted contacts to be listed on your profile.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleAddContact}
            className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200"
          >
            <input
              type="text"
              required
              placeholder="Contact Name"
              value={contactForm.name}
              onChange={(e) =>
                setContactForm((p) => ({ ...p, name: e.target.value }))
              }
              className="px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
            />
            <input
              type="text"
              required
              placeholder="Phone Number"
              value={contactForm.phone}
              onChange={(e) =>
                setContactForm((p) => ({ ...p, phone: e.target.value }))
              }
              className="px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
            />
            <input
              type="text"
              placeholder="Relationship (e.g. Sister)"
              value={contactForm.relationship}
              onChange={(e) =>
                setContactForm((p) => ({ ...p, relationship: e.target.value }))
              }
              className="px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
            />
            <button
              type="submit"
              disabled={contacts.length >= 5}
              className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white text-sm font-semibold transition"
            >
              {contacts.length >= 5 ? 'Max 5 Reached' : 'Add Contact'}
            </button>
          </form>

          {contacts.length === 0 ? (
            <p className="text-sm text-slate-500">No contacts saved yet.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {contacts.map((c) => (
                <div
                  key={c._id}
                  className="py-3 flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold text-sm text-slate-900">
                      {c.name}{' '}
                      {c.relationship && (
                        <span className="text-xs font-normal text-slate-500">
                          ({c.relationship})
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-mono text-slate-600">
                      {c.phone}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteContact(c._id)}
                    className="px-3 py-1 rounded bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default HealthProfilePage;