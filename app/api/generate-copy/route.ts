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

        const { productName } = await req.json()

        if (!productName) {
            return new NextResponse('Product name is required', { status: 400 })
        }

        const response = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [
                {
                    role: 'system',
                    content: 'Eres un experto copywriter de e-commerce. Genera contenido persuasivo para el producto indicado.',
                },
                {
                    role: 'user',
                    content: `Genera contenido persuasivo para este producto: ${productName}. 
          Devuelve en formato JSON con esta estructura:
          {
            "title": "Título gancho (máx 60 caracteres)",
            "description": "Descripción detallada (150-200 palabras)",
            "benefits": ["beneficio1", "beneficio2", "beneficio3", "beneficio4"],
            "faqs": [{"question": "pregunta", "answer": "respuesta"}]
          }`,
                },
            ],
            response_format: { type: 'json_object' },
        })

        const content = response.choices[0].message.content
        if (!content) throw new Error('No content received from OpenAI')

        const result = JSON.parse(content)
        return NextResponse.json(result)
    } catch (error) {
        console.error('[GENERATE_COPY_ERROR]', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}
