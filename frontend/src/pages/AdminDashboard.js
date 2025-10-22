
// import React, { useEffect, useState } from 'react';

// export default function AdminDashboard({ token }) {
//   const [users, setUsers] = useState([]);
//   const [events, setEvents] = useState([]);
//   const [rejectedEvents, setRejectedEvents] = useState([]);

//   useEffect(() => {
//     fetchUsers();
//     fetchEvents();
//     fetchRejectedEvents();
//   }, []);

//   async function fetchUsers() {
//     const res = await fetch('http://localhost:5000/api/admin/users', {
//       headers: { Authorization: 'Bearer ' + token },
//     });
//     if (res.ok) setUsers(await res.json());
//   }

//   async function fetchEvents() {
//     const res = await fetch('http://localhost:5000/api/events');
//     if (res.ok) setEvents(await res.json());
//   }

//   async function fetchRejectedEvents() {
//     const res = await fetch('http://localhost:5000/api/admin/events/rejected', {
//       headers: { Authorization: 'Bearer ' + token },
//     });
//     if (res.ok) setRejectedEvents(await res.json());
//   }

//   async function changeRole(id, role) {
//     await fetch(`http://localhost:5000/api/admin/users/${id}/role`, {
//       method: 'PUT',
//       headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
//       body: JSON.stringify({ role }),
//     });
//     fetchUsers();
//   }

//   async function setStatus(id, status) {
//     await fetch(`http://localhost:5000/api/admin/events/${id}/status`, {
//       method: 'PUT',
//       headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
//       body: JSON.stringify({ status }),
//     });
//     fetchEvents();
//     fetchRejectedEvents();
//   }

//   async function deleteEvent(id) {
//     if (window.confirm('Are you sure you want to delete this event?')) {
//       await fetch(`http://localhost:5000/api/admin/events/${id}`, {
//         method: 'DELETE',
//         headers: { Authorization: 'Bearer ' + token },
//       });
//       fetchEvents();
//       fetchRejectedEvents();
//     }
//   }

//   return (
//     <div className="p-6 text-white">
//       <h3 className="text-3xl font-extrabold mb-8 text-center drop-shadow-lg tracking-wide">
//         🛠️ Admin Dashboard
//       </h3>

//       {/* USERS SECTION */}
//       <section className="mb-10 bg-white/10 backdrop-blur-lg p-5 rounded-2xl border border-white/20 shadow-lg transition-all hover:shadow-2xl">
//         <h4 className="font-semibold text-blue-300 text-xl mb-3">👥 Manage Users</h4>
//         {users.map((u) => (
//           <div
//             key={u._id}
//             className="p-3 my-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex justify-between items-center transition"
//           >
//             <div>
//               <div className="font-semibold">{u.name}</div>
//               <div className="text-sm text-gray-300">
//                 {u.email} • Role:{' '}
//                 <span className="font-medium text-indigo-300">{u.role}</span>
//               </div>
//             </div>
//             <div className="flex gap-2">
//               <button
//                 onClick={() => changeRole(u._id, 'admin')}
//                 className="px-3 py-1 rounded-lg bg-blue-500 hover:bg-blue-600 text-sm"
//               >
//                 Make Admin
//               </button>
//               <button
//                 onClick={() => changeRole(u._id, 'organizer')}
//                 className="px-3 py-1 rounded-lg bg-green-500 hover:bg-green-600 text-sm"
//               >
//                 Make Organizer
//               </button>
//               <button
//                 onClick={() => changeRole(u._id, 'customer')}
//                 className="px-3 py-1 rounded-lg bg-gray-500 hover:bg-gray-600 text-sm"
//               >
//                 Make Customer
//               </button>
//             </div>
//           </div>
//         ))}
//       </section>

