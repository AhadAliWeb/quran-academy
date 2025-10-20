import React, { useState, useEffect } from 'react';
import { User, Mail, Lock, Phone, Globe, Users, Save, DollarSign, CheckCircle } from 'lucide-react';
import { countries } from 'countries-list'
import axios from 'axios';
import { useParams } from "react-router"

const EditStudent = () => {

  const { studentId } = useParams()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    phoneNumber: '',
    country: '',
    gender: '',
    fees: '',
    status: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const countryNames = Object.values(countries).map(country => country.name)

  const getStudentInfo = () => {

    axios.get(`/api/v1/students/${studentId}`).then(res => setFormData(prev => ({
      ...prev,
      ...res.data.student
    }))).catch(err => console.log(err))
  }

  useEffect(() => {

    getStudentInfo()
  }, [studentId])




  // Form field configuration - easy to modify/extend
  const formFields = [
    {
      id: 'name',
      label: 'Student Name',
      type: 'text',
      icon: User,
      placeholder: 'Enter full name',
      required: true,
      validation: (value) => value.length < 2 ? 'Name must be at least 2 characters' : null
    },
    {
      id: 'email',
      label: 'Email Address',
      type: 'email',
      icon: Mail,
      placeholder: 'Enter email address',
      required: true,
      validation: (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return !emailRegex.test(value) ? 'Please enter a valid email address' : null;
      }
    },
    {
      id: 'password',
      label: 'Password',
      type: 'password',
      icon: Lock,
      placeholder: 'Enter password',
      required: false,
      validation: (value) => value.length < 6 ? 'Password must be at least 6 characters' : null
    },
    {
      id: 'fees',
      label: 'Fees',
      type: 'number',
      icon: DollarSign,
      placeholder: "Enter Fees",
      required: true,
    },
    {
      id: 'age',
      label: 'Age',
      type: 'number',
      icon: User,
      placeholder: 'Enter age',
      required: true,
      validation: (value) => value.length < 1 ? 'Please enter a valid age' : null
    },
    {
      id: 'phoneNumber',
      label: 'Phone Number',
      type: 'tel',
      icon: Phone,
      placeholder: 'Enter phone number',
      required: true,
      validation: (value) => value.length < 10 ? 'Please enter a valid phone number' : null
    },
    {
      id: 'country',
      label: 'Country',
      type: 'select',
      icon: Globe,
      placeholder: 'Select country',
      required: true,
      options: countryNames,
      validation: (value) => !value ? 'Please select a country' : null
    },
    {
      id: 'gender',
      label: 'Gender',
      type: 'select',
      icon: Users,
      placeholder: 'Select gender',
      required: true,
      options: ['Male', 'Female'],
      validation: (value) => !value ? 'Please select a gender' : null
    },
    {
      id: 'status',
      label: 'Status',
      type: 'select',
      icon: CheckCircle,
      placeholder: 'Select status',
      required: true,
      options: ['Active', 'Demo', 'Left'],
      validation: (value) => !value ? 'Please select a status' : null
    }
  ];

  const handleInputChange = (fieldId, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
    
    // Clear error when user starts typing
    if (errors[fieldId]) {
      setErrors(prev => ({
        ...prev,
        [fieldId]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    formFields.forEach(field => {
      const value = formData[field.id];
      if (field.required && !value) {
        newErrors[field.id] = `${field.label} is required`;
      } else if (value && field.validation) {
        const error = field.validation(value);
        if (error) {
          newErrors[field.id] = error;
        }
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    axios.put(`/api/v1/students/${studentId}`, formData).then(res => {
      alert("Student Edited Successfully")      
    }).catch(err => {
    }).finally(() => setIsSubmitting(false))
    
  };

  const renderField = (field) => {
    const IconComponent = field.icon;
    const value = formData[field.id];
    const error = errors[field.id];

    return (
      <div key={field.id} className="space-y-2">
        <label htmlFor={field.id} className="block text-sm font-medium text-gray-700">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <IconComponent className="h-5 w-5 text-gray-400" />
          </div>
          
          {field.type === 'select' ? (
            <select
              id={field.id}
              value={value}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              className={`block w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors ${
                error ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">{field.placeholder}</option>
              {field.options.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          ) : (
            <input
              type={field.type}
              id={field.id}
              value={value}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              placeholder={field.placeholder}
              className={`block w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors ${
                error ? 'border-red-300' : 'border-gray-300'
              }`}
            />
          )}
        </div>
        
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Edit Student</h1>
          </div>
          <p className="text-gray-600">Update the Student in the System</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:p-8">
          <div className="space-y-6">
            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {formFields.map(field => (
                <div key={field.id} className={field.id === 'name' || field.id === 'email' ? 'md:col-span-2' : ''}>
                  {renderField(field)}
                </div>
              ))}
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row gap-4 sm:justify-end">
                <button
                  type="button"
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Updating Student...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5" />
                      <span>Update Student</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditStudent;