

// import React, { useEffect, useState } from 'react';

// const API_ORIGIN = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// function getPosterUrl(poster) {
//   if (!poster) return '/images/sample-poster.jpg'; // CRA placeholder
//   if (poster.startsWith('http://') || poster.startsWith('https://')) return poster;
//   if (poster.startsWith('/')) return `${API_ORIGIN}${poster}`;
//   return `${API_ORIGIN}/${poster}`;
// }

// export default function EventList({ token }) {
//   const [events, setEvents] = useState([]);
//   const [user, setUser] = useState(null);
//   const [selectedEvent, setSelectedEvent] = useState(null); // for "More info"
//   const [posterModal, setPosterModal] = useState(null); // view poster
//   const [editModal, setEditModal] = useState(null); // { ev, form... }
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
//     setUser(storedUser);
//     fetchEvents();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   async function fetchEvents() {
//     try {
//       setLoading(true);
//       const res = await fetch(`${API_ORIGIN}/api/events`);
//       const data = await res.json();
//       const arr = Array.isArray(data) ? data : Array.isArray(data?.events) ? data.events : [];
//       // normalize posters to full URLs
//       const formatted = arr
//         .filter((ev) => ev.status !== 'rejected')
//         .map((ev) => ({ ...ev, poster: getPosterUrl(ev.poster) }));
//       setEvents(formatted);
//       // debug
//       console.log('Events loaded (first 5):', formatted.slice(0, 5));
//     } catch (err) {
//       console.error('Error loading events', err);
//       setEvents([]);
//     } finally {
//       setLoading(false);
//     }
//   }

//   // helper: owner check robust for various shapes
//   const isOwner = (ev) => {
//     const organizer = ev?.organizer;
//     if (!organizer) return false;
//     const organizerId = organizer._id || organizer.id || organizer;
//     const userId = user?._id || user?.id || user;
//     return !!(organizerId && userId && String(organizerId) === String(userId));
//   };

//   // Razorpay registration - unchanged
//   async function register(ev) {
//     if (!token) return alert('Please login to register');
//     const res = await fetch(`${API_ORIGIN}/api/registrations/create-order`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
//       body: JSON.stringify({ eventId: ev._id }),
//     });
//     const data = await res.json();
//     if (!res.ok) return alert(data.message || 'Could not create order');

//     if (!window.Razorpay) {
//       const script = document.createElement('script');
//       script.src = 'https://checkout.razorpay.com/v1/checkout.js';
//       document.body.appendChild(script);
//       await new Promise((resolve) => (script.onload = resolve));
//     }

//     const options = {
//       key: data.key,
//       amount: data.amount,
//       currency: data.currency,
//       name: ev.title,
//       description: ev.description,
//       order_id: data.orderId,
//       handler: async function (response) {
//         const verifyRes = await fetch(`${API_ORIGIN}/api/registrations/verify`, {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
//           body: JSON.stringify(response),
//         });
//         const v = await verifyRes.json();
//         if (verifyRes.ok) {
//           alert('Payment successful and verified!');
//           fetchEvents();
//         } else alert(v.message || 'Verification failed');
//       },
//       prefill: { name: user?.name, email: user?.email },
//       theme: { color: '#4f46e5' },
//     };
//     const rzp = new window.Razorpay(options);
//     rzp.open();
//   }

//   // Open edit modal (owner or admin only)
//   function openEditModal(ev) {
//     // safe check (UI-level) - backend enforces too
//     if (!(user?.role === 'admin' || isOwner(ev))) {
//       return alert('You do not have permission to edit this event.');
//     }

//     setEditModal({
//       ev,
//       title: ev.title || '',
//       description: ev.description || '',
//       price: ev.price || 0,
//       date: ev.date || '',
//       location: ev.location || '',
//       posterFile: null,
//       saving: false,
//     });
//   }

