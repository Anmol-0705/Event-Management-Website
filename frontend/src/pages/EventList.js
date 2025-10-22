
// import React, { useEffect, useState } from 'react';

// export default function EventList({ token }) {
//   const [events, setEvents] = useState([]);
//   const [user, setUser] = useState(null);
//   const [selectedEvent, setSelectedEvent] = useState(null);

//   useEffect(() => {
//     const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
//     setUser(storedUser);

//     fetch('http://localhost:5000/api/events')
//       .then((r) => r.json())
//       .then((data) => {
//         // Hide rejected events for non-admin users
//         if (storedUser?.role !== 'admin') {
//           data = data.filter((ev) => ev.status !== 'rejected');
//         }
//         setEvents(data);
//       });
//   }, []);

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
//           body: JSON.stringify({
//             razorpay_order_id: response.razorpay_order_id,
//             razorpay_payment_id: response.razorpay_payment_id,
//             razorpay_signature: response.razorpay_signature,
//           }),
//         });
//         const v = await verifyRes.json();
//         if (verifyRes.ok) {
//           alert('Payment successful and verified!');
//           window.location.reload();
//         } else {
//           alert(v.message || 'Verification failed');
//         }
//       },
//       prefill: { name: 'Guest', email: '' },
//       theme: { color: '#6366f1' },
//     };
//     const rzp = new window.Razorpay(options);
//     rzp.open();
//   }

//   return (
//     <div>
//       <h3 className="text-2xl font-semibold text-white mb-4 drop-shadow-md">🎉 Events</h3>
//       {events.length === 0 && <p className="text-gray-300 italic">No events available right now.</p>}

//       {events.map((ev) => (
//         <div
//           key={ev._id}
//           className={`p-4 my-3 rounded-2xl shadow-lg backdrop-blur-md border transition-all duration-300 hover:scale-[1.02]
//             ${
//               ev.status === 'approved'
//                 ? 'bg-white/20 hover:bg-white/30 border-green-300/30'
//                 : 'bg-white/10 border-yellow-300/20'
//             }`}
//         >
//           <div className="flex justify-between items-start">
//             <div>
//               <div className="font-bold text-lg text-white">{ev.title}</div>
//               <div className="text-sm text-gray-200 mt-1 truncate max-w-xs">{ev.description}</div>
//               <div className="text-sm mt-2 text-gray-300">
//                 Organizer: {ev.organizer?.name || 'Unknown'} •
//                 <span
//                   className={`ml-1 font-medium ${
//                     ev.status === 'approved'
//                       ? 'text-green-300'
//                       : ev.status === 'pending'
//                       ? 'text-yellow-300'
//                       : 'text-red-400'
//                   }`}
//                 >
//                   {ev.status}
//                 </span>
//               </div>
//             </div>
//             <div className="text-right">
//               <div className="font-semibold text-white">₹{ev.price}</div>
//               <div className="flex flex-col items-end gap-2 mt-2">
//                 <button
//                   onClick={() => setSelectedEvent(ev)}
//                   className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-medium transition-transform transform hover:scale-105"
//                 >
//                   More Info
//                 </button>
//                 {ev.status === 'approved' ? (
//                   <button
//                     onClick={() => register(ev)}
//                     className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded-lg text-sm font-medium shadow-md transition-transform transform hover:scale-105"
//                   >
//                     Register / Pay
//                   </button>
//                 ) : (
//                   <div className="text-sm text-red-300 italic">Not open</div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       ))}

//       {/* MODAL POPUP */}
//       {selectedEvent && (
//         <div
//           className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 animate-fadeIn"
//           onClick={() => setSelectedEvent(null)}
//         >
//           <div
//             className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 w-11/12 md:w-2/3 text-white shadow-2xl relative animate-scaleIn"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <h2 className="text-3xl font-bold mb-2">{selectedEvent.title}</h2>
//             <p className="text-gray-200 mb-4">{selectedEvent.description}</p>
//             <p className="text-gray-300 mb-2">Organizer: {selectedEvent.organizer?.name || 'Unknown'}</p>
//             <p className="text-gray-300 mb-2">Price: ₹{selectedEvent.price}</p>
//             <p
//               className={`text-sm mb-6 ${
//                 selectedEvent.status === 'approved'
//                   ? 'text-green-300'
//                   : selectedEvent.status === 'pending'
//                   ? 'text-yellow-300'
//                   : 'text-red-300'
//               }`}
//             >
//               Status: {selectedEvent.status}
//             </p>
//             <div className="flex justify-end gap-3">
//               <button
//                 onClick={() => setSelectedEvent(null)}
//                 className="px-4 py-2 bg-gray-500 hover:bg-gray-600 rounded-lg"
//               >
//                 Close
//               </button>
//               {selectedEvent.status === 'approved' && (
//                 <button
//                   onClick={() => register(selectedEvent)}
//                   className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-lg"
//                 >
//                   Register / Pay
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
// import React, { useEffect, useState } from 'react';

