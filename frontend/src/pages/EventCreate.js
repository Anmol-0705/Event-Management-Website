// import React, { useState } from 'react';

// export default function EventCreate({ token }) {
//   const [title, setTitle] = useState('');
//   const [desc, setDesc] = useState('');
//   const [price, setPrice] = useState('');
//   const [poster, setPoster] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const create = async () => {
//     if (!title || !desc || !price) {
//       alert('Please fill all fields');
//       return;
//     }

//     const formData = new FormData();
//     formData.append('title', title);
//     formData.append('description', desc);
//     formData.append('price', Number(price));
//     if (poster) formData.append('poster', poster);

//     setLoading(true);
//     try {
//       const res = await fetch('http://localhost:5000/api/events', {
//         method: 'POST',
//         headers: {
//           Authorization: 'Bearer ' + token,
//         },
//         body: formData,
//       });

//       const data = await res.json();
//       if (res.ok) {
//         alert('Event created (pending admin approval)');
//         setTitle('');
//         setDesc('');
//         setPrice('');
//         setPoster(null);
//       } else {
//         alert(data.message || 'Error creating event');
//       }
//     } catch (err) {
//       console.error(err);
//       alert('Network error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-lg text-white border border-white/20">
//       <h3 className="text-2xl font-bold mb-4 text-center">Create Event</h3>

//       <label className="block mb-2 text-sm font-semibold">Title</label>
//       <input
//         className="w-full p-2 mb-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-400"
//         placeholder="Enter event title"
//         value={title}
//         onChange={(e) => setTitle(e.target.value)}
//       />

//       <label className="block mb-2 text-sm font-semibold">Description</label>
//       <textarea
//         className="w-full p-2 mb-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-400"
//         placeholder="Enter event description"
//         rows="3"
//         value={desc}
//         onChange={(e) => setDesc(e.target.value)}
//       ></textarea>

//       <label className="block mb-2 text-sm font-semibold">Ticket Price</label>
//       <input
//         type="number"
//         className="w-full p-2 mb-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-400"
//         placeholder="Enter price"
//         value={price}
//         onChange={(e) => setPrice(e.target.value)}
//       />

//       <label className="block mb-2 text-sm font-semibold">Upload Poster</label>
//       <input
//         type="file"
//         accept="image/*"
//         onChange={(e) => setPoster(e.target.files[0])}
//         className="w-full p-2 mb-4 bg-white/10 rounded-lg border border-white/20 cursor-pointer file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-indigo-500 file:text-white hover:file:bg-indigo-600 transition-all"
//       />

//       <button
//         onClick={create}
//         disabled={loading}
//         className={`w-full py-2 rounded-lg font-semibold text-white transition-all duration-300 ${
//           loading
//             ? 'bg-gray-400 cursor-not-allowed'
//             : 'bg-green-500 hover:bg-green-600'
//         }`}
//       >
//         {loading ? 'Creating...' : 'Create Event'}
//       </button>
//     </div>
//   );
// }


// src/pages/EventCreate.js
import React, { useState } from 'react';

export default function EventCreate({ token }) {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [poster, setPoster] = useState(null);
  const [loading, setLoading] = useState(false);

  const create = async () => {
    if (!title || !desc || !price) {
      alert('Please fill title, description and price');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', desc);
    formData.append('price', Number(price));
    if (date) formData.append('date', date);
    if (location) formData.append('location', location);
    if (poster) formData.append('poster', poster);

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/events', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + token,
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        alert('Event created (pending admin approval)');
        // clear
        setTitle('');
        setDesc('');
        setPrice('');
        setDate('');
        setLocation('');
        setPoster(null);
      } else {
        alert(data.message || 'Error creating event');
      }
    } catch (err) {
      console.error(err);
      alert('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-lg text-gray-900 border border-white/20">
      <h3 className="text-2xl font-bold mb-4 text-center">Create Event</h3>

      <label className="block mb-2 text-sm font-semibold">Title</label>
      <input
        className="w-full p-2 mb-3 rounded-lg bg-white/90 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        placeholder="Enter event title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <label className="block mb-2 text-sm font-semibold">Description</label>
      <textarea
        className="w-full p-2 mb-3 rounded-lg bg-white/90 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        placeholder="Enter event description"
        rows="3"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <label className="block">
          <div className="text-sm font-semibold mb-1">Ticket Price</div>
          <input
            type="number"
            className="w-full p-2 mb-3 rounded-lg bg-white/90 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Enter price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </label>

        <label className="block">
          <div className="text-sm font-semibold mb-1">Date</div>
          <input
            type="date"
            className="w-full p-2 mb-3 rounded-lg bg-white/90 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>
      </div>

      <label className="block mb-3">
        <div className="text-sm font-semibold mb-1">Location</div>
        <input
          className="w-full p-2 rounded-lg bg-white/90 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          placeholder="Enter location / venue"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </label>

      <label className="block mb-4">
        <div className="text-sm font-semibold mb-1">Upload Poster</div>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setPoster(e.target.files[0])}
          className="w-full rounded-lg cursor-pointer"
        />
      </label>

      <button
        onClick={create}
        disabled={loading}
        className={`w-full py-2 rounded-lg font-semibold text-white transition-all duration-300 ${
          loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
        }`}
      >
        {loading ? 'Creating...' : 'Create Event'}
      </button>
    </div>
  );
}
