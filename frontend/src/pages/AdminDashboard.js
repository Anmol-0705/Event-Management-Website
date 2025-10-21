// import React, { useEffect, useState } from 'react';

// export default function AdminDashboard({ token }) {
//   const [users, setUsers] = useState([]);
//   const [events, setEvents] = useState([]);

//   useEffect(() => { fetchUsers(); fetchEvents(); }, []);

//   async function fetchUsers() {
//     const res = await fetch('http://localhost:5000/api/admin/users', { headers: { Authorization: 'Bearer ' + token } });
//     if (res.ok) setUsers(await res.json());
//   }


//   async function fetchEvents() {
//     const res = await fetch('http://localhost:5000/api/admin/events/pending', {
//       headers: { Authorization: 'Bearer ' + token }
//     });
//     if (res.ok) setEvents(await res.json());
//   }

//   async function changeRole(id, role) {
//     await fetch('http://localhost:5000/api/admin/users/' + id + '/role', {
//       method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
//       body: JSON.stringify({ role })
//     });
//     fetchUsers();
//   }
//   async function setStatus(id, status) {
//     await fetch('http://localhost:5000/api/admin/events/' + id + '/status', {
//       method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
//       body: JSON.stringify({ status })
//     });
//     fetchEvents();
//   }
//   async function deleteEvent(id) {
//     if (window.confirm("Are you sure you want to delete this event?")) {
//       await fetch('http://localhost:5000/api/admin/events/' + id, {
//         method: 'DELETE',
//         headers: { 'Authorization': 'Bearer ' + token }
//       });
//       fetchEvents();
//     }
//   }


//   return <div>
//     <h3 className="text-lg font-semibold">Admin Dashboard</h3>
//     <div>
//       <h4 className="font-medium mt-2">Users</h4>
//       {users.map(u => <div key={u._id} className="border p-2 my-1">
//         {u.name} - {u.email} - {u.role}
//         <div className="mt-1">
//           <button onClick={() => changeRole(u._id, 'admin')} className="mr-2">Make Admin</button>
//           <button onClick={() => changeRole(u._id, 'organizer')} className="mr-2">Make Organizer</button>

//           <button onClick={() => changeRole(u._id, 'customer')}>Make Customer</button>
//         </div>
//       </div>)}
//     </div>

//     <div>
//       <h4 className="font-medium mt-4">Events</h4>
//       {events.map(ev => <div key={ev._id} className="border p-2 my-1">
//         <div className="font-semibold">{ev.title}</div>
//         <div className="text-sm">Status: {ev.status}</div>
//         <div className="mt-2">
//           <button onClick={() => setStatus(ev._id, 'approved')} className="mr-2">Approve</button>
//           <button onClick={() => setStatus(ev._id, 'rejected')} className="mr-2">Reject</button>
//           <button onClick={() => deleteEvent(ev._id)} className="text-red-600">Delete</button>
//         </div>

//       </div>)}
//     </div>
//   </div>;
// }


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
//     const res = await fetch('http://localhost:5000/api/admin/users', { headers: { Authorization: 'Bearer ' + token } });
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
//     await fetch('http://localhost:5000/api/admin/users/' + id + '/role', {
//       method: 'PUT',
//       headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
//       body: JSON.stringify({ role }),
//     });
//     fetchUsers();
//   }

//   async function setStatus(id, status) {
//     await fetch('http://localhost:5000/api/admin/events/' + id + '/status', {
//       method: 'PUT',
//       headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
//       body: JSON.stringify({ status }),
//     });
//     fetchEvents();
//     fetchRejectedEvents();
//   }

//   async function deleteEvent(id) {
//     if (window.confirm('Are you sure you want to delete this event?')) {
//       await fetch('http://localhost:5000/api/admin/events/' + id, {
//         method: 'DELETE',
//         headers: { Authorization: 'Bearer ' + token },
//       });
//       fetchEvents();
//       fetchRejectedEvents();
//     }
//   }