// /**
//  * EventList.js
//  * - Preserves all original behavior (fetching events, Razorpay register flow)
//  * - Improved visuals, spacing, consistent buttons, More Info modal + Poster modal
//  * - Accessibility: close on Escape, prevent background scroll when modal open
//  */

// export default function EventList({ token }) {
//   const [events, setEvents] = useState([]);
//   const [user, setUser] = useState(null);
//   const [selectedEvent, setSelectedEvent] = useState(null);
//   const [posterModal, setPosterModal] = useState(null);

//   useEffect(() => {
//     const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
//     setUser(storedUser);

//     fetch('http://localhost:5000/api/events')
//       .then((r) => r.json())
//       .then((data) => {
//         if (storedUser?.role !== 'admin') {
//           data = data.filter((ev) => ev.status !== 'rejected');
//         }
//         setEvents(data);
//       })
//       .catch(() => {
//         setEvents([]); // keep fallback minimal
//       });
//   }, []);

//   // prevent background scroll while any modal is open
//   useEffect(() => {
//     const anyOpen = !!selectedEvent || !!posterModal;
//     document.body.style.overflow = anyOpen ? 'hidden' : '';
//     return () => {
//       document.body.style.overflow = '';
//     };
//   }, [selectedEvent, posterModal]);

//   // close modals on Escape
//   useEffect(() => {
//     function onKey(e) {
//       if (e.key === 'Escape') {
//         setSelectedEvent(null);
//         setPosterModal(null);
//       }
//     }
//     window.addEventListener('keydown', onKey);
//     return () => window.removeEventListener('keydown', onKey);
//   }, []);

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
//           window.location.reload();
//         } else alert(v.message || 'Verification failed');
//       },
//       prefill: { name: user?.name, email: user?.email },
//       theme: { color: '#4f46e5' }, // soft indigo
//     };
//     const rzp = new window.Razorpay(options);
//     rzp.open();
//   }

//   return (
//     <div className="max-w-6xl mx-auto px-4 py-8">
//       <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
//         <div>
//           <h3 className="text-3xl font-extrabold text-gray-800">🎉 Events</h3>
//           <p className="mt-1 text-sm text-gray-500 max-w-xl">
//             Browse upcoming events. Click <strong>More Info</strong> to see details or view the poster.
//           </p>
//         </div>

//         <div className="flex items-center gap-3">
//           <div className="text-sm text-gray-600">Showing {events.length} events</div>
//           {/* Keep space for any future controls (filters/search) */}
//         </div>
//       </header>

//       {events.length === 0 && (
//         <div className="rounded-xl p-6 bg-white shadow-sm border text-center text-gray-500">
//           No events available right now.
//         </div>
//       )}

//       <div className="grid gap-4 auto-rows-fr grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
//         {events.map((ev) => (
//           <article
//             key={ev._id}
//             className={`flex flex-col justify-between rounded-2xl p-4 shadow-sm border transition-transform duration-200
//               hover:scale-[1.02] ${
//                 ev.status === 'approved'
//                   ? 'bg-white'
//                   : 'bg-white/60'
//               }`}
//             aria-labelledby={`event-${ev._id}-title`}
//           >
//             <div className="flex gap-4">
//               <div className="w-28 h-28 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
//                 <img
//                   src={ev.poster ? `http://localhost:5000${ev.poster}` : '/images/sample-poster.jpg'}
//                   alt={ev.title}
//                   className="w-full h-full object-cover"
//                 />
//               </div>

//               <div className="flex-1">
//                 <h4 id={`event-${ev._id}-title`} className="font-semibold text-lg text-gray-800">
//                   {ev.title}
//                 </h4>

