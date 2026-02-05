import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Package, Plus, Layout, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function ProjectsPage() {
    const supabase = await createClient()

    const { data: projects } = await supabase
        .from('projects')
        .select('*, products(id)')
        .order('created_at', { ascending: false })

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Mis Proyectos</h1>
                    <p className="text-muted-foreground">Gestiona todas tus marcas y tiendas desde aquí.</p>
                </div>
                <Link href="/generator">
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        Nuevo Proyecto
                    </Button>
                </Link>
            </div>

            {projects?.length === 0 ? (
                <Card className="bg-slate-50 border-dashed border-2 flex flex-col items-center justify-center py-20">
                    <Layout className="h-12 w-12 text-slate-300 mb-4" />
                    <p className="text-muted-foreground">Aún no has creado ningún proyecto.</p>
                    <Link href="/generator" className="mt-4">
                        <Button>Empezar ahora</Button>
                    </Link>
                </Card>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {projects?.map((project) => (
                        <Card key={project.id} className="hover:shadow-md transition group">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-xl group-hover:text-primary transition-colors">
                                            {project.brand_name}
                                        </CardTitle>
                                        <CardDescription className="line-clamp-1">{project.niche}</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <Package className="h-4 w-4" />
                                        {project.products?.length || 0} Productos
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-4 w-4" />
                                        {new Date(project.created_at).toLocaleDateString()}
                                    </div>
                                </div>
                                <div className="pt-2 flex flex-col gap-2">
                                    <Link href={`/products?projectId=${project.id}`}>
                                        <Button variant="outline" className="w-full">Agregar Producto</Button>
                                    </Link>
                                    <Link href="/dashboard">
                                        <Button variant="secondary" className="w-full">Ver en Dashboard</Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
