import { NextRequest, NextResponse } from 'next/server';
import { getCreatorSubmissions } from '@/lib/services/marketplace';
import { MOCK_UI_PRODUCTS } from '@/lib/mock-marketplace';

export async function GET(request: NextRequest) {
  try {
    const submissions = await getCreatorSubmissions();

    // Calculate aggregated metrics for the current user's creator profile
    const publishedCount = MOCK_UI_PRODUCTS.filter((p) => p.status === 'published').length;
    const pendingCount = submissions.filter((s) => s.status === 'pending_review').length;
    const totalSales = MOCK_UI_PRODUCTS.reduce((acc, p) => acc + (p.sales_count || 0), 0);
    const totalRevenue = MOCK_UI_PRODUCTS.reduce(
      (acc, p) => acc + (p.sales_count || 0) * (p.price || 0),
      0
    );

    return NextResponse.json({
      success: true,
      stats: {
        totalProducts: publishedCount + pendingCount,
        publishedCount,
        pendingReviewCount: pendingCount,
        totalSales,
        totalRevenueINR: totalRevenue,
        averageRating: 4.94,
        conversionRate: '4.8%',
      },
      submissions,
    });
  } catch (error) {
    console.error('Creator Stats API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch creator stats' }, { status: 500 });
  }
}