//                 <p className="text-sm text-gray-500 mt-1 line-clamp-3">{ev.description}</p>

//                 <div className="flex items-center gap-3 mt-3 text-sm">
//                   <span className="text-gray-600">Organizer: {ev.organizer?.name || 'Unknown'}</span>
//                   <span className="text-gray-400">•</span>
//                   <span className="text-gray-600">₹{ev.price}</span>
//                 </div>
//               </div>
//             </div>

//             <div className="mt-4 flex items-center justify-between">
//               <div className="text-sm">
//                 <span
//                   className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
//                     ev.status === 'approved'
//                       ? 'bg-green-50 text-green-700'
//                       : ev.status === 'pending'
//                       ? 'bg-yellow-50 text-yellow-700'
//                       : 'bg-red-50 text-red-700'
//                   }`}
//                 >
//                   {ev.status}
//                 </span>
//               </div>

//               <div className="flex items-center gap-2">
//                 <button
//                   onClick={() => setSelectedEvent(ev)}
//                   className="px-3 py-1.5 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 shadow-sm transition transform hover:-translate-y-[1px]"
//                 >
//                   More info
//                 </button>

//                 {ev.poster && (
//                   <button
//                     onClick={() => setPosterModal(ev)}
//                     className="px-3 py-1.5 rounded-md bg-white border border-gray-200 text-sm text-gray-700 hover:shadow-sm transition"
//                   >
//                     View poster
//                   </button>
//                 )}

//                 {ev.status === 'approved' ? (
//                   <button
//                     onClick={() => register(ev)}
//                     className="px-3 py-1.5 rounded-md bg-green-600 text-white text-sm font-medium hover:bg-green-700 shadow-sm transition"
//                   >
//                     Register / Pay
//                   </button>
//                 ) : (
//                   <div className="text-xs text-gray-500 italic">Not open</div>
//                 )}
//               </div>
//             </div>
//           </article>
//         ))}
//       </div>

//       {/* More Info Modal */}
//       {selectedEvent && (
//         <div
//           className="fixed inset-0 z-50 flex items-center justify-center"
//           role="dialog"
//           aria-modal="true"
//           onClick={() => setSelectedEvent(null)}
//         >
//           <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" />

//           <div
//             className="relative z-10 w-11/12 max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-250 scale-100"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="md:flex">
//               <div className="md:w-1/2">
//                 <img
//                   src={selectedEvent.poster ? `http://localhost:5000${selectedEvent.poster}` : '/images/sample-poster.jpg'}
//                   alt={selectedEvent.title}
//                   className="w-full h-64 md:h-full object-cover"
//                 />
//               </div>

//               <div className="p-6 md:w-1/2 flex flex-col">
//                 <div className="flex items-start justify-between">
//                   <div>
//                     <h2 className="text-2xl font-semibold text-gray-800">{selectedEvent.title}</h2>
//                     <p className="text-sm text-gray-500 mt-1">{selectedEvent.date} · {selectedEvent.location || '—'}</p>
//                   </div>

//                   <button
//                     onClick={() => setSelectedEvent(null)}
//                     aria-label="Close details"
//                     className="text-gray-400 hover:text-gray-700 ml-4"
//                   >
//                     ✕
//                   </button>
//                 </div>

//                 <div className="mt-4 text-sm text-gray-700 overflow-auto">{selectedEvent.description}</div>

//                 <div className="mt-auto flex items-center justify-between gap-3">
//                   <div className="text-sm text-gray-600">Organizer: {selectedEvent.organizer?.name || 'Unknown'}</div>
//                   <div className="flex items-center gap-2">
//                     <a
//                       href={`/events/${selectedEvent._id}`}
//                       className="px-3 py-1.5 rounded-md border border-gray-200 text-sm text-gray-700 hover:bg-gray-50"
//                     >
//                       View full page
//                     </a>

//                     {selectedEvent.status === 'approved' && (
//                       <button
//                         onClick={() => register(selectedEvent)}
//                         className="px-3 py-1.5 rounded-md bg-green-600 text-white text-sm font-medium hover:bg-green-700"
//                       >
//                         Register / Pay
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Poster Modal (Zoomed poster) */}
//       {posterModal && (
//         <div
//           className="fixed inset-0 z-50 flex items-center justify-center"
//           role="dialog"
//           aria-modal="true"
//           onClick={() => setPosterModal(null)}
//         >
//           <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" />

