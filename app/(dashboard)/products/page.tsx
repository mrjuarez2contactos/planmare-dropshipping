import { ProductSearchForm } from "@/components/forms/ProductSearchForm"

export default function ProductsPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Buscar Productos</h1>
                <p className="text-muted-foreground">
                    Encuentra los productos ganadores para tu marca y agrégalos a tu inventario.
                </p>
            </div>
            <ProductSearchForm />
        </div>
    )
}
