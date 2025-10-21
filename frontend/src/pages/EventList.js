// import React, { useEffect, useState } from 'react';

// export default function EventList({ token }){
//   const [events, setEvents] = useState([]);
//   useEffect(()=>{ fetch('http://localhost:5000/api/events').then(r=>r.json()).then(setEvents); }, []);

//   async function register(ev){
//     if (!token) return alert('Please login to register');

//     const res = await fetch('http://localhost:5000/api/registrations/create-order', {
//       method:'POST', headers:{ 'Content-Type':'application/json', 'Authorization':'Bearer '+token },
//       body: JSON.stringify({ eventId: ev._id })
//     });
//     const data = await res.json();
//     if (!res.ok) return alert(data.message || 'Could not create order');

//     // load Razorpay script if not present
//     if (!window.Razorpay) {
//       const script = document.createElement('script');
//       script.src = 'https://checkout.razorpay.com/v1/checkout.js';
//       document.body.appendChild(script);
//       await new Promise(resolve => script.onload = resolve);
//     }

//     const options = {
//       key: data.key,
//       amount: data.amount,
//       currency: data.currency,
//       name: ev.title,
//       description: ev.description,
//       order_id: data.orderId,
//       handler: async function (response) {
//         // send verification to backend
//         const verifyRes = await fetch('http://localhost:5000/api/registrations/verify', {
//           method:'POST', headers:{ 'Content-Type':'application/json', 'Authorization':'Bearer '+token },
//           body: JSON.stringify({
//             razorpay_order_id: response.razorpay_order_id,
//             razorpay_payment_id: response.razorpay_payment_id,
//             razorpay_signature: response.razorpay_signature
//           })
//         });
//         const v = await verifyRes.json();
//         if (verifyRes.ok) {
//           alert('Payment successful and verified!');
//           window.location.reload();
//         } else {
//           alert(v.message || 'Verification failed');
//         }
//       },
//       prefill: { name: 'Guest', email: '' },
//       theme: { color: '#2563eb' }
//     };
//     const rzp = new window.Razorpay(options);
//     rzp.open();
//   }

//   return <div>
//     <h3 className="text-xl font-semibold">Events</h3>
//     {events.map(ev => <div key={ev._id} className="border p-3 my-3">
//       <div className="flex justify-between items-start">
//         <div>
//           <div className="font-bold">{ev.title}</div>
//           <div className="text-sm text-gray-600">{ev.description}</div>
//           <div className="text-sm mt-1">Organizer: {ev.organizer?.name} • Status: {ev.status}</div>
//         </div>
//         <div className="text-right">
//           <div className="font-semibold">₹{ev.price}</div>
//           {ev.status==='approved' ? <button onClick={()=>register(ev)} className="mt-2">Register / Pay</button> : <div className="mt-2 text-sm text-red-600">Not open</div>}
//         </div>
//       </div>
//     </div>)}
//   </div>;
// }



import React, { useEffect, useState } from 'react';

export default function EventList({ token }) {
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
    setUser(storedUser);

    fetch('http://localhost:5000/api/events')
      .then(r => r.json())
      .then(data => {
        // Hide rejected events for non-admin users
        if (storedUser?.role !== 'admin') {
          data = data.filter(ev => ev.status !== 'rejected');
        }
        setEvents(data);
      });
  }, []);

  async function register(ev) {
    if (!token) return alert('Please login to register');

    const res = await fetch('http://localhost:5000/api/registrations/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
      body: JSON.stringify({ eventId: ev._id })
    });
    const data = await res.json();
    if (!res.ok) return alert(data.message || 'Could not create order');

    if (!window.Razorpay) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      document.body.appendChild(script);
      await new Promise(resolve => script.onload = resolve);
    }

    const options = {
      key: data.key,
      amount: data.amount,
      currency: data.currency,
      name: ev.title,
      description: ev.description,
      order_id: data.orderId,
      handler: async function (response) {
        const verifyRes = await fetch('http://localhost:5000/api/registrations/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
          body: JSON.stringify({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature
          })
        });
        const v = await verifyRes.json();
        if (verifyRes.ok) {
          alert('Payment successful and verified!');
          window.location.reload();
        } else {
          alert(v.message || 'Verification failed');
        }
      },
      prefill: { name: 'Guest', email: '' },
      theme: { color: '#6366f1' } // blue-purple accent
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  }

  return (
    <div>
      <h3 className="text-2xl font-semibold text-white mb-4 drop-shadow-md">Events</h3>
      {events.length === 0 && (
        <p className="text-gray-300 italic">No events available right now.</p>
      )}
      {events.map(ev => (
        <div
          key={ev._id}
          className={`p-4 my-3 rounded-2xl shadow-lg backdrop-blur-md border transition-all duration-300 
            ${ev.status === 'approved'
              ? 'bg-white/20 hover:bg-white/30 border-green-300/30'
              : 'bg-white/10 border-yellow-300/20'
            }`}
        >
          <div className="flex justify-between items-start">
            <div>
              <div className="font-bold text-lg text-white">{ev.title}</div>
              <div className="text-sm text-gray-200 mt-1">{ev.description}</div>
              <div className="text-sm mt-2 text-gray-300">
                Organizer: {ev.organizer?.name || 'Unknown'} •
                <span
                  className={`ml-1 font-medium ${ev.status === 'approved'
                    ? 'text-green-300'
                    : ev.status === 'pending'
                      ? 'text-yellow-300'
                      : 'text-red-400'
                    }`}
                >
                  {ev.status}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-white">₹{ev.price}</div>
              {ev.status === 'approved' ? (
                <button
                  onClick={() => register(ev)}
                  className="mt-2 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md transition-transform transform hover:scale-105"
                >
                  Register / Pay
                </button>
              ) : (
                <div className="mt-2 text-sm text-red-300 italic">Not open</div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
