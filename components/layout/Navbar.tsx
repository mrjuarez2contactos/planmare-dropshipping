'use client'

import { User } from '@supabase/supabase-js'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

interface NavbarProps {
    user: User
}

export const Navbar = ({ user }: NavbarProps) => {
    return (
        <header className="border-b bg-white px-6 py-3 flex items-center justify-between shadow-sm">
            <div className="font-semibold text-slate-700">
                Bienvenido, {user.email?.split('@')[0]}
            </div>
            <div>
                <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-primary text-white">
                        {user.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
            </div>
        </header>
    )
}
