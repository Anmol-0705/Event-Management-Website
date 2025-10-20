import React, { useState } from 'react';
import EventList from './pages/EventList';
import Login from './pages/Login';
import Register from './pages/Register';
import OrganizerDashboard from './pages/EventCreate';
import AdminDashboard from './pages/AdminDashboard';
import MyRegistrations from './pages/MyRegistrations';

function App(){
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')||'null'));

  const onLogin = (t,u) => { setToken(t); setUser(u); localStorage.setItem('token', t); localStorage.setItem('user', JSON.stringify(u)); };
  const logout = () => { setToken(null); setUser(null); localStorage.removeItem('token'); localStorage.removeItem('user'); };

  return <div className="container">
    <div className="card mb-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Event Management</h1>
        {token ? <div>
          <span className="mr-3">Hi {user?.name} ({user?.role})</span>
          <button onClick={logout}>Logout</button>
        </div> : null}
      </div>
      {!token && <div className="grid md:grid-cols-2 gap-4 mt-4">
        <Login onLogin={onLogin} />
        <Register />
      </div>}
    </div>

    <div className="grid md:grid-cols-2 gap-4">
      <div className="card">
        <EventList token={token} />
      </div>
      <div className="card">
        {user?.role === 'organizer' && <OrganizerDashboard token={token} />}
        {user?.role === 'admin' && <AdminDashboard token={token} />}
        {token && <MyRegistrations token={token} />}
      </div>
    </div>
  </div>;
}

export default App;
