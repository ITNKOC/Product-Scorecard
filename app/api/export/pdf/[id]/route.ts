import { NextRequest, NextResponse } from 'next/server';

// This ensures the route is only executed during actual HTTP requests
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Lazy load Prisma to avoid build-time execution
    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient()
    
    // Fetch the analysis with user and reports
    const analysis = await prisma.productAnalysis.findUnique({
      where: { id },
      include: {
        user: true,
        analysisReports: true
      }
    });

    if (!analysis) {
      await prisma.$disconnect()
      return NextResponse.json({ error: 'Analysis not found' }, { status: 404 });
    }

    // Calculate gross margin
    const totalCost = (analysis.unitPrice || 0) + (analysis.shippingCost || 0) + (analysis.brandingCost || 0);
    const sellingPrice = analysis.desiredSellingPrice || 0;
    const grossMarginPercentage = sellingPrice > 0 ? ((sellingPrice - totalCost) / sellingPrice) * 100 : 0;

    const analysisWithMargin = {
      ...analysis,
      grossMarginPercentage: Math.max(0, grossMarginPercentage)
    };

    await prisma.$disconnect()
    return NextResponse.json(analysisWithMargin);
  } catch (error) {
    console.error('Error fetching analysis for PDF:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}