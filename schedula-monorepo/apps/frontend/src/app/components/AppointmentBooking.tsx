import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  specialization: string;
  availability: {
    days: string[];
    startTime: string;
    endTime: string;
  };
}

interface AppointmentBookingProps {
  doctorId?: string;
}

export const AppointmentBooking: React.FC<AppointmentBookingProps> = ({ doctorId }) => {
  const router = useRouter();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);

  useEffect(() => {
    // Fetch doctors list
    const fetchDoctors = async () => {
      try {
        const response = await fetch('/api/doctors');
        const data = await response.json();
        setDoctors(data);
        if (doctorId) {
          const doctor = data.find((d: Doctor) => d.id === doctorId);
          if (doctor) setSelectedDoctor(doctor);
        }
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
    };

    fetchDoctors();
  }, [doctorId]);

  useEffect(() => {
    // Fetch available slots when doctor and date are selected
    if (selectedDoctor && selectedDate) {
      const fetchAvailableSlots = async () => {
        try {
          const response = await fetch(
            `/api/appointments/available-slots?doctorId=${selectedDoctor.id}&date=${selectedDate}`
          );
          const data = await response.json();
          setAvailableSlots(data);
        } catch (error) {
          console.error('Error fetching available slots:', error);
        }
      };

      fetchAvailableSlots();
    }
  }, [selectedDoctor, selectedDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctor || !selectedDate || !selectedTime) return;

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          doctorId: selectedDoctor.id,
          date: selectedDate,
          time: selectedTime,
        }),
      });

      if (response.ok) {
        router.push('/dashboard/appointments');
      } else {
        const error = await response.json();
        alert(error.message);
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert('Failed to book appointment. Please try again.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">Book an Appointment</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {!doctorId && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Select Doctor</label>
            <select
              value={selectedDoctor?.id || ''}
              onChange={(e) => {
                const doctor = doctors.find((d) => d.id === e.target.value);
                setSelectedDoctor(doctor || null);
              }}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Select a doctor</option>
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  Dr. {doctor.firstName} {doctor.lastName} - {doctor.specialization}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">Select Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        {availableSlots.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Select Time</label>
            <select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Select a time slot</option>
              {availableSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>
        )}

        <button
          type="submit"
          disabled={!selectedDoctor || !selectedDate || !selectedTime}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
        >
          Book Appointment
        </button>
      </form>
    </div>
  );
}; 