//   // Save update
//   async function updateEvent() {
//     if (!editModal || !editModal.ev) return;
//     const id = editModal.ev._id;
//     const fd = new FormData();
//     fd.append('title', editModal.title);
//     fd.append('description', editModal.description);
//     fd.append('price', editModal.price);
//     if (editModal.date) fd.append('date', editModal.date);
//     if (editModal.location) fd.append('location', editModal.location);
//     if (editModal.posterFile) fd.append('poster', editModal.posterFile);

//     try {
//       setEditModal((s) => ({ ...s, saving: true }));
//       const res = await fetch(`${API_ORIGIN}/api/events/${id}`, {
//         method: 'PUT',
//         headers: {
//           Authorization: 'Bearer ' + token,
//         },
//         body: fd,
//       });
//       const data = await res.json().catch(() => null);
//       if (!res.ok) {
//         alert(data?.message || 'Failed to update event');
//         setEditModal((s) => ({ ...s, saving: false }));
//         return;
//       }
//       alert('Event updated');
//       setEditModal(null);
//       fetchEvents();
//     } catch (err) {
//       console.error('Update error', err);
//       alert('Network error');
//       setEditModal((s) => ({ ...s, saving: false }));
//     }
//   }

//   // Small accessible modal keyboard close
//   useEffect(() => {
//     function onKey(e) {
//       if (e.key === 'Escape') {
//         setSelectedEvent(null);
//         setPosterModal(null);
//         setEditModal(null);
//       }
//     }
//     window.addEventListener('keydown', onKey);
//     return () => window.removeEventListener('keydown', onKey);
//   }, []);

//   // UI rendering
//   return (
//     <div>
//       <div className="flex items-center justify-between mb-6">
//         <h3 className="text-3xl font-extrabold text-gray-900">🎉 Events</h3>
//         <div className="text-sm text-gray-600">{loading ? 'Loading...' : `${events.length} events`}</div>
//       </div>

//       <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
//         {events.map((ev) => (
//           <article key={ev._id} className="p-4 rounded-lg border shadow-sm bg-white flex flex-col hover:shadow-md transition-shadow">
//             <div className="h-44 w-full rounded overflow-hidden bg-gray-100">
//               <img src={ev.poster || '/images/sample-poster.jpg'} alt={ev.title} className="w-full h-full object-cover" />
//             </div>

//             <div className="mt-3 flex-1">
//               <h4 className="font-semibold text-gray-800">{ev.title}</h4>
//               <p className="text-sm text-gray-600 mt-2 line-clamp-3">{ev.description}</p>
//             </div>

//             <div className="mt-4 flex items-center justify-between">
//               <div>
//                 <span
//                   className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
//                     ev.status === 'approved' ? 'bg-green-50 text-green-700' : ev.status === 'pending' ? 'bg-yellow-50 text-yellow-700' : 'bg-red-50 text-red-700'
//                   }`}
//                 >
//                   {ev.status}
//                 </span>
//               </div>

//               <div className="flex items-center gap-2">
//                 <button
//                   onClick={() => setSelectedEvent(ev)}
//                   className="px-3 py-1.5 rounded-md bg-indigo-600 text-white text-sm hover:bg-indigo-700 transition"
//                 >
//                   More info
//                 </button>

//                 {ev.poster && (
//                   <button
//                     onClick={() => setPosterModal(ev)}
//                     className="px-3 py-1.5 rounded-md border bg-white text-sm hover:bg-gray-50 transition"
//                   >
//                     Poster
//                   </button>
//                 )}

//                 {(user?.role === 'admin' || isOwner(ev)) && (
//                   <button
//                     onClick={() => openEditModal(ev)}
//                     className="px-3 py-1.5 rounded-md bg-gray-100 text-sm hover:bg-gray-200 transition"
//                   >
//                     Edit
//                   </button>
//                 )}

//                 {ev.status === 'approved' ? (
//                   <button onClick={() => register(ev)} className="px-3 py-1.5 rounded-md bg-green-600 text-white text-sm hover:bg-green-700 transition">
//                     Register
//                   </button>
//                 ) : (
//                   <div className="px-3 py-1 rounded text-xs text-gray-500">Not open</div>
//                 )}
//               </div>
//             </div>
//           </article>
//         ))}
//       </div>

