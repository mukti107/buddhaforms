import { NextResponse } from 'next/server';
import { Form, Submission } from '../../../models';
import { sendEmail } from '../../../lib/ses';

export async function POST(
  req: Request,
  { params }: { params: { formId: string } }
) {
  try {
    const formId = params.formId;
    const form = await Form.findOne({ formId });
    
    if (!form) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 });
    }

    // Handle multipart form data
    const formData = await req.formData();
    const data: Record<string, string> = {};
    
    // Convert FormData to a regular object
    for (const [key, value] of formData.entries()) {
      // Handle file uploads if needed
      if (value instanceof File) {
        // For simple cases, you might just want to store file name
        data[key] = value.name;
        
        // For actual file handling, you'd need to process the file
        // const buffer = await value.arrayBuffer();
        // const fileContent = Buffer.from(buffer);
        // Then upload to S3 or save elsewhere
      } else {
        data[key] = value as string;
      }
    }

    console.log('submission', {
      formId,
      data
    });
    
    // Save submission to database
    await Submission.create({
      formId,
      data,
    });

    // Send email notification
    await sendEmail(
      form.emailTo,
      `New submission for ${form.name}`,
      `
        <h1>New Form Submission</h1>
        <p>You have received a new submission for form: ${form.name}</p>
        <pre>${JSON.stringify(data, null, 2)}</pre>
      `
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error submitting form', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 