// import React, { useState } from 'react';
// import EventList from './pages/EventList';
// import Login from './pages/Login';
// import Register from './pages/Register';
// import OrganizerDashboard from './pages/EventCreate';
// import AdminDashboard from './pages/AdminDashboard';
// import MyRegistrations from './pages/MyRegistrations';

// function App(){
//   const [token, setToken] = useState(localStorage.getItem('token'));
//   const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')||'null'));

//   const onLogin = (t,u) => { setToken(t); setUser(u); localStorage.setItem('token', t); localStorage.setItem('user', JSON.stringify(u)); };
//   const logout = () => { setToken(null); setUser(null); localStorage.removeItem('token'); localStorage.removeItem('user'); };

//   return <div className="container">
//     <div className="card mb-4">
//       <div className="flex justify-between items-center">
//         <h1 className="text-2xl font-bold">Event Management</h1>
//         {token ? <div>
//           <span className="mr-3">Hi {user?.name} ({user?.role})</span>
//           <button onClick={logout}>Logout</button>
//         </div> : null}
//       </div>
//       {!token && <div className="grid md:grid-cols-2 gap-4 mt-4">
//         <Login onLogin={onLogin} />
//         <Register />
//       </div>}
//     </div>

//     <div className="grid md:grid-cols-2 gap-4">
//       <div className="card">
//         <EventList token={token} />
//       </div>
//       <div className="card">
//         {user?.role === 'organizer' && <OrganizerDashboard token={token} />}
//         {user?.role === 'admin' && <AdminDashboard token={token} />}
//         {token && <MyRegistrations token={token} />}
//       </div>
//     </div>
//   </div>;
// }

// export default App;


import React, { useState } from 'react';
import EventList from './pages/EventList';
import Login from './pages/Login';
import Register from './pages/Register';
import OrganizerDashboard from './pages/EventCreate';
import AdminDashboard from './pages/AdminDashboard';
import MyRegistrations from './pages/MyRegistrations';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'));

  const onLogin = (t, u) => {
    setToken(t);
    setUser(u);
    localStorage.setItem('token', t);
    localStorage.setItem('user', JSON.stringify(u));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-500 text-gray-100 font-poppins">
      {/* Glass effect container */}
      <div className="max-w-6xl mx-auto py-10 px-6">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-6 border border-white/20 mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-extrabold tracking-wide text-white drop-shadow-lg">
              Event Management
            </h1>
            {token ? (
              <div className="flex items-center gap-3">
                <span className="text-lg font-medium text-white">
                  Hi {user?.name} <span className="opacity-80 text-sm">({user?.role})</span>
                </span>
                <button
                  onClick={logout}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg font-semibold text-white transition-all duration-300 transform hover:scale-105"
                >
                  Logout
                </button>
              </div>
            ) : null}
          </div>

          {!token && (
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md shadow-lg hover:shadow-2xl transition-all">
                <Login onLogin={onLogin} />
              </div>
              <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md shadow-lg hover:shadow-2xl transition-all">
                <Register />
              </div>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-4 border border-white/10">
            <EventList token={token} />
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-4 border border-white/10">
            {user?.role === 'organizer' && <OrganizerDashboard token={token} />}
            {user?.role === 'admin' && <AdminDashboard token={token} />}
            {token && <MyRegistrations token={token} />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
