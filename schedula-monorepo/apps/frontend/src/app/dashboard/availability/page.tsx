'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface TimeSlot {
  day: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const TIME_SLOTS = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, '0');
  return `${hour}:00`;
});

export default function Availability() {
  const router = useRouter();
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    // Initialize time slots
    const initialTimeSlots = DAYS.map(day => ({
      day,
      startTime: '09:00',
      endTime: '17:00',
      isAvailable: true,
    }));
    setTimeSlots(initialTimeSlots);
    setLoading(false);
  }, [router]);

  const handleTimeChange = (day: string, field: 'startTime' | 'endTime', value: string) => {
    setTimeSlots(prev =>
      prev.map(slot =>
        slot.day === day ? { ...slot, [field]: value } : slot
      )
    );
  };

  const handleAvailabilityToggle = (day: string) => {
    setTimeSlots(prev =>
      prev.map(slot =>
        slot.day === day ? { ...slot, isAvailable: !slot.isAvailable } : slot
      )
    );
  };

  const handleSave = async () => {
    try {
      const response = await fetch('/api/availability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ timeSlots }),
      });

      if (response.ok) {
        alert('Availability updated successfully');
      } else {
        console.error('Failed to update availability');
      }
    } catch (error) {
      console.error('Error updating availability:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-900">Schedula</h1>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => router.push('/dashboard')}
                className="ml-4 px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Manage Your Availability</h3>
              <div className="mt-6 space-y-6">
                {timeSlots.map((slot) => (
                  <div key={slot.day} className="flex items-center space-x-4">
                    <div className="w-32">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={slot.isAvailable}
                          onChange={() => handleAvailabilityToggle(slot.day)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="text-sm font-medium text-gray-700">{slot.day}</span>
                      </label>
                    </div>
                    <div className="flex-1 flex items-center space-x-4">
                      <div>
                        <label htmlFor={`${slot.day}-start`} className="block text-sm font-medium text-gray-700">
                          Start Time
                        </label>
                        <select
                          id={`${slot.day}-start`}
                          value={slot.startTime}
                          onChange={(e) => handleTimeChange(slot.day, 'startTime', e.target.value)}
                          disabled={!slot.isAvailable}
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        >
                          {TIME_SLOTS.map((time) => (
                            <option key={time} value={time}>
                              {time}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label htmlFor={`${slot.day}-end`} className="block text-sm font-medium text-gray-700">
                          End Time
                        </label>
                        <select
                          id={`${slot.day}-end`}
                          value={slot.endTime}
                          onChange={(e) => handleTimeChange(slot.day, 'endTime', e.target.value)}
                          disabled={!slot.isAvailable}
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        >
                          {TIME_SLOTS.map((time) => (
                            <option key={time} value={time}>
                              {time}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <button
                  onClick={handleSave}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Save Availability
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 