


// // frontend/src/pages/EventList.js
// import React, { useEffect, useState } from 'react';

// export default function EventList({ token }) {
//   const [events, setEvents] = useState([]);
//   const [user, setUser] = useState(null);
//   const [selectedEvent, setSelectedEvent] = useState(null);
//   const [posterModal, setPosterModal] = useState(null);

//   useEffect(() => {
//     const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
//     setUser(storedUser);

//     fetchEvents();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const fetchEvents = async () => {
//     try {
//       const res = await fetch('http://localhost:5000/api/events');
//       if (!res.ok) {
//         setEvents([]);
//         return;
//       }
//       const data = await res.json();
//       // ensure array shape
//       const arr = Array.isArray(data) ? data : Array.isArray(data?.events) ? data.events : [];
//       // hide rejected just in case
//       const filtered = arr.filter((ev) => ev.status !== 'rejected');
//       setEvents(filtered);
//     } catch (err) {
//       console.error('Failed fetching events', err);
//       setEvents([]);
//     }
//   };

//   useEffect(() => {
//     // prevent background scroll when a modal is open
//     const anyOpen = !!selectedEvent || !!posterModal;
//     document.body.style.overflow = anyOpen ? 'hidden' : '';
//     return () => (document.body.style.overflow = '');
//   }, [selectedEvent, posterModal]);

//   // close modals with Escape
//   useEffect(() => {
//     const onKey = (e) => {
//       if (e.key === 'Escape') {
//         setSelectedEvent(null);
//         setPosterModal(null);
//       }
//     };
//     window.addEventListener('keydown', onKey);
//     return () => window.removeEventListener('keydown', onKey);
//   }, []);

//   // Helper to form poster URL robustly
//   const posterUrl = (ev) => {
//     if (!ev?.poster) return '/images/sample-poster.jpg';
//     if (ev.poster.startsWith('http')) return ev.poster;
//     return `http://localhost:5000${ev.poster.startsWith('/') ? '' : '/'}${ev.poster}`;
//   };

//   // robust owner check
//   const isOwner = (ev) => {
//     const organizer = ev?.organizer;
//     const organizerId = organizer?._id || organizer?.id || organizer;
//     const userId = user?._id || user?.id;
//     return !!(organizerId && userId && String(organizerId) === String(userId));
//   };

//   async function register(ev) {
//     if (!token) return alert('Please login to register');

//     const res = await fetch('http://localhost:5000/api/registrations/create-order', {
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
//         const verifyRes = await fetch('http://localhost:5000/api/registrations/verify', {
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

//   return (
//     <div>
//       <header className="mb-6">
//         <h3 className="text-2xl font-semibold">🎉 Events</h3>
//         <p className="text-sm text-gray-600">Browse upcoming events. Click “More info” to see details.</p>
//       </header>

//       {events.length === 0 ? (
//         <div className="p-6 bg-white rounded shadow text-center text-gray-500">No events available right now.</div>
//       ) : (
//         <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
//           {events.map((ev) => (
//             <article key={ev._id} className="p-4 rounded-lg border shadow-sm bg-white flex flex-col">
//               <div className="h-40 w-full rounded overflow-hidden bg-gray-100">
//                 <img src={posterUrl(ev)} alt={ev.title} className="w-full h-full object-cover" />
//               </div>

//               <div className="mt-3 flex-1">
//                 <h4 className="font-semibold text-lg">{ev.title}</h4>
//                 <p className="text-sm text-gray-600 line-clamp-3 mt-2">{ev.description}</p>

//                 <div className="mt-3 text-xs text-gray-500">
//                   <div>{ev.date ? new Date(ev.date).toLocaleString() : 'Date not set'}</div>
//                   <div>{ev.venue || ev.location || ''}</div>
//                 </div>
//               </div>

//               <div className="mt-3 flex items-center justify-between">
//                 <div>
//                   <span
//                     className={`px-2 py-1 rounded text-xs ${
//                       ev.status === 'approved' ? 'bg-green-50 text-green-700' : ev.status === 'pending' ? 'bg-yellow-50 text-yellow-700' : 'bg-red-50 text-red-700'
//                     }`}
//                   >
//                     {ev.status}
//                   </span>
//                 </div>

//                 <div className="flex gap-2">
//                   <button onClick={() => setSelectedEvent(ev)} className="px-3 py-1 rounded bg-indigo-600 text-white text-sm">
//                     More info
//                   </button>

//                   {ev.poster && (
//                     <button onClick={() => setPosterModal(ev)} className="px-3 py-1 rounded border text-sm">
//                       Poster
//                     </button>
//                   )}

//                   {(user?.role === 'admin' || isOwner(ev)) && (
//                     <a href={`/events/${ev._id}/edit`} className="px-3 py-1 rounded bg-gray-100 text-sm">
//                       Edit
//                     </a>
//                   )}

//                   {ev.status === 'approved' ? (
//                     <button onClick={() => register(ev)} className="px-3 py-1 rounded bg-green-600 text-white text-sm">
//                       Register
//                     </button>
//                   ) : (
//                     <div className="text-xs text-gray-500 italic">Not open</div>
//                   )}
//                 </div>
//               </div>
//             </article>
//           ))}
//         </div>
//       )}

//       {/* More info modal */}
//       {selectedEvent && (
//         <div
//           className="fixed inset-0 z-50 flex items-center justify-center"
//           onClick={() => setSelectedEvent(null)}
//           role="dialog"
//           aria-modal="true"
//         >
//           <div className="absolute inset-0 bg-black/50" />
//           <div className="relative z-10 w-11/12 max-w-3xl bg-white rounded-2xl p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
//             <button onClick={() => setSelectedEvent(null)} className="absolute top-4 right-4 text-gray-500">✕</button>
//             <div className="md:flex gap-4">
//               <div className="md:w-1/2">
//                 <img src={posterUrl(selectedEvent)} alt={selectedEvent.title} className="w-full h-48 object-cover rounded" />
//               </div>
//               <div className="md:w-1/2">
//                 <h2 className="text-xl font-semibold">{selectedEvent.title}</h2>
//                 <p className="text-sm text-gray-600 mt-2">{selectedEvent.description}</p>
//                 <p className="text-sm text-gray-500 mt-3">{selectedEvent.date ? new Date(selectedEvent.date).toLocaleString() : ''}</p>
//                 <p className="text-sm text-gray-500">{selectedEvent.venue || selectedEvent.location || ''}</p>

//                 <div className="mt-4 flex justify-end gap-2">
//                   {(user?.role === 'admin' || isOwner(selectedEvent)) && (
//                     <a href={`/events/${selectedEvent._id}/edit`} className="px-3 py-1.5 border rounded text-sm">Edit</a>
//                   )}
//                   <a href={`/events/${selectedEvent._id}`} className="px-3 py-1.5 border rounded text-sm">View full page</a>
//                   {selectedEvent.status === 'approved' && (
//                     <button onClick={() => register(selectedEvent)} className="px-3 py-1.5 bg-green-600 text-white rounded text-sm">Register</button>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Poster modal */}
//       {posterModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setPosterModal(null)}>
//           <div className="absolute inset-0 bg-black/60" />
//           <div className="relative z-10 w-11/12 max-w-2xl bg-white rounded-xl p-4" onClick={(e) => e.stopPropagation()}>
//             <button className="absolute top-3 right-3 text-gray-500" onClick={() => setPosterModal(null)}>✕</button>
//             <img src={posterUrl(posterModal)} alt="Poster" className="w-full h-auto max-h-[80vh] object-contain rounded" />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// separate 

// import React, { useEffect, useState } from 'react';
// import EventCreate from './EventCreate';

// export default function EventList({ token }) {
//   const [events, setEvents] = useState([]);
//   const [user, setUser] = useState(null);
//   const [selectedEvent, setSelectedEvent] = useState(null);
//   const [posterModal, setPosterModal] = useState(null);
//   const [editEvent, setEditEvent] = useState(null); // event object to edit (opens modal)

//   useEffect(() => {
//     const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
//     setUser(storedUser);
//     fetchEvents();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const fetchEvents = async () => {
//     try {
//       const res = await fetch('http://localhost:5000/api/events');
//       if (!res.ok) {
//         setEvents([]);
//         return;
//       }
//       const data = await res.json();
//       const arr = Array.isArray(data) ? data : Array.isArray(data?.events) ? data.events : [];
//       const filtered = arr.filter((ev) => ev.status !== 'rejected');
//       setEvents(filtered);
//     } catch (err) {
//       console.error('Failed fetching events', err);
//       setEvents([]);
//     }
//   };

//   // Helper to form poster URL robustly
//   const posterUrl = (ev) => {
//     if (!ev?.poster) return '/images/sample-poster.jpg';
//     if (ev.poster.startsWith('http')) return ev.poster;
//     return `http://localhost:5000${ev.poster.startsWith('/') ? '' : '/'}${ev.poster}`;
//   };

