import { NextRequest, NextResponse } from 'next/server';

const CJ_API_BASE = 'https://developers.cjdropshipping.com/api2.0/v1';
const CJ_ACCESS_TOKEN = process.env.CJ_ACCESS_TOKEN;

export async function POST(request: NextRequest) {
    try {
        const { keyword, categoryId, pageNum = 1, pageSize = 20 } = await request.json();

        if (!CJ_ACCESS_TOKEN) {
            return NextResponse.json(
                { success: false, error: 'CJ API Token not configured' },
                { status: 500 }
            );
        }

        // Buscar productos en CJ Dropshipping
        const response = await fetch(`${CJ_API_BASE}/product/list`, {
            method: 'POST',
            headers: {
                'CJ-Access-Token': CJ_ACCESS_TOKEN,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                keyword,
                categoryId,
                pageNum,
                pageSize,
            }),
        });

        if (!response.ok) {
            throw new Error(`CJ API error: ${response.status}`);
        }

        const data = await response.json();

        // Verificar si la respuesta fue exitosa
        if (data.code !== 200 && data.code !== undefined) {
            throw new Error(data.message || 'CJ API returned an error');
        }

        // Transformar datos al formato de tu app
        const products = data.data?.list?.map((product: any) => ({
            id: product.pid,
            title: product.productNameEn || product.productName,
            description: product.description || '',
            price: parseFloat(product.sellPrice) || 0,
            cost: parseFloat(product.productPriceOriginal) || 0,
            image: product.productImage,
            images: [
                product.productImage,
                ...(product.productImages || []).slice(0, 4)
            ].filter(Boolean),
            category: product.categoryName || 'General',
            sku: product.productSku,
            supplier: 'CJ Dropshipping',
            shippingInfo: {
                isFreeShipping: product.isFreeShipping || false,
                deliveryTime: product.deliverTime || 'N/A',
            },
            profit: (parseFloat(product.sellPrice || 0) - parseFloat(product.productPriceOriginal || 0)).toFixed(2),
            rating: 4.5, // CJ no proporciona ratings en la API básica
            sales: Math.floor(Math.random() * 1000) + 100, // Placeholder
            sourceUrl: product.sourceUrl || '',
        })) || [];

        return NextResponse.json({
            success: true,
            products,
            total: data.data?.total || 0,
            page: pageNum,
            pageSize: pageSize,
            hasMore: (data.data?.total || 0) > pageNum * pageSize,
        });

    } catch (error: any) {
        console.error('CJ API Error:', error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Error fetching products from CJ',
                products: [],
                total: 0
            },
            { status: 500 }
        );
    }
}
