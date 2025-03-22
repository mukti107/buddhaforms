import { NextResponse } from 'next/server';
import { Form } from '../../models';
import { nanoid } from 'nanoid';
import { getSession } from '@auth0/nextjs-auth0';
import { cookies } from 'next/headers';

// Create form
export async function POST(req: Request) {
  try {
    await cookies();
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, settings } = await req.json();
    
    const formId = nanoid(10);
    const form = await Form.create({
      userId: session.user.sub,
      formId,
      name,
      settings: {
        emailNotifications: true,
        notificationEmail: settings?.notificationEmail,
        honeypot: false,
        dataRetention: 'forever'
      }
    });

    return NextResponse.json({ form });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// List forms
export async function GET() {
  try {
    await cookies();
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const forms = await Form.find({ userId: session.user.sub })
      .sort({ createdAt: -1 });

    return NextResponse.json({ forms });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 