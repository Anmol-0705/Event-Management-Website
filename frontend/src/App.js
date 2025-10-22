

// import React, { useState } from 'react';
// import EventList from './pages/EventList';
// import Login from './pages/Login';
// import Register from './pages/Register';
// import OrganizerDashboard from './pages/EventCreate';
// import AdminDashboard from './pages/AdminDashboard';
// import MyRegistrations from './pages/MyRegistrations';

// function App() {
//   const [token, setToken] = useState(localStorage.getItem('token'));
//   const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'));

//   const onLogin = (t, u) => {
//     setToken(t);
//     setUser(u);
//     localStorage.setItem('token', t);
//     localStorage.setItem('user', JSON.stringify(u));
//   };

//   const logout = () => {
//     setToken(null);
//     setUser(null);
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-blue-500 text-gray-100 font-sans">
//       <div className="max-w-6xl mx-auto py-10 px-6">
//         {/* Header */}
//         <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-white/20 mb-8 animate-fadeIn">
//           <div className="flex flex-col md:flex-row justify-between items-center">
//             <h1 className="text-4xl font-extrabold tracking-wide text-white drop-shadow-lg mb-4 md:mb-0">
//               Event<span className="text-blue-200">Hub</span>
//             </h1>
//             {token ? (
//               <div className="flex items-center gap-3">
//                 <span className="text-lg font-medium text-white">
//                   Hi {user?.name}{' '}
//                   <span className="opacity-80 text-sm">({user?.role})</span>
//                 </span>
//                 <button
//                   onClick={logout}
//                   className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg font-semibold text-white transition-all duration-300 transform hover:scale-105"
//                 >
//                   Logout
//                 </button>
//               </div>
//             ) : null}
//           </div>

//           {/* Login + Register */}
//           {!token && (
//             <div className="grid md:grid-cols-2 gap-6 mt-8">
//               <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-md shadow-lg hover:shadow-2xl transition-all duration-300">
//                 <Login onLogin={onLogin} />
//               </div>
//               <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-md shadow-lg hover:shadow-2xl transition-all duration-300">
//                 <Register />
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Event + Dashboard Section */}
//         <div className="grid md:grid-cols-2 gap-6">
//           <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-4 border border-white/10">
//             <EventList token={token} />
//           </div>

//           <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-4 border border-white/10">
//             {user?.role === 'organizer' && <OrganizerDashboard token={token} />}
//             {user?.role === 'admin' && <AdminDashboard token={token} />}
//             {token && <MyRegistrations token={token} />}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50 to-white text-gray-800 antialiased">
      <div className="max-w-7xl mx-auto py-12 px-6">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-800">
              EventHub
            </h1>
            <p className="text-sm text-gray-500 mt-1">Manage and discover events — clean, simple and professional.</p>
          </div>

          <div className="flex items-center gap-4">
            {token ? (
              <>
                <div className="text-sm text-gray-700">
                  Hi <span className="font-medium">{user?.name}</span>{' '}
                  <span className="text-xs text-gray-400">({user?.role})</span>
                </div>

                <button
                  onClick={logout}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition transform hover:-translate-y-[1px]"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="text-sm text-gray-600">Sign in or create an account to register for events</div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column: events */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
              <EventList token={token} />
            </div>
          </div>

          {/* Right column: auth / dashboards */}
          <aside>
            <div className="space-y-6">
              {!token ? (
                <>
                  <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <Login onLogin={onLogin} />
                  </div>
                  <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <Register />
                  </div>
                </>
              ) : (
                <>
                  {user?.role === 'organizer' && (
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4">
                      <OrganizerDashboard token={token} />
                    </div>
                  )}

                  {user?.role === 'admin' && (
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4">
                      <AdminDashboard token={token} />
                    </div>
                  )}

                  <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                    <MyRegistrations token={token} />
                  </div>
                </>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default App;

