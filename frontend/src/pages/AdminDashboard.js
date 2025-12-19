// frontend/src/pages/AdminDashboard.js
// import React, { useEffect, useState } from 'react';

// export default function AdminDashboard({ token }) {
//   const [events, setEvents] = useState([]);
//   const [posterModal, setPosterModal] = useState(null);
//   const [posterFile, setPosterFile] = useState(null);
//   const [logsModal, setLogsModal] = useState(null); // { eventTitle, logs: [] }
//   const [loading, setLoading] = useState(false);
//   const [filterStatus, setFilterStatus] = useState('all'); // all | approved | pending | rejected

//   useEffect(() => {
//     fetchEvents();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   useEffect(() => {
//     document.body.style.overflow = posterModal || logsModal ? 'hidden' : '';
//     return () => {
//       document.body.style.overflow = '';
//     };
//   }, [posterModal, logsModal]);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       fetchEvents();
//     }, 10000); // refresh every 10 seconds

//     return () => clearInterval(interval);
//   }, []);


//   const fetchEvents = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch('http://localhost:5000/api/events/all', {
//         headers: { Authorization: 'Bearer ' + token },
//       });

//       if (!res.ok) {
//         console.error('Failed to fetch events (admin):', await res.text());
//         setEvents([]);
//         return;
//       }

//       const data = await res.json();
//       setEvents(Array.isArray(data) ? data : []);
//     } catch (err) {
//       console.error('fetchEvents error:', err);
//       setEvents([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateStatus = async (id, status, reason = '') => {
//     try {
//       const res = await fetch(`http://localhost:5000/api/events/${id}/status`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: 'Bearer ' + token,
//         },
//         body: JSON.stringify({ status, reason }),
//       });

//       if (res.ok) {
//         fetchEvents();
//       } else {
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
//         headers: {
//           Authorization: 'Bearer ' + token,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ reason: 'Deleted by admin' }),
//       });

//       if (res.ok) {
//         fetchEvents();
//       } else {
//         const j = await res.json().catch(() => null);
//         alert(j?.message || 'Failed to delete event');
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
//         console.error('Failed to load logs:', await res.text());
//         alert('Could not load logs. Check backend /logs route.');
//         return;
//       }

//       const logs = await res.json();
//       const ev = events.find((e) => e._id === id);
//       setLogsModal({
//         eventTitle: ev?.title || 'Event',
//         logs: Array.isArray(logs) ? logs : [],
//       });
//     } catch (err) {
//       console.error(err);
//       alert('Network error while loading logs.');
//     }
//   };

//   // ---- Stats & filtering ----
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

//   const filteredEvents =
//     filterStatus === 'all'
//       ? safeEvents
//       : safeEvents.filter((ev) => ev.status === filterStatus);

//   const getPosterSrc = (ev) =>
//     ev.poster
//       ? ev.poster.startsWith('http')
//         ? ev.poster
//         : `http://localhost:5000${ev.poster}`
//       : '/images/sample-poster.jpg';

//   const handleCardClick = (statusKey) => {
//     setFilterStatus((prev) => (prev === statusKey ? 'all' : statusKey));
//   };

//   const cardBase =
//     'cursor-pointer bg-white rounded-2xl p-4 shadow-sm border transition-all flex flex-col gap-1';

//   return (
//     <div>
//       {/* Header */}
//       <header className="mb-4 flex items-center justify-between">
//         <div>
//           <h3 className="text-xl font-bold flex items-center gap-2">
//             <span role="img" aria-label="compass">
//               🧭
//             </span>
//             Admin Dashboard
//           </h3>
//           <p className="text-sm text-gray-600">
//             Moderate events, upload posters and view logs.
//           </p>
//         </div>
//         <button
//           onClick={fetchEvents}
//           className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium shadow hover:bg-indigo-700"
//         >
//           Refresh
//         </button>
//       </header>

