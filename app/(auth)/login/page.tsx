'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { toast } from 'sonner'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            toast.error(error.message)
        } else {
            toast.success('Sesión iniciada correctamente')
            router.push('/dashboard')
            router.refresh()
        }
        setLoading(false)
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-slate-50">
            <Card className="w-full max-w-md shadow-lg border-none">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-3xl font-bold text-primary">PlanMARE</CardTitle>
                    <CardDescription>
                        Ingresa tus credenciales para acceder a tu dashboard
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleLogin}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Correo Electrónico</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="tu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Contraseña</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Button className="w-full h-11" type="submit" disabled={loading}>
                            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                        </Button>
                        <div className="text-sm text-center text-muted-foreground">
                            ¿No tienes una cuenta?{' '}
                            <Link href="/register" className="text-primary hover:underline font-medium">
                                Regístrate aquí
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