//   return (
//     <div className="p-4">
//       <h3 className="text-lg font-semibold">Admin Dashboard</h3>

//       {/* USERS SECTION */}
//       <div className="mt-4">
//         <h4 className="font-medium text-blue-600">Users</h4>
//         {users.map((u) => (
//           <div key={u._id} className="border p-2 my-1 rounded">
//             {u.name} - {u.email} - {u.role}
//             <div className="mt-1">
//               <button onClick={() => changeRole(u._id, 'admin')} className="mr-2 text-blue-600">Make Admin</button>
//               <button onClick={() => changeRole(u._id, 'organizer')} className="mr-2 text-green-600">Make Organizer</button>
//               <button onClick={() => changeRole(u._id, 'customer')} className="text-gray-600">Make Customer</button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* EVENTS SECTION */}
//       <div className="mt-6">
//         <h4 className="font-medium text-blue-600">All Active Events</h4>
//         {events.map((ev) => (
//           <div key={ev._id} className="border p-2 my-2 rounded">
//             <div className="font-semibold">{ev.title}</div>
//             <div className="text-sm">Status: {ev.status}</div>
//             <div className="mt-2">
//               <button onClick={() => setStatus(ev._id, 'approved')} className="mr-2 text-green-600">Approve</button>
//               <button onClick={() => setStatus(ev._id, 'rejected')} className="mr-2 text-yellow-600">Reject</button>
//               <button onClick={() => deleteEvent(ev._id)} className="text-red-600">Delete</button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* REJECTED EVENTS SECTION */}
//       <div className="mt-6">
//         <h4 className="font-medium text-red-600">Rejected Events Log</h4>
//         {rejectedEvents.length === 0 && <p className="text-sm text-gray-500">No rejected events</p>}
//         {rejectedEvents.map((ev) => (
//           <div key={ev._id} className="border p-2 my-2 rounded bg-red-50">
//             <div className="font-semibold">{ev.title}</div>
//             <div className="text-sm">Organizer: {ev.organizer?.name || 'Unknown'}</div>
//             <div className="mt-2">
//               <button onClick={() => setStatus(ev._id, 'approved')} className="mr-2 text-green-600">Re-Approve</button>
//               <button onClick={() => deleteEvent(ev._id)} className="text-red-600">Delete Permanently</button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }



import React, { useEffect, useState } from 'react';