//       {/* ACTIVE EVENTS */}
//       <section className="mb-10 bg-white/10 backdrop-blur-lg p-5 rounded-2xl border border-white/20 shadow-lg transition-all hover:shadow-2xl">
//         <h4 className="font-semibold text-green-300 text-xl mb-3">✅ Active / Pending Events</h4>
//         {events.length === 0 && <p className="text-gray-300">No events currently available.</p>}
//         {events.map((ev) => (
//           <div
//             key={ev._id}
//             className="p-3 my-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition"
//           >
//             <div className="font-semibold text-lg">{ev.title}</div>
//             <div className="text-sm text-gray-300">
//               Organizer: {ev.organizer?.name || 'Unknown'} • Status:{' '}
//               <span
//                 className={`font-medium ${
//                   ev.status === 'approved'
//                     ? 'text-green-400'
//                     : ev.status === 'pending'
//                     ? 'text-yellow-400'
//                     : 'text-red-400'
//                 }`}
//               >
//                 {ev.status}
//               </span>
//             </div>
//             <div className="mt-2 flex gap-2">
//               <button
//                 onClick={() => setStatus(ev._id, 'approved')}
//                 className="px-3 py-1 rounded-lg bg-green-500 hover:bg-green-600 text-sm"
//               >
//                 Approve
//               </button>
//               <button
//                 onClick={() => setStatus(ev._id, 'rejected')}
//                 className="px-3 py-1 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-sm"
//               >
//                 Reject
//               </button>
//               <button
//                 onClick={() => deleteEvent(ev._id)}
//                 className="px-3 py-1 rounded-lg bg-red-500 hover:bg-red-600 text-sm"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         ))}
//       </section>

//       {/* REJECTED EVENTS */}
//       <section className="bg-white/10 backdrop-blur-lg p-5 rounded-2xl border border-white/20 shadow-lg hover:shadow-2xl transition">
//         <h4 className="font-semibold text-red-400 text-xl mb-3">🗑️ Rejected Events Log</h4>
//         {rejectedEvents.length === 0 && (
//           <p className="text-gray-300 italic">No rejected events currently.</p>
//         )}
//         {rejectedEvents.map((ev) => (
//           <div
//             key={ev._id}
//             className="p-3 my-2 rounded-lg bg-red-900/20 border border-red-400/30 hover:bg-red-900/30 transition"
//           >
//             <div className="font-semibold text-lg">{ev.title}</div>
//             <div className="text-sm text-gray-300">
//               Organizer: {ev.organizer?.name || 'Unknown'}
//             </div>
//             <div className="mt-2 flex gap-2">
//               <button
//                 onClick={() => setStatus(ev._id, 'approved')}
//                 className="px-3 py-1 rounded-lg bg-green-500 hover:bg-green-600 text-sm"
//               >
//                 Re-Approve
//               </button>
//               <button
//                 onClick={() => deleteEvent(ev._id)}
//                 className="px-3 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-sm"
//               >
//                 Delete Permanently
//               </button>
//             </div>
//           </div>
//         ))}
//       </section>
//     </div>
//   );
// }
// import React, { useEffect, useState } from 'react';

// /**
//  * AdminDashboard.js
//  * - Preserves current admin features (fetch events/all, update status, poster upload/delete)
//  * - Improved layout: summary cards, clearer table-like list, consistent controls
//  * - Poster modal improved; keyboard accessible and prevents background scroll while open
//  */

// export default function AdminDashboard({ token }) {
//   const [events, setEvents] = useState([]);
//   const [posterModal, setPosterModal] = useState(null);
//   const [posterFile, setPosterFile] = useState(null);
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     setUser(JSON.parse(localStorage.getItem('user') || 'null'));
//     fetchEvents();
//   }, []);

//   // prevent background scroll when poster modal open
//   useEffect(() => {
//     document.body.style.overflow = posterModal ? 'hidden' : '';
//     return () => (document.body.style.overflow = '');
//   }, [posterModal]);

//   // close on Escape
//   useEffect(() => {
//     function onKey(e) {
//       if (e.key === 'Escape') setPosterModal(null);
//     }
//     window.addEventListener('keydown', onKey);
//     return () => window.removeEventListener('keydown', onKey);
//   }, []);

//   // inside AdminDashboard.js — replace existing fetchEvents with this
//   const fetchEvents = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch('http://localhost:5000/api/events/all', {
//         headers: { Authorization: 'Bearer ' + token },
//       });