//       {/* More info modal (fade+scale) */}
//       {selectedEvent && (
//         <div
//           className="fixed inset-0 z-50 flex items-center justify-center"
//           onClick={() => setSelectedEvent(null)}
//           aria-modal="true"
//           role="dialog"
//         >
//           <div className="absolute inset-0 bg-black/50 transition-opacity" />
//           <div
//             className="relative z-10 w-11/12 max-w-3xl bg-white rounded-2xl p-6 shadow-2xl transform transition-all duration-300 scale-100"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <button onClick={() => setSelectedEvent(null)} className="absolute top-4 right-4 text-gray-500">✕</button>
//             <h2 className="text-2xl font-semibold text-gray-900 mb-2">{selectedEvent.title}</h2>
//             <p className="text-gray-700 mb-4">{selectedEvent.description}</p>
//             <div className="text-sm text-gray-600">Organizer: {selectedEvent.organizer?.name || 'Unknown'}</div>

//             <div className="mt-6 flex justify-end gap-2">
//               {(user?.role === 'admin' || isOwner(selectedEvent)) && (
//                 <button onClick={() => openEditModal(selectedEvent)} className="px-4 py-2 bg-gray-100 rounded">Edit</button>
//               )}
//               <a href={`/events/${selectedEvent._id}`} className="px-4 py-2 bg-white rounded border">View full page</a>
//               {selectedEvent.status === 'approved' && (
//                 <button onClick={() => register(selectedEvent)} className="px-4 py-2 bg-green-600 text-white rounded">Register</button>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Poster view modal */}
//       {posterModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setPosterModal(null)}>
//           <div className="absolute inset-0 bg-black/60" />
//           <div
//             className="relative z-10 w-11/12 max-w-2xl bg-white rounded-xl p-4 shadow-xl transform transition-all duration-300"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <button className="absolute top-3 right-3 text-gray-500" onClick={() => setPosterModal(null)}>✕</button>
//             <img src={posterModal.poster || '/images/sample-poster.jpg'} alt="poster" className="w-full h-auto object-contain rounded" />
//           </div>
//         </div>
//       )}

//       {/* Edit modal (organizer/admin) */}
//       {editModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setEditModal(null)}>
//           <div className="absolute inset-0 bg-black/50" />
//           <div
//             className="relative z-10 w-11/12 max-w-2xl bg-white rounded-2xl p-6 shadow-2xl transform transition-all duration-300"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="flex items-start justify-between mb-4">
//               <h3 className="text-xl font-semibold text-gray-900">Edit Event</h3>
//               <button onClick={() => setEditModal(null)} className="text-gray-500">✕</button>
//             </div>

//             <div className="space-y-3">
//               <label className="block">
//                 <div className="text-sm text-gray-600 mb-1">Title</div>
//                 <input
//                   value={editModal.title}
//                   onChange={(e) => setEditModal((s) => ({ ...s, title: e.target.value }))}
//                   className="w-full p-2 rounded border"
//                 />
//               </label>

//               <label className="block">
//                 <div className="text-sm text-gray-600 mb-1">Description</div>
//                 <textarea
//                   value={editModal.description}
//                   onChange={(e) => setEditModal((s) => ({ ...s, description: e.target.value }))}
//                   rows="4"
//                   className="w-full p-2 rounded border"
//                 />
//               </label>

//               <div className="grid grid-cols-2 gap-3">
//                 <label className="block">
//                   <div className="text-sm text-gray-600 mb-1">Price</div>
//                   <input
//                     type="number"
//                     value={editModal.price}
//                     onChange={(e) => setEditModal((s) => ({ ...s, price: e.target.value }))}
//                     className="w-full p-2 rounded border"
//                   />
//                 </label>
//                 <label className="block">
//                   <div className="text-sm text-gray-600 mb-1">Date</div>
//                   <input
//                     type="date"
//                     value={editModal.date || ''}
//                     onChange={(e) => setEditModal((s) => ({ ...s, date: e.target.value }))}
//                     className="w-full p-2 rounded border"
//                   />
//                 </label>
//               </div>

