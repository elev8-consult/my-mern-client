import { useState } from 'react'
import BookingForm from './BookingForm'
import BookingList from './BookingList'

export default function Dashboard() {
  const [refresh, setRefresh] = useState(0)
  return (
    <div className="flex flex-col md:flex-row">
      <div className="md:w-1/3"><BookingForm onAdd={()=>setRefresh(r=>r+1)}/></div>
      <div className="md:w-2/3"><BookingList key={refresh}/></div>
    </div>
  )
}