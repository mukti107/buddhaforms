"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import CodeEditor from '@/app/components/ui/CodeEditor';

// Import form templates from parent page
const formTemplates = [
  {
    id: 'contact',
    title: 'Contact form',
    description: 'Create a simple contact form to collect messages from visitors',
    icon: '✉️',
    fields: [
      { type: 'text', name: 'name', label: 'Your Name', required: true },
      { type: 'email', name: 'email', label: 'Email Address', required: true },
      { type: 'text', name: 'subject', label: 'Subject', required: true },
      { type: 'textarea', name: 'message', label: 'Your Message', required: true },
    ]
  },
  {
    id: 'feedback',
    title: 'Feedback form',
    description: 'Gather feedback about your products or services',
    icon: '📝',
    fields: [
      { type: 'text', name: 'name', label: 'Your Name', required: true },
      { type: 'email', name: 'email', label: 'Email Address', required: true },
      { type: 'radio', name: 'rating', label: 'How would you rate our service?', options: ['Excellent', 'Good', 'Average', 'Poor', 'Very Poor'], required: true },
      { type: 'textarea', name: 'feedback', label: 'Your Feedback', required: true },
    ]
  },
  {
    id: 'survey',
    title: 'Survey form',
    description: 'Create surveys with multiple question types',
    icon: '📊',
    fields: [
      { type: 'text', name: 'name', label: 'Your Name', required: true },
      { type: 'email', name: 'email', label: 'Email Address', required: true },
      { type: 'radio', name: 'age', label: 'Age Group', options: ['18-24', '25-34', '35-44', '45-54', '55+'], required: true },
      { type: 'checkbox', name: 'interests', label: 'Your Interests', options: ['Technology', 'Sports', 'Music', 'Art', 'Travel', 'Food'], required: false },
      { type: 'textarea', name: 'comments', label: 'Additional Comments', required: false },
    ]
  },
  // Add more templates here (abbreviated for brevity)
  {
    id: 'order',
    title: 'Order form',
    description: 'Accept orders and collect payment information',
    icon: '🛒',
    fields: [
      { type: 'text', name: 'name', label: 'Full Name', required: true },
      { type: 'email', name: 'email', label: 'Email Address', required: true },
      { type: 'text', name: 'address', label: 'Shipping Address', required: true },
      { type: 'select', name: 'product', label: 'Product', options: ['Product A - $10', 'Product B - $20', 'Product C - $30'], required: true },
      { type: 'number', name: 'quantity', label: 'Quantity', required: true },
    ]
  },
];

