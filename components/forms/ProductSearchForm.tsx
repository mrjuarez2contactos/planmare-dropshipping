'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { Package, Search, ShoppingCart, Truck } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const MOCK_PRODUCTS = [
    {
        id: '1',
        name: 'Reloj Inteligente Ultra Pro',
        category: 'Salud',
        cost: 15.50,
        sell: 39.99,
        image: 'https://images.unsplash.com/photo-1544117518-30df57809ca7?w=500&q=80',
        fastShipping: true
    },
    {
        id: '2',
        name: 'Set de Maquillaje Profesional',
        category: 'Belleza',
        cost: 12.00,
        sell: 29.99,
        image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500&q=80',
        fastShipping: false
    },
    {
        id: '3',
        name: 'Lámpara LED Minimalista',
        category: 'Hogar',
        cost: 8.90,
        sell: 22.50,
        image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&q=80',
        fastShipping: true
    },
    {
        id: '4',
        name: 'Difusor de Aromas Ultrasónico',
        category: 'Hogar',
        cost: 10.50,
        sell: 25.99,
        image: 'https://images.unsplash.com/photo-1602928321679-560bb453f190?w=500&q=80',
        fastShipping: true
    },
    {
        id: '5',
        name: 'Depiladora Laser Portátil',
        category: 'Belleza',
        cost: 25.00,
        sell: 65.00,
        image: 'https://images.unsplash.com/photo-1559594411-6834468f9b90?w=500&q=80',
        fastShipping: false
    }
]

export const ProductSearchForm = () => {
    const [search, setSearch] = useState('')
    const [category, setCategory] = useState('all')
    const supabase = createClient()
    const router = useRouter()

    const filteredProducts = MOCK_PRODUCTS.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase())
        const matchesCategory = category === 'all' || p.category.toLowerCase() === category.toLowerCase()
        return matchesSearch && matchesCategory
    })

    const selectProduct = async (product: typeof MOCK_PRODUCTS[0]) => {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return toast.error('Debes iniciar sesión')

            const { data: projects, error: projectsError } = await supabase
                .from('projects')
                .select('id')
                .order('created_at', { ascending: false })
                .limit(1)

            if (projectsError) throw projectsError
            if (!projects || projects.length === 0) return toast.error('Crea un proyecto/marca primero')

            const { data: newProduct, error } = await supabase.from('products').insert({
                project_id: projects[0].id,
                product_name: product.name,
                cost_price: product.cost,
                sell_price: product.sell,
                image_url: product.image,
            }).select().single()

            if (error) throw error

            toast.success(`Producto "${product.name}" añadido al proyecto`)
            router.push(`/products/${newProduct.id}`)
        } catch (err) {
            toast.error('Error al guardar el producto')
        }
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2 relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar productos ganadores..."
                                className="pl-10"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <Select value={category} onValueChange={setCategory}>
                            <SelectTrigger>
                                <SelectValue placeholder="Categoría" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todas las categorías</SelectItem>
                                <SelectItem value="salud">Salud</SelectItem>
                                <SelectItem value="belleza">Belleza</SelectItem>
                                <SelectItem value="hogar">Hogar</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                    <Card key={product.id} className="overflow-hidden group">
                        <div className="aspect-square relative overflow-hidden">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="object-cover w-full h-full group-hover:scale-105 transition duration-300"
                            />
                            {product.fastShipping && (
                                <div className="absolute top-2 right-2 bg-yellow-400 text-black text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1">
                                    <Truck className="h-3 w-3" />
                                    ENVÍO RÁPIDO
                                </div>
                            )}
                        </div>
                        <CardHeader className="p-4">
                            <div className="text-xs text-primary font-semibold mb-1 uppercase tracking-wider">
                                {product.category}
                            </div>
                            <CardTitle className="text-lg leading-tight">{product.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <div className="flex justify-between items-end">
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground">Precio de costo: ${product.cost}</p>
                                    <p className="text-xl font-bold text-green-600">${product.sell}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] text-muted-foreground uppercase">Profit Sugerido</p>
                                    <p className="text-sm font-semibold text-slate-700">${(product.sell - product.cost).toFixed(2)}</p>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="p-4 pt-0">
                            <Button onClick={() => selectProduct(product)} className="w-full gap-2">
                                <ShoppingCart className="h-4 w-4" />
                                Seleccionar Producto
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}
