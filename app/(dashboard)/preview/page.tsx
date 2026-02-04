'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { LandingPagePreview } from "@/components/preview/LandingPagePreview"
import { createClient } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'

function PreviewContent() {
    const searchParams = useSearchParams()
    const productId = searchParams.get('productId')
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(false)
    const supabase = createClient()

    useEffect(() => {
        if (productId) {
            fetchData()
        }
    }, [productId])

    const fetchData = async () => {
        setLoading(true)
        try {
            const { data: product, error: pError } = await supabase
                .from('products')
                .select('*, projects(brand_name), copywriting(*)')
                .eq('id', productId)
                .single()

            if (pError) throw pError

            if (product) {
                const copy = product.copywriting?.[0] || {
                    title: "Generando contenido...",
                    description: "Aún no has generado el copywriting para este producto.",
                    benefits: [],
                    faqs: []
                }

                setData({
                    brandName: product.projects.brand_name,
                    productName: product.product_name,
                    imageUrl: product.image_url,
                    copy: {
                        title: copy.title,
                        description: copy.description,
                        benefits: copy.benefits,
                        faqs: copy.faqs
                    }
                })
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="bg-slate-200 p-4 md:p-12 rounded-2xl overflow-hidden">
            <LandingPagePreview {...data} />
        </div>
    )
}

export default function PreviewPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Vista Previa</h1>
                <p className="text-muted-foreground underline">
                    Así es como tus clientes verán tu landing page optimizada.
                </p>
            </div>
            <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin" />}>
                <PreviewContent />
            </Suspense>
        </div>
    )
}
