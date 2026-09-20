import { NextRequest, NextResponse } from 'next/server';
import { getUIProducts } from '@/lib/services/marketplace';
import { MarketplaceFilterOptions } from '@/types/marketplace';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const options: MarketplaceFilterOptions = {
      search: searchParams.get('search') || undefined,
      category: searchParams.get('category') || undefined,
      technology: searchParams.get('technology') || undefined,
      priceRange: (searchParams.get('priceRange') as MarketplaceFilterOptions['priceRange']) || 'all',
      sortBy: (searchParams.get('sortBy') as MarketplaceFilterOptions['sortBy']) || 'popular',
      featuredOnly: searchParams.get('featured') === 'true',
      trendingOnly: searchParams.get('trending') === 'true',
      page: parseInt(searchParams.get('page') || '1', 10),
      limit: parseInt(searchParams.get('limit') || '50', 10),
    };

    const result = await getUIProducts(options);
    return NextResponse.json(result);
  } catch (error) {
    console.error('API /api/marketplace/products error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch UI products' },
      { status: 500 }
    );
  }
}
