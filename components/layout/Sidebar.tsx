'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
    LayoutDashboard,
    PlusCircle,
    Search,
    FileText,
    Eye,
    Settings,
    LogOut,
    Package
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const routes = [
    {
        label: 'Dashboard',
        icon: LayoutDashboard,
        href: '/dashboard',
        color: "text-sky-500"
    },
    {
        label: 'Mis Proyectos',
        icon: Package,
        href: '/projects',
        color: "text-violet-500",
    },
    {
        label: 'Buscador de Productos',
        icon: Search,
        href: '/products',
        color: "text-pink-700",
    },
    {
        label: 'Generador de Marca',
        icon: PlusCircle,
        href: '/generator',
        color: "text-orange-700",
    },
    {
        label: 'Preview Landing',
        icon: Eye,
        href: '/preview',
        color: "text-emerald-500",
    },
]

export const Sidebar = () => {
    const pathname = usePathname()
    const router = useRouter()
    const supabase = createClient()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/login')
        router.refresh()
    }

    return (
        <div className="space-y-4 py-4 flex flex-col h-full bg-[#111827] text-white w-64">
            <div className="px-3 py-2 flex-1">
                <Link href="/dashboard" className="flex items-center pl-3 mb-14">
                    <h1 className="text-2xl font-bold">
                        PlanMARE
                    </h1>
                </Link>
                <div className="space-y-1">
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                                pathname === route.href ? "text-white bg-white/10" : "text-zinc-400",
                            )}
                        >
                            <div className="flex items-center flex-1">
                                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                                {route.label}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            <div className="px-3 py-2">
                <button
                    onClick={handleLogout}
                    className="text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition text-zinc-400"
                >
                    <div className="flex items-center flex-1">
                        <LogOut className="h-5 w-5 mr-3 text-red-500" />
                        Cerrar Sesión
                    </div>
                </button>
            </div>
        </div>
    )
}
