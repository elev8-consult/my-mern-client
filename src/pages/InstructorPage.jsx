import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';

export default function InstructorPage() {
  const { instructorId } = useParams();
  const [instructor, setInstructor] = useState(null);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    // Fetch instructor details and their classes
    Promise.all([
      api.get(`/api/instructors/${instructorId}`),
      api.get(`/api/events?instructor=${instructorId}`)
    ])
    .then(([instructorRes, classesRes]) => {
      setInstructor(instructorRes.data);
      setClasses(Array.isArray(classesRes.data) ? classesRes.data : []);
    })
    .catch(err => {
      console.error('Error fetching instructor data:', err);
      setError('Failed to load instructor information');
    })
    .finally(() => setLoading(false));
  }, [instructorId]);

  // Delete class
  const deleteClass = async (id) => {
    if (!window.confirm('Are you sure you want to delete this class?')) return;
    try {
      await api.delete(`/api/events/${id}`);
      setClasses(classes => classes.filter(c => c._id !== id));
    } catch (err) {
      alert('Failed to delete class.');
    }
  };

  if (loading) {
    return (
      <div className="p-4 max-w-4xl mx-auto">
        <div className="text-center py-8">
          <p>Loading instructor dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 max-w-4xl mx-auto">
        <div className="text-red-600 py-8">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!instructor) {
    return (
      <div className="p-4 max-w-4xl mx-auto">
        <div className="text-center py-8 text-red-600">
          <p>Instructor not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">{instructor.name}'s Dashboard</h1>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Your Classes</h2>
          {classes.length === 0 ? (
            <p className="text-gray-500">No classes scheduled</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {classes.map(classItem => (
                <div key={classItem._id} className="bg-white p-4 rounded-lg shadow">
                  <h3 className="font-semibold text-lg mb-2">{classItem.title || 'Untitled Class'}</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>Date: {new Date(classItem.date).toLocaleDateString()}</p>
                    <p>Time: {classItem.time}</p>
                    <p>Duration: {classItem.duration} minutes</p>
                    <p className="font-medium">
                      Attendance: {classItem.booked}/{classItem.maxSeats} students
                    </p>
                    {/* Attendance progress bar */}
                    <div className="mt-2 mb-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                          style={{
                            width: `${(classItem.booked / classItem.maxSeats) * 100}%`
                          }}
                        />
                      </div>
                    </div>
                    {/* Attendee List */}
                    {classItem.attendees && classItem.attendees.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-medium mb-2">Attendees:</h4>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {classItem.attendees.map((attendee, index) => (
                            <div key={index} className="text-sm bg-gray-50 p-2 rounded">
                              <p className="font-medium">{attendee.name}</p>
                              <p className="text-gray-500">
                                {attendee.countryCode} {attendee.phone}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <button
                      onClick={() => deleteClass(classItem._id)}
                      className="mt-4 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                    >
                      Delete Class
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
