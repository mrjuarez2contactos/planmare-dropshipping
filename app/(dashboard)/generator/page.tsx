import { BrandGeneratorForm } from "@/components/forms/BrandGeneratorForm"

export default function GeneratorPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Crea tu Marca</h1>
                <p className="text-muted-foreground">
                    Define tu nicho y deja que la IA haga el trabajo creativo.
                </p>
            </div>
            <BrandGeneratorForm />
        </div>
    )
}
