import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, Layout, Sparkles, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function DashboardPage() {
    const supabase = await createClient()

    const { data: projects } = await supabase
        .from('projects')
        .select('*, products(*)')
        .order('created_at', { ascending: false })

    const totalProjects = projects?.length || 0
    const totalProducts = projects?.reduce((acc, curr) => acc + (curr.products?.length || 0), 0) || 0

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Mi Dashboard</h1>
                    <p className="text-muted-foreground">Resumen general de tu actividad en PlanMARE.</p>
                </div>
                <Link href="/generator">
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        Nuevo Proyecto
                    </Button>
                </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Proyectos</CardTitle>
                        <Layout className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalProjects}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Productos Guardados</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalProducts}</div>
                    </CardContent>
                </Card>
            </div>

            <h2 className="text-xl font-bold mt-8">Tus Proyectos Recientes</h2>
            {totalProjects === 0 ? (
                <Card className="bg-slate-50 border-dashed border-2 flex flex-col items-center justify-center py-12">
                    <Sparkles className="h-12 w-12 text-slate-300 mb-4" />
                    <p className="text-muted-foreground">No tienes proyectos aún. ¡Crea tu primera marca!</p>
                    <Link href="/generator" className="mt-4">
                        <Button variant="outline">Empezar Ahora</Button>
                    </Link>
                </Card>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {projects?.map((project) => (
                        <Card key={project.id} className="hover:shadow-md transition">
                            <CardHeader>
                                <CardTitle>{project.brand_name}</CardTitle>
                                <p className="text-xs text-muted-foreground">{project.niche}</p>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-2 text-sm">
                                    <Package className="h-4 w-4" />
                                    {project.products?.length || 0} Productos
                                </div>
                            </CardContent>
                            <div className="p-4 pt-0 flex flex-col gap-2">
                                <Link href={`/products?projectId=${project.id}`} className="w-full">
                                    <Button variant="outline" className="w-full">Agregar Producto</Button>
                                </Link>
                                {project.products && project.products.length > 0 && (
                                    <Link href={`/products/${project.products[0].id}`} className="w-full">
                                        <Button variant="secondary" className="w-full">Editar Copy y Landing</Button>
                                    </Link>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
