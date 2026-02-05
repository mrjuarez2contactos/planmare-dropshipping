import { NextRequest, NextResponse } from 'next/server';

const CJ_API_BASE = 'https://developers.cjdropshipping.com/api2.0/v1';
const CJ_ACCESS_TOKEN = process.env.CJ_ACCESS_TOKEN;

export async function POST(request: NextRequest) {
    try {
        const { pid } = await request.json();

        if (!CJ_ACCESS_TOKEN) {
            return NextResponse.json(
                { success: false, error: 'CJ API Token not configured' },
                { status: 500 }
            );
        }

        if (!pid) {
            return NextResponse.json(
                { success: false, error: 'Product ID is required' },
                { status: 400 }
            );
        }

        const response = await fetch(`${CJ_API_BASE}/product/query`, {
            method: 'POST',
            headers: {
                'CJ-Access-Token': CJ_ACCESS_TOKEN,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ pid }),
        });

        if (!response.ok) {
            throw new Error(`CJ API error: ${response.status}`);
        }

        const data = await response.json();

        return NextResponse.json({
            success: true,
            product: data.data,
        });
    } catch (error: any) {
        console.error('CJ Product Detail Error:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
