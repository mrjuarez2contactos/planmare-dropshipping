import { NextRequest, NextResponse } from 'next/server';
import { eprolo } from '@/lib/eprolo';

export async function GET(
    request: NextRequest,
      { params }: { params: Promise<{ id: string }> }
) {
    try {
            const { id } = await params;

        console.log(`[GET /api/products/${id}] Obteniendo detalles`);

        const product = await eprolo.getProductDetails(id);

        return NextResponse.json({
            success: true,
            product
        });
    } catch (error: any) {
        console.error(`[API_PRODUCT_DETAIL_ERROR] ID: ${id}`, error);
        return NextResponse.json(
            { success: false, error: error.message || 'Error al obtener detalles del producto' },
            { status: 500 }
        );
    }
}
