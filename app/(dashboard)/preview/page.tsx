import { LandingPagePreview } from "@/components/preview/LandingPagePreview"

export default function PreviewPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Vista Previa</h1>
                <p className="text-muted-foreground underline">
                    Así es como tus clientes verán tu landing page optimizada.
                </p>
            </div>
            <div className="bg-slate-200 p-4 md:p-12 rounded-2xl overflow-hidden">
                <LandingPagePreview />
            </div>
        </div>
    )
}
