


// import React, { useState } from 'react';

// export default function Login({ onLogin }) {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const login = async () => {
//     const res = await fetch('http://localhost:5000/api/auth/login', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ email, password }),
//     });
//     const data = await res.json();
//     if (res.ok) onLogin(data.token, data.user);
//     else alert(data.message || 'Login failed');
//   };

//   return (
//     <div className="space-y-4 text-white">
//       <h3 className="text-2xl font-semibold text-center mb-4">Login</h3>
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
//       <button
//         onClick={login}
//         className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 rounded-lg transition-transform transform hover:scale-105"
//       >
//         Login
//       </button>
//     </div>
//   );
// }

import React, { useState } from 'react';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const login = async (e) => {
    if (e) e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        onLogin(data.token, data.user);
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={login}
      className="space-y-4 text-gray-800"
      aria-label="Login form"
    >
      <h3 className="text-2xl font-semibold text-center">Welcome back</h3>
      <p className="text-sm text-gray-500 text-center">Sign in to access events and registrations</p>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-100 p-2 rounded-md">
          {error}
        </div>
      )}

      <label className="block">
        <span className="text-sm text-gray-600">Email</span>
        <input
          className="mt-1 w-full bg-white/90 placeholder-gray-400 border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
          aria-required="true"
        />
      </label>

      <label className="block">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Password</span>
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="text-sm text-indigo-600 hover:underline"
            aria-pressed={showPassword}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>

        <input
          className="mt-1 w-full bg-white/90 placeholder-gray-400 border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition"
          placeholder="Your password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          aria-required="true"
        />
      </label>

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3 rounded-lg text-white font-semibold transition transform ${
          loading ? 'bg-indigo-300 cursor-wait' : 'bg-indigo-600 hover:bg-indigo-700'
        }`}
        aria-busy={loading}
      >
        {loading ? 'Signing in...' : 'Login'}
      </button>

      <p className="text-xs text-gray-500 text-center">
        By signing in you agree to our <span className="text-indigo-600">terms</span>.
      </p>
    </form>
  );
}
