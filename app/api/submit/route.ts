import { NextRequest, NextResponse } from 'next/server';

// This is a simple mock implementation for demonstration
// In a real application, you would store this in a database
const submissions = new Map();

export async function POST(request: NextRequest) {
  try {
    // Get the form data from the request
    const formData = await request.json();
    
    // Validate the request - ensure formId is present
    if (!formData.formId) {
      return NextResponse.json(
        { error: 'Missing formId parameter' },
        { status: 400 }
      );
    }
    
    // Create a submission record
    const submission = {
      id: crypto.randomUUID(),
      formId: formData.formId,
      data: formData.data || {},
      createdAt: new Date().toISOString(),
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
    };
    
    // Store the submission (in a real app, this would go to a database)
    if (!submissions.has(formData.formId)) {
      submissions.set(formData.formId, []);
    }
    submissions.get(formData.formId).push(submission);
    
    console.log(`New submission for form ${formData.formId}:`, submission);
    
    // In a real application, you would:
    // 1. Validate the submission against the form schema
    // 2. Store the submission in a database
    // 3. Send email notifications if configured
    // 4. Handle file uploads if any
    
    // Return a success response
    return NextResponse.json({ 
      success: true, 
      message: 'Form submission received',
      submissionId: submission.id
    });
    
  } catch (error) {
    console.error('Error processing form submission:', error);
    
    return NextResponse.json(
      { error: 'Failed to process form submission' },
      { status: 500 }
    );
  }
}

// For testing purposes - allows us to get all submissions for a form
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const formId = searchParams.get('formId');
  
  if (!formId) {
    return NextResponse.json(
      { error: 'Missing formId parameter' },
      { status: 400 }
    );
  }
  
  const formSubmissions = submissions.get(formId) || [];
  
  return NextResponse.json({
    formId,
    submissions: formSubmissions,
    count: formSubmissions.length
  });
} 