//       // If server returns non-OK (500, 404, etc) try to parse JSON for message, else fallback.
//       if (!res.ok) {
//         let text;
//         try {
//           const errBody = await res.json();
//           console.error('fetchEvents server error body:', errBody);
//           text = errBody?.message || JSON.stringify(errBody);
//         } catch (parseErr) {
//           // not JSON
//           text = await res.text().catch(() => 'No response body');
//         }
//         console.error(`fetchEvents failed: ${res.status} ${res.statusText} — ${text}`);
//         setEvents([]); // safe fallback
//         return;
//       }

//       // res.ok === true
//       let data;
//       try {
//         data = await res.json();
//       } catch (parseErr) {
//         console.error('fetchEvents: response ok but failed to parse JSON:', parseErr);
//         setEvents([]);
//         return;
//       }

//       // Debug output (remove in production)
//       console.debug('fetchEvents response:', data);

//       // Normalize possible shapes to an array
//       const evList = Array.isArray(data)
//         ? data
//         : Array.isArray(data?.events)
//           ? data.events
//           : Array.isArray(data?.data)
//             ? data.data
//             : [];

//       setEvents(evList);
//     } catch (err) {
//       console.error('Network/fetch error in fetchEvents:', err);
//       setEvents([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateStatus = async (id, status) => {
//     const res = await fetch(`http://localhost:5000/api/events/${id}/status`, {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: 'Bearer ' + token,
//       },
//       body: JSON.stringify({ status }),
//     });
//     if (res.ok) fetchEvents();
//     else alert('Failed to update status');
//   };

//   const updatePoster = async (id) => {
//     if (!posterFile) return alert('Please select a file first.');
//     const formData = new FormData();
//     formData.append('poster', posterFile);

//     const res = await fetch(`http://localhost:5000/api/events/${id}/poster`, {
//       method: 'PUT',
//       headers: { Authorization: 'Bearer ' + token },
//       body: formData,
//     });
//     if (res.ok) {
//       alert('Poster updated successfully!');
//       setPosterModal(null);
//       setPosterFile(null);
//       fetchEvents();
//     } else {
//       alert('Error updating poster.');
//     }
//   };

//   const deletePoster = async (id) => {
//     const confirmDel = window.confirm('Delete this poster?');
//     if (!confirmDel) return;
//     const res = await fetch(`http://localhost:5000/api/events/${id}/poster`, {
//       method: 'DELETE',
//       headers: { Authorization: 'Bearer ' + token },
//     });
//     if (res.ok) {
//       alert('Poster removed successfully!');
//       fetchEvents();
//     } else {
//       alert('Error deleting poster.');
//     }
//   };

//   // Helper: summary stats
//   const stats = events.reduce(
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
//     <div className="max-w-6xl mx-auto px-4 py-8">
//       <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
//         <div>
//           <h3 className="text-2xl font-extrabold text-gray-800">🧭 Admin Dashboard</h3>
//           <p className="mt-1 text-sm text-gray-500">Moderate events, upload posters and track activity.</p>
//         </div>

//         <div className="flex items-center gap-3">
//           <button
//             onClick={fetchEvents}
//             className="px-3 py-1.5 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700"
//           >
//             Refresh
//           </button>
//         </div>
//       </header>

//       <section className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
//         <div className="bg-white rounded-2xl p-4 shadow-sm">
//           <div className="text-sm text-gray-500">Total events</div>
//           <div className="mt-2 text-2xl font-semibold text-indigo-700">{stats.total}</div>
//         </div>
//         <div className="bg-white rounded-2xl p-4 shadow-sm">
//           <div className="text-sm text-gray-500">Approved</div>
//           <div className="mt-2 text-2xl font-semibold text-green-600">{stats.approved}</div>
//         </div>
//         <div className="bg-white rounded-2xl p-4 shadow-sm">
//           <div className="text-sm text-gray-500">Pending</div>
//           <div className="mt-2 text-2xl font-semibold text-yellow-600">{stats.pending}</div>
//         </div>
//         <div className="bg-white rounded-2xl p-4 shadow-sm">
//           <div className="text-sm text-gray-500">Rejected</div>
//           <div className="mt-2 text-2xl font-semibold text-red-600">{stats.rejected}</div>
//         </div>
//       </section>

//       <section className="bg-white rounded-2xl shadow-sm p-4">
//         <div className="mb-4 flex items-center justify-between">
//           <h4 className="text-lg font-medium text-gray-800">Events</h4>
//           <div className="text-sm text-gray-500">{loading ? 'Loading...' : `${events.length} events`}</div>
//         </div>

//         <div className="divide-y">
//           {events.length === 0 && <div className="text-gray-500 p-6">No events found.</div>}

//           {events.map((ev) => (
//             <div key={ev._id} className="py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
//               <div className="flex items-start gap-4">
//                 <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
//                   <img
//                     src={ev.poster ? `http://localhost:5000${ev.poster}` : '/images/sample-poster.jpg'}
//                     alt={ev.title}
//                     className="w-full h-full object-cover"
//                   />
//                 </div>

//                 <div>
//                   <div className="font-semibold text-gray-800">{ev.title}</div>
//                   <div className="text-sm text-gray-500 mt-1 line-clamp-2">{ev.description}</div>
//                   <div className="text-xs text-gray-400 mt-1">
//                     Organizer: {ev.organizer?.name || 'Unknown'} · ₹{ev.price}
//                   </div>
//                 </div>
//               </div>

//               <div className="flex items-center gap-2">
//                 {/* Status pills */}
//                 <div className="text-sm">
//                   <span
//                     className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${ev.status === 'approved'
//                         ? 'bg-green-50 text-green-700'
//                         : ev.status === 'pending'
//                           ? 'bg-yellow-50 text-yellow-700'
//                           : 'bg-red-50 text-red-700'
//                       }`}
//                   >
//                     {ev.status}
//                   </span>
//                 </div>

//                 {/* Approve/Reject */}
//                 <div className="flex gap-2">
//                   {ev.status !== 'approved' && (
//                     <button
//                       onClick={() => updateStatus(ev._id, 'approved')}
//                       className="px-3 py-1.5 bg-green-600 text-white rounded-md text-sm hover:bg-green-700"
//                     >
//                       Approve
//                     </button>
//                   )}
//                   {ev.status !== 'rejected' && (
//                     <button
//                       onClick={() => updateStatus(ev._id, 'rejected')}
//                       className="px-3 py-1.5 bg-red-500 text-white rounded-md text-sm hover:bg-red-600"
//                     >
//                       Reject
//                     </button>
//                   )}
//                 </div>

//                 {/* Poster controls */}
//                 <div className="flex items-center gap-2">
//                   {ev.poster && (
//                     <button
//                       onClick={() => setPosterModal(ev)}
//                       className="px-3 py-1.5 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700"
//                     >
//                       View Poster
//                     </button>
//                   )}

//                   <label className="cursor-pointer inline-flex items-center px-3 py-1.5 bg-yellow-500 text-white rounded-md text-sm hover:bg-yellow-600">
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
//                     className={`px-3 py-1.5 rounded-md text-sm ${posterFile ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-600 cursor-not-allowed'
//                       }`}
//                   >
//                     Save
//                   </button>

//                   {ev.poster && (
//                     <button
//                       onClick={() => deletePoster(ev._id)}
//                       className="px-3 py-1.5 bg-red-400 text-white rounded-md text-sm hover:bg-red-500"
//                     >
//                       Delete
//                     </button>
//                   )}
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
//           role="dialog"
//           aria-modal="true"
//           onClick={() => setPosterModal(null)}
//         >
//           <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

//           <div
//             className="relative z-10 w-11/12 max-w-3xl bg-white rounded-2xl p-4 shadow-2xl"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <button
//               onClick={() => setPosterModal(null)}
//               className="absolute top-3 right-3 bg-white/80 rounded-full p-1 hover:bg-white text-gray-700"
//               aria-label="Close poster"
//             >
//               ✕
//             </button>

//             <div className="mb-4">
//               <img
//                 src={`http://localhost:5000${posterModal.poster}`}
//                 alt="Poster"
//                 className="w-full h-auto max-h-[80vh] object-contain rounded-md"
//               />
//             </div>

//             <div className="flex justify-end gap-2">
//               <button
//                 onClick={() => { setPosterModal(null); setPosterFile(null); }}
//                 className="px-3 py-1.5 rounded-md bg-gray-200 text-sm"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// src/pages/AdminDashboard.js


