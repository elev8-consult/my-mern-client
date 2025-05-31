import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

function generateGoogleCalendarLink(bookingDetails) {
  const eventDate = new Date(bookingDetails.date);
  const [hours, minutes] = bookingDetails.time.split(':');
  eventDate.setHours(parseInt(hours), parseInt(minutes));
  
  // Calculate end time based on duration (in minutes)
  const endDate = new Date(eventDate);
  endDate.setMinutes(endDate.getMinutes() + (bookingDetails.duration || 60));

  const details = {
    action: 'TEMPLATE',
    text: `${bookingDetails.title} with ${bookingDetails.instructorName}`,
    dates: `${eventDate.toISOString().replace(/-|:|\.\d+/g, '')}/${endDate.toISOString().replace(/-|:|\.\d+/g, '')}`,
    details: `Your booking for ${bookingDetails.title} with ${bookingDetails.instructorName}.\n\nFor any questions, contact us on WhatsApp: +961 81 953 747`,
    location: 'Studio Location'
  };

  const query = Object.keys(details)
    .map(key => `${key}=${encodeURIComponent(details[key])}`)
    .join('&');

  return `https://calendar.google.com/calendar/render?${query}`;
}

function generateIcsFileLink(bookingDetails) {
  const eventDate = new Date(bookingDetails.date);
  const [hours, minutes] = bookingDetails.time.split(':');
  eventDate.setHours(parseInt(hours), parseInt(minutes));
  
  // Calculate end time based on duration (in minutes)
  const endDate = new Date(eventDate);
  endDate.setMinutes(endDate.getMinutes() + (bookingDetails.duration || 60));

  const formatDate = (date) => {
    return date.toISOString().replace(/-|:|\.\d+/g, '');
  };

  const icsData = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VEVENT',
    `DTSTART:${formatDate(eventDate)}`,
    `DTEND:${formatDate(endDate)}`,
    `SUMMARY:${bookingDetails.title} with ${bookingDetails.instructorName}`,
    `DESCRIPTION:Your booking for ${bookingDetails.title} with ${bookingDetails.instructorName}.\\n\\nFor any questions\\, contact us on WhatsApp: +961 81 953 747`,
    'LOCATION:Studio Location',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\n');

  return `data:text/calendar;charset=utf8,${encodeURIComponent(icsData)}`;
}

export default function ThankYouPage() {
  const location = useLocation();
  const bookingDetails = location.state?.bookingDetails;

  // Redirect to home if accessed directly without booking details
  useEffect(() => {
    if (!bookingDetails) {
      window.location.href = '/';
    } else {
      // Prevent going back to booking form
      window.history.replaceState(null, '', '/thank-you');
    }
  }, [bookingDetails]);

  if (!bookingDetails) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Thank You!
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Your reservation has been confirmed
          </p>
        </div>
        
        <div className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px bg-gray-50 p-4">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {bookingDetails.title}
              </h3>
              <p className="text-sm font-medium text-gray-700">Class Details:</p>
              <p className="mt-1 text-sm text-gray-900">
                Date: {new Date(bookingDetails.date).toLocaleDateString()}
              </p>
              <p className="mt-1 text-sm text-gray-900">
                Time: {bookingDetails.time}
              </p>
              <p className="mt-1 text-sm text-gray-900">
                Duration: {bookingDetails.duration} minutes
              </p>
              <p className="mt-1 text-sm text-gray-900">
                Instructor: {bookingDetails.instructorName}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Your Information:</p>
              <p className="mt-1 text-sm text-gray-900">
                Name: {bookingDetails.name}
              </p>
              <p className="mt-1 text-sm text-gray-900">
                Phone: {bookingDetails.countryCode} {bookingDetails.phone}
              </p>
            </div>
          </div>
          <div className="space-y-4 text-center">
            <div>
              <a
                href="https://wa.me/96181953747"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 w-full"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Contact Us on WhatsApp
              </a>
              <p className="text-sm text-gray-600 mt-2">
                For more information, message us on: +961 81 953 747
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Add to Calendar:</p>
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={generateGoogleCalendarLink(bookingDetails)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.5 3h-3V1.5h-1.5V3h-6V1.5H7.5V3h-3A1.5 1.5 0 003 4.5v15A1.5 1.5 0 004.5 21h15a1.5 1.5 0 001.5-1.5v-15A1.5 1.5 0 0019.5 3zm0 16.5h-15v-9h15v9zm0-10.5h-15V4.5h3V6h1.5V4.5h6V6h1.5V4.5h3v4.5z"/>
                  </svg>
                  Google Calendar
                </a>
                <a
                  href={generateIcsFileLink(bookingDetails)}
                  className="inline-flex items-center justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  download="class-booking.ics"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 002 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM9 14H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm-8 4H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2z"/>
                  </svg>
                  Apple/Other Calendar
                </a>
              </div>
            </div>
            <div>
              <Link
                to="/"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
