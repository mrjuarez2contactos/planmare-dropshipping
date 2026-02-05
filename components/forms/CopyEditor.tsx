'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Sparkles, Save, Loader2, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'

interface CopyData {
    title: string
    description: string
    benefits: string[]
    faqs: { question: string; answer: string }[]
}

export const CopyEditor = ({ productId }: { productId: string }) => {
    const [loading, setLoading] = useState(false)
    const [generating, setGenerating] = useState(false)
    const [copy, setCopy] = useState<CopyData | null>(null)
    const supabase = createClient()

    useEffect(() => {
        fetchCopy()
    }, [productId])

    const fetchCopy = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('copywriting')
            .select('*')
            .eq('product_id', productId)
            .single()

        if (data) {
            setCopy({
                title: data.title,
                description: data.description,
                benefits: data.benefits || [],
                faqs: data.faqs || []
            })
        }
        setLoading(false)
    }

    const generateCopy = async () => {
        setGenerating(true)
        try {
            // Get product info first
            const { data: product } = await supabase
                .from('products')
                .select('product_name')
                .eq('id', productId)
                .single()

            if (!product) throw new Error('Producto no encontrado')

            const resp = await fetch('/api/generate-copy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productName: product.product_name })
            })

            const data = await resp.json()

            if (!resp.ok) {
                throw new Error(data.error || 'Error al generar copy')
            }

            setCopy(data)
            toast.success('Copy generado con éxito')
        } catch (err: any) {
            toast.error(err.message || 'Error al generar el copy con IA')
        } finally {
            setGenerating(false)
        }
    }

    const saveCopy = async () => {
        if (!copy) return
        setLoading(true)
        try {
            const { error } = await supabase
                .from('copywriting')
                .upsert({
                    product_id: productId,
                    title: copy.title,
                    description: copy.description,
                    benefits: copy.benefits,
                    faqs: copy.faqs,
                    updated_at: new Date().toISOString()
                }, { onConflict: 'product_id' })

            if (error) throw error
            toast.success('Cambios guardados correctamente')
        } catch (err) {
            toast.error('Error al guardar los cambios')
        } finally {
            setLoading(false)
        }
    }

    if (loading && !copy) {
        return (
            <Card className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </Card>
        )
    }

    if (!copy) {
        return (
            <Card className="text-center py-12 border-dashed">
                <CardContent className="space-y-4">
                    <Sparkles className="h-12 w-12 text-slate-300 mx-auto" />
                    <div className="space-y-1">
                        <h2 className="text-xl font-bold">Generar Copywriting</h2>
                        <p className="text-muted-foreground">Este producto no tiene textos de venta aún.</p>
                    </div>
                    <Button onClick={generateCopy} disabled={generating} className="gap-2">
                        {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                        Generar con IA
                    </Button>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="shadow-lg border-none">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl">Editor de Contenido</CardTitle>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={generateCopy} disabled={generating}>
                            {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
                            Regenerar
                        </Button>
                        <Button onClick={saveCopy} disabled={loading}>
                            <Save className="h-4 w-4 mr-2" />
                            Guardar
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="general" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-8">
                        <TabsTrigger value="general">Título y Descripción</TabsTrigger>
                        <TabsTrigger value="benefits">Beneficios</TabsTrigger>
                        <TabsTrigger value="faqs">Preguntas Frecuentes</TabsTrigger>
                    </TabsList>

                    <TabsContent value="general" className="space-y-6">
                        <div className="space-y-2">
                            <Label>Título Gancho</Label>
                            <Input
                                value={copy.title}
                                onChange={(e) => setCopy({ ...copy, title: e.target.value })}
                                placeholder="Un título irresistible..."
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Descripción Persuasiva</Label>
                            <Textarea
                                className="min-h-[200px]"
                                value={copy.description}
                                onChange={(e) => setCopy({ ...copy, description: e.target.value })}
                                placeholder="Escribe la historia de tu producto..."
                            />
                        </div>
                    </TabsContent>

                    <TabsContent value="benefits" className="space-y-4">
                        {copy.benefits.map((benefit, index) => (
                            <div key={index} className="flex gap-2">
                                <Input
                                    value={benefit}
                                    onChange={(e) => {
                                        const newBenefits = [...copy.benefits]
                                        newBenefits[index] = e.target.value
                                        setCopy({ ...copy, benefits: newBenefits })
                                    }}
                                />
                                <Button variant="ghost" size="icon" onClick={() => {
                                    const newBenefits = copy.benefits.filter((_, i) => i !== index)
                                    setCopy({ ...copy, benefits: newBenefits })
                                }}>
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                            </div>
                        ))}
                        <Button variant="outline" className="w-full border-dashed" onClick={() => {
                            setCopy({ ...copy, benefits: [...copy.benefits, "Nuevo beneficio..."] })
                        }}>
                            <Plus className="h-4 w-4 mr-2" /> Agregar Beneficio
                        </Button>
                    </TabsContent>

                    <TabsContent value="faqs" className="space-y-6">
                        {copy.faqs.map((faq, index) => (
                            <div key={index} className="space-y-2 p-4 border rounded-lg relative bg-slate-50/50">
                                <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => {
                                    const newFaqs = copy.faqs.filter((_, i) => i !== index)
                                    setCopy({ ...copy, faqs: newFaqs })
                                }}>
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                                <div className="space-y-1">
                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Pregunta</Label>
                                    <Input
                                        value={faq.question}
                                        onChange={(e) => {
                                            const newFaqs = [...copy.faqs]
                                            newFaqs[index].question = e.target.value
                                            setCopy({ ...copy, faqs: newFaqs })
                                        }}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Respuesta</Label>
                                    <Textarea
                                        value={faq.answer}
                                        onChange={(e) => {
                                            const newFaqs = [...copy.faqs]
                                            newFaqs[index].answer = e.target.value
                                            setCopy({ ...copy, faqs: newFaqs })
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                        <Button variant="outline" className="w-full border-dashed" onClick={() => {
                            setCopy({ ...copy, faqs: [...copy.faqs, { question: "Nueva pregunta...", answer: "Nueva respuesta..." }] })
                        }}>
                            <Plus className="h-4 w-4 mr-2" /> Agregar FAQ
                        </Button>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    )
}
