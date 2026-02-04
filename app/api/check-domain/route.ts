import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    const { domain } = await req.json()

    // Mock domain check
    // Randomly return available true/false
    const available = Math.random() > 0.3

    return NextResponse.json({ available })
}
