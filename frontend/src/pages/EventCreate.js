
/**
 * EventCreate - used for both Create (no initialData) and Edit (initialData provided)
 *
 * Props:
 * - token: auth token (required for create/update)
 * - initialData: optional object with event fields when editing
 * - onSaved: callback called with saved event after create/update
 * - onClose: optional function to close modal (only used when editing via modal)
 *
 * Behavior:
 * - If initialData is provided -> update flow (PUT /api/events/:id)
 * - Otherwise -> create flow (POST /api/events)
 */

// import React, { useEffect, useState } from 'react';


// export default function EventCreate({ token, initialData = null, onSaved = () => {}, onClose = null }) {
//   const [title, setTitle] = useState('');
//   const [desc, setDesc] = useState('');
//   const [price, setPrice] = useState('');
//   const [date, setDate] = useState('');
//   const [location, setLocation] = useState('');
//   const [poster, setPoster] = useState(null); // file for upload
//   const [loading, setLoading] = useState(false);

//   // populate when editing
//   useEffect(() => {
//     if (initialData) {
//       setTitle(initialData.title || '');
//       setDesc(initialData.description || '');
//       setPrice(initialData.price || '');
//       setDate(initialData.date ? initialData.date.split('T')[0] : initialData.date || '');
//       setLocation(initialData.location || initialData.venue || '');
//       setPoster(null);
//     }
//   }, [initialData]);

//   // Helper to call API
//   const create = async () => {
//     if (!title || !desc || !price) {
//       alert('Please fill title, description and price');
//       return;
//     }
//     const formData = new FormData();
//     formData.append('title', title);
//     formData.append('description', desc);
//     formData.append('price', Number(price));
//     if (date) formData.append('date', date);
//     if (location) formData.append('location', location);
//     if (poster) formData.append('poster', poster);

//     setLoading(true);
//     try {
//       const res = await fetch('http://localhost:5000/api/events', {
//         method: 'POST',
//         headers: { Authorization: 'Bearer ' + token },
//         body: formData,
//       });
//       const data = await res.json().catch(() => null);
//       if (res.ok) {
//         alert('Event created (pending admin approval)');
//         // clear fields
//         setTitle('');
//         setDesc('');
//         setPrice('');
//         setDate('');
//         setLocation('');
//         setPoster(null);
//         onSaved(data);
//       } else {
//         alert(data?.message || 'Error creating event');
//       }
//     } catch (err) {
//       console.error(err);
//       alert('Network error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const update = async () => {
//     if (!initialData || !initialData._id) return;
//     if (!title || !desc || !price) {
//       alert('Please fill title, description and price');
//       return;
//     }
//     const formData = new FormData();
//     formData.append('title', title);
//     formData.append('description', desc);
//     formData.append('price', Number(price));
//     if (date) formData.append('date', date);
//     if (location) formData.append('location', location);
//     if (poster) formData.append('poster', poster);

//     setLoading(true);
//     try {
//       const res = await fetch(`http://localhost:5000/api/events/${initialData._id}`, {
//         method: 'PUT',
//         headers: { Authorization: 'Bearer ' + token },
//         body: formData,
//       });
//       const data = await res.json().catch(() => null);
//       if (res.ok) {
//         alert('Event updated');
//         onSaved(data);
//         if (onClose) onClose();
//       } else {
//         alert(data?.message || 'Failed to update event');
//       }
//     } catch (err) {
//       console.error('Update error', err);
//       alert('Network error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Render form UI (same look as your create form)
//   return (
//     <div className="bg-white/90 p-6 rounded-2xl shadow-lg border border-gray-200">
//       <h3 className="text-2xl font-bold mb-4 text-center">
//         {initialData ? 'Edit Event' : 'Create Event'}
//       </h3>

//       <label className="block mb-2 text-sm font-semibold">Title</label>
//       <input
//         className="w-full p-2 mb-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
//         placeholder="Enter event title"
//         value={title}
//         onChange={(e) => setTitle(e.target.value)}
//       />

//       <label className="block mb-2 text-sm font-semibold">Description</label>
//       <textarea
//         className="w-full p-2 mb-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
//         placeholder="Enter event description"
//         rows="3"
//         value={desc}
//         onChange={(e) => setDesc(e.target.value)}
//       />

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
//         <div>
//           <div className="text-sm font-semibold mb-1">Ticket Price</div>
//           <input
//             type="number"
//             className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
//             placeholder="Enter price"
//             value={price}
//             onChange={(e) => setPrice(e.target.value)}
//           />
//         </div>

//         <div>
//           <div className="text-sm font-semibold mb-1">Date</div>
//           <input
//             type="date"
//             className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
//             value={date}
//             onChange={(e) => setDate(e.target.value)}
//           />
//         </div>
//       </div>

