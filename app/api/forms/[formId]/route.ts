import { NextResponse } from 'next/server';
import { Form } from '../../../models';
import { getSession } from '@auth0/nextjs-auth0';

interface UpdateFormData {
  name: string;
  emailTo: string;
  active: boolean;
  settings: {
    honeypot: boolean;
    dataRetention: string;
    emailNotifications: boolean;
    notificationEmail: string | null;
  };
}

// Get single form
export async function GET(
  req: Request,
  { params }: { params: { formId: string } }
) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log({
        formId: params.formId,
        userId: session.user.sub
      });

    const form = await Form.findOne({
      formId: params.formId,
      userId: session.user.sub
    });

    if (!form) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 });
    }

    return NextResponse.json({ form });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Delete form
export async function DELETE(
  req: Request,
  { params }: { params: { formId: string } }
) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const form = await Form.findOneAndDelete({
      formId: params.formId,
      userId: session.user.sub
    });

    if (!form) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Form deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Update form
export async function PUT(
  req: Request,
  { params }: { params: { formId: string } }
) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data: UpdateFormData = await req.json();

    // Validate required fields
    if (!data.name?.trim() || !data.emailTo?.trim()) {
      return NextResponse.json({ error: 'Form name and email are required' }, { status: 400 });
    }

    // Find and update the form
    const form = await Form.findOneAndUpdate(
      {
        formId: params.formId,
        userId: session.user.sub
      },
      {
        $set: {
          name: data.name,
          emailTo: data.emailTo,
          active: data.active,
          settings: {
            honeypot: data.settings.honeypot,
            dataRetention: data.settings.dataRetention,
            emailNotifications: data.settings.emailNotifications,
            notificationEmail: data.settings.emailNotifications ? data.settings.notificationEmail : null,
          },
          updatedAt: new Date()
        }
      },
      { new: true }
    );

    if (!form) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 });
    }

    return NextResponse.json({ form });
  } catch (error) {
    console.error('Error updating form:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 