//   // robust owner check
//   const isOwner = (ev) => {
//     const organizer = ev?.organizer;
//     const organizerId = organizer?._id || organizer?.id || organizer;
//     const userId = user?._id || user?.id;
//     return !!(organizerId && userId && String(organizerId) === String(userId));
//   };

//   async function register(ev) {
//     if (!token) return alert('Please login to register');

//     const res = await fetch('http://localhost:5000/api/registrations/create-order', {
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
//         const verifyRes = await fetch('http://localhost:5000/api/registrations/verify', {
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
//     if (!(user?.role === 'admin' || isOwner(ev))) {
//       return alert('You do not have permission to edit this event.');
//     }
//     setEditEvent(ev);
//     // prevent background scroll
//     document.body.style.overflow = 'hidden';
//   }

//   // handle saved (from EventCreate): refresh list and close modal
//   const onSaved = (saved) => {
//     // optional: replace the local event quickly for immediate UX
//     if (!saved) {
//       fetchEvents();
//     } else {
//       // update in-place if present
//       setEvents((prev) => {
//         const idx = prev.findIndex((e) => e._id === saved._id);
//         if (idx === -1) return prev;
//         const copy = [...prev];
//         copy[idx] = saved;
//         return copy;
//       });
//     }
//     closeEditModal();
//     fetchEvents();
//   };

//   const closeEditModal = () => {
//     setEditEvent(null);
//     document.body.style.overflow = '';
//   };

//   return (
//     <div>
//       <header className="mb-6">
//         <h3 className="text-2xl font-semibold">🎉 Events</h3>
//         <p className="text-sm text-gray-600">Browse upcoming events. Click “More info” to see details.</p>
//       </header>

//       {events.length === 0 ? (
//         <div className="p-6 bg-white rounded shadow text-center text-gray-500">No events available right now.</div>
//       ) : (
//         <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
//           {events.map((ev) => (
//             <article key={ev._id} className="p-4 rounded-lg border shadow-sm bg-white flex flex-col">
//               <div className="h-40 w-full rounded overflow-hidden bg-gray-100">
//                 <img src={posterUrl(ev)} alt={ev.title} className="w-full h-full object-cover" />
//               </div>

//               <div className="mt-3 flex-1">
//                 <h4 className="font-semibold text-lg">{ev.title}</h4>
//                 <p className="text-sm text-gray-600 line-clamp-3 mt-2">{ev.description}</p>

//                 <div className="mt-3 text-xs text-gray-500">
//                   <div>{ev.date ? new Date(ev.date).toLocaleString() : 'Date not set'}</div>
//                   <div>{ev.venue || ev.location || ''}</div>
//                   <div className="mt-1 font-medium text-gray-700">💰 ₹{ev.price || '0'}</div>
//                 </div>
//               </div>

//               <div className="mt-3 flex items-center justify-between">
//                 <div>
//                   <span
//                     className={`px-2 py-1 rounded text-xs ${ev.status === 'approved' ? 'bg-green-50 text-green-700' : ev.status === 'pending' ? 'bg-yellow-50 text-yellow-700' : 'bg-red-50 text-red-700'
//                       }`}
//                   >
//                     {ev.status}
//                   </span>
//                 </div>

//                 <div className="flex gap-2">
//                   <button onClick={() => setSelectedEvent(ev)} className="px-3 py-1 rounded bg-indigo-600 text-white text-sm">
//                     More info
//                   </button>

//                   {ev.poster && (
//                     <button onClick={() => setPosterModal(ev)} className="px-3 py-1 rounded border text-sm">
//                       Poster
//                     </button>
//                   )}

//                   {(user?.role === 'admin' || isOwner(ev)) && (
//                     <button onClick={() => openEditModal(ev)} className="px-3 py-1 rounded bg-gray-100 text-sm">
//                       Edit
//                     </button>
//                   )}

//                   {ev.status === 'approved' ? (
//                     <button onClick={() => register(ev)} className="px-3 py-1 rounded bg-green-600 text-white text-sm">
//                       Register
//                     </button>
//                   ) : (
//                     <div className="text-xs text-gray-500 italic">Not open</div>
//                   )}
//                 </div>
//               </div>
//             </article>
//           ))}
//         </div>
//       )}

