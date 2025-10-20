import React, { useEffect, useState } from 'react';

export default function MyRegistrations({ token }){
  const [regs, setRegs] = useState([]);
  useEffect(()=>{ fetchMy(); }, []);
  async function fetchMy(){
    const res = await fetch('http://localhost:5000/api/registrations/my', { headers: { Authorization: 'Bearer '+token }});
    if (res.ok) setRegs(await res.json());
  }
  return <div>
    <h3 className="text-lg font-semibold">My Registrations</h3>
    {regs.map(r => <div key={r._id} className="border p-2 my-2">
      <div className="font-medium">{r.event?.title}</div>
      <div>Amount: ₹{r.amount} • Status: {r.paymentStatus}</div>
    </div>)}
  </div>;
}
