import { NextResponse } from 'next/server';
import connectDB from '../../lib/mongodb';
import { Form } from '../../models/Form';
import { nanoid } from 'nanoid';
import { getSession } from '@auth0/nextjs-auth0';

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, emailTo } = await req.json();
    
    await connectDB();
    
    const formId = nanoid(10);
    const form = await Form.create({
      userId: session.user.sub,
      formId,
      name,
      emailTo,
    });

    return NextResponse.json({ form });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 