import { useEffect, useState } from 'react'
import axios from 'axios'

export default function BookingList() {
  const [bookings, setBookings] = useState([])
  useEffect(() => {
    axios.get('http://localhost:4000/api/bookings')
      .then(r => setBookings(r.data))
  }, [])

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
          {bookings.map(b=>(
            <tr key={b._id} className="border-t">
              <td className="p-2">{b.event?.title}</td>
              <td className="p-2">{new Date(b.date).toLocaleDateString()}</td>
              <td className="p-2">{b.time}</td>
              <td className="p-2">{b.instructor.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}