"use client";

import React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface FormData {
  [key: string]: string;
}

export default function PublicFormPage({ params }: { params: Promise<{ formId: string }> }) {
  const router = useRouter();
  const { formId } = React.use(params);
  const [formData, setFormData] = useState<FormData>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // For demo purposes, we're using hardcoded form fields
  // In a real application, you would fetch the form structure from the API
  const formFields = [
    { id: 'name', label: 'Name', type: 'text', required: true },
    { id: 'email', label: 'Email', type: 'email', required: true },
    { id: 'message', label: 'Message', type: 'textarea', required: true },
    { id: 'phone', label: 'Phone', type: 'tel', required: false },
  ];
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formId: formId,
          data: formData
        }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Something went wrong');
      }
      
      // Redirect to success page
      router.push('/submit/success');
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit form');
      console.error('Error submitting form:', err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="max-w-md mx-auto my-10 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-6">Contact Form</h1>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        {formFields.map(field => (
          <div key={field.id} className="mb-4">
            <label 
              htmlFor={field.id} 
              className="block text-gray-700 font-medium mb-2"
            >
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            
            {field.type === 'textarea' ? (
              <textarea
                id={field.id}
                name={field.id}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required={field.required}
                onChange={handleChange}
                value={formData[field.id] || ''}
              />
            ) : (
              <input
                type={field.type}
                id={field.id}
                name={field.id}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required={field.required}
                onChange={handleChange}
                value={formData[field.id] || ''}
              />
            )}
          </div>
        ))}
        
        <div className="mt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-4 bg-indigo-600 text-white font-medium rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
      
      <div className="mt-4 text-center text-sm text-gray-500">
        Powered by <span className="font-medium">BuddhaForms</span>
      </div>
    </div>
  );
} 