//2ns comment
// import React, { useEffect, useState } from 'react';

// export default function AdminDashboard({ token }) {
//   const [events, setEvents] = useState([]);
//   const [posterModal, setPosterModal] = useState(null);
//   const [logsModal, setLogsModal] = useState(null); // { eventId, logs: [] }
//   const [posterFile, setPosterFile] = useState(null);
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     setUser(JSON.parse(localStorage.getItem('user') || 'null'));
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
//     if (!confirm('Approve this event? It will become open to users.')) return;
//     await updateStatus(id, 'approved', 'Approved by admin');
//   };

//   const deleteEvent = async (id) => {
//     if (!confirm('Permanently delete this event? This cannot be undone.')) return;
//     try {
//       const res = await fetch(`http://localhost:5000/api/events/${id}`, {
//         method: 'DELETE',
//         headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
//         body: JSON.stringify({ reason: 'Deleted by admin' }),
//       });
//       if (res.ok) {
//         alert('Deleted');
//         fetchEvents();
//       } else {
//         const j = await res.json().catch(() => null);
//         alert(j?.message || 'Delete failed');
//       }
//     } catch (err) {
//       console.error(err);
//       alert('Network error');
//     }
//   };

//   const openLogs = async (eventId) => {
//     try {
//       const res = await fetch(`http://localhost:5000/api/events/${eventId}/logs`, {
//         headers: { Authorization: 'Bearer ' + token },
//       });
//       if (!res.ok) {
//         alert('Failed to load logs');
//         return;
//       }
//       const logs = await res.json();
//       setLogsModal({ eventId, logs: Array.isArray(logs) ? logs : [] });
//     } catch (err) {
//       console.error(err);
//       alert('Network error');
//     }
//   };

//   const updatePoster = async (id) => {
//     if (!posterFile) return alert('Please select a file first.');
//     const formData = new FormData();
//     formData.append('poster', posterFile);

//     const res = await fetch(`http://localhost:5000/api/events/${id}`, {
//       method: 'PUT',
//       headers: { Authorization: 'Bearer ' + token },
//       body: formData,
//     });
//     if (res.ok) {
//       alert('Poster updated successfully!');
//       setPosterModal(null);
//       setPosterFile(null);
//       fetchEvents();
//     } else {
//       alert('Error updating poster.');
//     }
//   };

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
//       <header className="flex items-center justify-between mb-4">
//         <div>
//           <h3 className="text-2xl font-bold">🧭 Admin Dashboard</h3>
//           <p className="text-sm text-gray-500">Moderate events, upload posters and track activity.</p>
//         </div>
//         <div>
//           <button onClick={fetchEvents} className="px-3 py-1.5 bg-indigo-600 text-white rounded-md">Refresh</button>
//         </div>
//       </header>

//       <div className="grid grid-cols-4 gap-4 mb-6">
//         <div className="p-4 bg-white rounded-lg shadow-sm">
//           <div className="text-sm text-gray-500">Total events</div>
//           <div className="text-2xl font-semibold text-indigo-700">{stats.total}</div>
//         </div>
//         <div className="p-4 bg-white rounded-lg shadow-sm">
//           <div className="text-sm text-gray-500">Approved</div>
//           <div className="text-2xl font-semibold text-green-600">{stats.approved}</div>
//         </div>
//         <div className="p-4 bg-white rounded-lg shadow-sm">
//           <div className="text-sm text-gray-500">Pending</div>
//           <div className="text-2xl font-semibold text-yellow-600">{stats.pending}</div>
//         </div>
//         <div className="p-4 bg-white rounded-lg shadow-sm">
//           <div className="text-sm text-gray-500">Rejected</div>
//           <div className="text-2xl font-semibold text-red-600">{stats.rejected}</div>
//         </div>
//       </div>

//       <section className="bg-white rounded-lg p-4 shadow-sm">
//         <div className="flex items-center justify-between mb-4">
//           <h4 className="text-lg font-medium">Events</h4>
//           <div className="text-sm text-gray-500">{loading ? 'Loading...' : `${safeEvents.length} events`}</div>
//         </div>

//         <div className="divide-y">
//           {safeEvents.length === 0 && <div className="text-gray-500 p-6">No events found.</div>}

