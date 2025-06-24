import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import logo from '../logo.jpg';

export default function BookingPage() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [modal, setModal] = useState({ open: false, event: null });
  const [name, setName] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');

  // Helper to get unique dates from events, sorted by date (earliest to latest), then by earliest time
  const getUniqueDates = (events) => {
    // Group all events by date string
    const dateMap = {};
    events.forEach(e => {
      if (!e.date) return;
      const dateObj = new Date(e.date);
      const dateStr = dateObj.toISOString().split('T')[0];
      if (!dateMap[dateStr]) dateMap[dateStr] = [];
      dateMap[dateStr].push(e.time || '00:00');
    });
    // For each date, keep the earliest time for sorting
    const dateArr = Object.entries(dateMap).map(([dateStr, times]) => {
      const minTime = times.sort()[0];
      return { dateStr, minTime };
    });
    // Sort by date (earliest to latest), then by earliest time
    dateArr.sort((a, b) => {
      const dateA = new Date(a.dateStr);
      const dateB = new Date(b.dateStr);
      if (dateA - dateB !== 0) return dateA - dateB;
      return a.minTime.localeCompare(b.minTime);
    });
    return dateArr.map(d => d.dateStr);
  };

  useEffect(() => {
    setLoading(true);
    setError(null);
    api.get('/api/events')
      .then(response => {
        if (Array.isArray(response.data)) {
          setEvents(response.data);
        } else {
          setEvents([]);
        }
      })
      .catch(() => {
        setError('Failed to load available classes');
        setEvents([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const openModal = ev => {
    setModal({ open: true, event: ev });
    setName('');
    setCountryCode('+961'); // Default to Lebanon
    setPhone('');
  };

  const formatPhoneNumber = (value) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    return digits;
  };

  const handlePhoneChange = (e) => {
    const formattedPhone = formatPhoneNumber(e.target.value);
    setPhone(formattedPhone);
  };

  const [bookingError, setBookingError] = useState(null);

  const confirm = async () => {
    if (!name.trim()) {
      setBookingError('Please enter your name');
      return;
    }
    if (phone.length < 6) {
      setBookingError('Please enter a valid phone number');
      return;
    }

    setBookingError(null);
    setIsSubmitting(true);
    try {
      await api.post('/api/bookings', {
        event: modal.event._id,
        name,
        countryCode,
        phone
      });
      
      // Navigate to thank you page with booking details
      navigate('/thank-you', {
        state: {
          bookingDetails: {
            date: modal.event.date,
            time: modal.event.time,
            title: modal.event.title,
            duration: modal.event.duration,
            instructorName: modal.event.instructor.name,
            name,
            countryCode,
            phone
          }
        }
      });
      
      setModal({ open: false, event: null });
    } catch (err) {
      console.error('Error making booking:', err);
      setBookingError(err.response?.data?.message || err.message || 'Failed to make booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter events by selected date
  const filteredEvents = selectedDate
    ? events.filter(e => e.date && new Date(e.date).toISOString().split('T')[0] === selectedDate)
    : events;

  const uniqueDates = getUniqueDates(events);

  if (loading) {
    return (
      <div className="p-4 max-w-2xl mx-auto">
        <h1 className="text-2xl mb-4">Book a Class</h1>
        <div className="text-center py-8">
          <p>Loading available classes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 max-w-2xl mx-auto">
        <h1 className="text-2xl mb-4">Book a Class</h1>
        <div className="text-red-600 py-8">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2 sm:p-4 max-w-full sm:max-w-2xl mx-auto" style={{ background: '#EFE7DA', minHeight: '100vh' }}>
      <div className="flex flex-col items-center mb-4 sm:mb-6">
        <img src={logo} alt="Logo" style={{ maxWidth: 140, width: '60vw', margin: '0 auto', display: 'block' }} />
      </div>
      <h1 className="text-xl sm:text-2xl mb-3 sm:mb-4 text-center text-[#3B2F2F]">Book a Class</h1>
      {uniqueDates.length > 0 && (
        <div className="flex overflow-x-auto gap-2 mb-4 sm:mb-6 justify-center scrollbar-hide">
          {uniqueDates.map(date => {
            const d = new Date(date);
            const dayName = d.toLocaleDateString(undefined, { weekday: 'short' });
            return (
              <button
                key={date}
                onClick={() => setSelectedDate(date)}
                className={`px-3 sm:px-4 py-2 rounded-full border transition-colors whitespace-nowrap text-xs sm:text-base ${selectedDate === date ? 'bg-[#3B2F2F] text-[#EFE7DA]' : 'bg-white text-[#3B2F2F] border-[#D6C7B0] hover:bg-[#F5EBDD]'}`}
              >
                <span className="block font-semibold">{dayName}</span>
                <span className="block">{d.toLocaleDateString()}</span>
              </button>
            );
          })}
          <button
            onClick={() => setSelectedDate('')}
            className={`px-3 sm:px-4 py-2 rounded-full border transition-colors whitespace-nowrap text-xs sm:text-base ${selectedDate === '' ? 'bg-[#3B2F2F] text-[#EFE7DA]' : 'bg-white text-[#3B2F2F] border-[#D6C7B0] hover:bg-[#F5EBDD]'}`}
          >
            All Dates
          </button>
        </div>
      )}
      <div className="space-y-3 sm:space-y-4">
        {filteredEvents.length === 0 ? (
          <p className="text-center py-8 text-[#A89B8C] text-sm sm:text-base">No classes available for this day.</p>
        ) : (
          <div className="flex overflow-x-auto gap-3 sm:gap-4 pb-2 scrollbar-hide">
            {filteredEvents
              .slice() // copy array
              .sort((a, b) => {
                // Sort by time (earliest to latest)
                const tA = (a.time || '00:00').padStart(5, '0');
                const tB = (b.time || '00:00').padStart(5, '0');
                return tA.localeCompare(tB);
              })
              .map(e => {
                const seatsLeft = e.maxSeats - e.booked;
                return (
                  <div key={e._id} className="min-w-[85vw] max-w-xs sm:min-w-[320px] p-3 sm:p-4 bg-white rounded shadow flex flex-col justify-between items-start border border-[#E2D3C0]">
                    <div>
                      <h3 className="font-semibold text-base sm:text-lg mb-1 text-[#3B2F2F]">{e.title || 'Untitled Class'}</h3>
                      <p className="text-[#7C6F5F] text-xs sm:text-base">{e.date ? new Date(e.date).toLocaleDateString() : 'N/A'} @ {e.time || 'N/A'}</p>
                      <p className="text-xs sm:text-sm text-[#A89B8C]">with {e.instructor?.name || 'N/A'}</p>
                      <p className="text-xs sm:text-sm text-[#A89B8C]">Duration: {e.duration || 'N/A'} minutes</p>
                    </div>
                    {seatsLeft > 0
                      ? <button
                          onClick={() => openModal(e)}
                          className="mt-3 sm:mt-4 px-3 sm:px-4 py-2 rounded bg-[#3B2F2F] text-[#EFE7DA] hover:bg-[#5A4636] transition-colors text-xs sm:text-base"
                        >
                          Book ({seatsLeft} left)
                        </button>
                      : <span className="mt-3 sm:mt-4 px-3 sm:px-4 py-2 rounded bg-[#A89B8C] text-white text-xs sm:text-base">Full</span>
                    }
                  </div>
                )
              })}
          </div>
        )}
      </div>
      {modal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-2 sm:px-0">
          <div className="bg-white p-4 sm:p-6 rounded shadow max-w-xs sm:max-w-sm w-full border border-[#E2D3C0]">
            <h2 className="text-lg sm:text-xl mb-3 sm:mb-4 text-[#3B2F2F]">Enter your details</h2>
            {bookingError && (
              <div className="mb-3 sm:mb-4 p-2 bg-[#F5EBDD] border border-[#E2D3C0] rounded text-[#A94442] text-xs sm:text-sm">
                {bookingError}
              </div>
            )}
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={e => {setName(e.target.value); setBookingError(null);}}
              className={`w-full mb-2 sm:mb-3 p-2 border rounded transition-colors bg-[#F5EBDD] text-[#3B2F2F] text-xs sm:text-base ${
                name.trim() === '' ? 'border-[#A94442]' : 'focus:border-[#3B2F2F]'
              }`}
            />
            <div className="flex mb-3 sm:mb-4">
              <select
                value={countryCode}
                onChange={e => {setCountryCode(e.target.value); setBookingError(null);}}
                className="p-2 border rounded-l w-20 sm:w-24 focus:border-[#3B2F2F] transition-colors bg-[#F5EBDD] text-[#3B2F2F] text-xs sm:text-base"
              >
                <option value="+961">+961 (Lebanon)</option>
                <option value="+1">+1 (USA/Canada)</option>
<option value="+7">+7 (Russia)</option>
<option value="+20">+20 (Egypt)</option>
<option value="+27">+27 (South Africa)</option>
<option value="+30">+30 (Greece)</option>
<option value="+31">+31 (Netherlands)</option>
<option value="+32">+32 (Belgium)</option>
<option value="+33">+33 (France)</option>
<option value="+34">+34 (Spain)</option>
<option value="+36">+36 (Hungary)</option>
<option value="+39">+39 (Italy)</option>
<option value="+40">+40 (Romania)</option>
<option value="+41">+41 (Switzerland)</option>
<option value="+43">+43 (Austria)</option>
<option value="+44">+44 (United Kingdom)</option>
<option value="+45">+45 (Denmark)</option>
<option value="+46">+46 (Sweden)</option>
<option value="+47">+47 (Norway)</option>
<option value="+48">+48 (Poland)</option>
<option value="+49">+49 (Germany)</option>
<option value="+51">+51 (Peru)</option>
<option value="+52">+52 (Mexico)</option>
<option value="+53">+53 (Cuba)</option>
<option value="+54">+54 (Argentina)</option>
<option value="+55">+55 (Brazil)</option>
<option value="+56">+56 (Chile)</option>
<option value="+57">+57 (Colombia)</option>
<option value="+58">+58 (Venezuela)</option>
<option value="+60">+60 (Malaysia)</option>
<option value="+61">+61 (Australia)</option>
<option value="+62">+62 (Indonesia)</option>
<option value="+63">+63 (Philippines)</option>
<option value="+64">+64 (New Zealand)</option>
<option value="+65">+65 (Singapore)</option>
<option value="+66">+66 (Thailand)</option>
<option value="+81">+81 (Japan)</option>
<option value="+82">+82 (South Korea)</option>
<option value="+84">+84 (Vietnam)</option>
<option value="+86">+86 (China)</option>
<option value="+90">+90 (Turkey)</option>
<option value="+91">+91 (India)</option>
<option value="+92">+92 (Pakistan)</option>
<option value="+93">+93 (Afghanistan)</option>
<option value="+94">+94 (Sri Lanka)</option>
<option value="+95">+95 (Myanmar)</option>
<option value="+98">+98 (Iran)</option>
<option value="+962">+962 (Jordan)</option>
<option value="+963">+963 (Syria)</option>
<option value="+964">+964 (Iraq)</option>
<option value="+965">+965 (Kuwait)</option>
<option value="+966">+966 (Saudi Arabia)</option>
<option value="+967">+967 (Yemen)</option>
<option value="+968">+968 (Oman)</option>
<option value="+970">+970 (Palestine)</option>
<option value="+971">+971 (United Arab Emirates)</option>
<option value="+973">+973 (Bahrain)</option>
<option value="+974">+974 (Qatar)</option>
<option value="+975">+975 (Bhutan)</option>
<option value="+976">+976 (Mongolia)</option>
<option value="+977">+977 (Nepal)</option>
              </select>
              <input
                type="tel"
                placeholder="Phone Number (numbers only)"
                value={phone}
                onChange={e => {handlePhoneChange(e); setBookingError(null);}}
                pattern="[0-9]*"
                minLength="6"
                maxLength="15"
                className={`flex-1 p-2 border rounded-r transition-colors bg-[#F5EBDD] text-[#3B2F2F] text-xs sm:text-base ${
                  phone && phone.length < 6 ? 'border-[#A94442]' : 'focus:border-[#3B2F2F]'
                }`}
              />
            </div>
            {phone && phone.length < 6 && (
              <div className="text-[#A94442] text-xs sm:text-sm mb-3 sm:mb-4">
                Please enter at least 6 digits
              </div>
            )}
            <button
              onClick={confirm}
              disabled={isSubmitting || !name.trim() || phone.length < 6}
              className={`w-full p-2 rounded transition-colors text-xs sm:text-base ${
                isSubmitting ? 'bg-[#A89B8C] cursor-not-allowed text-white' :
                name.trim() && phone.length >= 6 
                  ? 'bg-[#3B2F2F] text-[#EFE7DA] hover:bg-[#5A4636]' 
                  : 'bg-[#A89B8C] cursor-not-allowed text-white'
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  Processing<span className="animate-pulse">...</span>
                </span>
              ) : (
                'Confirm Reservation'
              )}
            </button>
            <button
              onClick={() => {
                setModal({ open: false, event: null });
                setBookingError(null);
              }}
              className="mt-2 w-full p-2 border rounded hover:bg-[#F5EBDD] transition-colors text-[#3B2F2F] border-[#E2D3C0] text-xs sm:text-base"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}