//           <div
//             className="relative z-10 w-11/12 max-w-2xl rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-250"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <button
//               onClick={() => setPosterModal(null)}
//               className="absolute top-3 right-3 z-20 bg-white/80 rounded-full p-1 hover:bg-white text-gray-700"
//               aria-label="Close poster"
//             >
//               ✕
//             </button>

//             <div className="bg-white p-4 rounded-xl">
//               <img
//                 src={`http://localhost:5000${posterModal.poster}`}
//                 alt="Poster"
//                 className="w-full h-auto max-h-[80vh] object-contain rounded-md"
//               />
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// src/pages/EventList.js
// import React, { useEffect, useState } from 'react';

// export default function EventList({ token }) {
//   const [events, setEvents] = useState([]);
//   const [user, setUser] = useState(null);
//   const [selectedEvent, setSelectedEvent] = useState(null);
//   const [posterModal, setPosterModal] = useState(null);

//   useEffect(() => {
//     const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
//     setUser(storedUser);

//     fetch('http://localhost:5000/api/events')
//       .then((r) => r.json())
//       .then((data) => {
//         // ensure array and filter out rejected if any slip through
//         const arr = Array.isArray(data) ? data : Array.isArray(data?.events) ? data.events : [];
//         setEvents(arr.filter((ev) => ev.status !== 'rejected'));
//       })
//       .catch(() => {
//         setEvents([]);
//       });
//   }, []);

//   async function register(ev) {
//     if (!token) return alert('Please login to register');

//     // same Razorpay flow as before (kept intact)
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
//           window.location.reload();
//         } else alert(v.message || 'Verification failed');
//       },
//       prefill: { name: user?.name, email: user?.email },
//       theme: { color: '#4f46e5' },
//     };
//     const rzp = new window.Razorpay(options);
//     rzp.open();
//   }

//   // helper to check owner (organizer field can be object or id)
//   const isOwner = (ev) => {
//     const organizerId = ev.organizer?._id || ev.organizer;
//     return user && organizerId && String(organizerId) === String(user._id);
//   };

//   return (
//     <div>
//       <h3 className="text-2xl font-semibold mb-4">🎉 Events</h3>

//       <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
//         {events.map((ev) => (
//           <article key={ev._id} className="p-4 rounded-lg border shadow-sm bg-white">
//             <div className="h-40 w-full rounded overflow-hidden bg-gray-100">
//               <img src={ev.poster ? `http://localhost:5000${ev.poster}` : '/images/sample-poster.jpg'} alt={ev.title} className="w-full h-full object-cover" />
//             </div>

//             <h4 className="mt-3 font-semibold">{ev.title}</h4>
//             <p className="text-sm text-gray-600 line-clamp-3">{ev.description}</p>

//             <div className="mt-3 flex items-center justify-between">
//               <div>
//                 <span className={`px-2 py-1 rounded text-xs ${ev.status === 'approved' ? 'bg-green-50 text-green-700' : ev.status === 'pending' ? 'bg-yellow-50 text-yellow-700' : 'bg-red-50 text-red-700'}`}>
//                   {ev.status}
//                 </span>
//               </div>

//               <div className="flex gap-2">
//                 <button onClick={() => setSelectedEvent(ev)} className="px-3 py-1 rounded bg-indigo-600 text-white">More info</button>

//                 {ev.poster && <button onClick={() => setPosterModal(ev)} className="px-3 py-1 rounded border">View poster</button>}

//                 {/* Edit visible only to owner or admin */}
//                 {(user?.role === 'admin' || isOwner(ev)) && (
//                   <a href={`/events/${ev._id}/edit`} className="px-3 py-1 rounded bg-gray-100">Edit</a>
//                 )}

//                 {ev.status === 'approved' ? (
//                   <button onClick={() => register(ev)} className="px-3 py-1 rounded bg-green-600 text-white">Register</button>
//                 ) : (
//                   <div className="px-3 py-1 rounded text-xs text-gray-500">Not open</div>
//                 )}
//               </div>
//             </div>
//           </article>
//         ))}
//       </div>

