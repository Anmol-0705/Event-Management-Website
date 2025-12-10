// // frontend/src/pages/AdminDashboard.js
// import React, { useEffect, useState } from 'react';

// export default function AdminDashboard({ token }) {
//   const [events, setEvents] = useState([]);
//   const [posterModal, setPosterModal] = useState(null);
//   const [posterFile, setPosterFile] = useState(null);
//   const [logsModal, setLogsModal] = useState(null); // { eventTitle, logs: [] }
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     fetchEvents();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   useEffect(() => {
//     document.body.style.overflow = posterModal || logsModal ? 'hidden' : '';
//     return () => (document.body.style.overflow = '');
//   }, [posterModal, logsModal]);

//   const fetchEvents = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch('http://localhost:5000/api/events/all', {
//         headers: { Authorization: 'Bearer ' + token },
//       });
//       if (!res.ok) {
//         console.error('Failed to fetch events (admin):', await res.text());
//         setEvents([]);
//         setLoading(false);
//         return;
//       }
//       const data = await res.json();
//       setEvents(Array.isArray(data) ? data : []);
//     } catch (err) {
//       console.error(err);
//       setEvents([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateStatus = async (id, status, reason = '') => {
//     try {
//       const res = await fetch(`http://localhost:5000/api/events/${id}/status`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
//         body: JSON.stringify({ status, reason }),
//       });
//       if (res.ok) fetchEvents();
//       else {
//         const j = await res.json().catch(() => null);
//         alert(j?.message || 'Failed to update status');
//       }
//     } catch (err) {
//       console.error(err);
//       alert('Network error');
//     }
//   };

//   const askAndReject = async (id) => {
//     const reason = prompt('Reason for rejection (optional):');
//     if (reason === null) return; // cancelled
//     await updateStatus(id, 'rejected', reason);
//   };

//   const approveEvent = async (id) => {
//     if (!window.confirm('Approve this event? It will become open to users.')) return;
//     await updateStatus(id, 'approved', 'Approved by admin');
//   };

//   const deleteEvent = async (id) => {
//     if (!window.confirm('Permanently delete this event?')) return;
//     try {
//       const res = await fetch(`http://localhost:5000/api/events/${id}`, {
//         method: 'DELETE',
//         headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
//         body: JSON.stringify({ reason: 'Deleted by admin' }),
//       });
//       if (res.ok) fetchEvents();
//       else {
//         const j = await res.json().catch(() => null);
//         alert(j?.message || 'Failed to delete');
//       }
//     } catch (err) {
//       console.error(err);
//       alert('Network error');
//     }
//   };

//   const updatePoster = async (id) => {
//     if (!posterFile) return alert('Please select a file first.');
//     const form = new FormData();
//     form.append('poster', posterFile);

//     try {
//       const res = await fetch(`http://localhost:5000/api/events/${id}/poster`, {
//         method: 'PUT',
//         headers: { Authorization: 'Bearer ' + token },
//         body: form,
//       });
//       if (res.ok) {
//         alert('Poster updated');
//         setPosterModal(null);
//         setPosterFile(null);
//         fetchEvents();
//       } else {
//         const j = await res.json().catch(() => null);
//         alert(j?.message || 'Error updating poster.');
//       }
//     } catch (err) {
//       console.error(err);
//       alert('Network error');
//     }
//   };

//   const deletePoster = async (id) => {
//     if (!window.confirm('Remove poster?')) return;
//     try {
//       const res = await fetch(`http://localhost:5000/api/events/${id}/poster`, {
//         method: 'DELETE',
//         headers: { Authorization: 'Bearer ' + token },
//       });
//       if (res.ok) {
//         fetchEvents();
//       } else {
//         const j = await res.json().catch(() => null);
//         alert(j?.message || 'Error removing poster.');
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const openLogs = async (id) => {
//     try {
//       const res = await fetch(`http://localhost:5000/api/events/${id}/logs`, {
//         headers: { Authorization: 'Bearer ' + token },
//       });
//       if (!res.ok) {
//         alert('Could not load logs');
//         return;
//       }
//       const logs = await res.json();
//       const ev = events.find((e) => e._id === id);
//       setLogsModal({ eventTitle: ev?.title || 'Event', logs });
//     } catch (err) {
//       console.error(err);
//       alert('Network error');
//     }
//   };

//   // safe compute stats
//   const safeEvents = Array.isArray(events) ? events : [];
//   const stats = safeEvents.reduce(
//     (acc, ev) => {
//       acc.total += 1;
//       if (ev.status === 'approved') acc.approved += 1;
//       if (ev.status === 'pending') acc.pending += 1;
//       if (ev.status === 'rejected') acc.rejected += 1;
//       return acc;
//     },
//     { total: 0, approved: 0, pending: 0, rejected: 0 }
//   );

//   return (
//     <div>
//       <header className="mb-4 flex items-center justify-between">
//         <div>
//           <h3 className="text-xl font-bold">🧭 Admin Dashboard</h3>
//           <p className="text-sm text-gray-600">Moderate events, upload posters and view logs.</p>
//         </div>
//         <div>
//           <button onClick={fetchEvents} className="px-3 py-1.5 bg-indigo-600 text-white rounded">Refresh</button>
//         </div>
//       </header>

//       <div className="grid grid-cols-4 gap-3 mb-6">
//         <div className="p-4 bg-white rounded shadow">
//           <div className="text-sm text-gray-500">Total</div>
//           <div className="text-2xl font-semibold">{stats.total}</div>
//         </div>
//         <div className="p-4 bg-white rounded shadow">
//           <div className="text-sm text-gray-500">Approved</div>
//           <div className="text-2xl font-semibold text-green-600">{stats.approved}</div>
//         </div>
//         <div className="p-4 bg-white rounded shadow">
//           <div className="text-sm text-gray-500">Pending</div>
//           <div className="text-2xl font-semibold text-yellow-600">{stats.pending}</div>
//         </div>
//         <div className="p-4 bg-white rounded shadow">
//           <div className="text-sm text-gray-500">Rejected</div>
//           <div className="text-2xl font-semibold text-red-600">{stats.rejected}</div>
//         </div>
//       </div>

//       <section className="bg-white rounded shadow p-4">
//         <div className="flex justify-between items-center mb-3">
//           <h4 className="font-semibold">Events</h4>
//           <div className="text-sm text-gray-500">{loading ? 'Loading...' : `${safeEvents.length} events`}</div>
//         </div>

//         <div className="divide-y">
//           {safeEvents.length === 0 && <div className="p-6 text-gray-500">No events found.</div>}

//           {safeEvents.map((ev) => (
//             <div className="py-4 flex items-center justify-between" key={ev._id}>
//               <div className="flex items-center gap-3">
//                 <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden">
//                   <img src={ev.poster ? (ev.poster.startsWith('http') ? ev.poster : `http://localhost:5000${ev.poster}`) : '/images/sample-poster.jpg'} alt={ev.title} className="w-full h-full object-cover" />
//                 </div>
//                 <div>
//                   <div className="font-semibold">{ev.title}</div>
//                   <div className="text-sm text-gray-500">{ev.organizer?.name || 'Unknown'} · ₹{ev.price}</div>
//                 </div>
//               </div>

//               <div className="flex items-center gap-2">
//                 <span className={`px-3 py-1 rounded-full text-xs ${ev.status === 'approved' ? 'bg-green-50 text-green-700' : ev.status === 'pending' ? 'bg-yellow-50 text-yellow-700' : 'bg-red-50 text-red-700'}`}>
//                   {ev.status}
//                 </span>

//                 <button onClick={() => approveEvent(ev._id)} className="px-3 py-1 bg-green-600 text-white rounded text-sm">Approve</button>
//                 <button onClick={() => askAndReject(ev._id)} className="px-3 py-1 bg-red-500 text-white rounded text-sm">Reject</button>
//                 <button onClick={() => openLogs(ev._id)} className="px-3 py-1 bg-gray-100 rounded text-sm">Logs</button>

//                 {ev.poster && <button onClick={() => setPosterModal(ev)} className="px-3 py-1 bg-indigo-600 text-white rounded text-sm">View Poster</button>}

//                 <label className="cursor-pointer inline-block px-3 py-1 bg-yellow-500 text-white rounded text-sm">
//                   <input type="file" className="hidden" onChange={(e) => setPosterFile(e.target.files[0])} />
//                   Upload
//                 </label>

//                 <button onClick={() => updatePoster(ev._id)} disabled={!posterFile} className={`px-3 py-1 rounded text-sm ${posterFile ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600 cursor-not-allowed'}`}>Save</button>

//                 <button onClick={() => deletePoster(ev._id)} className="px-3 py-1 bg-red-400 text-white rounded text-sm">Delete Poster</button>

//                 <button onClick={() => deleteEvent(ev._id)} className="px-3 py-1 bg-red-500 text-white rounded text-sm">Delete</button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* Poster Modal */}
//       {posterModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setPosterModal(null)}>
//           <div className="absolute inset-0 bg-black/60" />
//           <div className="relative z-10 bg-white p-4 rounded max-w-3xl w-11/12" onClick={(e) => e.stopPropagation()}>
//             <button onClick={() => setPosterModal(null)} className="absolute top-3 right-3">✕</button>
//             <img src={posterModal.poster ? (posterModal.poster.startsWith('http') ? posterModal.poster : `http://localhost:5000${posterModal.poster}`) : '/images/sample-poster.jpg'} alt="Poster" className="w-full h-auto object-contain" />
//           </div>
//         </div>
//       )}

//       {/* Logs Modal */}
//       {logsModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setLogsModal(null)}>
//           <div className="absolute inset-0 bg-black/50" />
//           <div className="relative z-10 bg-white p-4 rounded max-w-2xl w-11/12" onClick={(e) => e.stopPropagation()}>
//             <button onClick={() => setLogsModal(null)} className="absolute top-3 right-3">✕</button>
//             <h3 className="font-semibold mb-3">Logs — {logsModal.eventTitle}</h3>
//             <div className="max-h-80 overflow-auto">
//               {logsModal.logs.length === 0 ? <div className="text-gray-500">No logs</div> : (
//                 logsModal.logs.map((l) => (
//                   <div key={l._id} className="border-b py-2">
//                     <div className="text-sm font-medium">{l.action}</div>
//                     <div className="text-xs text-gray-500">{l.by?.name || 'system'} — {new Date(l.createdAt).toLocaleString()}</div>
//                     {l.reason && <div className="text-xs mt-1 text-gray-600">{l.reason}</div>}
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// frontend/src/pages/AdminDashboard.js
import React, { useEffect, useState } from 'react';

export default function AdminDashboard({ token }) {
  const [events, setEvents] = useState([]);
  const [posterModal, setPosterModal] = useState(null);
  const [posterFile, setPosterFile] = useState(null);
  const [logsModal, setLogsModal] = useState(null); // { eventTitle, logs: [] }
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all'); // all | approved | pending | rejected

  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.body.style.overflow = posterModal || logsModal ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
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
        return;
      }

      const data = await res.json();
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('fetchEvents error:', err);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status, reason = '') => {
    try {
      const res = await fetch(`http://localhost:5000/api/events/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify({ status, reason }),
      });

      if (res.ok) {
        fetchEvents();
      } else {
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
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason: 'Deleted by admin' }),
      });

      if (res.ok) {
        fetchEvents();
      } else {
        const j = await res.json().catch(() => null);
        alert(j?.message || 'Failed to delete event');
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
        console.error('Failed to load logs:', await res.text());
        alert('Could not load logs. Check backend /logs route.');
        return;
      }

      const logs = await res.json();
      const ev = events.find((e) => e._id === id);
      setLogsModal({
        eventTitle: ev?.title || 'Event',
        logs: Array.isArray(logs) ? logs : [],
      });
    } catch (err) {
      console.error(err);
      alert('Network error while loading logs.');
    }
  };

  // ---- Stats & filtering ----
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

  const filteredEvents =
    filterStatus === 'all'
      ? safeEvents
      : safeEvents.filter((ev) => ev.status === filterStatus);

  const getPosterSrc = (ev) =>
    ev.poster
      ? ev.poster.startsWith('http')
        ? ev.poster
        : `http://localhost:5000${ev.poster}`
      : '/images/sample-poster.jpg';

  const handleCardClick = (statusKey) => {
    setFilterStatus((prev) => (prev === statusKey ? 'all' : statusKey));
  };

  const cardBase =
    'cursor-pointer bg-white rounded-2xl p-4 shadow-sm border transition-all flex flex-col gap-1';

  return (
    <div>
      {/* Header */}
      <header className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2">
            <span role="img" aria-label="compass">
              🧭
            </span>
            Admin Dashboard
          </h3>
          <p className="text-sm text-gray-600">
            Moderate events, upload posters and view logs.
          </p>
        </div>
        <button
          onClick={fetchEvents}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium shadow hover:bg-indigo-700"
        >
          Refresh
        </button>
      </header>

      {/* Stats cards */}
      <section className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div
          className={`${cardBase} ${
            filterStatus === 'all'
              ? 'border-indigo-500 shadow-md'
              : 'border-gray-100 hover:border-indigo-300'
          }`}
          onClick={() => handleCardClick('all')}
        >
          <span className="text-xs text-gray-500">Total</span>
          <span className="text-2xl font-semibold text-gray-800">
            {stats.total}
          </span>
        </div>

        <div
          className={`${cardBase} ${
            filterStatus === 'approved'
              ? 'border-green-500 shadow-md'
              : 'border-gray-100 hover:border-green-300'
          }`}
          onClick={() => handleCardClick('approved')}
        >
          <span className="text-xs text-gray-500">Approved</span>
          <span className="text-2xl font-semibold text-green-600">
            {stats.approved}
          </span>
        </div>

        <div
          className={`${cardBase} ${
            filterStatus === 'pending'
              ? 'border-yellow-500 shadow-md'
              : 'border-gray-100 hover:border-yellow-300'
          }`}
          onClick={() => handleCardClick('pending')}
        >
          <span className="text-xs text-gray-500">Pending</span>
          <span className="text-2xl font-semibold text-yellow-600">
            {stats.pending}
          </span>
        </div>

        <div
          className={`${cardBase} ${
            filterStatus === 'rejected'
              ? 'border-red-500 shadow-md'
              : 'border-gray-100 hover:border-red-300'
          }`}
          onClick={() => handleCardClick('rejected')}
        >
          <span className="text-xs text-gray-500">Rejected</span>
          <span className="text-2xl font-semibold text-red-600">
            {stats.rejected}
          </span>
        </div>
      </section>

      {/* Events list */}
      <section className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-gray-800">Events</h4>
          <div className="text-xs text-gray-500">
            {loading
              ? 'Loading...'
              : `${filteredEvents.length} of ${safeEvents.length} events`}
            {filterStatus !== 'all' && (
              <span className="ml-1 text-gray-400">
                (filter: {filterStatus})
              </span>
            )}
          </div>
        </div>

        <div className="divide-y">
          {filteredEvents.length === 0 && (
            <div className="p-6 text-gray-500 text-sm">No events found.</div>
          )}

          {filteredEvents.map((ev) => (
            <div
              key={ev._id}
              className="py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
            >
              {/* Left: info */}
              <div className="flex items-start gap-3">
                <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <img
                    src={getPosterSrc(ev)}
                    alt={ev.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="font-semibold text-gray-800 leading-tight">
                    {ev.title}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {ev.organizer?.name || 'Unknown'} · ₹{ev.price}
                  </div>
                  <div className="mt-1">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium ${
                        ev.status === 'approved'
                          ? 'bg-green-50 text-green-700'
                          : ev.status === 'pending'
                          ? 'bg-yellow-50 text-yellow-700'
                          : 'bg-red-50 text-red-700'
                      }`}
                    >
                      {ev.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: actions */}
              <div className="flex flex-col items-end gap-2 w-full md:w-auto">
                {/* Row 1: status buttons + logs */}
                <div className="flex flex-wrap justify-end gap-2">
                  {ev.status !== 'approved' && (
                    <button
                      onClick={() => approveEvent(ev._id)}
                      className="px-3 py-1.5 bg-green-600 text-white rounded text-xs sm:text-sm hover:bg-green-700"
                    >
                      Approve
                    </button>
                  )}
                  {ev.status !== 'rejected' && (
                    <button
                      onClick={() => askAndReject(ev._id)}
                      className="px-3 py-1.5 bg-red-500 text-white rounded text-xs sm:text-sm hover:bg-red-600"
                    >
                      Reject
                    </button>
                  )}
                  <button
                    onClick={() => openLogs(ev._id)}
                    className="px-3 py-1.5 bg-gray-100 text-gray-800 rounded text-xs sm:text-sm hover:bg-gray-200"
                  >
                    Logs
                  </button>
                  {ev.poster && (
                    <button
                      onClick={() => setPosterModal(ev)}
                      className="px-3 py-1.5 bg-indigo-600 text-white rounded text-xs sm:text-sm hover:bg-indigo-700"
                    >
                      View Poster
                    </button>
                  )}
                </div>

                {/* Row 2: poster upload / save / delete / delete event */}
                <div className="flex flex-wrap justify-end gap-2">
                  <label className="cursor-pointer inline-flex items-center px-3 py-1.5 bg-yellow-500 text-white rounded text-xs sm:text-sm hover:bg-yellow-600">
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => setPosterFile(e.target.files[0])}
                    />
                    Upload
                  </label>
                  <button
                    onClick={() => updatePoster(ev._id)}
                    disabled={!posterFile}
                    className={`px-3 py-1.5 rounded text-xs sm:text-sm ${
                      posterFile
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Save
                  </button>
                  {ev.poster && (
                    <button
                      onClick={() => deletePoster(ev._id)}
                      className="px-3 py-1.5 bg-red-400 text-white rounded text-xs sm:text-sm hover:bg-red-500"
                    >
                      Delete Poster
                    </button>
                  )}
                  <button
                    onClick={() => deleteEvent(ev._id)}
                    className="px-3 py-1.5 bg-red-500 text-white rounded text-xs sm:text-sm hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Poster Modal */}
      {posterModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={() => {
            setPosterModal(null);
            setPosterFile(null);
          }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="relative z-10 bg-white p-4 rounded-2xl max-w-3xl w-11/12 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => {
                setPosterModal(null);
                setPosterFile(null);
              }}
              className="absolute top-3 right-3 bg-white/80 rounded-full p-1 hover:bg-white text-gray-700"
            >
              ✕
            </button>
            <img
              src={getPosterSrc(posterModal)}
              alt="Poster"
              className="w-full h-auto max-h-[80vh] object-contain rounded-md"
            />
          </div>
        </div>
      )}

      {/* Logs Modal */}
      {logsModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={() => setLogsModal(null)}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div
            className="relative z-10 bg-white p-4 rounded-2xl max-w-2xl w-11/12 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setLogsModal(null)}
              className="absolute top-3 right-3 bg-white/80 rounded-full p-1 hover:bg-white text-gray-700"
            >
              ✕
            </button>
            <h3 className="font-semibold text-gray-800 mb-3">
              Logs — {logsModal.eventTitle}
            </h3>
            <div className="max-h-80 overflow-auto space-y-3">
              {logsModal.logs.length === 0 ? (
                <div className="text-gray-500 text-sm">No logs recorded.</div>
              ) : (
                logsModal.logs.map((l) => (
                  <div key={l._id} className="border rounded-lg p-2">
                    <div className="text-sm font-medium text-gray-800">
                      {l.action}
                    </div>
                    <div className="text-xs text-gray-500">
                      {l.by?.name || 'system'} ·{' '}
                      {new Date(l.createdAt).toLocaleString()}
                    </div>
                    {l.reason && (
                      <div className="text-xs mt-1 text-gray-700">
                        Reason: {l.reason}
                      </div>
                    )}
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
