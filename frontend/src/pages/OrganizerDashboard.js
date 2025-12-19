



// src/pages/OrganizerDashboard.js
// import React, { useEffect, useState } from 'react';
// import EventCreate from './EventCreate';

// export default function OrganizerDashboard({ token }) {
//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [posterFile, setPosterFile] = useState(null);
//   const [posterModal, setPosterModal] = useState(null);

//   // 🔹 NEW
//   const [editEvent, setEditEvent] = useState(null);

//   useEffect(() => {
//     fetchMyEvents();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const fetchMyEvents = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch('http://localhost:5000/api/events/mine', {
//         headers: { Authorization: 'Bearer ' + token },
//       });
//       const data = await res.json();
//       setEvents(Array.isArray(data) ? data : []);
//     } catch {
//       setEvents([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const deleteEvent = async (id) => {
//     if (!window.confirm('Delete this event?')) return;
//     const res = await fetch(`http://localhost:5000/api/events/${id}`, {
//       method: 'DELETE',
//       headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
//       body: JSON.stringify({ reason: 'Deleted by organizer' }),
//     });
//     if (res.ok) fetchMyEvents();
//   };

//   const uploadPoster = async (id) => {
//     if (!posterFile) return;
//     const fd = new FormData();
//     fd.append('poster', posterFile);
//     const res = await fetch(`http://localhost:5000/api/events/${id}`, {
//       method: 'PUT',
//       headers: { Authorization: 'Bearer ' + token },
//       body: fd,
//     });
//     if (res.ok) {
//       setPosterModal(null);
//       setPosterFile(null);
//       fetchMyEvents();
//     }
//   };

//   return (
//     <div>
//       <div className="mb-4 flex justify-between">
//         <h3 className="text-lg font-semibold">My Events</h3>
//         <span className="text-sm text-gray-500">{loading ? 'Loading...' : `${events.length} events`}</span>
//       </div>

//       <div className="space-y-4">
//         {events.map((ev) => (
//           <div key={ev._id} className="bg-white p-4 rounded-lg shadow flex flex-col md:flex-row md:justify-between gap-3">
//             <div className="flex gap-4">
//               <img
//                 src={ev.poster ? `http://localhost:5000${ev.poster}` : '/images/sample-poster.jpg'}
//                 className="w-20 h-20 object-cover rounded"
//                 alt=""
//               />
//               <div>
//                 <div className="font-semibold">{ev.title}</div>
//                 <div className="text-sm text-gray-500">{ev.description}</div>
//                 <div className="text-xs mt-1">
//                   Status:{' '}
//                   <span className={
//                     ev.status === 'approved' ? 'text-green-600'
//                     : ev.status === 'pending' ? 'text-yellow-600'
//                     : 'text-red-600'
//                   }>
//                     {ev.status}
//                   </span>
//                 </div>
//               </div>
//             </div>

//             <div className="flex gap-2 flex-wrap">
//               {/* 🔹 EDIT (modal) */}
//               <button
//                 onClick={() => setEditEvent(ev)}
//                 className="px-3 py-1.5 bg-indigo-600 text-white rounded text-sm"
//               >
//                 Edit
//               </button>

//               <button
//                 onClick={() => setPosterModal(ev)}
//                 className="px-3 py-1.5 bg-yellow-500 text-white rounded text-sm"
//               >
//                 Poster
//               </button>

//               <button
//                 onClick={() => deleteEvent(ev._id)}
//                 className="px-3 py-1.5 bg-red-500 text-white rounded text-sm"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* 🔹 EDIT MODAL */}
//       {editEvent && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
//           <div className="bg-white rounded-xl w-11/12 max-w-2xl p-6">
//             <EventCreate
//               token={token}
//               initialData={editEvent}
//               onClose={() => {
//                 setEditEvent(null);
//                 fetchMyEvents();
//               }}
//             />
//           </div>
//         </div>
//       )}