//       {/* More info modal */}
//       {selectedEvent && (
//         <div className="fixed inset-0 flex items-center justify-center z-50" onClick={() => setSelectedEvent(null)}>
//           <div className="absolute inset-0 bg-black/40" />
//           <div className="relative z-10 bg-white rounded-lg p-6 max-w-3xl w-11/12" onClick={(e) => e.stopPropagation()}>
//             <button className="absolute top-3 right-3" onClick={() => setSelectedEvent(null)}>✕</button>
//             <h2 className="text-xl font-semibold">{selectedEvent.title}</h2>
//             <p className="mt-2 text-gray-700">{selectedEvent.description}</p>
//             <div className="mt-4 text-sm text-gray-600">Organizer: {selectedEvent.organizer?.name || 'Unknown'}</div>
//             <div className="mt-4 text-right">
//               <a href={`/events/${selectedEvent._id}`} className="px-3 py-1 bg-gray-100 rounded mr-2">View full page</a>
//               {selectedEvent.status === 'approved' && <button onClick={() => register(selectedEvent)} className="px-3 py-1 bg-green-600 text-white rounded">Register</button>}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Poster modal */}
//       {posterModal && (
//         <div className="fixed inset-0 flex items-center justify-center z-50" onClick={() => setPosterModal(null)}>
//           <div className="absolute inset-0 bg-black/50" />
//           <div className="relative z-10 bg-white rounded-lg p-4 max-w-2xl w-11/12" onClick={(e) => e.stopPropagation()}>
//             <button className="absolute top-2 right-2" onClick={() => setPosterModal(null)}>✕</button>
//             <img src={`http://localhost:5000${posterModal.poster}`} alt="poster" className="w-full object-contain" />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }



// src/pages/EventList.js





// import React, { useEffect, useState } from 'react';



// export default function EventList({ token }) {
//   const [events, setEvents] = useState([]);
//   const [user, setUser] = useState(null);
//   const [selectedEvent, setSelectedEvent] = useState(null);
//   const [posterModal, setPosterModal] = useState(null);

//   useEffect(() => {
//     const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
//     setUser(storedUser);

//     fetch('http://localhost:5000/api/events')
//       .then((r) => r.json())
//       .then((data) => {
//         const arr = Array.isArray(data) ? data : Array.isArray(data?.events) ? data.events : [];
//         setEvents(arr.filter((ev) => ev.status !== 'rejected'));
//       })
//       .catch(() => {
//         setEvents([]);
//       });
//   }, []);

//   // razorpay register function (unchanged, kept intact)
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
//           window.location.reload();
//         } else alert(v.message || 'Verification failed');
//       },
//       prefill: { name: user?.name, email: user?.email },
//       theme: { color: '#4f46e5' },
//     };
//     const rzp = new window.Razorpay(options);
//     rzp.open();
//   }

//  // robust owner check — handles many shapes (string id, {_id:...}, id vs _id)
// const isOwner = (ev) => {
//   const organizer = ev?.organizer;
//   if (!organizer) return false;

//   // organizer maybe an object { _id, name } or could be just an id string
//   const organizerId = organizer._id || organizer.id || organizer; 
//   const userId = user?._id || user?.id || user; // user could be object or string

//   // normalize to strings and compare
//   return !!(organizerId && userId && String(organizerId) === String(userId));
// };


//   return (
//     <div>
//       <h3 className="text-2xl font-semibold mb-4">🎉 Events</h3>

//       <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
//         {events.map((ev) => (
//           <article key={ev._id} className="p-4 rounded-lg border shadow-sm bg-white flex flex-col">
//             <div className="h-40 w-full rounded overflow-hidden bg-gray-100">
//               <img src={ev.poster ? `http://localhost:5000${ev.poster}` : '/images/sample-poster.jpg'} alt={ev.title} className="w-full h-full object-cover" />
//             </div>

//             <div className="mt-3 flex-1">
//               <h4 className="font-semibold">{ev.title}</h4>
//               <p className="text-sm text-gray-600 line-clamp-3 mt-2">{ev.description}</p>
//             </div>

