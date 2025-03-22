import { NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { Form, Submission } from '../../models';
import { startOfMonth, subMonths, endOfMonth, format } from 'date-fns';

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the range from query params (default to last 6 months)
    const url = new URL(req.url);
    const range = url.searchParams.get('range') || 'last_6_months';

    // Calculate date range
    const now = new Date();
    let startDate = startOfMonth(subMonths(now, 5));
    let endDate = endOfMonth(now);

    switch (range) {
      case 'this_month':
        startDate = startOfMonth(now);
        break;
      case 'last_30_days':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'last_3_months':
        startDate = startOfMonth(subMonths(now, 2));
        break;
      case 'last_12_months':
        startDate = startOfMonth(subMonths(now, 11));
        break;
      // Add other cases as needed
    }

    // Get user's forms
    const forms = await Form.find({ userId: session.user.sub });
    const formIds = forms.map(form => form.formId);

    // Get submissions within date range
    const submissions = await Submission.aggregate([
      {
        $match: {
          formId: { $in: formIds },
          submittedAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$submittedAt" },
            month: { $month: "$submittedAt" }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }
      }
    ]);

    // Format the data for the chart
    const chartData = submissions.map(item => ({
      date: format(new Date(item._id.year, item._id.month - 1), 'MMM'),
      submissions: item.count,
      forms: forms.filter(f => 
        new Date(f.createdAt).getMonth() === item._id.month - 1 && 
        new Date(f.createdAt).getFullYear() === item._id.year
      ).length
    }));

    // Calculate totals
    const totalForms = forms.length;
    const totalSubmissions = submissions.reduce((sum, item) => sum + item.count, 0);

    return NextResponse.json({
      chartData,
      totals: {
        forms: totalForms,
        submissions: totalSubmissions
      }
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 