//       {/* More info modal */}
//       {selectedEvent && (
//         <div
//           className="fixed inset-0 z-50 flex items-center justify-center"
//           onClick={() => setSelectedEvent(null)}
//           role="dialog"
//           aria-modal="true"
//         >
//           <div className="absolute inset-0 bg-black/50" />
//           <div className="relative z-10 w-11/12 max-w-3xl bg-white rounded-2xl p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
//             <button onClick={() => setSelectedEvent(null)} className="absolute top-4 right-4 text-gray-500">✕</button>
//             <div className="md:flex gap-4">
//               <div className="md:w-1/2">
//                 <img src={posterUrl(selectedEvent)} alt={selectedEvent.title} className="w-full h-48 object-cover rounded" />
//               </div>
//               <div className="md:w-1/2">
//                 <h2 className="text-xl font-semibold">{selectedEvent.title}</h2>
//                 <p className="text-sm text-gray-600 mt-2">{selectedEvent.description}</p>
//                 <p className="text-sm text-gray-500 mt-3">
//                   🗓 {selectedEvent.date ? new Date(selectedEvent.date).toLocaleString() : 'Date not set'}
//                 </p>
//                 <p className="text-sm text-gray-500">📍 {selectedEvent.venue || selectedEvent.location || 'Location not specified'}</p>
//                 <p className="text-sm text-gray-700 font-medium mt-2">💰 Price: ₹{selectedEvent.price || '0'}</p>


//                 <div className="mt-4 flex justify-end gap-2">
//                   {(user?.role === 'admin' || isOwner(selectedEvent)) && (
//                     <button onClick={() => openEditModal(selectedEvent)} className="px-3 py-1.5 border rounded text-sm">Edit</button>
//                   )}
//                   <a href={`/events/${selectedEvent._id}`} className="px-3 py-1.5 border rounded text-sm">View full page</a>
//                   {selectedEvent.status === 'approved' && (
//                     <button onClick={() => register(selectedEvent)} className="px-3 py-1.5 bg-green-600 text-white rounded text-sm">Register</button>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Poster modal */}
//       {posterModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setPosterModal(null)}>
//           <div className="absolute inset-0 bg-black/60" />
//           <div className="relative z-10 w-11/12 max-w-2xl bg-white rounded-xl p-4" onClick={(e) => e.stopPropagation()}>
//             <button className="absolute top-3 right-3 text-gray-500" onClick={() => setPosterModal(null)}>✕</button>
//             <img src={posterUrl(posterModal)} alt="Poster" className="w-full h-auto max-h-[80vh] object-contain rounded" />
//           </div>
//         </div>
//       )}

