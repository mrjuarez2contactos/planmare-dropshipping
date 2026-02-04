'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { ChevronRight, Globe, Loader2, Sparkles } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export const BrandGeneratorForm = () => {
    const [niche, setNiche] = useState('')
    const [loading, setLoading] = useState(false)
    const [results, setResults] = useState<string[]>([])
    const supabase = createClient()
    const router = useRouter()

    const generateNames = async () => {
        if (!niche) return toast.error('Ingresa un nicho o industria')

        setLoading(true)
        setResults([])
        try {
            const resp = await fetch('/api/generate-brand', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ niche })
            })

            if (!resp.ok) throw new Error('Error al generar nombres')

            const data = await resp.json()
            setResults(data.names || [])
        } catch (err) {
            toast.error('Hubo un problema al conectar con la IA')
        } finally {
            setLoading(false)
        }
    }

    const selectBrand = async (name: string) => {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return toast.error('Debes iniciar sesión')

            const { error } = await supabase.from('projects').insert({
                user_id: user.id,
                brand_name: name,
                niche: niche,
                domain: `${name.toLowerCase().replace(/\s+/g, '')}.com`
            })

            if (error) throw error

            toast.success(`Marca "${name}" guardada con éxito`)
            router.push('/dashboard')
        } catch (err) {
            toast.error('Error al guardar la marca')
        }
    }

    return (
        <div className="space-y-8">
            <Card className="max-w-2xl mx-auto shadow-md">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-orange-500" />
                        Generador de Nombres de Marca
                    </CardTitle>
                    <CardDescription>
                        Cuéntanos sobre tu nicho y nuestra IA te sugerirá 5 nombres memorables.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4">
                        <Input
                            placeholder="Ej: Fitness para mujeres, Accesorios para mascotas..."
                            value={niche}
                            onChange={(e) => setNiche(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && generateNames()}
                        />
                        <Button onClick={generateNames} disabled={loading}>
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Generar'}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {results.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {results.map((name) => (
                        <Card key={name} className="hover:border-primary transition group">
                            <CardContent className="pt-6">
                                <h3 className="text-xl font-bold mb-2">{name}</h3>
                                <div className="text-sm text-muted-foreground flex items-center gap-1 mb-4">
                                    <Globe className="h-3 w-3" />
                                    {name.toLowerCase().replace(/\s+/g, '')}.com
                                </div>
                                <Button
                                    variant="outline"
                                    className="w-full group-hover:bg-primary group-hover:text-white transition"
                                    onClick={() => selectBrand(name)}
                                >
                                    Seleccionar Marca
                                    <ChevronRight className="h-4 w-4 ml-2" />
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
