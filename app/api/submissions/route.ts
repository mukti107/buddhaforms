import { NextResponse } from 'next/server';
import { Form, Submission } from '@/app/models';
import { getSession } from '@auth0/nextjs-auth0';

// Get all submissions across all forms for the user
export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all forms belonging to the user
    const userForms = await Form.find({ userId: session.user.sub });
    const formIds = userForms.map(form => form.formId);

    // Get submissions with pagination and filters
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const formId = searchParams.get('formId'); // Optional form filter
    const skip = (page - 1) * limit;

    // Build query
    const query = formId ? 
      { formId } : 
      { formId: { $in: formIds } };

    const submissions = await Submission.find(query)
      .sort({ submittedAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Submission.countDocuments(query);

    // Get form details for each submission
    const formDetails = await Form.find(
      { formId: { $in: submissions.map(s => s.formId) } },
      { formId: 1, name: 1 }
    );

    const formMap = Object.fromEntries(
      formDetails.map(form => [form.formId, { name: form.name }])
    );

    // Enhance submissions with form details
    const enhancedSubmissions = submissions.map(submission => ({
      ...submission.toObject(),
      form: formMap[submission.formId]
    }));

    return NextResponse.json({
      submissions: enhancedSubmissions,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 