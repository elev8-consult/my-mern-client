import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';

export default function ClassDetailsPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const fetchEventDetails = async () => {
    try {
      const [eventRes, bookingsRes] = await Promise.all([
        api.get(`/api/events/${id}`),
        api.get(`/api/events/${id}/bookings`)
      ]);
      setEvent(eventRes.data);
      setBookings(bookingsRes.data);
    } catch (err) {
      console.error('Error fetching event details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventDetails();
  }, [id, fetchEventDetails]);

  const handleDelete = async (bookingId) => {
    if (!window.confirm('Are you sure you want to delete this reservation?')) {
      return;
    }

    setDeleting(true);
    try {
      await api.delete(`/api/bookings/${bookingId}`);
      await fetchEventDetails(); // Refresh the data
    } catch (err) {
      console.error('Error deleting booking:', err);
      alert('Failed to delete reservation: ' + (err.response?.data?.message || err.message));
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const [eventRes, bookingsRes] = await Promise.all([
          api.get(`/api/events/${id}`),
          api.get(`/api/events/${id}/bookings`)
        ]);
        setEvent(eventRes.data);
        setBookings(bookingsRes.data);
      } catch (err) {
        console.error('Error fetching event details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (!event) return <div className="p-4">Event not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-4">
        <Link to="/aura-admin" className="text-blue-600 hover:underline">
          ← Back to Admin
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold mb-4">{event.title}</h1>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-gray-600">Date</p>
            <p className="font-semibold">{new Date(event.date).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-gray-600">Time</p>
            <p className="font-semibold">{event.time}</p>
          </div>
          <div>
            <p className="text-gray-600">Instructor</p>
            <p className="font-semibold">{event.instructor.name}</p>
          </div>
          <div>
            <p className="text-gray-600">Duration</p>
            <p className="font-semibold">{event.duration} minutes</p>
          </div>
          <div>
            <p className="text-gray-600">Availability</p>
            <p className="font-semibold">{event.booked}/{event.maxSeats} booked</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Reservations ({bookings.length})</h2>
        {bookings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booked At</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookings.map((booking) => (
                  <tr key={booking._id}>
                    <td className="px-6 py-4 whitespace-nowrap">{booking.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {booking.countryCode} {booking.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(booking.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => handleDelete(booking._id)}
                        disabled={deleting}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No reservations yet</p>
        )}
      </div>
    </div>
  );
}
