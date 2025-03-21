import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import { Form, Submission } from '../../../models/Form';
import { sendEmail } from '../../../lib/ses';

export async function POST(
  req: Request,
  { params }: { params: { formId: string } }
) {
  try {
    await connectDB();
    
    const formId = params.formId;
    const form = await Form.findOne({ formId });
    
    if (!form) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 });
    }

    const data = await req.json();
    
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
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 