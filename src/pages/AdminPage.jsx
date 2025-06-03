import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import api from '../api/axios'

// Copy instructor link to clipboard
const copyToClipboard = (id) => {
  const link = `${window.location.origin}/instructor/${id}`
  navigator.clipboard.writeText(link)
    .then(() => alert('Link copied to clipboard!'))
    .catch(err => console.error('Failed to copy:', err))
}

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

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    // Fetch both instructors and events
    Promise.all([
      api.get('/api/instructors'),
      api.get('/api/events')
    ])
    .then(([instructorsRes, eventsRes]) => {
      setInstructors(Array.isArray(instructorsRes.data) ? instructorsRes.data : [])
      setEvents(Array.isArray(eventsRes.data) ? eventsRes.data : [])
    })
    .catch(err => {
      console.error('Error fetching data:', err)
      setError('Failed to load data')
      setInstructors([])
      setEvents([])
    })
    .finally(() => setLoading(false))
  }, [refresh])

  const [submitError, setSubmitError] = useState(null)
  
  const addInstructor = async e => {
    e.preventDefault()
    setSubmitError(null)
    try {
      await api.post('/api/instructors', { name })
      setName('')
      setRefresh(r => r + 1)
    } catch (err) {
      console.error('Error adding instructor:', err)
      setSubmitError('Failed to add instructor. Please try again.')
    }
  }

  const addEvent = async e => {
    e.preventDefault()
    setSubmitError(null)
    try {
      await api.post('/api/events', {
        date, time, duration, instructor: selInstructor, maxSeats, title
      })
      setTitle('')
      setTime('09:00')
      setMaxSeats(10)
      setRefresh(r => r + 1)
    } catch (err) {
      console.error('Error adding event:', err)
      setSubmitError('Failed to create class. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="p-4 max-w-md mx-auto">
        <h1 className="text-2xl mb-4">Admin</h1>
        <p>Loading...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 max-w-md mx-auto">
        <h1 className="text-2xl mb-4">Admin</h1>
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  return (
    <div className="p-4 max-w-md mx-auto space-y-8">
      <h1 className="text-2xl">Admin</h1>

      <div className="space-y-4">
        <h2 className="font-semibold">Instructors</h2>
        <div className="space-y-2">
          {instructors.map(instructor => (
            <div key={instructor._id} className="p-3 border rounded flex justify-between items-center">
              <span>{instructor.name}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => copyToClipboard(instructor._id)}
                  className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors"
                >
                  Copy Link
                </button>
                <Link
                  to={`/instructor/${instructor._id}`}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                >
                  View Dashboard
                </Link>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={addInstructor} className="space-y-2 mt-4 pt-4 border-t">
          <h3 className="font-semibold">Add New Instructor</h3>
          {submitError && (
            <p className="text-red-600 text-sm">{submitError}</p>
          )}
          <input
            value={name} onChange={e => setName(e.target.value)}
            placeholder="Name" required
            className="w-full p-2 border rounded"
          />
          <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
            Save
          </button>
        </form>
      </div>

      <div className="mb-8">
        <h2 className="font-semibold mb-4">Existing Classes</h2>
        <div className="space-y-2">
          {events.length === 0 ? (
            <p className="text-gray-500">No classes found.</p>
          ) : (
            events.map(event => (
              <div key={event._id} className="p-4 border rounded flex justify-between items-center">
                <div>
                  <p>{event.date ? new Date(event.date).toLocaleDateString() : 'N/A'} @ {event.time || 'N/A'}</p>
                  <p className="text-sm text-gray-600">
                    {event.instructor?.name || 'N/A'} - {event.booked || 0}/{event.maxSeats || 'N/A'} booked
                  </p>
                  <p className="text-sm text-gray-600">
                    Duration: {event.duration || 'N/A'} minutes
                  </p>
                </div>
                <Link 
                  to={`/aura-admin/class/${event._id}`}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  View Details
                </Link>
              </div>
            ))
          )}
        </div>
      </div>

      <form onSubmit={addEvent} className="space-y-2">
        <h2 className="font-semibold">Add Class</h2>
        {submitError && (
          <p className="text-red-600 text-sm">{submitError}</p>
        )}

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
          <option value="">Select an instructor</option>
          {!instructors.length ? (
            <option disabled>No instructors available</option>
          ) : (
            instructors.map(i =>
              <option key={i._id} value={i._id}>{i.name || 'Unnamed Instructor'}</option>
            )
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

        <button 
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
          Create Class
        </button>
      </form>
    </div>
  )
}