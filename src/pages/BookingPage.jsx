import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function BookingPage() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [modal, setModal] = useState({ open: false, event: null });
  const [name, setName] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    api.get('/api/events').then(r => setEvents(r.data));
  }, []);

  const openModal = ev => {
    setModal({ open: true, event: ev });
    setName('');
    setCountryCode('+1');
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

  const confirm = async () => {
    if (!name.trim()) {
      alert('Please enter your name');
      return;
    }
    if (phone.length < 6) {
      alert('Please enter a valid phone number');
      return;
    }

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
      alert(err.response?.data || err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl mb-4">Book a Class</h1>
      <div className="space-y-4">
        {events.map(e => {
          const seatsLeft = e.maxSeats - e.booked;
          return (
            <div key={e._id} className="p-4 bg-white rounded shadow flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg mb-1">{e.title}</h3>
                <p>{new Date(e.date).toLocaleDateString()} @ {e.time}</p>
                <p className="text-sm text-gray-600">with {e.instructor.name}</p>
                <p className="text-sm text-gray-600">Duration: {e.duration} minutes</p>
              </div>
              {seatsLeft > 0
                ? <button
                    onClick={() => openModal(e)}
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                  >
                    Book ({seatsLeft} left)
                  </button>
                : <span className="px-4 py-2 bg-gray-400 text-white rounded">Full</span>
              }
            </div>
          )
        })}
      </div>

      {modal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow max-w-sm w-full">
            <h2 className="text-xl mb-4">Enter your details</h2>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={e => setName(e.target.value)}
              className={`w-full mb-3 p-2 border rounded ${
                name.trim() === '' ? 'border-red-500' : ''
              }`}
            />
            <div className="flex mb-4">
              <select
                value={countryCode}
                onChange={e => setCountryCode(e.target.value)}
                className="p-2 border rounded-l w-24"
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
                onChange={handlePhoneChange}
                pattern="[0-9]*"
                minLength="6"
                maxLength="15"
                className={`flex-1 p-2 border rounded-r ${
                  phone && phone.length < 6 ? 'border-red-500' : ''
                }`}
              />
            </div>
            {phone && phone.length < 6 && (
              <div className="text-red-500 text-sm mb-4">
                Please enter at least 6 digits
              </div>
            )}
            <button
              onClick={confirm}
              disabled={isSubmitting || !name.trim() || phone.length < 6}
              className={`w-full p-2 rounded text-white ${
                isSubmitting ? 'bg-gray-400 cursor-not-allowed' :
                name.trim() && phone.length >= 6 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? 'Processing...' : 'Confirm Reservation'}
            </button>
            <button
              onClick={() => setModal({ open: false, event: null })}
              className="mt-2 w-full p-2 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}