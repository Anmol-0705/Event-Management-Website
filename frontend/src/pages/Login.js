import React, { useState } from 'react';

export default function Login({ onLogin }){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const login = async () => {
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (res.ok) onLogin(data.token, data.user);
    else alert(data.message || 'Login failed');
  };

  return <div>
    <h3 className="text-lg font-semibold">Login</h3>
    <input className="w-full border p-2 my-1" placeholder='email' value={email} onChange={e=>setEmail(e.target.value)} />
    <input className="w-full border p-2 my-1" placeholder='password' type='password' value={password} onChange={e=>setPassword(e.target.value)} />
    <button onClick={login}>Login</button>
  </div>;
}