//       {/* Stats cards */}
//       <section className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
//         <div
//           className={`${cardBase} ${filterStatus === 'all'
//               ? 'border-indigo-500 shadow-md'
//               : 'border-gray-100 hover:border-indigo-300'
//             }`}
//           onClick={() => handleCardClick('all')}
//         >
//           <span className="text-xs text-gray-500">Total</span>
//           <span className="text-2xl font-semibold text-gray-800">
//             {stats.total}
//           </span>
//         </div>

//         <div
//           className={`${cardBase} ${filterStatus === 'approved'
//               ? 'border-green-500 shadow-md'
//               : 'border-gray-100 hover:border-green-300'
//             }`}
//           onClick={() => handleCardClick('approved')}
//         >
//           <span className="text-xs text-gray-500">Approved</span>
//           <span className="text-2xl font-semibold text-green-600">
//             {stats.approved}
//           </span>
//         </div>

//         <div
//           className={`${cardBase} ${filterStatus === 'pending'
//               ? 'border-yellow-500 shadow-md'
//               : 'border-gray-100 hover:border-yellow-300'
//             }`}
//           onClick={() => handleCardClick('pending')}
//         >
//           <span className="text-xs text-gray-500">Pending</span>
//           <span className="text-2xl font-semibold text-yellow-600">
//             {stats.pending}
//           </span>
//         </div>

//         <div
//           className={`${cardBase} ${filterStatus === 'rejected'
//               ? 'border-red-500 shadow-md'
//               : 'border-gray-100 hover:border-red-300'
//             }`}
//           onClick={() => handleCardClick('rejected')}
//         >
//           <span className="text-xs text-gray-500">Rejected</span>
//           <span className="text-2xl font-semibold text-red-600">
//             {stats.rejected}
//           </span>
//         </div>
//       </section>

//       {/* Events list */}
//       <section className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
//         <div className="flex items-center justify-between mb-3">
//           <h4 className="font-semibold text-gray-800">Events</h4>
//           <div className="text-xs text-gray-500">
//             {loading
//               ? 'Loading...'
//               : `${filteredEvents.length} of ${safeEvents.length} events`}
//             {filterStatus !== 'all' && (
//               <span className="ml-1 text-gray-400">
//                 (filter: {filterStatus})
//               </span>
//             )}
//           </div>
//         </div>

//         <div className="divide-y">
//           {filteredEvents.length === 0 && (
//             <div className="p-6 text-gray-500 text-sm">No events found.</div>
//           )}

//           {filteredEvents.map((ev) => (
//             <div
//               key={ev._id}
//               className="py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
//             >
//               {/* Left: info */}
//               <div className="flex items-start gap-3">
//                 <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
//                   <img
//                     src={getPosterSrc(ev)}
//                     alt={ev.title}
//                     className="w-full h-full object-cover"
//                   />
//                 </div>
//                 <div>
//                   <div className="font-semibold text-gray-800 leading-tight">
//                     {ev.title}
//                   </div>
//                   <div className="text-xs text-gray-500 mt-0.5">
//                     {ev.organizer?.name || 'Unknown'} · ₹{ev.price}
//                   </div>
//                   <div className="mt-1">
//                     <span
//                       className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium ${ev.status === 'approved'
//                           ? 'bg-green-50 text-green-700'
//                           : ev.status === 'pending'
//                             ? 'bg-yellow-50 text-yellow-700'
//                             : 'bg-red-50 text-red-700'
//                         }`}
//                     >
//                       {ev.status}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               {/* Right: actions */}
//               <div className="flex flex-col items-end gap-2 w-full md:w-auto">
//                 {/* Row 1: status buttons + logs */}
//                 <div className="flex flex-wrap justify-end gap-2">
//                   {ev.status !== 'approved' && (
//                     <button
//                       onClick={() => approveEvent(ev._id)}
//                       className="px-3 py-1.5 bg-green-600 text-white rounded text-xs sm:text-sm hover:bg-green-700"
//                     >
//                       Approve
//                     </button>
//                   )}
//                   {ev.status !== 'rejected' && (
//                     <button
//                       onClick={() => askAndReject(ev._id)}
//                       className="px-3 py-1.5 bg-red-500 text-white rounded text-xs sm:text-sm hover:bg-red-600"
//                     >
//                       Reject
//                     </button>
//                   )}
//                   <button
//                     onClick={() => openLogs(ev._id)}
//                     className="px-3 py-1.5 bg-gray-100 text-gray-800 rounded text-xs sm:text-sm hover:bg-gray-200"
//                   >
//                     Logs
//                   </button>
//                   {ev.poster && (
//                     <button
//                       onClick={() => setPosterModal(ev)}
//                       className="px-3 py-1.5 bg-indigo-600 text-white rounded text-xs sm:text-sm hover:bg-indigo-700"
//                     >
//                       View Poster
//                     </button>
//                   )}
//                 </div>