//       <label className="block mb-3">
//         <div className="text-sm font-semibold mb-1">Location</div>
//         <input
//           className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
//           placeholder="Enter location / venue"
//           value={location}
//           onChange={(e) => setLocation(e.target.value)}
//         />
//       </label>

//       <label className="block mb-4">
//         <div className="text-sm font-semibold mb-1">Upload Poster</div>
//         <input
//           type="file"
//           accept="image/*"
//           onChange={(e) => setPoster(e.target.files[0])}
//           className="w-full rounded-lg cursor-pointer"
//         />
//       </label>

//       <div className="flex gap-3">
//         {initialData ? (
//           <>
//             <button
//               onClick={update}
//               disabled={loading}
//               className={`flex-1 py-2 rounded-lg font-semibold text-white transition ${
//                 loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
//               }`}
//             >
//               {loading ? 'Saving...' : 'Save Changes'}
//             </button>

//             <button
//               onClick={() => onClose && onClose()}
//               className="px-4 py-2 rounded-lg border border-gray-300 text-sm"
//             >
//               Cancel
//             </button>
//           </>
//         ) : (
//           <button
//             onClick={create}
//             disabled={loading}
//             className={`w-full py-2 rounded-lg font-semibold text-white transition ${
//               loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
//             }`}
//           >
//             {loading ? 'Creating...' : 'Create Event'}
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }




import React, { useEffect, useState } from 'react';

export default function EventCreate({
  token,
  initialData = null,
  onSaved = () => {},
  onClose = null,
}) {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [poster, setPoster] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔹 ADDED: reason for edit
  const [changeReason, setChangeReason] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDesc(initialData.description || '');
      setPrice(initialData.price || '');
      setDate(initialData.date ? initialData.date.split('T')[0] : '');
      setLocation(initialData.location || initialData.venue || '');
      setPoster(null);
      setChangeReason('');
    }
  }, [initialData]);

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
        headers: { Authorization: 'Bearer ' + token },
        body: formData,
      });
      const data = await res.json().catch(() => null);
      if (res.ok) {
        alert('Event created (pending admin approval)');
        setTitle('');
        setDesc('');
        setPrice('');
        setDate('');
        setLocation('');
        setPoster(null);
        onSaved(data);
      } else {
        alert(data?.message || 'Error creating event');
      }
    } catch {
      alert('Network error');
    } finally {
      setLoading(false);
    }
  };

  const update = async () => {
    if (!initialData?._id) return;

    if (!title || !desc || !price) {
      alert('Please fill title, description and price');
      return;
    }

    // 🔹 ADDED: reason mandatory
    if (!changeReason.trim()) {
      alert('Please provide a reason for the change (required for admin approval)');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', desc);
    formData.append('price', Number(price));
    if (date) formData.append('date', date);
    if (location) formData.append('location', location);
    if (poster) formData.append('poster', poster);

    // 🔹 ADDED
    formData.append('reason', changeReason);
    formData.append('status', 'pending');

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/events/${initialData._id}`, {
        method: 'PUT',
        headers: { Authorization: 'Bearer ' + token },
        body: formData,
      });
      const data = await res.json().catch(() => null);
      if (res.ok) {
        alert('Changes submitted for admin approval');
        onSaved(data);
        if (onClose) onClose();
      } else {
        alert(data?.message || 'Failed to update event');
      }
    } catch {
      alert('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border">
      <h3 className="text-2xl font-bold mb-4 text-center">
        {initialData ? 'Edit Event' : 'Create Event'}
      </h3>

      <input
        className="w-full p-2 mb-3 border rounded"
        placeholder="Event title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        className="w-full p-2 mb-3 border rounded"
        placeholder="Event description"
        rows="3"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
        <input
          type="number"
          className="p-2 border rounded"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <input
          type="date"
          className="p-2 border rounded"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <input
        className="w-full p-2 mb-3 border rounded"
        placeholder="Location / venue"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />

      <input type="file" onChange={(e) => setPoster(e.target.files[0])} className="mb-3" />

      {/* 🔹 ADDED: reason input (edit only) */}
      {initialData && (
        <textarea
          className="w-full p-2 mb-4 border rounded"
          placeholder="Reason for change (required for admin approval)"
          rows="2"
          value={changeReason}
          onChange={(e) => setChangeReason(e.target.value)}
        />
      )}

      <div className="flex gap-3">
        {initialData ? (
          <>
            <button
              onClick={update}
              disabled={loading}
              className="flex-1 bg-indigo-600 text-white py-2 rounded"
            >
              {loading ? 'Submitting...' : 'Submit for Approval'}
            </button>
            <button onClick={onClose} className="px-4 py-2 border rounded">
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={create}
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded"
          >
            {loading ? 'Creating...' : 'Create Event'}
          </button>
        )}
      </div>
    </div>
  );
}
