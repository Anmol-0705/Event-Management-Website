

// import React, { useState } from 'react';

// export default function Register() {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [role, setRole] = useState('customer');

//   const reg = async () => {
//     const res = await fetch('http://localhost:5000/api/auth/register', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ name, email, password, role }),
//     });
//     const data = await res.json();
//     alert(data.message || 'Registered successfully!');
//   };

//   return (
//     <div className="space-y-4 text-white">
//       <h3 className="text-2xl font-semibold text-center mb-4">Register</h3>
//       <input
//         className="w-full bg-white/20 text-white placeholder-gray-300 border border-white/30 rounded-lg p-2 focus:ring-2 focus:ring-indigo-300 focus:outline-none transition-all"
//         placeholder="Full Name"
//         value={name}
//         onChange={(e) => setName(e.target.value)}
//       />
//       <input
//         className="w-full bg-white/20 text-white placeholder-gray-300 border border-white/30 rounded-lg p-2 focus:ring-2 focus:ring-indigo-300 focus:outline-none transition-all"
//         placeholder="Email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//       />
//       <input
//         className="w-full bg-white/20 text-white placeholder-gray-300 border border-white/30 rounded-lg p-2 focus:ring-2 focus:ring-indigo-300 focus:outline-none transition-all"
//         placeholder="Password"
//         type="password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//       />
//       <select
//         className="w-full bg-white/20 text-white border border-white/30 rounded-lg p-2 focus:ring-2 focus:ring-indigo-300 focus:outline-none transition-all"
//         value={role}
//         onChange={(e) => setRole(e.target.value)}
//       >
//         <option value="customer">Customer</option>
//         <option value="organizer">Organizer</option>
//       </select>
//       <button
//         onClick={reg}
//         className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition-transform transform hover:scale-105"
//       >
//         Register
//       </button>
//     </div>
//   );
// }

import React, { useState } from 'react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const reg = async (e) => {
    if (e) e.preventDefault();
    setMessage('');
    setError('');

    if (!name || !email || !password) {
      setError('Please fill all required fields.');
      return;
    }
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message || 'Registered successfully!');
        // clear minimal fields
        setName('');
        setEmail('');
        setPassword('');
        setRole('customer');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={reg} className="space-y-4 text-gray-800" aria-label="Register form">
      <h3 className="text-2xl font-semibold text-center">Create account</h3>
      <p className="text-sm text-gray-500 text-center">Register to create or join events</p>

      {message && (
        <div className="text-sm text-green-700 bg-green-50 border border-green-100 p-2 rounded-md">
          {message}
        </div>
      )}
      {error && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-100 p-2 rounded-md">
          {error}
        </div>
      )}

      <label className="block">
        <span className="text-sm text-gray-600">Full name</span>
        <input
          className="mt-1 w-full bg-white/90 border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
          placeholder="Your full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>

      <label className="block">
        <span className="text-sm text-gray-600">Email</span>
        <input
          className="mt-1 w-full bg-white/90 border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
        />
      </label>

      <label className="block">
        <span className="text-sm text-gray-600">Password</span>
        <input
          className="mt-1 w-full bg-white/90 border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
          placeholder="Create a strong password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          required
        />
      </label>

      <label className="block">
        <span className="text-sm text-gray-600">Role</span>
        <select
          className="mt-1 w-full bg-white/90 border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="customer">Customer</option>
          <option value="organizer">Organizer</option>
        </select>
      </label>

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3 rounded-lg font-semibold text-white ${
          loading ? 'bg-green-300 cursor-wait' : 'bg-green-600 hover:bg-green-700'
        } transition`}
      >
        {loading ? 'Creating account...' : 'Register'}
      </button>
    </form>
  );
}