//       {/* Poster Modal */}
//       {posterModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
//           <div className="bg-white p-6 rounded-xl">
//             <input type="file" onChange={(e) => setPosterFile(e.target.files[0])} />
//             <div className="mt-4 flex gap-2">
//               <button onClick={() => setPosterModal(null)} className="px-3 py-1 bg-gray-200 rounded">Cancel</button>
//               <button onClick={() => uploadPoster(posterModal._id)} className="px-3 py-1 bg-blue-600 text-white rounded">
//                 Upload
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

//revert area 

// import React, { useEffect, useState } from 'react';
// import toast from 'react-hot-toast';

// export default function OrganizerDashboard({ token }) {
//   const [events, setEvents] = useState([]);
//   const [editEvent, setEditEvent] = useState(null);
//   const [reason, setReason] = useState('');
//   const [editModal, setEditModal] = useState(false);
//   const [editReason, setEditReason] = useState('');


//   useEffect(() => {
//     fetchMyEvents();
//     // eslint-disable-next-line
//   }, []);

//   const fetchMyEvents = async () => {
//     try {
//       const res = await fetch('http://localhost:5000/api/events/mine', {
//         headers: { Authorization: 'Bearer ' + token },
//       });
//       const data = await res.json();
//       setEvents(Array.isArray(data) ? data : []);
//     } catch {
//       toast.error('Failed to load your events');
//     }
//   };

//   const submitEdit = async () => {
//     if (!reason.trim()) {
//       toast.error('Please provide a reason for changes');
//       return;
//     }

//     try {
//       const res = await fetch(`http://localhost:5000/api/events/${editEvent._id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: 'Bearer ' + token,
//         },
//         body: JSON.stringify({ ...editEvent, reason }),
//       });

//       if (res.ok) {
//         toast.success('Changes sent for admin approval');
//         setEditEvent(null);
//         setReason('');
//         fetchMyEvents();
//       } else {
//         toast.error('Update failed');
//       }
//     } catch {
//       toast.error('Network error');
//     }
//   };

//   return (
//     <div>
//       <h3 className="text-lg font-bold mb-3">🎤 My Events</h3>

//       {events.map((ev) => (
//         <div key={ev._id} className="border rounded-lg p-3 mb-3 bg-white">
//           <div className="font-semibold">{ev.title}</div>

//           <div className="text-sm mt-1 flex gap-2 items-center">
//             {ev.status === 'pending' && (
//               <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs">
//                 Awaiting admin approval
//               </span>
//             )}
//             {ev.status === 'approved' && (
//               <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">
//                 Approved
//               </span>
//             )}
//             {ev.status === 'rejected' && (
//               <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs">
//                 Rejected
//               </span>
//             )}
//           </div>

//           <button
//             onClick={() => setEditEvent({ ...ev })}
//             className="mt-2 px-3 py-1 bg-indigo-600 text-white rounded text-sm"
//           >
//             Edit
//           </button>
//         </div>
//       ))}

//       {/* Edit Modal */}
//       {editEvent && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-4 w-full max-w-md">
//             <h4 className="font-semibold mb-3">Edit Event</h4>

//             <input
//               value={editEvent.title}
//               onChange={(e) => setEditEvent({ ...editEvent, title: e.target.value })}
//               className="w-full border p-2 mb-2 rounded"
//               placeholder="Title"
//             />

//             <textarea
//               value={editEvent.description}
//               onChange={(e) =>
//                 setEditEvent({ ...editEvent, description: e.target.value })
//               }
//               className="w-full border p-2 mb-2 rounded"
//               placeholder="Description"
//             />

//             <input
//               placeholder="Reason for change"
//               className="w-full border p-2 mb-3 rounded"
//               value={reason}
//               onChange={(e) => setReason(e.target.value)}
//             />

//             <div className="flex justify-end gap-2">
//               <button
//                 onClick={() => setEditEvent(null)}
//                 className="px-3 py-1 bg-gray-200 rounded"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={submitEdit}
//                 className="px-3 py-1 bg-green-600 text-white rounded"
//               >
//                 Submit
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }



import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function OrganizerDashboard({ token }) {
  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);
  const [reason, setReason] = useState('');
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    date: '',
    location: '',
    poster: null,
  });

  // fetch organizer events
  const fetchMyEvents = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/events/mine', {
        headers: { Authorization: 'Bearer ' + token },
      });
      const data = await res.json();
      setEvents(Array.isArray(data) ? data : []);
    } catch {
      toast.error('Failed to load your events');
    }
  };

  useEffect(() => {
    fetchMyEvents();
  }, []);

  // open edit modal
  const openEdit = (ev) => {
    setEditingEvent(ev);
    setForm({
      title: ev.title || '',
      description: ev.description || '',
      price: ev.price || '',
      date: ev.date ? ev.date.slice(0, 10) : '',
      location: ev.location || '',
      poster: null,
    });
    setReason('');
  };

  // submit update
  const submitUpdate = async () => {
    if (!reason.trim()) {
      toast.error('Please provide reason for changes');
      return;
    }

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (v !== null) fd.append(k, v);
    });
    fd.append('reason', reason);

    try {
      const res = await fetch(
        `http://localhost:5000/api/events/${editingEvent._id}`,
        {
          method: 'PUT',
          headers: { Authorization: 'Bearer ' + token },
          body: fd,
        }
      );

      if (!res.ok) throw new Error();
      toast.success('Changes sent for admin approval');
      setEditingEvent(null);
      fetchMyEvents();
    } catch {
      toast.error('Update failed');
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">🎤 My Events</h3>

      {events.length === 0 && (
        <p className="text-sm text-gray-500">No events created yet.</p>
      )}

      <div className="space-y-3">
        {events.map((ev) => (
          <div
            key={ev._id}
            className="border rounded-lg p-3 flex items-center justify-between"
          >
            <div>
              <div className="font-medium">{ev.title}</div>
              <div className="text-sm text-gray-500">
                ₹{ev.price} ·{' '}
                <span
                  className={`${
                    ev.status === 'approved'
                      ? 'text-green-600'
                      : ev.status === 'pending'
                      ? 'text-yellow-600'
                      : 'text-red-600'
                  }`}
                >
                  {ev.status === 'pending'
                    ? 'Awaiting admin approval'
                    : ev.status}
                </span>
              </div>
            </div>

            <button
              onClick={() => openEdit(ev)}
              className="px-4 py-1.5 bg-indigo-600 text-white rounded text-sm"
            >
              Edit
            </button>
          </div>
        ))}
      </div>

      {/* EDIT MODAL */}
      {editingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setEditingEvent(null)}
          />
          <div className="relative bg-white w-full max-w-lg rounded-xl p-6 z-10">
            <h3 className="text-lg font-semibold mb-4">
              Edit Event — {editingEvent.title}
            </h3>

            <div className="space-y-3">
              <input
                className="w-full border rounded px-3 py-2"
                placeholder="Event title"
                value={form.title}
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value })
                }
              />

              <textarea
                className="w-full border rounded px-3 py-2"
                placeholder="Event description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />

              <div className="flex gap-2">
                <input
                  type="number"
                  className="w-1/2 border rounded px-3 py-2"
                  placeholder="Price"
                  value={form.price}
                  onChange={(e) =>
                    setForm({ ...form, price: e.target.value })
                  }
                />
                <input
                  type="date"
                  className="w-1/2 border rounded px-3 py-2"
                  value={form.date}
                  onChange={(e) =>
                    setForm({ ...form, date: e.target.value })
                  }
                />
              </div>

              <input
                className="w-full border rounded px-3 py-2"
                placeholder="Location / venue"
                value={form.location}
                onChange={(e) =>
                  setForm({ ...form, location: e.target.value })
                }
              />

              <input
                type="file"
                onChange={(e) =>
                  setForm({ ...form, poster: e.target.files[0] })
                }
              />

              <textarea
                className="w-full border rounded px-3 py-2"
                placeholder="Reason for change (required)"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={() => setEditingEvent(null)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={submitUpdate}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Submit for Approval
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

