import { useEffect, useState } from 'react'
import api from '../api/axios'

export default function BookingList() {
  const [bookings, setBookings] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    api.get('/api/bookings')
      .then(response => {
        if (Array.isArray(response.data)) {
          setBookings(response.data)
        } else {
          console.error('Expected array of bookings but got:', response.data)
          setBookings([])
        }
      })
      .catch(err => {
        console.error('Error fetching bookings:', err)
        setError('Failed to load bookings')
        setBookings([])
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="p-4">
        <p>Loading bookings...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 text-red-600">
        <p>{error}</p>
      </div>
    )
  }

  if (!bookings.length) {
    return (
      <div className="p-4">
        <p>No bookings found.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto p-4">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="text-left">
            <th className="p-2">Class Title</th>
            <th className="p-2">Date</th>
            <th className="p-2">Time</th>
            <th className="p-2">Instructor</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map(b => (
            <tr key={b._id} className="border-t">
              <td className="p-2">{b.event?.title || 'N/A'}</td>
              <td className="p-2">{b.date ? new Date(b.date).toLocaleDateString() : 'N/A'}</td>
              <td className="p-2">{b.time || 'N/A'}</td>
              <td className="p-2">{b.instructor?.name || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}