export default function TemplateDetailPage() {
  const router = useRouter();
  const params = useParams();
  const templateId = params.templateId as string;
  
  const [template, setTemplate] = useState<any>(null);
  const [htmlCode, setHtmlCode] = useState<string>('');
  
  useEffect(() => {
    // Find the template from the template ID
    const selectedTemplate = formTemplates.find(t => t.id === templateId);
    
    if (!selectedTemplate) {
      // Redirect to the main generator page if template not found
      router.push('/generator');
      return;
    }
    
    setTemplate(selectedTemplate);
    
    // Generate HTML code for the template
    generateHtmlCode(selectedTemplate);
  }, [templateId, router]);
  
  const generateHtmlCode = (template: any) => {
    if (!template || !template.fields) return;
    
    let formHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${template.title}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 500px;
            margin: 0 auto;
            padding: 20px;
        }
        .form-group {
            margin-bottom: 15px;
        }
        label {
            display: block;
            margin-bottom: 5px;
            font-weight: 500;
        }
        input[type="text"],
        input[type="email"],
        input[type="number"],
        select,
        textarea {
            width: 100%;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-sizing: border-box;
        }
        textarea {
            height: 100px;
            resize: vertical;
        }
        button {
            background-color: #FF7A59;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
        }
        button:hover {
            background-color: #F15B2A;
        }
        .radio-group, .checkbox-group {
            margin-top: 5px;
        }
        .radio-option, .checkbox-option {
            margin-bottom: 5px;
        }
        .required {
            color: #e74c3c;
        }
    </style>
</head>
<body>
    <h2>${template.title}</h2>
    <p>${template.description}</p>
    
    <form id="${template.id}-form" action="#" method="POST">
`;

    // Add form fields
    template.fields.forEach((field: any) => {
      const requiredMark = field.required ? '<span class="required">*</span>' : '';
      
      formHtml += `
        <div class="form-group">
            <label for="${field.name}">${field.label} ${requiredMark}</label>`;
            
      if (field.type === 'textarea') {
        formHtml += `
            <textarea id="${field.name}" name="${field.name}" ${field.required ? 'required' : ''}></textarea>`;
      } else if (field.type === 'select') {
        formHtml += `
            <select id="${field.name}" name="${field.name}" ${field.required ? 'required' : ''}>
                <option value="" disabled selected>Select an option</option>`;
                
        field.options?.forEach((option: string) => {
          formHtml += `
                <option value="${option.toLowerCase().replace(/\s+/g, '-')}">${option}</option>`;
        });
        
        formHtml += `
            </select>`;
      } else if (field.type === 'radio') {
        formHtml += `
            <div class="radio-group">`;
            
        field.options?.forEach((option: string, idx: number) => {
          formHtml += `
                <div class="radio-option">
                    <input type="radio" id="${field.name}-${idx}" name="${field.name}" value="${option.toLowerCase().replace(/\s+/g, '-')}" ${idx === 0 && field.required ? 'required' : ''}>
                    <label for="${field.name}-${idx}">${option}</label>
                </div>`;
        });
        
        formHtml += `
            </div>`;
      } else if (field.type === 'checkbox') {
        formHtml += `
            <div class="checkbox-group">`;
            
        field.options?.forEach((option: string, idx: number) => {
          formHtml += `
                <div class="checkbox-option">
                    <input type="checkbox" id="${field.name}-${idx}" name="${field.name}[]" value="${option.toLowerCase().replace(/\s+/g, '-')}">
                    <label for="${field.name}-${idx}">${option}</label>
                </div>`;
        });
        
        formHtml += `
            </div>`;
      } else {
        formHtml += `
            <input type="${field.type}" id="${field.name}" name="${field.name}" ${field.required ? 'required' : ''}>`;
      }
      
      formHtml += `
        </div>`;
    });
    
    // Add submit button
    formHtml += `
        <div class="form-group">
            <button type="submit">Submit</button>
        </div>
    </form>
    
    <script>
        document.getElementById('${template.id}-form').addEventListener('submit', function(event) {
            event.preventDefault();
            alert('Form submitted! In a real implementation, this would send data to your server.');
            this.reset();
        });
    </script>
</body>
</html>`;
    
    setHtmlCode(formHtml);
  };
  
  if (!template) {
    return (
      <div className="min-h-screen bg-buddha-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl text-buddha-gray-600 mb-4">Loading template...</div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-buddha-gray-50 pb-20">
      {/* Header - matching homepage header style */}
      <header className="bg-white border-b border-buddha-gray-200 h-16 flex items-center px-4 lg:px-6">
        <div className="max-w-7xl w-full mx-auto flex justify-between items-center">
          {/* Logo and branding */}
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-buddha-orange flex items-center justify-center">
              <span className="text-white font-bold">BF</span>
            </div>
            <span className="text-lg font-semibold text-buddha-blue-dark">BuddhaForms</span>
          </Link>
          
          {/* Right side with dashboard button */}
          <div className="flex items-center gap-3">
            <Link
              href="/generator"
              className="text-buddha-gray-700 hover:text-buddha-blue transition-colors px-3 py-2 text-sm font-medium"
            >
              Form Generator
            </Link>
            <Link
              href="/dashboard"
              className="btn-buddha flex items-center gap-1 text-sm"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              <span>Dashboard</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Page title section */}
      <div className="bg-gradient-to-r from-buddha-blue to-buddha-blue-dark text-white py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <Link href="/generator" className="text-buddha-blue-light hover:text-white mb-4 inline-flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to all templates
          </Link>
          <h1 className="text-3xl font-bold mb-2 text-white flex items-center">
            <span className="text-4xl mr-3">{template.icon}</span>
            {template.title}
          </h1>
          <p className="text-lg text-buddha-blue-light max-w-3xl">
            {template.description}
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="bg-white rounded-buddha-lg shadow-buddha p-0 border border-buddha-gray-200 mb-8 overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Preview Panel */}
            <div className="w-full md:w-1/2 p-8 border-r border-buddha-gray-200">
              <h2 className="text-xl font-semibold text-buddha-blue-dark mb-4">Form Preview</h2>
              
              <div className="bg-buddha-gray-50 p-6 rounded-buddha border border-buddha-gray-200">
                <h3 className="text-lg font-medium text-buddha-blue-dark mb-3">{template.title}</h3>
                
                {template.fields.map((field: any, idx: number) => (
                  <div key={idx} className="mb-4">
                    <label className="block text-sm font-medium text-buddha-gray-700 mb-1">
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </label>
                    
                    {field.type === 'textarea' ? (
                      <textarea 
                        className="w-full px-3 py-2 border border-buddha-gray-300 rounded-buddha text-buddha-gray-700"
                        disabled 
                      />
                    ) : field.type === 'select' ? (
                      <select 
                        className="w-full px-3 py-2 border border-buddha-gray-300 rounded-buddha text-buddha-gray-700"
                        disabled
                      >
                        <option>Select an option</option>
                        {field.options?.map((option: string, optIdx: number) => (
                          <option key={optIdx}>{option}</option>
                        ))}
                      </select>
                    ) : field.type === 'radio' ? (
                      <div className="space-y-2">
                        {field.options?.map((option: string, optIdx: number) => (
                          <div key={optIdx} className="flex items-center">
                            <input 
                              type="radio" 
                              className="h-4 w-4 text-buddha-orange"
                              disabled
                            />
                            <label className="ml-2 text-sm text-buddha-gray-700">{option}</label>
                          </div>
                        ))}
                      </div>
                    ) : field.type === 'checkbox' ? (
                      <div className="space-y-2">
                        {field.options?.map((option: string, optIdx: number) => (
                          <div key={optIdx} className="flex items-center">
                            <input 
                              type="checkbox" 
                              className="h-4 w-4 text-buddha-orange"
                              disabled
                            />
                            <label className="ml-2 text-sm text-buddha-gray-700">{option}</label>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <input 
                        type={field.type} 
                        className="w-full px-3 py-2 border border-buddha-gray-300 rounded-buddha text-buddha-gray-700"
                        disabled 
                      />
                    )}
                  </div>
                ))}
                
                <button className="btn-buddha mt-4">
                  Submit
                </button>
              </div>
            </div>
            
            {/* Code Panel */}
            <div className="w-full md:w-1/2 p-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-buddha-blue-dark">HTML Code</h2>
              </div>
              
              <CodeEditor 
                code={htmlCode} 
                language="html" 
                theme="github-dark" 
              />
              
              <div className="mt-6">
                <h3 className="text-lg font-medium text-buddha-blue-dark mb-2">How to use this form</h3>
                <ol className="list-decimal list-inside text-buddha-gray-700 space-y-2">
                  <li>Copy the HTML code above</li>
                  <li>Paste it into your website's HTML file</li>
                  <li>Customize the form action to point to your backend or form processing service</li>
                  <li>Adjust the styles to match your website's design</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="bg-buddha-blue-50 border border-buddha-blue-200 rounded-buddha p-6 text-center">
          <h2 className="text-xl font-semibold text-buddha-blue-dark mb-2">Need more advanced forms?</h2>
          <p className="text-buddha-gray-700 mb-4">
            Create a free BuddhaForms account to access more templates, save your forms, and collect submissions.
          </p>
          <Link href="/dashboard" className="btn-buddha">
            Create a Free Account
          </Link>
        </div>
      </div>
    </div>
  );
} 