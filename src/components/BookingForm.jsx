import { useState, useEffect } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import axios from 'axios'

export default function BookingForm({ onAdd }) {
  const [date, setDate] = useState(new Date())
  const [time, setTime] = useState('09:00')
  const [instructors, setInstructors] = useState([])
  const [instructor, setInstructor] = useState('')

  useEffect(() => {
    axios.get('http://localhost:4000/api/instructors')
      .then(r => setInstructors(r.data))
  }, [])

  const submit = e => {
    e.preventDefault()
    axios.post('http://localhost:4000/api/bookings', { date, time, instructor })
      .then(r => onAdd(r.data))
  }

  return (
    <form onSubmit={submit} className="max-w-md mx-auto p-4 bg-white rounded shadow">
      <label className="block mb-2">Date</label>
      <DatePicker selected={date} onChange={setDate}
        className="w-full p-2 border mb-4"/>
      <label className="block mb-2">Time</label>
      <input type="time" value={time} onChange={e=>setTime(e.target.value)}
        className="w-full p-2 border mb-4"/>
      <label className="block mb-2">Instructor</label>
      <select value={instructor} onChange={e=>setInstructor(e.target.value)}
        className="w-full p-2 border mb-4">
        <option value="">—</option>
        {instructors.map(i=>(
          <option key={i._id} value={i._id}>{i.name}</option>
        ))}
      </select>
      <button type="submit" className="w-full p-2 bg-blue-600 text-white rounded">
        Add Booking
      </button>
    </form>
  )
}