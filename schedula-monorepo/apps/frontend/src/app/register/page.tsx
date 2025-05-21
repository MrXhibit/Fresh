'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { z } from 'zod';

// Validation schemas
const baseSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number'),
});

const doctorSchema = baseSchema.extend({
  specialization: z.string().min(1, 'Please select a specialization'),
  licenseNumber: z.string().min(5, 'License number must be at least 5 characters'),
});

const patientSchema = baseSchema.extend({
  dateOfBirth: z.string().refine((date) => {
    const today = new Date();
    const birthDate = new Date(date);
    const age = today.getFullYear() - birthDate.getFullYear();
    return age >= 0 && age <= 120;
  }, 'Invalid date of birth'),
  gender: z.enum(['male', 'female', 'other'], {
    required_error: 'Please select a gender',
  }),
  address: z.string().min(5, 'Address must be at least 5 characters'),
});

export default function Register() {
  const router = useRouter();
  const [userType, setUserType] = useState<'doctor' | 'patient'>('patient');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    // Doctor specific fields
    specialization: '',
    licenseNumber: '',
    // Patient specific fields
    dateOfBirth: '',
    gender: '',
    address: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    try {
      const schema = userType === 'doctor' ? doctorSchema : patientSchema;
      schema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path) {
            newErrors[err.path[0]] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userType,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/login?registered=true');
      } else {
        setErrors({ submit: data.message || 'Registration failed' });
      }
    } catch (error) {
      setErrors({ submit: 'An error occurred during registration' });
      console.error('Error during registration:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const renderField = (
    name: string,
    label: string,
    type: string = 'text',
    required: boolean = true,
    options?: { value: string; label: string }[]
  ) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      {type === 'select' && options ? (
        <select
          name={name}
          id={name}
          required={required}
          className={`mt-1 block w-full border ${
            errors[name] ? 'border-red-500' : 'border-gray-300'
          } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
          value={formData[name as keyof typeof formData]}
          onChange={handleChange}
        >
          <option value="">Select {label.toLowerCase()}</option>
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          id={name}
          required={required}
          className={`mt-1 block w-full border ${
            errors[name] ? 'border-red-500' : 'border-gray-300'
          } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
          value={formData[name as keyof typeof formData]}
          onChange={handleChange}
        />
      )}
      {errors[name] && (
        <p className="mt-1 text-sm text-red-600">{errors[name]}</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Register as
            </label>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setUserType('patient')}
                className={`flex-1 py-2 px-4 rounded-md ${
                  userType === 'patient'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                Patient
              </button>
              <button
                type="button"
                onClick={() => setUserType('doctor')}
                className={`flex-1 py-2 px-4 rounded-md ${
                  userType === 'doctor'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                Doctor
              </button>
            </div>
          </div>

          {errors.submit && (
            <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg">
              {errors.submit}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {renderField('firstName', 'First Name')}
              {renderField('lastName', 'Last Name')}
            </div>

            {renderField('email', 'Email address', 'email')}
            {renderField('password', 'Password', 'password')}
            {renderField('phoneNumber', 'Phone Number', 'tel')}

            {userType === 'doctor' ? (
              <>
                {renderField('specialization', 'Specialization', 'select', true, [
                  { value: 'general', label: 'General Medicine' },
                  { value: 'cardiology', label: 'Cardiology' },
                  { value: 'dermatology', label: 'Dermatology' },
                  { value: 'pediatrics', label: 'Pediatrics' },
                  { value: 'orthopedics', label: 'Orthopedics' },
                ])}
                {renderField('licenseNumber', 'Medical License Number')}
              </>
            ) : (
              <>
                {renderField('dateOfBirth', 'Date of Birth', 'date')}
                {renderField('gender', 'Gender', 'select', true, [
                  { value: 'male', label: 'Male' },
                  { value: 'female', label: 'Female' },
                  { value: 'other', label: 'Other' },
                ])}
                {renderField('address', 'Address')}
              </>
            )}

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  isSubmitting
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                {isSubmitting ? 'Registering...' : `Register as ${userType === 'doctor' ? 'Doctor' : 'Patient'}`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 