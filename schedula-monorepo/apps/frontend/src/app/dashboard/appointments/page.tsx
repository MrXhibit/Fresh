'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Appointment {
  id: string;
  date: string;
  time: string;
  patientName?: string;
  doctorName?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  type: string;
  notes?: string;
}

export default function Appointments() {
  const router = useRouter();
  const [userType, setUserType] = useState<'doctor' | 'patient' | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'scheduled' | 'completed' | 'cancelled'>('all');

  useEffect(() => {
    const storedUserType = localStorage.getItem('userType');
    if (storedUserType) {
      setUserType(storedUserType as 'doctor' | 'patient');
      fetchAppointments();
    }
  }, []);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/appointments', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAppointments(data);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (appointmentId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchAppointments();
      }
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };

  const filteredAppointments = appointments.filter(appointment => 
    filter === 'all' ? true : appointment.status === filter
  );

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
        <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
        {userType === 'patient' && (
          <button
            onClick={() => router.push('/dashboard/book')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Book New Appointment
          </button>
        )}
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="mb-4">
          <div className="flex space-x-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-md ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('scheduled')}
              className={`px-4 py-2 rounded-md ${
                filter === 'scheduled'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              Scheduled
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-md ${
                filter === 'completed'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              Completed
            </button>
            <button
              onClick={() => setFilter('cancelled')}
              className={`px-4 py-2 rounded-md ${
                filter === 'cancelled'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              Cancelled
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {userType === 'doctor' ? 'Patient' : 'Doctor'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                {userType === 'doctor' && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAppointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(appointment.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {appointment.time}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {userType === 'doctor' ? appointment.patientName : appointment.doctorName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {appointment.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        appointment.status === 'scheduled'
                          ? 'bg-green-100 text-green-800'
                          : appointment.status === 'completed'
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </span>
                  </td>
                  {userType === 'doctor' && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <select
                        value={appointment.status}
                        onChange={(e) => handleStatusChange(appointment.id, e.target.value)}
                        className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="scheduled">Scheduled</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 