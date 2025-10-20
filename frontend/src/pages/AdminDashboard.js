import React, { useEffect, useState } from 'react';

export default function AdminDashboard({ token }) {
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => { fetchUsers(); fetchEvents(); }, []);

  async function fetchUsers() {
    const res = await fetch('http://localhost:5000/api/admin/users', { headers: { Authorization: 'Bearer ' + token } });
    if (res.ok) setUsers(await res.json());
  }
  // async function fetchEvents(){
  //   const res = await fetch('http://localhost:5000/api/events');
  //   if (res.ok) setEvents(await res.json());
  // }

  async function fetchEvents() {
    const res = await fetch('http://localhost:5000/api/admin/events/pending', {
      headers: { Authorization: 'Bearer ' + token }
    });
    if (res.ok) setEvents(await res.json());
  }

  async function changeRole(id, role) {
    await fetch('http://localhost:5000/api/admin/users/' + id + '/role', {
      method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
      body: JSON.stringify({ role })
    });
    fetchUsers();
  }
  async function setStatus(id, status) {
    await fetch('http://localhost:5000/api/admin/events/' + id + '/status', {
      method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
      body: JSON.stringify({ status })
    });
    fetchEvents();
  }

  return <div>
    <h3 className="text-lg font-semibold">Admin Dashboard</h3>
    <div>
      <h4 className="font-medium mt-2">Users</h4>
      {users.map(u => <div key={u._id} className="border p-2 my-1">
        {u.name} - {u.email} - {u.role}
        <div className="mt-1">
          <button onClick={() => changeRole(u._id, 'admin')} className="mr-2">Make Admin</button>
          <button onClick={() => changeRole(u._id, 'organizer')} className="mr-2">Make Organizer</button>

          <button onClick={() => changeRole(u._id, 'customer')}>Make Customer</button>
        </div>
      </div>)}
    </div>

    <div>
      <h4 className="font-medium mt-4">Events</h4>
      {events.map(ev => <div key={ev._id} className="border p-2 my-1">
        <div className="font-semibold">{ev.title}</div>
        <div className="text-sm">Status: {ev.status}</div>
        <div className="mt-2">
          <button onClick={() => setStatus(ev._id, 'approved')} className="mr-2">Approve</button>
          <button onClick={() => setStatus(ev._id, 'rejected')}>Reject</button>
        </div>
      </div>)}
    </div>
  </div>;
}