//       {/* Edit Modal (uses EventCreate) */}
//       {editEvent && (
//         <div
//           className="fixed inset-0 z-60 flex items-center justify-center"
//           onClick={closeEditModal}
//           role="dialog"
//           aria-modal="true"
//         >
//           <div className="absolute inset-0 bg-black/40" />
//           <div className="relative z-10 w-11/12 max-w-2xl p-4" onClick={(e) => e.stopPropagation()}>
//             <EventCreate
//               token={token}
//               initialData={editEvent}
//               onSaved={onSaved}
//               onClose={closeEditModal}
//             />
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

    fetch('http://localhost:5000/api/events')
      .then((r) => r.json())
      .then((data) => {
        // non-admin should not see rejected events
        if (storedUser?.role !== 'admin') {
          data = data.filter((ev) => ev.status !== 'rejected');
        }
        setEvents(Array.isArray(data) ? data : []);
      })
      .catch(() => setEvents([]));
  }, []);


  useEffect(() => {
    const interval = setInterval(() => {
      fetch('http://localhost:5000/api/events')
        .then((r) => r.json())
        .then((data) => setEvents(Array.isArray(data) ? data : []))
        .catch(() => { });
    }, 15000); // refresh every 15 seconds

    return () => clearInterval(interval);
  }, []);

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
          window.location.reload();
        } else {
          alert(v.message || 'Verification failed');
        }
      },
      prefill: { name: user?.name, email: user?.email },
      theme: { color: '#4f46e5' },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  }

  const getPosterSrc = (ev) =>
    ev.poster
      ? ev.poster.startsWith('http')
        ? ev.poster
        : `http://localhost:5000${ev.poster}`
      : '/images/sample-poster.jpg';

  return (
    <div className="space-y-4">
      {/* Header */}
      <header className="mb-2">
        <h3 className="text-2xl font-extrabold text-gray-800 flex items-center gap-2">
          <span role="img" aria-label="party">
            🎉
          </span>
          Events
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Browse upcoming events. Click <strong>“More info”</strong> to see full details.
        </p>
      </header>

      {/* Empty state */}
      {events.length === 0 && (
        <div className="rounded-xl p-6 bg-white shadow-sm border text-center text-gray-500">
          No events available right now.
        </div>
      )}

      {/* Cards grid */}
      <div className="grid gap-6 auto-rows-fr grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {events.map((ev) => {
          const dateText = ev.date ? new Date(ev.date).toLocaleString() : 'Date not set';
          const venueText = ev.venue || ev.location || 'Venue not set';

          return (
            <article
              key={ev._id}
              className={`flex flex-col justify-between rounded-2xl border shadow-sm p-4 bg-white transition-transform duration-200 hover:scale-[1.01]`}
              aria-labelledby={`event-${ev._id}-title`}
            >
              {/* Top: image + details */}
              <div>
                <div className="w-full h-48 rounded-xl overflow-hidden bg-gray-100 mb-4">
                  <img
                    src={getPosterSrc(ev)}
                    alt={ev.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <h4
                  id={`event-${ev._id}-title`}
                  className="font-semibold text-lg text-gray-800 leading-snug mb-1"
                >
                  {ev.title}
                </h4>

                <p className="text-sm text-gray-600 mb-2 max-h-16 overflow-hidden">
                  {ev.description}
                </p>

                <div className="text-xs text-gray-500 space-y-0.5">
                  <div>{dateText}</div>
                  <div>{venueText}</div>
                  <div className="font-semibold text-gray-800 pt-1">💰 ₹{ev.price || 0}</div>
                </div>
              </div>

              {/* Bottom: status + buttons */}
              <div className="mt-4 flex items-center justify-between gap-3">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${ev.status === 'approved'
                      ? 'bg-green-50 text-green-700'
                      : ev.status === 'pending'
                        ? 'bg-yellow-50 text-yellow-700'
                        : 'bg-red-50 text-red-700'
                    }`}
                >
                  {ev.status}
                </span>

                <div className="flex flex-wrap justify-end gap-2">
                  <button
                    onClick={() => setSelectedEvent(ev)}
                    className="px-3 py-1.5 rounded-md bg-indigo-600 text-white text-xs sm:text-sm font-medium hover:bg-indigo-700 shadow-sm transition"
                  >
                    More info
                  </button>

                  {ev.poster && (
                    <button
                      onClick={() => setPosterModal(ev)}
                      className="px-3 py-1.5 rounded-md bg-white border border-gray-200 text-xs sm:text-sm text-gray-700 hover:shadow-sm transition"
                    >
                      Poster
                    </button>
                  )}

                  {ev.status === 'approved' ? (
                    <button
                      onClick={() => register(ev)}
                      className="px-3 py-1.5 rounded-md bg-green-600 text-white text-xs sm:text-sm font-medium hover:bg-green-700 shadow-sm transition"
                    >
                      Register
                    </button>
                  ) : (
                    <div className="text-[11px] sm:text-xs text-gray-500 italic">Not open</div>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* More Info Modal */}
      {selectedEvent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={() => setSelectedEvent(null)}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div
            className="relative z-10 w-11/12 max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="md:flex">
              <div className="md:w-1/2">
                <img
                  src={getPosterSrc(selectedEvent)}
                  alt={selectedEvent.title}
                  className="w-full h-64 md:h-full object-cover"
                />
              </div>
              <div className="p-6 md:w-1/2 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-800">
                      {selectedEvent.title}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {selectedEvent.date
                        ? new Date(selectedEvent.date).toLocaleString()
                        : 'Date not set'}
                      {' · '}
                      {selectedEvent.venue || selectedEvent.location || 'Venue not set'}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="text-gray-400 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>

                <div className="text-sm text-gray-700 flex-1 overflow-auto">
                  {selectedEvent.description}
                </div>

                <div className="text-sm text-gray-600">
                  <div>Organizer: {selectedEvent.organizer?.name || 'Unknown'}</div>
                  <div className="mt-1 font-semibold">Price: ₹{selectedEvent.price || 0}</div>
                  <div className="mt-1 text-xs">
                    Status:{' '}
                    <span className="font-medium">
                      {selectedEvent.status}
                    </span>
                  </div>
                </div>

                {selectedEvent.status === 'approved' && (
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={() => setSelectedEvent(null)}
                      className="px-3 py-1.5 rounded-md border border-gray-200 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => register(selectedEvent)}
                      className="px-3 py-1.5 rounded-md bg-green-600 text-white text-sm font-medium hover:bg-green-700"
                    >
                      Register / Pay
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Poster Modal */}
      {posterModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={() => setPosterModal(null)}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="relative z-10 w-11/12 max-w-2xl rounded-2xl overflow-hidden shadow-2xl bg-white p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPosterModal(null)}
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
    </div>
  );
}