//                 {/* Row 2: poster upload / save / delete / delete event */}
//                 <div className="flex flex-wrap justify-end gap-2">
//                   <label className="cursor-pointer inline-flex items-center px-3 py-1.5 bg-yellow-500 text-white rounded text-xs sm:text-sm hover:bg-yellow-600">
//                     <input
//                       type="file"
//                       className="hidden"
//                       onChange={(e) => setPosterFile(e.target.files[0])}
//                     />
//                     Upload
//                   </label>
//                   <button
//                     onClick={() => updatePoster(ev._id)}
//                     disabled={!posterFile}
//                     className={`px-3 py-1.5 rounded text-xs sm:text-sm ${posterFile
//                         ? 'bg-blue-600 text-white hover:bg-blue-700'
//                         : 'bg-gray-200 text-gray-500 cursor-not-allowed'
//                       }`}
//                   >
//                     Save
//                   </button>
//                   {ev.poster && (
//                     <button
//                       onClick={() => deletePoster(ev._id)}
//                       className="px-3 py-1.5 bg-red-400 text-white rounded text-xs sm:text-sm hover:bg-red-500"
//                     >
//                       Delete Poster
//                     </button>
//                   )}
//                   <button
//                     onClick={() => deleteEvent(ev._id)}
//                     className="px-3 py-1.5 bg-red-500 text-white rounded text-xs sm:text-sm hover:bg-red-600"
//                   >
//                     Delete
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* Poster Modal */}
//       {posterModal && (
//         <div
//           className="fixed inset-0 z-50 flex items-center justify-center"
//           onClick={() => {
//             setPosterModal(null);
//             setPosterFile(null);
//           }}
//         >
//           <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
//           <div
//             className="relative z-10 bg-white p-4 rounded-2xl max-w-3xl w-11/12 shadow-2xl"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <button
//               onClick={() => {
//                 setPosterModal(null);
//                 setPosterFile(null);
//               }}
//               className="absolute top-3 right-3 bg-white/80 rounded-full p-1 hover:bg-white text-gray-700"
//             >
//               ✕
//             </button>
//             <img
//               src={getPosterSrc(posterModal)}
//               alt="Poster"
//               className="w-full h-auto max-h-[80vh] object-contain rounded-md"
//             />
//           </div>
//         </div>
//       )}

