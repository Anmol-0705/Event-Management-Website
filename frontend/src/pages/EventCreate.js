import React, { useState } from 'react';

export default function EventCreate({ token }){
  const [title,setTitle]=useState(''); const [desc,setDesc]=useState(''); const [price,setPrice]=useState(0);

  const create = async ()=> {
    const res = await fetch('http://localhost:5000/api/events', {
      method:'POST', headers:{
        'Content-Type':'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({ title, description: desc, price: Number(price) })
    });
    const data = await res.json();
    if (res.ok) { alert('Created (pending approval by admin)'); setTitle(''); setDesc(''); setPrice(0); } else alert(data.message || 'Error');
  };

  return <div>
    <h3 className="text-lg font-semibold">Create Event</h3>
    <input className="w-full border p-2 my-1" placeholder='title' value={title} onChange={e=>setTitle(e.target.value)} />
    <textarea className="w-full border p-2 my-1" placeholder='description' value={desc} onChange={e=>setDesc(e.target.value)}></textarea>
    <input className="w-full border p-2 my-1" placeholder='price' value={price} onChange={e=>setPrice(e.target.value)} />
    <button onClick={create}>Create</button>
  </div>;
}
