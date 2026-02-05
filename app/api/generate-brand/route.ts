import { NextResponse } from 'next/server'
import { openai } from '@/lib/openai/client'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        const { niche } = await req.json()

        if (!niche) {
            return NextResponse.json({ error: 'El nicho es obligatorio' }, { status: 400 })
        }

        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: 'Eres un experto en branding para e-commerce y dropshipping.',
                },
                {
                    role: 'user',
                    content: `Genera 5 nombres creativos para una marca de dropshipping en el nicho de ${niche}. Los nombres deben ser cortos, memorables y no estar asociados a un producto específico. Solo devuelve los nombres en formato JSON con la estructura: { "names": ["nombre1", "nombre2", ...] }`,
                },
            ],
            response_format: { type: 'json_object' },
        })

        const content = response.choices[0].message.content
        if (!content) throw new Error('No se recibió contenido de OpenAI')

        const result = JSON.parse(content)
        return NextResponse.json(result)
    } catch (error: any) {
        console.error('[GENERATE_BRAND_ERROR]', error)
        const message = error?.message || 'Error interno del servidor'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
