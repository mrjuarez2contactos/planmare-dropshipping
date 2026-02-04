'use client'

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { CheckCircle2, Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface LandingPagePreviewProps {
    brandName?: string
    productName?: string
    imageUrl?: string
    copy?: {
        title: string
        description: string
        benefits: string[]
        faqs: { question: string; answer: string }[]
    }
}

export const LandingPagePreview = ({
    brandName = "Tu Marca IA",
    productName = "Reloj Inteligente Ultra",
    imageUrl = "https://images.unsplash.com/photo-1544117518-30df57809ca7?w=800&q=80",
    copy = {
        title: "El producto que revolucionará tu estilo de vida",
        description: "Diseñado con la tecnología más avanzada de 2026, este producto combina elegancia y funcionalidad para ofrecerte una experiencia única que no encontrarás en ningún otro lugar.",
        benefits: [
            "Materiales premium ultra duraderos",
            "Diseño ergonómico y estilizado",
            "Batería de larga duración",
            "Envío express 24-48 horas gratis"
        ],
        faqs: [
            { question: "¿Tienen envíos a todo el país?", answer: "Sí, realizamos envíos gratis a nivel nacional con seguimiento en tiempo real." },
            { question: "¿Cuál es la política de devolución?", answer: "Tienes 30 días para probarlo. Si no te gusta, te devolvemos tu dinero sin preguntas." },
            { question: "¿Es compatible con todos los dispositivos?", answer: "Totalmente compatible con iOS, Android y sistemas de escritorio." }
        ]
    }
}: LandingPagePreviewProps) => {
    return (
        <div className="bg-white text-slate-900 font-sans min-h-screen border rounded-xl overflow-hidden shadow-2xl mx-auto max-w-7xl">
            {/* Header */}
            <nav className="flex items-center justify-between p-4 md:p-6 border-b sticky top-0 bg-white/80 backdrop-blur-md z-50">
                <div className="text-2xl font-black tracking-tighter text-primary">{brandName.toUpperCase()}</div>
                <div className="hidden md:flex gap-8 items-center font-medium">
                    <p className="hover:text-primary cursor-pointer">Beneficios</p>
                    <p className="hover:text-primary cursor-pointer">Reviews</p>
                    <p className="hover:text-primary cursor-pointer">Preguntas</p>
                    <Button className="bg-black hover:bg-slate-800 text-white rounded-full px-6">Comprar Ahora</Button>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 p-8 md:p-20 items-center">
                <div className="space-y-8 animate-in fade-in slide-in-from-left duration-700">
                    <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-primary/10 text-primary border-transparent">
                        🔥 MÁS VENDIDO ESTA SEMANA
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.1] tracking-tight text-slate-900">
                        {copy.title}
                    </h1>
                    <p className="text-xl text-slate-500 leading-relaxed max-w-xl">
                        {copy.description}
                    </p>
                    <div className="flex flex-col gap-6">
                        <Button size="lg" className="bg-primary hover:bg-primary/90 text-white text-xl h-20 rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all">
                            QUIERO COMPRAR AHORA
                        </Button>
                        <div className="flex items-center gap-4">
                            <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>
                            <p className="font-semibold text-slate-600">4.9/5 <span className="text-slate-400 font-normal ml-1">(+2.5k Ventas)</span></p>
                        </div>
                    </div>
                </div>
                <div className="relative group perspective-1000 animate-in zoom-in duration-700">
                    <div className="absolute -inset-4 bg-gradient-to-tr from-primary to-violet-600 rounded-[3rem] blur-2xl opacity-20 group-hover:opacity-30 transition duration-1000"></div>
                    <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl border bg-slate-100">
                        <img src={imageUrl} alt={productName} className="object-cover w-full h-full" />
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="bg-slate-50 py-24 px-8 md:px-20">
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                    <h2 className="text-4xl font-bold tracking-tight">Imprescindible para tu {brandName}</h2>
                    <p className="text-slate-500 text-lg">Hemos cuidado cada detalle para ofrecerte la máxima excelencia tecnológica.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {copy.benefits.map((benefit, i) => (
                        <Card key={i} className="border-none shadow-md hover:shadow-xl transition-shadow bg-white rounded-3xl overflow-hidden group">
                            <CardContent className="p-8">
                                <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                                    <CheckCircle2 className="h-8 w-8" />
                                </div>
                                <p className="font-bold text-xl leading-snug">{benefit}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* FAQs Section */}
            <section className="py-24 px-8 md:px-20 max-w-4xl mx-auto">
                <h2 className="text-4xl font-bold text-center mb-16 underline decoration-primary/30 underline-offset-8">Preguntas Frecuentes</h2>
                <Accordion type="single" collapsible className="w-full space-y-4">
                    {copy.faqs.map((faq, i) => (
                        <AccordionItem key={i} value={`item-${i}`} className="border rounded-2xl px-6 bg-white shadow-sm">
                            <AccordionTrigger className="text-left font-bold text-lg hover:no-underline py-6">
                                {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-slate-500 text-lg leading-relaxed pb-6">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </section>

            {/* Final CTA */}
            <section className="bg-primary py-20 px-8 text-center text-white">
                <div className="max-w-2xl mx-auto space-y-8">
                    <h2 className="text-4xl md:text-5xl font-black">¿Listo para mejorar tu vida?</h2>
                    <p className="text-primary-foreground/80 text-lg">Únete a miles de clientes satisfechos que ya disfrutan de {productName}.</p>
                    <Button size="lg" className="bg-white text-primary hover:bg-slate-100 text-xl font-bold px-12 h-16 rounded-full shadow-2xl">
                        ¡SÍ, LO QUIERO COMPRAR!
                    </Button>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-950 text-white py-16 px-8 text-center text-sm border-t border-white/5">
                <div className="max-w-4xl mx-auto space-y-8">
                    <div className="text-3xl font-black tracking-tighter text-primary italic italic">{brandName.toUpperCase()}</div>
                    <p className="text-slate-500 max-w-md mx-auto">La marca número uno en innovación y confianza para tu hogar y estilo de vida profesional.</p>
                    <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-slate-400 font-medium">
                        <p className="hover:text-white cursor-pointer">Privacidad</p>
                        <p className="hover:text-white cursor-pointer">Términos</p>
                        <p className="hover:text-white cursor-pointer">Envíos</p>
                        <p className="hover:text-white cursor-pointer">Contacto</p>
                    </div>
                    <div className="pt-8 border-t border-white/5">
                        <p className="text-slate-600">© 2026 {brandName}. Desarrollado con ❤️ para dropshippers.</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}
