import { NextResponse } from 'next/server';
import { Form, Submission } from '@/app/models';
import { getSession } from '@auth0/nextjs-auth0';

interface SubmissionResponse {
  id: string;
  formId: string;
  data: Record<string, any>;
  submittedAt: Date;
  ip?: string;
  userAgent?: string;
  referrer?: string;
  isSpam: boolean;
  form?: {
    name: string;
    emailTo: string;
  };
}

// Get single submission
export async function GET(
  req: Request,
  { params }: { params: { submissionId: string } }
) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the submission
    const submission = await Submission.findOne({ _id: params.submissionId });

    if (!submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    // Get the associated form and verify ownership
    const form = await Form.findOne({
      formId: submission.formId,
      userId: session.user.sub
    });

    if (!form) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Combine submission data with form details
    const response: SubmissionResponse = {
      id: submission._id.toString(),
      formId: submission.formId,
      data: submission.data,
      submittedAt: submission.submittedAt,
      ip: submission.ip,
      userAgent: submission.userAgent,
      referrer: submission.referrer,
      isSpam: submission.isSpam,
      form: {
        name: form.name,
        emailTo: form.emailTo
      }
    };

    return NextResponse.json({ submission: response });
  } catch (error) {
    console.error('Error fetching submission:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Delete submission
export async function DELETE(
  req: Request,
  { params }: { params: { submissionId: string } }
) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the submission
    const submission = await Submission.findOne({ _id: params.submissionId });

    if (!submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    // Verify the form belongs to the user
    const form = await Form.findOne({
      formId: submission.formId,
      userId: session.user.sub
    });

    if (!form) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Delete the submission
    await Submission.deleteOne({ _id: params.submissionId });

    return NextResponse.json({ message: 'Submission deleted successfully' });
  } catch (error) {
    console.error('Error deleting submission:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 