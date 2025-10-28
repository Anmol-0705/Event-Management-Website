// frontend/src/pages/AdminDashboard.js
import React, { useEffect, useState } from 'react';

export default function AdminDashboard({ token }) {
  const [events, setEvents] = useState([]);
  const [posterModal, setPosterModal] = useState(null);
  const [posterFile, setPosterFile] = useState(null);
  const [logsModal, setLogsModal] = useState(null); // { eventTitle, logs: [] }
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.body.style.overflow = posterModal || logsModal ? 'hidden' : '';
    return () => (document.body.style.overflow = '');
  }, [posterModal, logsModal]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/events/all', {
        headers: { Authorization: 'Bearer ' + token },
      });
      if (!res.ok) {
        console.error('Failed to fetch events (admin):', await res.text());
        setEvents([]);
        setLoading(false);
        return;
      }
      const data = await res.json();
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status, reason = '') => {
    try {
      const res = await fetch(`http://localhost:5000/api/events/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify({ status, reason }),
      });
      if (res.ok) fetchEvents();
      else {
        const j = await res.json().catch(() => null);
        alert(j?.message || 'Failed to update status');
      }
    } catch (err) {
      console.error(err);
      alert('Network error');
    }
  };

  const askAndReject = async (id) => {
    const reason = prompt('Reason for rejection (optional):');
    if (reason === null) return; // cancelled
    await updateStatus(id, 'rejected', reason);
  };

  const approveEvent = async (id) => {
    if (!window.confirm('Approve this event? It will become open to users.')) return;
    await updateStatus(id, 'approved', 'Approved by admin');
  };

  const deleteEvent = async (id) => {
    if (!window.confirm('Permanently delete this event?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/events/${id}`, {
        method: 'DELETE',
        headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'Deleted by admin' }),
      });
      if (res.ok) fetchEvents();
      else {
        const j = await res.json().catch(() => null);
        alert(j?.message || 'Failed to delete');
      }
    } catch (err) {
      console.error(err);
      alert('Network error');
    }
  };

  const updatePoster = async (id) => {
    if (!posterFile) return alert('Please select a file first.');
    const form = new FormData();
    form.append('poster', posterFile);

    try {
      const res = await fetch(`http://localhost:5000/api/events/${id}/poster`, {
        method: 'PUT',
        headers: { Authorization: 'Bearer ' + token },
        body: form,
      });
      if (res.ok) {
        alert('Poster updated');
        setPosterModal(null);
        setPosterFile(null);
        fetchEvents();
      } else {
        const j = await res.json().catch(() => null);
        alert(j?.message || 'Error updating poster.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error');
    }
  };

  const deletePoster = async (id) => {
    if (!window.confirm('Remove poster?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/events/${id}/poster`, {
        method: 'DELETE',
        headers: { Authorization: 'Bearer ' + token },
      });
      if (res.ok) {
        fetchEvents();
      } else {
        const j = await res.json().catch(() => null);
        alert(j?.message || 'Error removing poster.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openLogs = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/events/${id}/logs`, {
        headers: { Authorization: 'Bearer ' + token },
      });
      if (!res.ok) {
        alert('Could not load logs');
        return;
      }
      const logs = await res.json();
      const ev = events.find((e) => e._id === id);
      setLogsModal({ eventTitle: ev?.title || 'Event', logs });
    } catch (err) {
      console.error(err);
      alert('Network error');
    }
  };

  // safe compute stats
  const safeEvents = Array.isArray(events) ? events : [];
  const stats = safeEvents.reduce(
    (acc, ev) => {
      acc.total += 1;
      if (ev.status === 'approved') acc.approved += 1;
      if (ev.status === 'pending') acc.pending += 1;
      if (ev.status === 'rejected') acc.rejected += 1;
      return acc;
    },
    { total: 0, approved: 0, pending: 0, rejected: 0 }
  );

  return (
    <div>
      <header className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold">🧭 Admin Dashboard</h3>
          <p className="text-sm text-gray-600">Moderate events, upload posters and view logs.</p>
        </div>
        <div>
          <button onClick={fetchEvents} className="px-3 py-1.5 bg-indigo-600 text-white rounded">Refresh</button>
        </div>
      </header>

      <div className="grid grid-cols-4 gap-3 mb-6">
        <div className="p-4 bg-white rounded shadow">
          <div className="text-sm text-gray-500">Total</div>
          <div className="text-2xl font-semibold">{stats.total}</div>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <div className="text-sm text-gray-500">Approved</div>
          <div className="text-2xl font-semibold text-green-600">{stats.approved}</div>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <div className="text-sm text-gray-500">Pending</div>
          <div className="text-2xl font-semibold text-yellow-600">{stats.pending}</div>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <div className="text-sm text-gray-500">Rejected</div>
          <div className="text-2xl font-semibold text-red-600">{stats.rejected}</div>
        </div>
      </div>

      <section className="bg-white rounded shadow p-4">
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-semibold">Events</h4>
          <div className="text-sm text-gray-500">{loading ? 'Loading...' : `${safeEvents.length} events`}</div>
        </div>

        <div className="divide-y">
          {safeEvents.length === 0 && <div className="p-6 text-gray-500">No events found.</div>}

          {safeEvents.map((ev) => (
            <div className="py-4 flex items-center justify-between" key={ev._id}>
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden">
                  <img src={ev.poster ? (ev.poster.startsWith('http') ? ev.poster : `http://localhost:5000${ev.poster}`) : '/images/sample-poster.jpg'} alt={ev.title} className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="font-semibold">{ev.title}</div>
                  <div className="text-sm text-gray-500">{ev.organizer?.name || 'Unknown'} · ₹{ev.price}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs ${ev.status === 'approved' ? 'bg-green-50 text-green-700' : ev.status === 'pending' ? 'bg-yellow-50 text-yellow-700' : 'bg-red-50 text-red-700'}`}>
                  {ev.status}
                </span>

                <button onClick={() => approveEvent(ev._id)} className="px-3 py-1 bg-green-600 text-white rounded text-sm">Approve</button>
                <button onClick={() => askAndReject(ev._id)} className="px-3 py-1 bg-red-500 text-white rounded text-sm">Reject</button>
                <button onClick={() => openLogs(ev._id)} className="px-3 py-1 bg-gray-100 rounded text-sm">Logs</button>

                {ev.poster && <button onClick={() => setPosterModal(ev)} className="px-3 py-1 bg-indigo-600 text-white rounded text-sm">View Poster</button>}

                <label className="cursor-pointer inline-block px-3 py-1 bg-yellow-500 text-white rounded text-sm">
                  <input type="file" className="hidden" onChange={(e) => setPosterFile(e.target.files[0])} />
                  Upload
                </label>

                <button onClick={() => updatePoster(ev._id)} disabled={!posterFile} className={`px-3 py-1 rounded text-sm ${posterFile ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600 cursor-not-allowed'}`}>Save</button>

                <button onClick={() => deletePoster(ev._id)} className="px-3 py-1 bg-red-400 text-white rounded text-sm">Delete Poster</button>

                <button onClick={() => deleteEvent(ev._id)} className="px-3 py-1 bg-red-500 text-white rounded text-sm">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Poster Modal */}
      {posterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setPosterModal(null)}>
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative z-10 bg-white p-4 rounded max-w-3xl w-11/12" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setPosterModal(null)} className="absolute top-3 right-3">✕</button>
            <img src={posterModal.poster ? (posterModal.poster.startsWith('http') ? posterModal.poster : `http://localhost:5000${posterModal.poster}`) : '/images/sample-poster.jpg'} alt="Poster" className="w-full h-auto object-contain" />
          </div>
        </div>
      )}

      {/* Logs Modal */}
      {logsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setLogsModal(null)}>
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 bg-white p-4 rounded max-w-2xl w-11/12" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setLogsModal(null)} className="absolute top-3 right-3">✕</button>
            <h3 className="font-semibold mb-3">Logs — {logsModal.eventTitle}</h3>
            <div className="max-h-80 overflow-auto">
              {logsModal.logs.length === 0 ? <div className="text-gray-500">No logs</div> : (
                logsModal.logs.map((l) => (
                  <div key={l._id} className="border-b py-2">
                    <div className="text-sm font-medium">{l.action}</div>
                    <div className="text-xs text-gray-500">{l.by?.name || 'system'} — {new Date(l.createdAt).toLocaleString()}</div>
                    {l.reason && <div className="text-xs mt-1 text-gray-600">{l.reason}</div>}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
