'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Doctor {
  id: string;
  name: string;
  specialization: string;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

export default function BookAppointment() {
  const router = useRouter();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      fetchTimeSlots();
    }
  }, [selectedDoctor, selectedDate]);

  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/doctors', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDoctors(data);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTimeSlots = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `/api/appointments/slots?doctorId=${selectedDoctor}&date=${selectedDate}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setTimeSlots(data);
      }
    } catch (error) {
      console.error('Error fetching time slots:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedDoctor || !selectedDate || !selectedTime) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          doctorId: selectedDoctor,
          date: selectedDate,
          time: selectedTime,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Appointment booked successfully');
        setTimeout(() => {
          router.push('/dashboard/appointments');
        }, 2000);
      } else {
        setError(data.message || 'Failed to book appointment');
      }
    } catch (error) {
      setError('An error occurred while booking the appointment');
      console.error('Error booking appointment:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Book an Appointment</h1>

      {error && (
        <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 text-sm text-green-700 bg-green-100 rounded-lg">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="doctor" className="block text-sm font-medium text-gray-700">
            Select Doctor
          </label>
          <select
            id="doctor"
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select a doctor</option>
            {doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                Dr. {doctor.name} - {doctor.specialization}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
            Select Date
          </label>
          <input
            type="date"
            id="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {selectedDoctor && selectedDate && (
          <div>
            <label htmlFor="time" className="block text-sm font-medium text-gray-700">
              Select Time
            </label>
            <div className="mt-2 grid grid-cols-4 gap-2">
              {timeSlots.map((slot) => (
                <button
                  key={slot.time}
                  type="button"
                  onClick={() => setSelectedTime(slot.time)}
                  disabled={!slot.available}
                  className={`py-2 px-3 rounded-md text-sm font-medium ${
                    selectedTime === slot.time
                      ? 'bg-blue-600 text-white'
                      : slot.available
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {slot.time}
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Book Appointment
          </button>
        </div>
      </form>
    </div>
  );
} 