export default function AdminDashboard({ token }) {
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [rejectedEvents, setRejectedEvents] = useState([]);

  useEffect(() => {
    fetchUsers();
    fetchEvents();
    fetchRejectedEvents();
  }, []);

  async function fetchUsers() {
    const res = await fetch('http://localhost:5000/api/admin/users', { headers: { Authorization: 'Bearer ' + token } });
    if (res.ok) setUsers(await res.json());
  }

  async function fetchEvents() {
    const res = await fetch('http://localhost:5000/api/events');
    if (res.ok) setEvents(await res.json());
  }

  async function fetchRejectedEvents() {
    const res = await fetch('http://localhost:5000/api/admin/events/rejected', {
      headers: { Authorization: 'Bearer ' + token },
    });
    if (res.ok) setRejectedEvents(await res.json());
  }

  async function changeRole(id, role) {
    await fetch(`http://localhost:5000/api/admin/users/${id}/role`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
      body: JSON.stringify({ role }),
    });
    fetchUsers();
  }

  async function setStatus(id, status) {
    await fetch(`http://localhost:5000/api/admin/events/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
      body: JSON.stringify({ status }),
    });
    fetchEvents();
    fetchRejectedEvents();
  }

  async function deleteEvent(id) {
    if (window.confirm('Are you sure you want to delete this event?')) {
      await fetch(`http://localhost:5000/api/admin/events/${id}`, {
        method: 'DELETE',
        headers: { Authorization: 'Bearer ' + token },
      });
      fetchEvents();
      fetchRejectedEvents();
    }
  }

  return (
    <div className="p-6 text-white">
      <h3 className="text-3xl font-extrabold mb-6 text-center drop-shadow-lg tracking-wide">Admin Dashboard</h3>

      {/* USERS SECTION */}
      <div className="mb-10 bg-white/10 backdrop-blur-lg p-5 rounded-2xl border border-white/20 shadow-md hover:shadow-lg transition-all">
        <h4 className="font-semibold text-blue-300 text-xl mb-3">👥 Manage Users</h4>
        {users.map((u) => (
          <div
            key={u._id}
            className="p-3 my-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex justify-between items-center transition"
          >
            <div>
              <div className="font-semibold">{u.name}</div>
              <div className="text-sm text-gray-300">{u.email} • Role: <span className="font-medium text-indigo-300">{u.role}</span></div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => changeRole(u._id, 'admin')}
                className="px-3 py-1 rounded-lg bg-blue-500 hover:bg-blue-600 text-sm"
              >
                Make Admin
              </button>
              <button
                onClick={() => changeRole(u._id, 'organizer')}
                className="px-3 py-1 rounded-lg bg-green-500 hover:bg-green-600 text-sm"
              >
                Make Organizer
              </button>
              <button
                onClick={() => changeRole(u._id, 'customer')}
                className="px-3 py-1 rounded-lg bg-gray-500 hover:bg-gray-600 text-sm"
              >
                Make Customer
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ACTIVE EVENTS */}
      <div className="mb-10 bg-white/10 backdrop-blur-lg p-5 rounded-2xl border border-white/20 shadow-md hover:shadow-lg transition-all">
        <h4 className="font-semibold text-green-300 text-xl mb-3">✅ Active / Pending Events</h4>
        {events.length === 0 && <p className="text-gray-300">No events currently available.</p>}
        {events.map((ev) => (
          <div
            key={ev._id}
            className="p-3 my-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition"
          >
            <div className="font-semibold text-lg">{ev.title}</div>
            <div className="text-sm text-gray-300">
              Organizer: {ev.organizer?.name || 'Unknown'} • Status:{' '}
              <span
                className={`font-medium ${
                  ev.status === 'approved' ? 'text-green-400' : ev.status === 'pending' ? 'text-yellow-400' : 'text-red-400'
                }`}
              >
                {ev.status}
              </span>
            </div>
            <div className="mt-2 flex gap-2">
              <button
                onClick={() => setStatus(ev._id, 'approved')}
                className="px-3 py-1 rounded-lg bg-green-500 hover:bg-green-600 text-sm"
              >
                Approve
              </button>
              <button
                onClick={() => setStatus(ev._id, 'rejected')}
                className="px-3 py-1 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-sm"
              >
                Reject
              </button>
              <button
                onClick={() => deleteEvent(ev._id)}
                className="px-3 py-1 rounded-lg bg-red-500 hover:bg-red-600 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* REJECTED EVENTS LOG */}
      <div className="bg-white/10 backdrop-blur-lg p-5 rounded-2xl border border-white/20 shadow-md hover:shadow-lg transition-all">
        <h4 className="font-semibold text-red-400 text-xl mb-3">🗑️ Rejected Events Log</h4>
        {rejectedEvents.length === 0 && <p className="text-gray-300 italic">No rejected events currently.</p>}
        {rejectedEvents.map((ev) => (
          <div
            key={ev._id}
            className="p-3 my-2 rounded-lg bg-red-900/20 border border-red-400/30 hover:bg-red-900/30 transition"
          >
            <div className="font-semibold text-lg">{ev.title}</div>
            <div className="text-sm text-gray-300">
              Organizer: {ev.organizer?.name || 'Unknown'}
            </div>
            <div className="mt-2 flex gap-2">
              <button
                onClick={() => setStatus(ev._id, 'approved')}
                className="px-3 py-1 rounded-lg bg-green-500 hover:bg-green-600 text-sm"
              >
                Re-Approve
              </button>
              <button
                onClick={() => deleteEvent(ev._id)}
                className="px-3 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-sm"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