//             <div className="mt-3 flex items-center justify-between">
//               <div>
//                 <span className={`px-2 py-1 rounded text-xs ${ev.status === 'approved' ? 'bg-green-50 text-green-700' : ev.status === 'pending' ? 'bg-yellow-50 text-yellow-700' : 'bg-red-50 text-red-700'}`}>
//                   {ev.status}
//                 </span>
//               </div>

//               <div className="flex gap-2 items-center">
//                 <button onClick={() => setSelectedEvent(ev)} className="px-3 py-1 rounded bg-indigo-600 text-white text-sm">More info</button>
//                 {ev.poster && <button onClick={() => setPosterModal(ev)} className="px-3 py-1 rounded border text-sm">View poster</button>}
//                 {(user?.role === 'admin' || isOwner(ev)) && (
//                   <a href={`/events/${ev._id}/edit`} className="px-3 py-1 rounded bg-gray-100 text-sm">Edit</a>
//                 )}
//                 {ev.status === 'approved' ? (
//                   <button onClick={() => register(ev)} className="px-3 py-1 rounded bg-green-600 text-white text-sm">Register</button>
//                 ) : (
//                   <div className="px-3 py-1 rounded text-xs text-gray-500">Not open</div>
//                 )}
//               </div>
//             </div>
//           </article>
//         ))}
//       </div>

//       {/* More info modal */}
//       {selectedEvent && (
//         <div className="fixed inset-0 flex items-center justify-center z-50" onClick={() => setSelectedEvent(null)}>
//           <div className="absolute inset-0 bg-black/40" />
//           <div className="relative z-10 bg-white rounded-lg p-6 max-w-3xl w-11/12" onClick={(e) => e.stopPropagation()}>
//             <button className="absolute top-3 right-3" onClick={() => setSelectedEvent(null)}>✕</button>
//             <h2 className="text-xl font-semibold">{selectedEvent.title}</h2>
//             <p className="mt-2 text-gray-700">{selectedEvent.description}</p>
//             <div className="mt-4 text-sm text-gray-600">Organizer: {selectedEvent.organizer?.name || 'Unknown'}</div>
//             <div className="mt-4 text-right">
//               <a href={`/events/${selectedEvent._id}`} className="px-3 py-1 bg-gray-100 rounded mr-2">View full page</a>
//               {selectedEvent.status === 'approved' && <button onClick={() => register(selectedEvent)} className="px-3 py-1 bg-green-600 text-white rounded">Register</button>}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Poster modal */}
//       {posterModal && (
//         <div className="fixed inset-0 flex items-center justify-center z-50" onClick={() => setPosterModal(null)}>
//           <div className="absolute inset-0 bg-black/50" />
//           <div className="relative z-10 bg-white rounded-lg p-4 max-w-2xl w-11/12" onClick={(e) => e.stopPropagation()}>
//             <button className="absolute top-2 right-2" onClick={() => setPosterModal(null)}>✕</button>
//             <img src={`http://localhost:5000${posterModal.poster}`} alt="poster" className="w-full object-contain" />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }



// src/pages/EventList.js
import React, { useEffect, useState } from 'react';

const API_ORIGIN = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function getPosterUrl(poster) {
  if (!poster) return '/images/sample-poster.jpg'; // CRA placeholder
  if (poster.startsWith('http://') || poster.startsWith('https://')) return poster;
  if (poster.startsWith('/')) return `${API_ORIGIN}${poster}`;
  return `${API_ORIGIN}/${poster}`;
}

