import { NextRequest, NextResponse } from 'next/server';
import { eprolo } from '@/lib/eprolo';

export async function POST(request: NextRequest) {
    try {
        const orderData = await request.json();
        console.log('[POST /api/orders] Creando orden en EPROLO');

        const result = await eprolo.createOrder(orderData);

        return NextResponse.json({
            success: true,
            order: result
        });
    } catch (error: any) {
        console.error('[API_ORDERS_ERROR]', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Error al crear la orden' },
            { status: 500 }
        );
    }
}
