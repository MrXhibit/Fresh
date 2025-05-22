'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface MedicalRecord {
  id: string;
  date: string;
  doctorName: string;
  diagnosis: string;
  prescription: string;
  notes: string;
}

interface PastAppointment {
  id: string;
  date: string;
  time: string;
  doctorName: string;
  type: string;
  status: 'completed' | 'cancelled';
  notes?: string;
}

export default function MedicalHistory() {
  const router = useRouter();
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [pastAppointments, setPastAppointments] = useState<PastAppointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMedicalHistory();
  }, []);

  const fetchMedicalHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const [recordsResponse, appointmentsResponse] = await Promise.all([
        fetch('/api/medical-records', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }),
        fetch('/api/appointments/past', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }),
      ]);

      if (recordsResponse.ok && appointmentsResponse.ok) {
        const [recordsData, appointmentsData] = await Promise.all([
          recordsResponse.json(),
          appointmentsResponse.json(),
        ]);
        setMedicalRecords(recordsData);
        setPastAppointments(appointmentsData);
      } else {
        setError('Failed to fetch medical history');
      }
    } catch (error) {
      console.error('Error fetching medical history:', error);
      setError('An error occurred while fetching medical history');
    } finally {
      setIsLoading(false);
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
      <h1 className="text-2xl font-bold text-gray-900">Medical History</h1>

      {error && (
        <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Medical Records</h2>
        {medicalRecords.length === 0 ? (
          <p className="text-gray-500">No medical records found</p>
        ) : (
          <div className="space-y-4">
            {medicalRecords.map((record) => (
              <div
                key={record.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500">
                      {new Date(record.date).toLocaleDateString()}
                    </p>
                    <p className="font-medium text-gray-900">Dr. {record.doctorName}</p>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-sm font-medium text-gray-700">Diagnosis</p>
                  <p className="text-sm text-gray-600">{record.diagnosis}</p>
                </div>
                <div className="mt-2">
                  <p className="text-sm font-medium text-gray-700">Prescription</p>
                  <p className="text-sm text-gray-600">{record.prescription}</p>
                </div>
                {record.notes && (
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-700">Notes</p>
                    <p className="text-sm text-gray-600">{record.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Past Appointments</h2>
        {pastAppointments.length === 0 ? (
          <p className="text-gray-500">No past appointments found</p>
        ) : (
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
                    Doctor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pastAppointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(appointment.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {appointment.time}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      Dr. {appointment.doctorName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {appointment.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          appointment.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
} 