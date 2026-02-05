'use client'

import { useState, useEffect, Suspense } from 'react'
import { useDebounce } from 'use-debounce'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { Package, Search, ShoppingCart, Truck, Loader2, ChevronLeft, ChevronRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'

interface Product {
    id: string
    title: string
    description: string
    price: number
    cost: number
    image: string
    images: string[]
    category: string
    sku: string
    supplier: string
    shippingInfo: {
        isFreeShipping: boolean
        deliveryTime: string
    }
    profit: string
    rating: number
    sales: number
}

export const ProductSearchForm = () => {
    const searchParams = useSearchParams()
    const projectIdParam = searchParams.get('projectId')

    const [searchTerm, setSearchTerm] = useState('')
    const [debouncedSearch] = useDebounce(searchTerm, 500)
    const [products, setProducts] = useState<Product[]>([])
    const [categories, setCategories] = useState<any[]>([])
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [loading, setLoading] = useState(false)
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)
    const [hasMore, setHasMore] = useState(false)

    const supabase = createClient()
    const router = useRouter()

    useEffect(() => {
        fetchCategories()
    }, [])

    useEffect(() => {
        searchProducts(debouncedSearch, selectedCategory, page)
    }, [debouncedSearch, selectedCategory, page])

    const fetchCategories = async () => {
        try {
            const resp = await fetch('/api/cj/categories')
            const data = await resp.json()
            if (data.success) {
                setCategories(data.categories)
            }
        } catch (err) {
            console.error('Error fetching categories:', err)
        }
    }

    const searchProducts = async (keyword: string, categoryId: string, pageNum: number) => {
        setLoading(true)
        try {
            const response = await fetch('/api/cj/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    keyword,
                    categoryId: categoryId === 'all' ? '' : categoryId,
                    pageNum,
                    pageSize: 12,
                }),
            })

            const data = await response.json()

            if (data.success) {
                setProducts(data.products)
                setTotal(data.total)
                setHasMore(data.hasMore)
            } else {
                toast.error(data.error || 'Error al buscar productos')
                setProducts([])
            }
        } catch (error: any) {
            toast.error('Error de conexión al buscar productos')
            setProducts([])
        } finally {
            setLoading(false)
        }
    }

    const selectProduct = async (product: Product) => {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return toast.error('Debes iniciar sesión')

            let projectId = projectIdParam

            if (!projectId) {
                const { data: projects, error: projectsError } = await supabase
                    .from('projects')
                    .select('id')
                    .order('created_at', { ascending: false })
                    .limit(1)

                if (projectsError) throw projectsError
                if (!projects || projects.length === 0) return toast.error('Crea un proyecto/marca primero')
                projectId = projects[0].id
            }

            const { data: newProduct, error } = await supabase.from('products').insert({
                project_id: projectId,
                product_name: product.title,
                cost_price: product.cost,
                sell_price: product.price,
                image_url: product.image,
            }).select().single()

            if (error) throw error

            toast.success(`Producto "${product.title}" añadido al proyecto`)
            router.push(`/products/${newProduct.id}`)
        } catch (err) {
            toast.error('Error al guardar el producto')
        }
    }

    return (
        <div className="space-y-6">
            <Card className="shadow-sm">
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="md:col-span-2 relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar productos ganadores (e.g. 'phone', 'pet')..."
                                className="pl-10"
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value)
                                    setPage(1)
                                }}
                            />
                        </div>
                        <Select value={selectedCategory} onValueChange={(val) => {
                            setSelectedCategory(val)
                            setPage(1)
                        }}>
                            <SelectTrigger>
                                <SelectValue placeholder="Todas las categorías" />
                            </SelectTrigger>
                            <SelectContent className="max-h-[300px]">
                                <SelectItem value="all">Todas las categorías</SelectItem>
                                {categories.map((cat: any) => (
                                    <SelectItem key={cat.categoryId} value={cat.categoryId}>
                                        {cat.categoryName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <div className="flex items-center justify-end gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                disabled={page === 1 || loading}
                                onClick={() => setPage(p => p - 1)}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <span className="text-sm font-medium">Página {page}</span>
                            <Button
                                variant="outline"
                                size="icon"
                                disabled={!hasMore || loading}
                                onClick={() => setPage(p => p + 1)}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, i) => (
                        <Card key={i} className="overflow-hidden animate-pulse">
                            <div className="aspect-square bg-slate-200" />
                            <CardHeader className="p-4 space-y-2">
                                <div className="h-4 bg-slate-200 rounded w-1/4" />
                                <div className="h-6 bg-slate-200 rounded w-3/4" />
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <div className="h-10 bg-slate-200 rounded w-full" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : products.length === 0 ? (
                <Card className="flex flex-col items-center justify-center py-20 bg-slate-50/50 border-dashed">
                    <Package className="h-16 w-16 text-slate-300 mb-4" />
                    <p className="text-xl font-medium text-slate-600">
                        {searchTerm ? 'No se encontraron productos' : 'Empieza buscando algo interesante'}
                    </p>
                    <p className="text-sm text-slate-400 mt-2">
                        Prueba con "jewelry", "beauty" o "electronics"
                    </p>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <Card key={product.id} className="overflow-hidden group flex flex-col hover:shadow-xl transition-all duration-300 border-slate-100">
                            <div className="aspect-square relative overflow-hidden bg-slate-100">
                                <img
                                    src={product.image}
                                    alt={product.title}
                                    className="object-cover w-full h-full group-hover:scale-110 transition duration-500"
                                    loading="lazy"
                                />
                                {product.shippingInfo.isFreeShipping && (
                                    <div className="absolute top-2 right-2 bg-yellow-400 text-black text-[10px] font-black px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                                        <Truck className="h-3 w-3" />
                                        FREE SHIPPING
                                    </div>
                                )}
                            </div>
                            <CardHeader className="p-4 flex-1">
                                <div className="text-[10px] text-primary font-bold mb-1 uppercase tracking-[0.2em]">
                                    {product.category}
                                </div>
                                <CardTitle className="text-sm font-bold leading-tight line-clamp-2 min-h-[2.5rem]">
                                    {product.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <div className="flex justify-between items-end border-t pt-4 border-slate-50">
                                    <div className="space-y-0.5">
                                        <p className="text-[10px] text-slate-400 uppercase font-bold">Venta Sugerida</p>
                                        <p className="text-2xl font-black text-slate-900">${product.price}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] text-green-600 font-bold uppercase">Profit</p>
                                        <p className="text-sm font-black text-green-600">+${product.profit}</p>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="p-4 pt-0">
                                <Button onClick={() => selectProduct(product)} className="w-full gap-2 bg-slate-950 hover:bg-primary transition-colors text-xs font-bold uppercase tracking-widest h-11">
                                    <ShoppingCart className="h-4 w-4" />
                                    Seleccionar
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
