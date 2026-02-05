import { NextResponse } from 'next/server';

const CJ_API_BASE = 'https://developers.cjdropshipping.com/api2.0/v1';
const CJ_ACCESS_TOKEN = process.env.CJ_ACCESS_TOKEN;

export async function GET() {
    try {
        if (!CJ_ACCESS_TOKEN) {
            return NextResponse.json(
                { success: false, error: 'CJ API Token not configured' },
                { status: 500 }
            );
        }

        const response = await fetch(`${CJ_API_BASE}/product/getCategory`, {
            headers: {
                'CJ-Access-Token': CJ_ACCESS_TOKEN,
            },
        });

        if (!response.ok) {
            throw new Error(`CJ API error: ${response.status}`);
        }

        const data = await response.json();

        return NextResponse.json({
            success: true,
            categories: data.data || [],
        });
    } catch (error: any) {
        console.error('CJ Categories Error:', error);
        return NextResponse.json(
            { success: false, error: error.message, categories: [] },
            { status: 500 }
        );
    }
}
