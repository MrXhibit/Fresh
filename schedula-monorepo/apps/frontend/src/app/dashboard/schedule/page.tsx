'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

interface Schedule {
  date: string;
  slots: TimeSlot[];
}

export default function Schedule() {
  const router = useRouter();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/schedule', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSchedules(data);
      } else {
        setError('Failed to fetch schedule');
      }
    } catch (error) {
      console.error('Error fetching schedule:', error);
      setError('An error occurred while fetching schedule');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  const handleSlotToggle = async (date: string, slotId: string, available: boolean) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/schedule/${date}/slots/${slotId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ available: !available }),
      });

      if (response.ok) {
        setSuccess('Schedule updated successfully');
        fetchSchedules();
      } else {
        setError('Failed to update schedule');
      }
    } catch (error) {
      console.error('Error updating schedule:', error);
      setError('An error occurred while updating schedule');
    }
  };

  const handleAddDate = async () => {
    if (!selectedDate) {
      setError('Please select a date');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/schedule', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date: selectedDate }),
      });

      if (response.ok) {
        setSuccess('Date added successfully');
        setSelectedDate('');
        fetchSchedules();
      } else {
        setError('Failed to add date');
      }
    } catch (error) {
      console.error('Error adding date:', error);
      setError('An error occurred while adding date');
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Schedule</h1>
        <div className="flex space-x-4">
          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            min={new Date().toISOString().split('T')[0]}
            className="border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            onClick={handleAddDate}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add Date
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 text-sm text-green-700 bg-green-100 rounded-lg">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {schedules.map((schedule) => (
          <div key={schedule.date} className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              {new Date(schedule.date).toLocaleDateString()}
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {schedule.slots.map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => handleSlotToggle(schedule.date, slot.id, slot.available)}
                  className={`py-2 px-3 rounded-md text-sm font-medium ${
                    slot.available
                      ? 'bg-green-100 text-green-800 hover:bg-green-200'
                      : 'bg-red-100 text-red-800 hover:bg-red-200'
                  }`}
                >
                  {slot.time}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {schedules.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No schedule found</p>
          <p className="text-sm text-gray-400 mt-2">
            Add dates to start managing your schedule
          </p>
        </div>
      )}
    </div>
  );
} 