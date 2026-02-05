import { NextRequest, NextResponse } from 'next/server';
import { eprolo } from '@/lib/eprolo';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search') || '';
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');

        console.log(`[GET /api/products] Iniciando búsqueda: "${search}" (Pag ${page})`);

        const data = await eprolo.searchProducts(search, page, limit);

        return NextResponse.json({
            success: true,
            ...data
        });
    } catch (error: any) {
        console.error('[API_PRODUCTS_ERROR]', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Error al buscar productos' },
            { status: 500 }
        );
    }
}
