// Define types for form submissions
export interface FormSubmission {
  id: string;
  formId: string;
  formName: string;
  submittedAt: Date;
  data: Record<string, any>;
  read?: boolean;
  starred?: boolean;
}

// Define type for forms
export interface Form {
  id: string;
  name: string;
  submissionCount: number;
  active: boolean;
  createdAt?: Date;
  fields?: FormField[];
  settings?: FormSettings;
}

// Form field type
export interface FormField {
  id: string;
  type: 'text' | 'email' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'file';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[]; // For select, checkbox, radio
}

// Form settings type
export interface FormSettings {
  redirectUrl?: string;
  emailNotifications?: boolean;
  honeypot?: boolean;
  captcha?: boolean;
}

// Mock forms data
export const mockForms: Form[] = [
  { 
    id: 'form1', 
    name: 'Contact Form', 
    submissionCount: 15, 
    active: true,
    createdAt: new Date('2023-04-10T14:30:00'),
    fields: [
      { id: 'name', type: 'text', label: 'Name', required: true },
      { id: 'email', type: 'email', label: 'Email', required: true },
      { id: 'message', type: 'textarea', label: 'Message', required: true }
    ]
  },
  { 
    id: 'form2', 
    name: 'Newsletter Signup', 
    submissionCount: 8, 
    active: true,
    createdAt: new Date('2023-04-15T09:45:00'),
    fields: [
      { id: 'name', type: 'text', label: 'Name', required: true },
      { id: 'email', type: 'email', label: 'Email', required: true },
      { id: 'interests', type: 'checkbox', label: 'Interests', required: false, options: ['Marketing', 'Technology', 'Design', 'Business'] }
    ]
  },
  { 
    id: 'form3', 
    name: 'Feedback Form', 
    submissionCount: 3, 
    active: false,
    createdAt: new Date('2023-05-01T16:20:00'),
    fields: [
      { id: 'name', type: 'text', label: 'Name', required: false },
      { id: 'email', type: 'email', label: 'Email', required: false },
      { id: 'rating', type: 'select', label: 'Rating', required: true, options: ['Excellent', 'Good', 'Average', 'Poor'] },
      { id: 'comments', type: 'textarea', label: 'Comments', required: true }
    ]
  }
];

// Mock submissions data - 12 entries with different dates, forms, and data
export const mockSubmissions: FormSubmission[] = [
  {
    id: 'sub1',
    formId: 'form1',
    formName: 'Contact Form',
    submittedAt: new Date('2023-05-15T09:24:00'),
    data: { 
      name: 'John Doe', 
      email: 'john@example.com', 
      message: 'I would like to know more about your services.' 
    },
    read: true
  },
  {
    id: 'sub2',
    formId: 'form1',
    formName: 'Contact Form',
    submittedAt: new Date('2023-05-14T15:42:00'),
    data: { 
      name: 'Sarah Johnson', 
      email: 'sarah@example.com', 
      message: 'Please contact me about pricing options.' 
    },
    read: true
  },
  {
    id: 'sub3',
    formId: 'form2',
    formName: 'Newsletter Signup',
    submittedAt: new Date('2023-05-13T11:18:00'),
    data: { 
      name: 'Michael Brown', 
      email: 'michael@example.com', 
      interests: ['Technology', 'Business'] 
    },
    read: false
  },
  {
    id: 'sub4',
    formId: 'form3',
    formName: 'Feedback Form',
    submittedAt: new Date('2023-05-12T16:30:00'),
    data: { 
      name: 'Emma Wilson', 
      email: 'emma@example.com', 
      rating: 'Excellent', 
      comments: 'Your service exceeded my expectations. Thank you!' 
    },
    read: true,
    starred: true
  },
  {
    id: 'sub5',
    formId: 'form1',
    formName: 'Contact Form',
    submittedAt: new Date('2023-05-11T10:05:00'),
    data: { 
      name: 'Robert Chen', 
      email: 'robert@example.com', 
      message: 'I need help with integration. Could someone from support contact me?' 
    },
    read: false
  },
  {
    id: 'sub6',
    formId: 'form2',
    formName: 'Newsletter Signup',
    submittedAt: new Date('2023-05-10T14:22:00'),
    data: { 
      name: 'Lisa Anderson', 
      email: 'lisa@example.com', 
      interests: ['Marketing', 'Design'] 
    },
    read: true
  },
  {
    id: 'sub7',
    formId: 'form1',
    formName: 'Contact Form',
    submittedAt: new Date('2023-05-09T09:11:00'),
    data: { 
      name: 'David Thompson', 
      email: 'david@example.com', 
      message: 'Looking to upgrade our current plan. What options do you have?' 
    },
    read: true
  },
  {
    id: 'sub8',
    formId: 'form3',
    formName: 'Feedback Form',
    submittedAt: new Date('2023-05-08T17:45:00'),
    data: { 
      name: 'Jessica Kim', 
      email: 'jessica@example.com', 
      rating: 'Good', 
      comments: 'Great experience overall, but could use more customization options.' 
    },
    read: false,
    starred: true
  },
  {
    id: 'sub9',
    formId: 'form2',
    formName: 'Newsletter Signup',
    submittedAt: new Date('2023-05-07T11:30:00'),
    data: { 
      name: 'Kevin Nguyen', 
      email: 'kevin@example.com', 
      interests: ['Technology'] 
    },
    read: true
  },
  {
    id: 'sub10',
    formId: 'form1',
    formName: 'Contact Form',
    submittedAt: new Date('2023-05-06T14:15:00'),
    data: { 
      name: 'Amanda Clark', 
      email: 'amanda@example.com', 
      message: 'I would like to schedule a demo of your product.' 
    },
    read: false
  },
  {
    id: 'sub11',
    formId: 'form3',
    formName: 'Feedback Form',
    submittedAt: new Date('2023-05-05T15:20:00'),
    data: { 
      name: 'Thomas Wright', 
      email: 'thomas@example.com', 
      rating: 'Average', 
      comments: 'The service was acceptable but there were some issues with response time.' 
    },
    read: true
  },
  {
    id: 'sub12',
    formId: 'form2',
    formName: 'Newsletter Signup',
    submittedAt: new Date('2023-05-04T10:48:00'),
    data: { 
      name: 'Jennifer Lopez', 
      email: 'jennifer@example.com', 
      interests: ['Marketing', 'Business', 'Design'] 
    },
    read: true
  }
];

// Helper function to get recent submissions
export const getRecentSubmissions = (count: number = 5) => {
  return [...mockSubmissions]
    .sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime())
    .slice(0, count);
};

// Helper function to get unread submissions count
export const getUnreadSubmissionsCount = () => {
  return mockSubmissions.filter(submission => !submission.read).length;
};

// Helper function to get submissions by form
export const getSubmissionsByForm = (formId: string) => {
  return mockSubmissions.filter(submission => submission.formId === formId);
}; 