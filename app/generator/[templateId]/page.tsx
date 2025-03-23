"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { use } from 'react';

// Import form templates from parent page
const formTemplates = [
  {
    id: 'contact-form',
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
    id: 'feedback-form',
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
    id: 'survey-form',
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
  {
    id: 'order-form',
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
  {
    id: 'donation-form',
    title: 'Donation form',
    description: 'Collect donations for your cause or organization',
    icon: '💰',
    fields: [
      { type: 'text', name: 'name', label: 'Full Name', required: true },
      { type: 'email', name: 'email', label: 'Email Address', required: true },
      { type: 'select', name: 'donationAmount', label: 'Donation Amount', options: ['$10', '$25', '$50', '$100', 'Other'], required: true },
      { type: 'number', name: 'customAmount', label: 'Custom Amount (if Other)', required: false },
      { type: 'checkbox', name: 'recurring', label: 'Make this a monthly donation', options: ['Yes'], required: false },
    ]
  },
  {
    id: 'booking-form',
    title: 'Booking form',
    description: 'Let visitors book appointments or services',
    icon: '📅',
    fields: [
      { type: 'text', name: 'name', label: 'Full Name', required: true },
      { type: 'email', name: 'email', label: 'Email Address', required: true },
      { type: 'tel', name: 'phone', label: 'Phone Number', required: true },
      { type: 'select', name: 'service', label: 'Service', options: ['Service A', 'Service B', 'Service C'], required: true },
      { type: 'date', name: 'date', label: 'Preferred Date', required: true },
      { type: 'select', name: 'time', label: 'Preferred Time', options: ['Morning', 'Afternoon', 'Evening'], required: true },
    ]
  },
  {
    id: 'login-form',
    title: 'Login form',
    description: 'Create a login form for your website or application',
    icon: '🔐',
    fields: [
      { type: 'email', name: 'email', label: 'Email Address', required: true },
      { type: 'password', name: 'password', label: 'Password', required: true },
      { type: 'checkbox', name: 'remember', label: 'Remember me', options: ['Yes'], required: false },
    ]
  },
  {
    id: 'quiz-form',
    title: 'Quiz form',
    description: 'Build interactive quizzes and assessments',
    icon: '❓',
    fields: [
      { type: 'text', name: 'name', label: 'Your Name', required: true },
      { type: 'email', name: 'email', label: 'Email Address', required: true },
      { type: 'radio', name: 'question1', label: 'Question 1: What is the capital of France?', options: ['London', 'Berlin', 'Paris', 'Madrid'], required: true },
      { type: 'radio', name: 'question2', label: 'Question 2: Which planet is closest to the sun?', options: ['Earth', 'Venus', 'Mercury', 'Mars'], required: true },
      { type: 'radio', name: 'question3', label: 'Question 3: Who painted the Mona Lisa?', options: ['Van Gogh', 'Picasso', 'Da Vinci', 'Michelangelo'], required: true },
    ]
  },
  {
    id: 'appointment-form',
    title: 'Appointment booking form',
    description: 'Schedule appointments with availability options',
    icon: '⏰',
    fields: [
      { type: 'text', name: 'name', label: 'Full Name', required: true },
      { type: 'email', name: 'email', label: 'Email Address', required: true },
      { type: 'tel', name: 'phone', label: 'Phone Number', required: true },
      { type: 'date', name: 'date', label: 'Appointment Date', required: true },
      { type: 'select', name: 'time', label: 'Preferred Time', options: ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM'], required: true },
      { type: 'textarea', name: 'notes', label: 'Additional Notes', required: false },
    ]
  },
  {
    id: 'event-registration-form',
    title: 'Event registration form',
    description: 'Register attendees for your events',
    icon: '🎫',
    fields: [
      { type: 'text', name: 'name', label: 'Full Name', required: true },
      { type: 'email', name: 'email', label: 'Email Address', required: true },
      { type: 'tel', name: 'phone', label: 'Phone Number', required: true },
      { type: 'select', name: 'ticketType', label: 'Ticket Type', options: ['General Admission', 'VIP', 'Student'], required: true },
      { type: 'number', name: 'quantity', label: 'Number of Tickets', required: true },
      { type: 'checkbox', name: 'dietary', label: 'Dietary Restrictions', options: ['Vegetarian', 'Vegan', 'Gluten-free', 'None'], required: false },
    ]
  },
  {
    id: 'newsletter-signup-form',
    title: 'Newsletter signup form',
    description: 'Grow your email list with a newsletter signup form',
    icon: '📧',
    fields: [
      { type: 'text', name: 'name', label: 'First Name', required: false },
      { type: 'email', name: 'email', label: 'Email Address', required: true },
      { type: 'checkbox', name: 'interests', label: 'Interests', options: ['News', 'Updates', 'Promotions', 'Events'], required: false },
      { type: 'checkbox', name: 'consent', label: 'I agree to receive newsletters', options: ['Yes'], required: true },
    ]
  },
  {
    id: 'registration-form',
    title: 'Registration form',
    description: 'Register users for your service or platform',
    icon: '👤',
    fields: [
      { type: 'text', name: 'firstName', label: 'First Name', required: true },
      { type: 'text', name: 'lastName', label: 'Last Name', required: true },
      { type: 'email', name: 'email', label: 'Email Address', required: true },
      { type: 'password', name: 'password', label: 'Password', required: true },
      { type: 'password', name: 'confirmPassword', label: 'Confirm Password', required: true },
      { type: 'checkbox', name: 'terms', label: 'I agree to the Terms and Conditions', options: ['Yes'], required: true },
    ]
  },
  {
    id: 'email-subscription-form',
    title: 'Email subscription form',
    description: 'Simple email signup form for your subscribers',
    icon: '✅',
    fields: [
      { type: 'email', name: 'email', label: 'Email Address', required: true },
      { type: 'checkbox', name: 'consent', label: 'I agree to receive emails', options: ['Yes'], required: true },
    ]
  },
  {
    id: 'customer-satisfaction-survey',
    title: 'Customer satisfaction survey',
    description: 'Measure customer satisfaction and collect feedback',
    icon: '😊',
    fields: [
      { type: 'text', name: 'name', label: 'Your Name', required: false },
      { type: 'email', name: 'email', label: 'Email Address', required: false },
      { type: 'radio', name: 'satisfaction', label: 'How satisfied are you with our service?', options: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very Dissatisfied'], required: true },
      { type: 'radio', name: 'recommendation', label: 'How likely are you to recommend us to others?', options: ['Very Likely', 'Likely', 'Neutral', 'Unlikely', 'Very Unlikely'], required: true },
      { type: 'textarea', name: 'feedback', label: 'What could we do to improve?', required: false },
    ]
  },
  {
    id: 'product-return-form',
    title: 'Product return form',
    description: 'Process product returns and exchanges',
    icon: '↩️',
    fields: [
      { type: 'text', name: 'name', label: 'Full Name', required: true },
      { type: 'email', name: 'email', label: 'Email Address', required: true },
      { type: 'text', name: 'orderNumber', label: 'Order Number', required: true },
      { type: 'text', name: 'productName', label: 'Product Name', required: true },
      { type: 'radio', name: 'returnReason', label: 'Reason for Return', options: ['Wrong Item', 'Defective', 'Not as Described', 'Changed Mind', 'Other'], required: true },
      { type: 'radio', name: 'action', label: 'Preferred Action', options: ['Refund', 'Exchange', 'Store Credit'], required: true },
      { type: 'textarea', name: 'comments', label: 'Additional Comments', required: false },
    ]
  },
  {
    id: 'volunteer-signup-form',
    title: 'Volunteer Signup form',
    description: 'Recruit volunteers for your organization',
    icon: '🤝',
    fields: [
      { type: 'text', name: 'name', label: 'Full Name', required: true },
      { type: 'email', name: 'email', label: 'Email Address', required: true },
      { type: 'tel', name: 'phone', label: 'Phone Number', required: true },
      { type: 'checkbox', name: 'availability', label: 'Availability', options: ['Weekdays', 'Weekends', 'Evenings', 'Mornings'], required: true },
      { type: 'checkbox', name: 'interests', label: 'Areas of Interest', options: ['Event Support', 'Administration', 'Fundraising', 'Marketing', 'Community Outreach'], required: true },
      { type: 'textarea', name: 'experience', label: 'Relevant Experience', required: false },
    ]
  },
];

export default function TemplateDetailPage({ params }: { params: { templateId: string } }) {
  const router = useRouter();
  const [template, setTemplate] = useState<any>(null);
  const [htmlCode, setHtmlCode] = useState<string>('');
  const [copied, setCopied] = useState(false);
  
  // Unwrap params with React.use
  const unwrappedParams = use(params as unknown as Promise<{ templateId: string }>);
  const templateId = unwrappedParams.templateId;
  
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
    
    // Form HTML only
    let formHtml = `<!-- ${template.title} -->
<form id="${template.id}" action="#" method="POST">`;

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

<!-- Form CSS Styles -->
<style>
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
  input[type="tel"],
  input[type="password"],
  input[type="date"],
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

<!-- Form JavaScript -->
<script>
  document.getElementById('${template.id}').addEventListener('submit', function(event) {
    event.preventDefault();
    alert('Form submitted! In a real implementation, this would send data to your server.');
    this.reset();
  });
</script>`;
    
    setHtmlCode(formHtml);
  };
  
  const copyHtmlToClipboard = () => {
    navigator.clipboard.writeText(htmlCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  
  if (!template) {
    return (
      <div className="min-h-screen bg-parrot-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl text-parrot-gray-600 mb-4">Loading template...</div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-parrot-gray-50 pb-20">
      {/* Header - matching homepage header style */}
      <header className="bg-white border-b border-parrot-gray-200 h-16 flex items-center px-4 lg:px-6">
        <div className="max-w-7xl w-full mx-auto flex justify-between items-center">
          {/* Logo and branding */}
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-parrot-green flex items-center justify-center">
              <span className="text-white font-bold">BF</span>
            </div>
            <span className="text-lg font-semibold text-parrot-blue-dark">ParrotForms</span>
          </Link>
          
          {/* Right side with dashboard button */}
          <div className="flex items-center gap-3">
            <Link
              href="/generator"
              className="text-parrot-gray-700 hover:text-parrot-blue transition-colors px-3 py-2 text-sm font-medium"
            >
              Form Generator
            </Link>
            <Link
              href="/dashboard"
              className="btn-parrot flex items-center gap-1 text-sm"
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
      <div className="bg-gradient-to-r from-parrot-blue to-parrot-blue-dark text-white py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <Link href="/generator" className="text-parrot-blue-light hover:text-white mb-4 inline-flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to all templates
          </Link>
          <h1 className="text-3xl font-bold mb-2 text-white flex items-center">
            <span className="text-4xl mr-3">{template.icon}</span>
            {template.title}
          </h1>
          <p className="text-lg text-parrot-blue-light max-w-3xl">
            {template.description}
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="bg-white rounded-parrot-lg shadow-parrot p-0 border border-parrot-gray-200 mb-8 overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Preview Panel */}
            <div className="w-full md:w-1/2 p-8 border-r border-parrot-gray-200">
              <h2 className="text-xl font-semibold text-parrot-blue-dark mb-4">Form Preview</h2>
              
              <div className="bg-parrot-gray-50 p-6 rounded-parrot border border-parrot-gray-200">
                <h3 className="text-lg font-medium text-parrot-blue-dark mb-3">{template.title}</h3>
                
                {template.fields.map((field: any, idx: number) => (
                  <div key={idx} className="mb-4">
                    <label className="block text-sm font-medium text-parrot-gray-700 mb-1">
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </label>
                    
                    {field.type === 'textarea' ? (
                      <textarea 
                        className="w-full px-3 py-2 border border-parrot-gray-300 rounded-parrot text-parrot-gray-700"
                        disabled 
                      />
                    ) : field.type === 'select' ? (
                      <select 
                        className="w-full px-3 py-2 border border-parrot-gray-300 rounded-parrot text-parrot-gray-700"
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
                              className="h-4 w-4 text-parrot-orange"
                              disabled
                            />
                            <label className="ml-2 text-sm text-parrot-gray-700">{option}</label>
                          </div>
                        ))}
                      </div>
                    ) : field.type === 'checkbox' ? (
                      <div className="space-y-2">
                        {field.options?.map((option: string, optIdx: number) => (
                          <div key={optIdx} className="flex items-center">
                            <input 
                              type="checkbox" 
                              className="h-4 w-4 text-parrot-orange"
                              disabled
                            />
                            <label className="ml-2 text-sm text-parrot-gray-700">{option}</label>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <input 
                        type={field.type} 
                        className="w-full px-3 py-2 border border-parrot-gray-300 rounded-parrot text-parrot-gray-700"
                        disabled 
                      />
                    )}
                  </div>
                ))}
                
                <button className="btn-parrot mt-4">
                  Submit
                </button>
              </div>
            </div>
            
            {/* Code Panel */}
            <div className="w-full md:w-1/2 p-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-parrot-blue-dark">HTML Code</h2>
                <button 
                  onClick={copyHtmlToClipboard}
                  className={`text-sm px-3 py-1 rounded-parrot ${copied ? 'bg-green-500 text-white' : 'bg-parrot-gray-100 text-parrot-gray-700 hover:bg-parrot-gray-200'}`}
                >
                  {copied ? 'Copied!' : 'Copy Code'}
                </button>
              </div>
              
              <div className="bg-gray-900 text-gray-200 p-4 rounded-parrot overflow-auto max-h-[500px]">
                <pre className="text-xs">
                  <code>{htmlCode}</code>
                </pre>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium text-parrot-blue-dark mb-2">How to use this form</h3>
                <ol className="list-decimal list-inside text-parrot-gray-700 space-y-2">
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
        <div className="bg-parrot-blue-50 border border-parrot-blue-200 rounded-parrot p-6 text-center">
          <h2 className="text-xl font-semibold text-parrot-blue-dark mb-2">Need more advanced forms?</h2>
          <p className="text-parrot-gray-700 mb-4">
            Create a free ParrotForms account to access more templates, save your forms, and collect submissions.
          </p>
          <Link href="/dashboard" className="btn-parrot">
            Create a Free Account
          </Link>
        </div>
      </div>
    </div>
  );
} 