//           {safeEvents.map((ev) => (
//             <div key={ev._id} className="py-4 flex items-start justify-between gap-4">
//               <div className="flex items-start gap-4">
//                 <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
//                   <img src={ev.poster ? `http://localhost:5000${ev.poster}` : '/images/sample-poster.jpg'} alt={ev.title} className="w-full h-full object-cover" />
//                 </div>
//                 <div>
//                   <div className="font-semibold">{ev.title}</div>
//                   <div className="text-sm text-gray-500">{ev.description}</div>
//                   <div className="text-xs text-gray-400 mt-1">Organizer: {ev.organizer?.name || 'Unknown'} · ₹{ev.price}</div>
//                 </div>
//               </div>

//               <div className="flex items-center gap-2">
//                 <div>
//                   <span className={`px-3 py-1 rounded-full text-xs ${ev.status === 'approved' ? 'bg-green-50 text-green-700' : ev.status === 'pending' ? 'bg-yellow-50 text-yellow-700' : 'bg-red-50 text-red-700'}`}>
//                     {ev.status}
//                   </span>
//                 </div>

//                 <div className="flex gap-2">
//                   {/* Approve / Reject (admin) */}
//                   <button onClick={() => approveEvent(ev._id)} className="px-3 py-1.5 bg-green-600 text-white rounded-md text-sm">Approve</button>
//                   <button onClick={() => askAndReject(ev._id)} className="px-3 py-1.5 bg-red-500 text-white rounded-md text-sm">Reject</button>

//                   {/* View Logs */}
//                   <button onClick={() => openLogs(ev._id)} className="px-3 py-1.5 bg-gray-100 rounded-md text-sm">Logs</button>

//                   {/* Poster controls */}
//                   {ev.poster && <button onClick={() => setPosterModal(ev)} className="px-3 py-1.5 bg-indigo-600 text-white rounded-md text-sm">View Poster</button>}

//                   <label className="cursor-pointer inline-flex items-center px-3 py-1.5 bg-yellow-500 text-white rounded-md text-sm">
//                     <input type="file" className="hidden" onChange={(e) => setPosterFile(e.target.files[0])} />
//                     Upload
//                   </label>

//                   <button onClick={() => updatePoster(ev._id)} disabled={!posterFile} className={`px-3 py-1.5 rounded-md text-sm ${posterFile ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}>Save</button>

//                   <button onClick={() => deleteEvent(ev._id)} className="px-3 py-1.5 bg-red-400 text-white rounded-md text-sm">Delete</button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* Poster Modal */}
//       {posterModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setPosterModal(null)}>
//           <div className="absolute inset-0 bg-black/60" />
//           <div className="relative z-10 bg-white rounded-2xl p-4 max-w-3xl w-11/12" onClick={(e) => e.stopPropagation()}>
//             <button onClick={() => setPosterModal(null)} className="absolute top-3 right-3">✕</button>
//             <img src={`http://localhost:5000${posterModal.poster}`} alt="poster" className="w-full object-contain" />
//           </div>
//         </div>
//       )}

//       {/* Logs Modal */}
//       {logsModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setLogsModal(null)}>
//           <div className="absolute inset-0 bg-black/50" />
//           <div className="relative z-10 bg-white rounded-2xl p-6 max-w-xl w-11/12" onClick={(e) => e.stopPropagation()}>
//             <div className="flex items-center justify-between mb-4">
//               <h4 className="text-lg font-semibold">Event logs</h4>
//               <button onClick={() => setLogsModal(null)}>✕</button>
//             </div>

//             <div className="space-y-3 max-h-96 overflow-auto">
//               {logsModal.logs.length === 0 ? (
//                 <div className="text-gray-500">No logs for this event.</div>
//               ) : (
//                 logsModal.logs.map((l) => (
//                   <div key={l._id} className="p-3 border rounded">
//                     <div className="text-sm font-medium">{l.action}</div>
//                     <div className="text-xs text-gray-500">{new Date(l.createdAt).toLocaleString()}</div>
//                     <div className="text-sm text-gray-700 mt-2">By: {l.by?.name || '—'}</div>
//                     {l.reason && <div className="text-sm mt-1 text-gray-600">Reason: {l.reason}</div>}
//                   </div>
//                 ))
//               )}
//             </div>