//               <label className="block">
//                 <div className="text-sm text-gray-600 mb-1">Location</div>
//                 <input
//                   value={editModal.location}
//                   onChange={(e) => setEditModal((s) => ({ ...s, location: e.target.value }))}
//                   className="w-full p-2 rounded border"
//                 />
//               </label>

//               <label className="block">
//                 <div className="text-sm text-gray-600 mb-1">Change Poster (optional)</div>
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={(e) => setEditModal((s) => ({ ...s, posterFile: e.target.files[0] }))}
//                 />
//               </label>
//             </div>

//             <div className="mt-4 flex justify-end gap-2">
//               <button onClick={() => setEditModal(null)} className="px-4 py-2 bg-gray-100 rounded">Cancel</button>
//               <button
//                 onClick={updateEvent}
//                 disabled={editModal.saving}
//                 className={`px-4 py-2 rounded text-white ${editModal.saving ? 'bg-gray-400 cursor-wait' : 'bg-indigo-600 hover:bg-indigo-700'}`}
//               >
//                 {editModal.saving ? 'Saving...' : 'Update'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


// frontend/src/pages/EventList.js
import React, { useEffect, useState } from 'react';

export default function EventList({ token }) {
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [posterModal, setPosterModal] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
    setUser(storedUser);

    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/events');
      if (!res.ok) {
        setEvents([]);
        return;
      }
      const data = await res.json();
      // ensure array shape
      const arr = Array.isArray(data) ? data : Array.isArray(data?.events) ? data.events : [];
      // hide rejected just in case
      const filtered = arr.filter((ev) => ev.status !== 'rejected');
      setEvents(filtered);
    } catch (err) {
      console.error('Failed fetching events', err);
      setEvents([]);
    }
  };

  useEffect(() => {
    // prevent background scroll when a modal is open
    const anyOpen = !!selectedEvent || !!posterModal;
    document.body.style.overflow = anyOpen ? 'hidden' : '';
    return () => (document.body.style.overflow = '');
  }, [selectedEvent, posterModal]);

  // close modals with Escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setSelectedEvent(null);
        setPosterModal(null);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Helper to form poster URL robustly
  const posterUrl = (ev) => {
    if (!ev?.poster) return '/images/sample-poster.jpg';
    if (ev.poster.startsWith('http')) return ev.poster;
    return `http://localhost:5000${ev.poster.startsWith('/') ? '' : '/'}${ev.poster}`;
  };

  // robust owner check
  const isOwner = (ev) => {
    const organizer = ev?.organizer;
    const organizerId = organizer?._id || organizer?.id || organizer;
    const userId = user?._id || user?.id;
    return !!(organizerId && userId && String(organizerId) === String(userId));
  };

  async function register(ev) {
    if (!token) return alert('Please login to register');

    const res = await fetch('http://localhost:5000/api/registrations/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
      body: JSON.stringify({ eventId: ev._id }),
    });
    const data = await res.json();
    if (!res.ok) return alert(data.message || 'Could not create order');

    if (!window.Razorpay) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      document.body.appendChild(script);
      await new Promise((resolve) => (script.onload = resolve));
    }

    const options = {
      key: data.key,
      amount: data.amount,
      currency: data.currency,
      name: ev.title,
      description: ev.description,
      order_id: data.orderId,
      handler: async function (response) {
        const verifyRes = await fetch('http://localhost:5000/api/registrations/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
          body: JSON.stringify(response),
        });
        const v = await verifyRes.json();
        if (verifyRes.ok) {
          alert('Payment successful and verified!');
          fetchEvents();
        } else alert(v.message || 'Verification failed');
      },
      prefill: { name: user?.name, email: user?.email },
      theme: { color: '#4f46e5' },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  }

  return (
    <div>
      <header className="mb-6">
        <h3 className="text-2xl font-semibold">🎉 Events</h3>
        <p className="text-sm text-gray-600">Browse upcoming events. Click “More info” to see details.</p>
      </header>

      {events.length === 0 ? (
        <div className="p-6 bg-white rounded shadow text-center text-gray-500">No events available right now.</div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((ev) => (
            <article key={ev._id} className="p-4 rounded-lg border shadow-sm bg-white flex flex-col">
              <div className="h-40 w-full rounded overflow-hidden bg-gray-100">
                <img src={posterUrl(ev)} alt={ev.title} className="w-full h-full object-cover" />
              </div>

              <div className="mt-3 flex-1">
                <h4 className="font-semibold text-lg">{ev.title}</h4>
                <p className="text-sm text-gray-600 line-clamp-3 mt-2">{ev.description}</p>

                <div className="mt-3 text-xs text-gray-500">
                  <div>{ev.date ? new Date(ev.date).toLocaleString() : 'Date not set'}</div>
                  <div>{ev.venue || ev.location || ''}</div>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <div>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      ev.status === 'approved' ? 'bg-green-50 text-green-700' : ev.status === 'pending' ? 'bg-yellow-50 text-yellow-700' : 'bg-red-50 text-red-700'
                    }`}
                  >
                    {ev.status}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => setSelectedEvent(ev)} className="px-3 py-1 rounded bg-indigo-600 text-white text-sm">
                    More info
                  </button>

                  {ev.poster && (
                    <button onClick={() => setPosterModal(ev)} className="px-3 py-1 rounded border text-sm">
                      Poster
                    </button>
                  )}

                  {(user?.role === 'admin' || isOwner(ev)) && (
                    <a href={`/events/${ev._id}/edit`} className="px-3 py-1 rounded bg-gray-100 text-sm">
                      Edit
                    </a>
                  )}

                  {ev.status === 'approved' ? (
                    <button onClick={() => register(ev)} className="px-3 py-1 rounded bg-green-600 text-white text-sm">
                      Register
                    </button>
                  ) : (
                    <div className="text-xs text-gray-500 italic">Not open</div>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* More info modal */}
      {selectedEvent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={() => setSelectedEvent(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 w-11/12 max-w-3xl bg-white rounded-2xl p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelectedEvent(null)} className="absolute top-4 right-4 text-gray-500">✕</button>
            <div className="md:flex gap-4">
              <div className="md:w-1/2">
                <img src={posterUrl(selectedEvent)} alt={selectedEvent.title} className="w-full h-48 object-cover rounded" />
              </div>
              <div className="md:w-1/2">
                <h2 className="text-xl font-semibold">{selectedEvent.title}</h2>
                <p className="text-sm text-gray-600 mt-2">{selectedEvent.description}</p>
                <p className="text-sm text-gray-500 mt-3">{selectedEvent.date ? new Date(selectedEvent.date).toLocaleString() : ''}</p>
                <p className="text-sm text-gray-500">{selectedEvent.venue || selectedEvent.location || ''}</p>

                <div className="mt-4 flex justify-end gap-2">
                  {(user?.role === 'admin' || isOwner(selectedEvent)) && (
                    <a href={`/events/${selectedEvent._id}/edit`} className="px-3 py-1.5 border rounded text-sm">Edit</a>
                  )}
                  <a href={`/events/${selectedEvent._id}`} className="px-3 py-1.5 border rounded text-sm">View full page</a>
                  {selectedEvent.status === 'approved' && (
                    <button onClick={() => register(selectedEvent)} className="px-3 py-1.5 bg-green-600 text-white rounded text-sm">Register</button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Poster modal */}
      {posterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setPosterModal(null)}>
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative z-10 w-11/12 max-w-2xl bg-white rounded-xl p-4" onClick={(e) => e.stopPropagation()}>
            <button className="absolute top-3 right-3 text-gray-500" onClick={() => setPosterModal(null)}>✕</button>
            <img src={posterUrl(posterModal)} alt="Poster" className="w-full h-auto max-h-[80vh] object-contain rounded" />
          </div>
        </div>
      )}
    </div>
  );
}

