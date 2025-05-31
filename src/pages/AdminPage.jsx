import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import api from '../api/axios'

export default function AdminPage() {
  const [name, setName] = useState('')
  const [instructors, setInstructors] = useState([])
  const [events, setEvents] = useState([])
  const [selInstructor, setSelInstructor] = useState('')
  const [title, setTitle] = useState('')
  const [date, setDate] = useState(new Date())
  const [time, setTime] = useState('09:00')
  const [maxSeats, setMaxSeats] = useState(10)
  const [duration, setDuration] = useState(60)
  const [refresh, setRefresh] = useState(0)

  useEffect(() => {
    // Fetch both instructors and events
    Promise.all([
      api.get('/api/instructors'),
      api.get('/api/events')
    ]).then(([instructorsRes, eventsRes]) => {
      setInstructors(instructorsRes.data);
      setEvents(eventsRes.data);
    });
  }, [refresh])

  const addInstructor = async e => {
    e.preventDefault()
    await api.post('/api/instructors', { name })
    setName(''); setRefresh(r => r + 1)
  }

  const addEvent = async e => {
    e.preventDefault()
    await api.post('/api/events', {
      date, time, duration, instructor: selInstructor, maxSeats, title
    })
    setTitle(''); setTime('09:00'); setMaxSeats(10); setRefresh(r => r + 1)
  }

  return (
    <div className="p-4 max-w-md mx-auto space-y-8">
      <h1 className="text-2xl">Admin</h1>

      <form onSubmit={addInstructor} className="space-y-2">
        <h2 className="font-semibold">Add Instructor</h2>
        <input
          value={name} onChange={e => setName(e.target.value)}
          placeholder="Name" required
          className="w-full p-2 border rounded"
        />
        <button className="px-4 py-2 bg-green-600 text-white rounded">Save</button>
      </form>

      <div className="mb-8">
        <h2 className="font-semibold mb-4">Existing Classes</h2>
        <div className="space-y-2">
          {events.map(event => (
            <div key={event._id} className="p-4 border rounded flex justify-between items-center">
              <div>
                <p>{new Date(event.date).toLocaleDateString()} @ {event.time}</p>
                <p className="text-sm text-gray-600">
                  {event.instructor.name} - {event.booked}/{event.maxSeats} booked
                </p>
                <p className="text-sm text-gray-600">
                  Duration: {event.duration} minutes
                </p>
              </div>
              <Link 
                to={`/aura-admin/class/${event._id}`}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={addEvent} className="space-y-2">
        <h2 className="font-semibold">Add Class</h2>

        <label>Title</label>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Class title"
          required
          className="w-full p-2 border rounded"
        />

        <label>Instructor</label>
        <select
          value={selInstructor}
          onChange={e => setSelInstructor(e.target.value)}
          required className="w-full p-2 border rounded"
        >
          <option value="">—</option>
          {instructors.map(i =>
            <option key={i._id} value={i._id}>{i.name}</option>
          )}
        </select>

        <label>Date</label>
        <DatePicker
          selected={date} onChange={setDate}
          className="w-full p-2 border rounded"
        />

        <label>Time</label>
        <input
          type="time" value={time}
          onChange={e => setTime(e.target.value)}
          required className="w-full p-2 border rounded"
        />

        <label>Duration (minutes)</label>
        <select
          value={duration}
          onChange={e => setDuration(Number(e.target.value))}
          required className="w-full p-2 border rounded"
        >
          <option value={30}>30 minutes</option>
          <option value={45}>45 minutes</option>
          <option value={60}>60 minutes</option>
          <option value={90}>90 minutes</option>
          <option value={120}>120 minutes</option>
        </select>

        <label>Max Seats</label>
        <input
          type="number" value={maxSeats}
          onChange={e => setMaxSeats(+e.target.value)}
          min="1" className="w-full p-2 border rounded"
        />

        <button className="px-4 py-2 bg-blue-600 text-white rounded">Create Class</button>
      </form>
    </div>
  )
}