//             <div className="mt-4 text-right">
//               <button onClick={() => setLogsModal(null)} className="px-3 py-1.5 bg-gray-200 rounded">Close</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


// src/pages/AdminDashboard.js
import React, { useEffect, useState } from 'react';

/**
 * Admin dashboard
 * - Tabs: Pending / Approved / Rejected
 * - Aligned action buttons, consistent sizes
 * - Logs modal + Poster modal (kept)
 * - Uses provided endpoints: /api/events/all, /api/events/:id/status, /api/events/:id, /api/events/:id/logs
 */

export default function AdminDashboard({ token }) {
  const [events, setEvents] = useState([]);
  const [tab, setTab] = useState('pending'); // pending | approved | rejected
  const [posterModal, setPosterModal] = useState(null);
  const [logsModal, setLogsModal] = useState(null); // { eventId, logs: [] }
  const [posterFile, setPosterFile] = useState(null);
  const [user] = useState(JSON.parse(localStorage.getItem('user') || 'null'));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // prevent background scroll when modal open
    const any = posterModal || logsModal;
    document.body.style.overflow = any ? 'hidden' : '';
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
    if (!confirm('Approve this event? It will become open to users.')) return;
    await updateStatus(id, 'approved', 'Approved by admin');
  };

  const deleteEvent = async (id) => {
    if (!confirm('Permanently delete this event? This cannot be undone.')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/events/${id}`, {
        method: 'DELETE',
        headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'Deleted by admin' }),
      });
      if (res.ok) {
        alert('Deleted');
        fetchEvents();
      } else {
        const j = await res.json().catch(() => null);
        alert(j?.message || 'Delete failed');
      }
    } catch (err) {
      console.error(err);
      alert('Network error');
    }
  };

  const openLogs = async (eventId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/events/${eventId}/logs`, {
        headers: { Authorization: 'Bearer ' + token },
      });
      if (!res.ok) {
        alert('Failed to load logs');
        return;
      }
      const logs = await res.json();
      setLogsModal({ eventId, logs: Array.isArray(logs) ? logs : [] });
    } catch (err) {
      console.error(err);
      alert('Network error');
    }
  };

  const updatePoster = async (id) => {
    if (!posterFile) return alert('Please select a file first.');
    const formData = new FormData();
    formData.append('poster', posterFile);

    const res = await fetch(`http://localhost:5000/api/events/${id}`, {
      method: 'PUT',
      headers: { Authorization: 'Bearer ' + token },
      body: formData,
    });
    if (res.ok) {
      alert('Poster updated successfully!');
      setPosterModal(null);
      setPosterFile(null);
      fetchEvents();
    } else {
      alert('Error updating poster.');
    }
  };

  // stats
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

  const filtered = safeEvents.filter((e) => {
    if (tab === 'approved') return e.status === 'approved';
    if (tab === 'pending') return e.status === 'pending';
    if (tab === 'rejected') return e.status === 'rejected';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto">
      <header className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold">🧭 Admin Dashboard</h3>
          <p className="text-sm text-gray-500">Moderate events, upload posters and track activity.</p>
        </div>

        <div>
          <button onClick={fetchEvents} className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700">
            Refresh
          </button>
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-white rounded-lg shadow-sm">
          <div className="text-sm text-gray-500">Total events</div>
          <div className="text-2xl font-semibold text-indigo-700">{stats.total}</div>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-sm">
          <div className="text-sm text-gray-500">Approved</div>
          <div className="text-2xl font-semibold text-green-600">{stats.approved}</div>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-sm">
          <div className="text-sm text-gray-500">Pending</div>
          <div className="text-2xl font-semibold text-yellow-600">{stats.pending}</div>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-sm">
          <div className="text-sm text-gray-500">Rejected</div>
          <div className="text-2xl font-semibold text-red-600">{stats.rejected}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 mb-4">
        {['pending', 'approved', 'rejected'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-md font-medium ${
              tab === t ? 'bg-indigo-600 text-white shadow' : 'bg-white border'
            }`}
          >
            {t[0].toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Events list */}
      <section className="bg-white rounded-lg p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-medium capitalize">{tab} events</h4>
          <div className="text-sm text-gray-500">{loading ? 'Loading...' : `${filtered.length} events`}</div>
        </div>

        <div className="divide-y">
          {filtered.length === 0 && <div className="text-gray-500 p-6">No events found.</div>}

          {filtered.map((ev) => (
            <div key={ev._id} className="py-4 flex flex-col md:flex-row md:items-start md:justify-between gap-3">
              {/* left: thumbnail + basic info */}
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <img
                    src={ev.poster ? `http://localhost:5000${ev.poster}` : '/images/sample-poster.jpg'}
                    alt={ev.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div>
                  <div className="font-semibold text-gray-800">{ev.title}</div>
                  <div className="text-sm text-gray-500 mt-1 line-clamp-2">{ev.description}</div>
                  <div className="text-xs text-gray-400 mt-1">Organizer: {ev.organizer?.name || 'Unknown'} · ₹{ev.price}</div>
                </div>
              </div>

              {/* right: status + actions */}
              <div className="flex flex-col items-end gap-3">
                <div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      ev.status === 'approved' ? 'bg-green-50 text-green-700' : ev.status === 'pending' ? 'bg-yellow-50 text-yellow-700' : 'bg-red-50 text-red-700'
                    }`}
                  >
                    {ev.status}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 items-center justify-end">
                  {/* Approve / Reject */}
                  <button onClick={() => approveEvent(ev._id)} className="px-3 py-1.5 bg-green-600 text-white rounded-md text-sm">Approve</button>
                  <button onClick={() => askAndReject(ev._id)} className="px-3 py-1.5 bg-red-500 text-white rounded-md text-sm">Reject</button>

                  {/* Logs */}
                  <button onClick={() => openLogs(ev._id)} className="px-3 py-1.5 bg-gray-100 rounded-md text-sm">Logs</button>

                  {/* Poster controls */}
                  {ev.poster && <button onClick={() => setPosterModal(ev)} className="px-3 py-1.5 bg-indigo-600 text-white rounded-md text-sm">View Poster</button>}

                  <label className="cursor-pointer inline-flex items-center px-3 py-1.5 bg-yellow-500 text-white rounded-md text-sm">
                    <input type="file" className="hidden" onChange={(e) => setPosterFile(e.target.files[0])} />
                    Upload
                  </label>

                  <button
                    onClick={() => updatePoster(ev._id)}
                    disabled={!posterFile}
                    className={`px-3 py-1.5 rounded-md text-sm ${posterFile ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}
                  >
                    Save
                  </button>

                  <button onClick={() => deleteEvent(ev._id)} className="px-3 py-1.5 bg-red-400 text-white rounded-md text-sm">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Poster Modal */}
      {posterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setPosterModal(null)}>
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative z-10 bg-white rounded-2xl p-4 max-w-3xl w-11/12" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setPosterModal(null)} className="absolute top-3 right-3">✕</button>
            <img src={`http://localhost:5000${posterModal.poster}`} alt="poster" className="w-full object-contain" />
          </div>
        </div>
      )}

      {/* Logs Modal */}
      {logsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setLogsModal(null)}>
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 bg-white rounded-2xl p-6 max-w-xl w-11/12" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold">Event logs</h4>
              <button onClick={() => setLogsModal(null)}>✕</button>
            </div>

            <div className="space-y-3 max-h-96 overflow-auto">
              {logsModal.logs.length === 0 ? (
                <div className="text-gray-500">No logs for this event.</div>
              ) : (
                logsModal.logs.map((l) => (
                  <div key={l._id} className="p-3 border rounded">
                    <div className="text-sm font-medium">{l.action}</div>
                    <div className="text-xs text-gray-500">{new Date(l.createdAt).toLocaleString()}</div>
                    <div className="text-sm text-gray-700 mt-2">By: {l.by?.name || '—'}</div>
                    {l.reason && <div className="text-sm mt-1 text-gray-600">Reason: {l.reason}</div>}
                  </div>
                ))
              )}
            </div>

            <div className="mt-4 text-right">
              <button onClick={() => setLogsModal(null)} className="px-3 py-1.5 bg-gray-200 rounded">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

