import React, { useState } from 'react';

export default function Register(){
  const [name,setName]=useState(''); const [email,setEmail]=useState(''); const [password,setPassword]=useState('');
  const [role,setRole]=useState('customer');

  const reg = async ()=> {
    const res = await fetch('http://localhost:5000/api/auth/register', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ name, email, password, role })
    });
    const data = await res.json();
    alert(data.message || 'Registered');
  };

  return <div>
    <h3 className="text-lg font-semibold">Register</h3>
    <input className="w-full border p-2 my-1" placeholder='name' value={name} onChange={e=>setName(e.target.value)} />
    <input className="w-full border p-2 my-1" placeholder='email' value={email} onChange={e=>setEmail(e.target.value)} />
    <input className="w-full border p-2 my-1" placeholder='password' type='password' value={password} onChange={e=>setPassword(e.target.value)} />
    <select className="w-full border p-2 my-1" value={role} onChange={e=>setRole(e.target.value)}>
      <option value='customer'>Customer</option>
      <option value='organizer'>Organizer</option>
    </select>
    <button onClick={reg}>Register</button>
  </div>;
}
