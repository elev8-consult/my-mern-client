import { useState, useEffect, useMemo } from 'react'
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
  const [repeatForMonth, setRepeatForMonth] = useState(false)
  const [showInstructors, setShowInstructors] = useState(true)
  const [showClasses, setShowClasses] = useState(true)

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

  const [instructorError, setInstructorError] = useState(null)
  const [eventError, setEventError] = useState(null)
  
  const addInstructor = async e => {
    e.preventDefault()
    setInstructorError(null)
    
    if (!name.trim()) {
      setInstructorError('Please enter a valid name')
      return
    }

    try {
      await api.post('/api/instructors', { name })
      setName('')
      setRefresh(r => r + 1)
    } catch (err) {
      console.error('Error adding instructor:', err)
      const errorMessage = err.response?.data?.message || 'Failed to add instructor. Please try again.'
      setInstructorError(errorMessage)
    }
  }

  const addEvent = async e => {
    e.preventDefault()
    setEventError(null)
    try {
      await api.post('/api/events', {
        date,
        time,
        duration,
        instructor: selInstructor,
        maxSeats,
        title,
        repeatForMonth
      })
      setTitle('')
      setTime('09:00')
      setMaxSeats(10)
      setRepeatForMonth(false)
      setRefresh(r => r + 1)
    } catch (err) {
      console.error('Error adding event:', err)
      setEventError('Failed to create class. Please try again.')
    }
  }

  // Delete instructor
  const deleteInstructor = async (id) => {
    if (!window.confirm('Are you sure you want to delete this instructor?')) return;
    try {
      await api.delete(`/api/instructors/${id}`);
      setRefresh(r => r + 1);
    } catch (err) {
      alert('Failed to delete instructor.');
    }
  };

  // Delete event (class)
  const deleteEvent = async (id) => {
    if (!window.confirm('Are you sure you want to delete this class?')) return;
    try {
      await api.delete(`/api/events/${id}`);
      setRefresh(r => r + 1);
    } catch (err) {
      alert('Failed to delete class.');
    }
  };

  const sortedEvents = useMemo(() => {
    return events.slice().sort((a, b) => {
      const dateA = a.date ? new Date(a.date) : new Date(0)
      const dateB = b.date ? new Date(b.date) : new Date(0)
      if (dateA.getTime() !== dateB.getTime()) {
        return dateA - dateB
      }
      return (a.time || '').localeCompare(b.time || '')
    })
  }, [events])

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
    <div className="p-4 max-w-3xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h1 className="text-2xl text-[#3B2F2F]">Admin</h1>
        <p className="text-sm text-[#7C6F5F]">
          {instructors.length} instructor{instructors.length === 1 ? '' : 's'} · {events.length} class{events.length === 1 ? '' : 'es'}
        </p>
      </div>

      <section className="bg-white border border-[#E2D3C0] rounded-lg shadow-sm p-4 space-y-4">
        <div>
          <h2 className="font-semibold text-lg text-[#3B2F2F]">Create Class</h2>
          <p className="text-sm text-[#7C6F5F]">Schedule a single class or repeat it weekly for the rest of the month.</p>
        </div>
        <form onSubmit={addEvent} className="space-y-4">
          {eventError && (
            <p className="text-red-600 text-sm">{eventError}</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-[#3B2F2F] mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Class title"
                required
                className="w-full p-2 border rounded bg-[#F5EBDD] text-[#3B2F2F]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#3B2F2F] mb-1">Instructor</label>
              <select
                value={selInstructor}
                onChange={e => setSelInstructor(e.target.value)}
                required
                className="w-full p-2 border rounded bg-[#F5EBDD] text-[#3B2F2F]"
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
            </div>

            <div>
              <label className="block text-sm font-medium text-[#3B2F2F] mb-1">Date</label>
              <DatePicker
                selected={date}
                onChange={setDate}
                className="w-full p-2 border rounded bg-[#F5EBDD] text-[#3B2F2F]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#3B2F2F] mb-1">Time</label>
              <input
                type="time"
                value={time}
                onChange={e => setTime(e.target.value)}
                required
                className="w-full p-2 border rounded bg-[#F5EBDD] text-[#3B2F2F]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#3B2F2F] mb-1">Duration (minutes)</label>
              <select
                value={duration}
                onChange={e => setDuration(Number(e.target.value))}
                required
                className="w-full p-2 border rounded bg-[#F5EBDD] text-[#3B2F2F]"
              >
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>60 minutes</option>
                <option value={90}>90 minutes</option>
                <option value={120}>120 minutes</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#3B2F2F] mb-1">Max Seats</label>
              <input
                type="number"
                value={maxSeats}
                onChange={e => setMaxSeats(+e.target.value)}
                min="1"
                className="w-full p-2 border rounded bg-[#F5EBDD] text-[#3B2F2F]"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <label htmlFor="repeatForMonth" className="flex items-start gap-2 text-sm text-[#3B2F2F]">
              <input
                id="repeatForMonth"
                type="checkbox"
                checked={repeatForMonth}
                onChange={e => setRepeatForMonth(e.target.checked)}
                className="mt-1"
              />
              Repeat this class every week for the remainder of the selected month.
            </label>
            <button 
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors self-start sm:self-auto"
            >
              Create Class
            </button>
          </div>
        </form>
      </section>

      <section className="border border-[#E2D3C0] rounded-lg bg-white/70 shadow-sm">
        <button
          type="button"
          onClick={() => setShowClasses(prev => !prev)}
          className="w-full flex items-center justify-between px-4 py-3 text-left"
          aria-expanded={showClasses}
        >
          <div>
            <span className="font-semibold text-[#3B2F2F]">Existing Classes</span>
            <span className="ml-2 text-sm text-[#7C6F5F]">({events.length})</span>
          </div>
          <span className="text-xl text-[#3B2F2F]">{showClasses ? '−' : '+'}</span>
        </button>
        {showClasses && (
          <div className="px-4 pb-4 space-y-4">
            {sortedEvents.length === 0 ? (
              <p className="text-sm text-[#7C6F5F]">No classes found.</p>
            ) : (
              <div className="max-h-72 overflow-y-auto pr-1 space-y-3">
                {sortedEvents.map(event => (
                  <div key={event._id} className="p-4 border border-[#E2D3C0] rounded-lg bg-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <p className="font-medium text-[#3B2F2F]">{event.date ? new Date(event.date).toLocaleDateString() : 'N/A'} @ {event.time || 'N/A'}</p>
                      <p className="text-sm text-[#7C6F5F]">{event.title || 'Untitled Class'}</p>
                      <p className="text-xs text-[#A89B8C]">
                        {event.instructor?.name || 'N/A'} · {event.booked || 0}/{event.maxSeats || 'N/A'} booked · {event.duration || 'N/A'} minutes
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Link 
                        to={`/aura-admin/class/${event._id}`}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        View Details
                      </Link>
                      <button
                        onClick={() => deleteEvent(event._id)}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      <section className="border border-[#E2D3C0] rounded-lg bg-white/70 shadow-sm">
        <button
          type="button"
          onClick={() => setShowInstructors(prev => !prev)}
          className="w-full flex items-center justify-between px-4 py-3 text-left"
          aria-expanded={showInstructors}
        >
          <div>
            <span className="font-semibold text-[#3B2F2F]">Instructors</span>
            <span className="ml-2 text-sm text-[#7C6F5F]">({instructors.length})</span>
          </div>
          <span className="text-xl text-[#3B2F2F]">{showInstructors ? '−' : '+'}</span>
        </button>
        {showInstructors && (
          <div className="px-4 pb-4 space-y-4">
            <div className="max-h-64 overflow-y-auto pr-1 space-y-2">
              {instructors.length === 0 ? (
                <p className="text-sm text-[#7C6F5F]">No instructors yet. Add one below.</p>
              ) : (
                instructors.map(instructor => (
                  <div key={instructor._id} className="p-3 border border-[#E2D3C0] rounded-lg bg-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <span className="font-medium text-[#3B2F2F]">{instructor.name}</span>
                    <div className="flex flex-wrap items-center gap-2">
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
                      <button
                        onClick={() => deleteInstructor(instructor._id)}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={addInstructor} className="space-y-3 pt-4 border-t border-[#E2D3C0]">
              <h3 className="font-semibold text-[#3B2F2F]">Add New Instructor</h3>
              {instructorError && (
                <p className="text-red-600 text-sm">{instructorError}</p>
              )}
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Name"
                required
                className="w-full p-2 border rounded bg-[#F5EBDD] text-[#3B2F2F]"
              />
              <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
                Save
              </button>
            </form>
          </div>
        )}
      </section>
    </div>
  )
}
