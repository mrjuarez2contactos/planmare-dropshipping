import { createClient } from '@/lib/supabase/server'
import { CopyEditor } from '@/components/forms/CopyEditor'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Eye } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function ProductDetailPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const supabase = await createClient()

    const { data: product } = await supabase
        .from('products')
        .select('*, projects(brand_name)')
        .eq('id', id)
        .single()

    if (!product) {
        redirect('/dashboard')
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{product.product_name}</h1>
                        <p className="text-muted-foreground">Proyecto: {product.projects.brand_name}</p>
                    </div>
                </div>
                <Link href={`/preview?productId=${id}`}>
                    <Button variant="secondary" className="gap-2">
                        <Eye className="h-4 w-4" />
                        Ver Landing Page
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6">
                    <Card className="overflow-hidden">
                        <div className="aspect-square relative">
                            <img
                                src={product.image_url}
                                alt={product.product_name}
                                className="object-cover w-full h-full"
                            />
                        </div>
                        <CardContent className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-sm font-semibold text-muted-foreground text-muted-foreground uppercase">Precio Venta</span>
                                <span className="text-2xl font-bold text-green-600">${product.sell_price}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Costo</span>
                                <span>${product.cost_price}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-2">
                    <CopyEditor productId={id} />
                </div>
            </div>
        </div>
    )
}