export default function EventList({ token }) {
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null); // for "More info"
  const [posterModal, setPosterModal] = useState(null); // view poster
  const [editModal, setEditModal] = useState(null); // { ev, form... }
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
    setUser(storedUser);
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchEvents() {
    try {
      setLoading(true);
      const res = await fetch(`${API_ORIGIN}/api/events`);
      const data = await res.json();
      const arr = Array.isArray(data) ? data : Array.isArray(data?.events) ? data.events : [];
      // normalize posters to full URLs
      const formatted = arr
        .filter((ev) => ev.status !== 'rejected')
        .map((ev) => ({ ...ev, poster: getPosterUrl(ev.poster) }));
      setEvents(formatted);
      // debug
      console.log('Events loaded (first 5):', formatted.slice(0, 5));
    } catch (err) {
      console.error('Error loading events', err);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }

  // helper: owner check robust for various shapes
  const isOwner = (ev) => {
    const organizer = ev?.organizer;
    if (!organizer) return false;
    const organizerId = organizer._id || organizer.id || organizer;
    const userId = user?._id || user?.id || user;
    return !!(organizerId && userId && String(organizerId) === String(userId));
  };

  // Razorpay registration - unchanged
  async function register(ev) {
    if (!token) return alert('Please login to register');
    const res = await fetch(`${API_ORIGIN}/api/registrations/create-order`, {
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
        const verifyRes = await fetch(`${API_ORIGIN}/api/registrations/verify`, {
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

  // Open edit modal (owner or admin only)
  function openEditModal(ev) {
    // safe check (UI-level) - backend enforces too
    if (!(user?.role === 'admin' || isOwner(ev))) {
      return alert('You do not have permission to edit this event.');
    }

    setEditModal({
      ev,
      title: ev.title || '',
      description: ev.description || '',
      price: ev.price || 0,
      date: ev.date || '',
      location: ev.location || '',
      posterFile: null,
      saving: false,
    });
  }

  // Save update
  async function updateEvent() {
    if (!editModal || !editModal.ev) return;
    const id = editModal.ev._id;
    const fd = new FormData();
    fd.append('title', editModal.title);
    fd.append('description', editModal.description);
    fd.append('price', editModal.price);
    if (editModal.date) fd.append('date', editModal.date);
    if (editModal.location) fd.append('location', editModal.location);
    if (editModal.posterFile) fd.append('poster', editModal.posterFile);

    try {
      setEditModal((s) => ({ ...s, saving: true }));
      const res = await fetch(`${API_ORIGIN}/api/events/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: 'Bearer ' + token,
        },
        body: fd,
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        alert(data?.message || 'Failed to update event');
        setEditModal((s) => ({ ...s, saving: false }));
        return;
      }
      alert('Event updated');
      setEditModal(null);
      fetchEvents();
    } catch (err) {
      console.error('Update error', err);
      alert('Network error');
      setEditModal((s) => ({ ...s, saving: false }));
    }
  }

  // Small accessible modal keyboard close
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') {
        setSelectedEvent(null);
        setPosterModal(null);
        setEditModal(null);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // UI rendering
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-3xl font-extrabold text-gray-900">🎉 Events</h3>
        <div className="text-sm text-gray-600">{loading ? 'Loading...' : `${events.length} events`}</div>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((ev) => (
          <article key={ev._id} className="p-4 rounded-lg border shadow-sm bg-white flex flex-col hover:shadow-md transition-shadow">
            <div className="h-44 w-full rounded overflow-hidden bg-gray-100">
              <img src={ev.poster || '/images/sample-poster.jpg'} alt={ev.title} className="w-full h-full object-cover" />
            </div>

            <div className="mt-3 flex-1">
              <h4 className="font-semibold text-gray-800">{ev.title}</h4>
              <p className="text-sm text-gray-600 mt-2 line-clamp-3">{ev.description}</p>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div>
                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    ev.status === 'approved' ? 'bg-green-50 text-green-700' : ev.status === 'pending' ? 'bg-yellow-50 text-yellow-700' : 'bg-red-50 text-red-700'
                  }`}
                >
                  {ev.status}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedEvent(ev)}
                  className="px-3 py-1.5 rounded-md bg-indigo-600 text-white text-sm hover:bg-indigo-700 transition"
                >
                  More info
                </button>

                {ev.poster && (
                  <button
                    onClick={() => setPosterModal(ev)}
                    className="px-3 py-1.5 rounded-md border bg-white text-sm hover:bg-gray-50 transition"
                  >
                    Poster
                  </button>
                )}

                {(user?.role === 'admin' || isOwner(ev)) && (
                  <button
                    onClick={() => openEditModal(ev)}
                    className="px-3 py-1.5 rounded-md bg-gray-100 text-sm hover:bg-gray-200 transition"
                  >
                    Edit
                  </button>
                )}

                {ev.status === 'approved' ? (
                  <button onClick={() => register(ev)} className="px-3 py-1.5 rounded-md bg-green-600 text-white text-sm hover:bg-green-700 transition">
                    Register
                  </button>
                ) : (
                  <div className="px-3 py-1 rounded text-xs text-gray-500">Not open</div>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* More info modal (fade+scale) */}
      {selectedEvent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={() => setSelectedEvent(null)}
          aria-modal="true"
          role="dialog"
        >
          <div className="absolute inset-0 bg-black/50 transition-opacity" />
          <div
            className="relative z-10 w-11/12 max-w-3xl bg-white rounded-2xl p-6 shadow-2xl transform transition-all duration-300 scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => setSelectedEvent(null)} className="absolute top-4 right-4 text-gray-500">✕</button>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">{selectedEvent.title}</h2>
            <p className="text-gray-700 mb-4">{selectedEvent.description}</p>
            <div className="text-sm text-gray-600">Organizer: {selectedEvent.organizer?.name || 'Unknown'}</div>

            <div className="mt-6 flex justify-end gap-2">
              {(user?.role === 'admin' || isOwner(selectedEvent)) && (
                <button onClick={() => openEditModal(selectedEvent)} className="px-4 py-2 bg-gray-100 rounded">Edit</button>
              )}
              <a href={`/events/${selectedEvent._id}`} className="px-4 py-2 bg-white rounded border">View full page</a>
              {selectedEvent.status === 'approved' && (
                <button onClick={() => register(selectedEvent)} className="px-4 py-2 bg-green-600 text-white rounded">Register</button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Poster view modal */}
      {posterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setPosterModal(null)}>
          <div className="absolute inset-0 bg-black/60" />
          <div
            className="relative z-10 w-11/12 max-w-2xl bg-white rounded-xl p-4 shadow-xl transform transition-all duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="absolute top-3 right-3 text-gray-500" onClick={() => setPosterModal(null)}>✕</button>
            <img src={posterModal.poster || '/images/sample-poster.jpg'} alt="poster" className="w-full h-auto object-contain rounded" />
          </div>
        </div>
      )}

      {/* Edit modal (organizer/admin) */}
      {editModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setEditModal(null)}>
          <div className="absolute inset-0 bg-black/50" />
          <div
            className="relative z-10 w-11/12 max-w-2xl bg-white rounded-2xl p-6 shadow-2xl transform transition-all duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Edit Event</h3>
              <button onClick={() => setEditModal(null)} className="text-gray-500">✕</button>
            </div>

            <div className="space-y-3">
              <label className="block">
                <div className="text-sm text-gray-600 mb-1">Title</div>
                <input
                  value={editModal.title}
                  onChange={(e) => setEditModal((s) => ({ ...s, title: e.target.value }))}
                  className="w-full p-2 rounded border"
                />
              </label>

              <label className="block">
                <div className="text-sm text-gray-600 mb-1">Description</div>
                <textarea
                  value={editModal.description}
                  onChange={(e) => setEditModal((s) => ({ ...s, description: e.target.value }))}
                  rows="4"
                  className="w-full p-2 rounded border"
                />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <div className="text-sm text-gray-600 mb-1">Price</div>
                  <input
                    type="number"
                    value={editModal.price}
                    onChange={(e) => setEditModal((s) => ({ ...s, price: e.target.value }))}
                    className="w-full p-2 rounded border"
                  />
                </label>
                <label className="block">
                  <div className="text-sm text-gray-600 mb-1">Date</div>
                  <input
                    type="date"
                    value={editModal.date || ''}
                    onChange={(e) => setEditModal((s) => ({ ...s, date: e.target.value }))}
                    className="w-full p-2 rounded border"
                  />
                </label>
              </div>

              <label className="block">
                <div className="text-sm text-gray-600 mb-1">Location</div>
                <input
                  value={editModal.location}
                  onChange={(e) => setEditModal((s) => ({ ...s, location: e.target.value }))}
                  className="w-full p-2 rounded border"
                />
              </label>

              <label className="block">
                <div className="text-sm text-gray-600 mb-1">Change Poster (optional)</div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEditModal((s) => ({ ...s, posterFile: e.target.files[0] }))}
                />
              </label>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setEditModal(null)} className="px-4 py-2 bg-gray-100 rounded">Cancel</button>
              <button
                onClick={updateEvent}
                disabled={editModal.saving}
                className={`px-4 py-2 rounded text-white ${editModal.saving ? 'bg-gray-400 cursor-wait' : 'bg-indigo-600 hover:bg-indigo-700'}`}
              >
                {editModal.saving ? 'Saving...' : 'Update'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
