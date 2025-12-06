// src/pages/OrganizerDashboard.js
import React, { useEffect, useState } from 'react';

/**
 * Organizer dashboard: dedicated area for organizers to manage their events.
 * 
 */

export default function OrganizerDashboard({ token }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [posterFile, setPosterFile] = useState(null);
  const [posterModal, setPosterModal] = useState(null);

  useEffect(() => {
    fetchMyEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchMyEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/events/mine', {
        headers: { Authorization: 'Bearer ' + token },
      });
      if (!res.ok) {
        console.error('Failed to fetch my events:', await res.text());
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

  const deleteEvent = async (id) => {
    if (!confirm('Delete this event?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/events/${id}`, {
        method: 'DELETE',
        headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'Deleted by organizer' }),
      });
      if (res.ok) fetchMyEvents();
      else {
        const j = await res.json().catch(() => null);
        alert(j?.message || 'Delete failed');
      }
    } catch (err) {
      console.error(err);
      alert('Network error');
    }
  };

  const uploadPoster = async (id) => {
    if (!posterFile) return alert('Select file first');
    const fd = new FormData();
    fd.append('poster', posterFile);
    try {
      const res = await fetch(`http://localhost:5000/api/events/${id}`, {
        method: 'PUT',
        headers: { Authorization: 'Bearer ' + token },
        body: fd,
      });
      if (res.ok) {
        alert('Poster uploaded');
        setPosterFile(null);
        setPosterModal(null);
        fetchMyEvents();
      } else {
        const j = await res.json().catch(() => null);
        alert(j?.message || 'Upload failed');
      }
    } catch (err) {
      console.error(err);
      alert('Network error');
    }
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Your events</h3>
        <div className="text-sm text-gray-500">{loading ? 'Loading...' : `${events.length} events`}</div>
      </div>

      <div className="space-y-4">
        {events.length === 0 && <div className="text-gray-500 p-4 bg-white rounded">No events yet.</div>}

        {events.map((ev) => (
          <div key={ev._id} className="bg-white rounded-lg p-4 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden">
                <img src={ev.poster ? `http://localhost:5000${ev.poster}` : '/images/sample-poster.jpg'} alt={ev.title} className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="font-semibold">{ev.title}</div>
                <div className="text-sm text-gray-500">{ev.description}</div>
                <div className="text-xs text-gray-400 mt-1">Status: <span className={`font-medium ${ev.status === 'approved' ? 'text-green-600' : ev.status === 'pending' ? 'text-yellow-600' : 'text-red-600'}`}>{ev.status}</span></div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a href={`/events/${ev._id}/edit`} className="px-3 py-1.5 bg-indigo-600 text-white rounded-md text-sm">Edit</a>

              <button onClick={() => { setPosterModal(ev); }} className="px-3 py-1.5 bg-yellow-500 text-white rounded-md text-sm">Upload Poster</button>

              <button onClick={() => deleteEvent(ev._1d || ev._id)} className="px-3 py-1.5 bg-red-400 text-white rounded-md text-sm">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Poster modal for organizer */}
      {posterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setPosterModal(null)}>
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 bg-white rounded-xl p-6 max-w-lg w-11/12" onClick={(e) => e.stopPropagation()}>
            <h4 className="text-lg font-medium mb-2">Upload poster for {posterModal.title}</h4>
            <input type="file" accept="image/*" onChange={(e) => setPosterFile(e.target.files[0])} className="mb-4" />
            <div className="flex justify-end gap-2">
              <button onClick={() => setPosterModal(null)} className="px-3 py-1.5 bg-gray-200 rounded">Cancel</button>
              <button onClick={() => uploadPoster(posterModal._id)} className={`px-3 py-1.5 rounded ${posterFile ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`} disabled={!posterFile}>Upload</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