//       {/* Logs Modal */}
//       {logsModal && (
//         <div
//           className="fixed inset-0 z-50 flex items-center justify-center"
//           onClick={() => setLogsModal(null)}
//         >
//           <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
//           <div
//             className="relative z-10 bg-white p-4 rounded-2xl max-w-2xl w-11/12 shadow-2xl"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <button
//               onClick={() => setLogsModal(null)}
//               className="absolute top-3 right-3 bg-white/80 rounded-full p-1 hover:bg-white text-gray-700"
//             >
//               ✕
//             </button>
//             <h3 className="font-semibold text-gray-800 mb-3">
//               Logs — {logsModal.eventTitle}
//             </h3>
//             <div className="max-h-80 overflow-auto space-y-3">
//               {logsModal.logs.length === 0 ? (
//                 <div className="text-gray-500 text-sm">No logs recorded.</div>
//               ) : (
//                 logsModal.logs.map((l) => (
//                   <div key={l._id} className="border rounded-lg p-2">
//                     <div className="text-sm font-medium text-gray-800">
//                       {l.action}
//                     </div>
//                     <div className="text-xs text-gray-500">
//                       {l.by?.name || 'system'} ·{' '}
//                       {new Date(l.createdAt).toLocaleString()}
//                     </div>
//                     {l.reason && (
//                       <div className="text-xs mt-1 text-gray-700">
//                         Reason: {l.reason}
//                       </div>
//                     )}
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
  const [logsModal, setLogsModal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  /* =======================
     AUTO REFRESH (POLLING)
     ======================= */
  useEffect(() => {
    fetchEvents();
    const interval = setInterval(fetchEvents, 8000); // every 8s
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    document.body.style.overflow = posterModal || logsModal ? 'hidden' : '';
    return () => (document.body.style.overflow = '');
  }, [posterModal, logsModal]);

  /* =======================
     FETCH EVENTS
     ======================= */
  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/events/all', {
        headers: { Authorization: 'Bearer ' + token },
      });
      const data = await res.json();
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  /* =======================
     STATUS ACTIONS
     ======================= */
  const updateStatus = async (id, status, reason = '') => {
    await fetch(`http://localhost:5000/api/events/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify({ status, reason }),
    });
    fetchEvents();
  };

  const askAndReject = async (id) => {
    const reason = prompt('Reason for rejection:');
    if (reason !== null) updateStatus(id, 'rejected', reason);
  };

  const approveEvent = async (id) => {
    if (window.confirm('Approve this event?')) {
      updateStatus(id, 'approved', 'Approved by admin');
    }
  };

  /* =======================
     DELETE EVENT
     ======================= */
  const deleteEvent = async (id) => {
    if (!window.confirm('Delete this event permanently?')) return;
    await fetch(`http://localhost:5000/api/events/${id}`, {
      method: 'DELETE',
      headers: { Authorization: 'Bearer ' + token },
    });
    fetchEvents();
  };

  /* =======================
     POSTER HANDLING
     ======================= */
  const updatePoster = async (id) => {
    if (!posterFile) return;
    const form = new FormData();
    form.append('poster', posterFile);
    await fetch(`http://localhost:5000/api/events/${id}/poster`, {
      method: 'PUT',
      headers: { Authorization: 'Bearer ' + token },
      body: form,
    });
    setPosterModal(null);
    setPosterFile(null);
    fetchEvents();
  };

  const deletePoster = async (id) => {
    if (!window.confirm('Remove poster?')) return;
    await fetch(`http://localhost:5000/api/events/${id}/poster`, {
      method: 'DELETE',
      headers: { Authorization: 'Bearer ' + token },
    });
    fetchEvents();
  };

  /* =======================
     LOGS
     ======================= */
  const openLogs = async (id) => {
    const res = await fetch(`http://localhost:5000/api/events/${id}/logs`, {
      headers: { Authorization: 'Bearer ' + token },
    });
    const logs = await res.json();
    const ev = events.find((e) => e._id === id);
    setLogsModal({ eventTitle: ev?.title, logs });
  };

  /* =======================
     STATS + FILTER
     ======================= */
  const stats = events.reduce(
    (a, e) => {
      a.total++;
      a[e.status]++;
      return a;
    },
    { total: 0, approved: 0, pending: 0, rejected: 0 }
  );

  const visibleEvents =
    filterStatus === 'all'
      ? events
      : events.filter((e) => e.status === filterStatus);

  const posterSrc = (ev) =>
    ev.poster
      ? ev.poster.startsWith('http')
        ? ev.poster
        : `http://localhost:5000${ev.poster}`
      : '/images/sample-poster.jpg';

  /* =======================
     UI
     ======================= */
  return (
    <div>
      <header className="flex justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold">🧭 Admin Dashboard</h3>
          <p className="text-sm text-gray-600">
            Live moderation · auto-refresh enabled
          </p>
        </div>
        <button
          onClick={fetchEvents}
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          Refresh
        </button>
      </header>

      {/* STATS */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {['total', 'approved', 'pending', 'rejected'].map((k) => (
          <div
            key={k}
            onClick={() => setFilterStatus(k === 'total' ? 'all' : k)}
            className={`cursor-pointer p-4 rounded-xl border shadow-sm ${
              filterStatus === k ? 'border-indigo-500' : ''
            }`}
          >
            <div className="text-xs text-gray-500">{k}</div>
            <div className="text-2xl font-semibold">{stats[k]}</div>
          </div>
        ))}
      </div>

      {/* EVENTS */}
      <div className="bg-white rounded-xl p-4 border">
        {visibleEvents.map((ev) => (
          <div
            key={ev._id}
            className={`flex justify-between items-center py-4 border-b ${
              ev.status === 'pending' && ev.lastEditedAt
                ? 'bg-yellow-50'
                : ''
            }`}
          >
            <div className="flex gap-3 items-center">
              <img
                src={posterSrc(ev)}
                alt=""
                className="w-14 h-14 rounded object-cover"
              />
              <div>
                <div className="font-semibold flex items-center gap-2">
                  {ev.title}
                  {ev.status === 'pending' && ev.lastEditedAt && (
                    <span className="text-xs bg-yellow-200 px-2 py-0.5 rounded">
                      edited – awaiting approval
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-500">
                  {ev.organizer?.name} · ₹{ev.price}
                </div>
              </div>
            </div>

            <div className="flex gap-2 flex-wrap justify-end">
              <button
                onClick={() => approveEvent(ev._id)}
                className="bg-green-600 text-white px-3 py-1 rounded text-sm"
              >
                Approve
              </button>
              <button
                onClick={() => askAndReject(ev._id)}
                className="bg-red-500 text-white px-3 py-1 rounded text-sm"
              >
                Reject
              </button>
              <button
                onClick={() => openLogs(ev._id)}
                className="bg-gray-100 px-3 py-1 rounded text-sm"
              >
                Logs
              </button>
              <button
                onClick={() => setPosterModal(ev)}
                className="bg-indigo-600 text-white px-3 py-1 rounded text-sm"
              >
                Poster
              </button>
              <button
                onClick={() => deleteEvent(ev._id)}
                className="bg-red-600 text-white px-3 py-1 rounded text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* LOGS MODAL */}
      {logsModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setLogsModal(null)}
        >
          <div
            className="bg-white p-4 rounded-xl w-11/12 max-w-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-semibold mb-3">
              Logs — {logsModal.eventTitle}
            </h3>
            {logsModal.logs.map((l) => (
              <div key={l._id} className="border-b py-2">
                <div className="text-sm font-medium">{l.action}</div>
                <div className="text-xs text-gray-500">
                  {l.by?.name} · {new Date(l.createdAt).toLocaleString()}
                </div>
                {l.reason && (
                  <div className="text-xs text-gray-700 mt-1">
                    Reason: {l.reason}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* POSTER MODAL */}
      {posterModal && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
          onClick={() => setPosterModal(null)}
        >
          <div
            className="bg-white p-4 rounded-xl max-w-3xl w-11/12"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={posterSrc(posterModal)}
              alt="poster"
              className="w-full rounded"
            />
            <div className="flex gap-2 mt-4">
              <input
                type="file"
                onChange={(e) => setPosterFile(e.target.files[0])}
              />
              <button
                onClick={() => updatePoster(posterModal._id)}
                className="bg-blue-600 text-white px-3 py-1 rounded"
              >
                Save
              </button>
              <button
                onClick={() => deletePoster(posterModal._id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
