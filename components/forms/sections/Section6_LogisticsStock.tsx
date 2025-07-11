'use client'

import { useProductFormStore } from '@/store/productFormStore'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'

export function Section6_LogisticsStock() {
  const { formData, updateFormData } = useProductFormStore()

  const handleInputChange = (field: string, value: any) => {
    updateFormData({ [field]: value })
  }

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">📦 6. Logistique & Stock</h3>
        <p className="text-sm text-muted-foreground">Informations techniques et logistiques</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Weight */}
        <div className="space-y-2">
          <Label htmlFor="productWeight">
            Poids du produit (kg)
          </Label>
          <Input
            id="productWeight"
            type="number"
            step="0.01"
            min="0"
            value={formData.storageCostPerUnit || ''}
            onChange={(e) => handleInputChange('storageCostPerUnit', parseFloat(e.target.value) || 0)}
            placeholder="ex: 0.5"
          />
          <p className="text-sm text-muted-foreground">
            Poids unitaire du produit emballé
          </p>
        </div>

        {/* Product Dimensions */}
        <div className="space-y-2">
          <Label htmlFor="productDimensions">
            Dimensions (L x l x H)
          </Label>
          <Input
            id="productDimensions"
            type="text"
            value={(formData as any).productDimensions || ''}
            onChange={(e) => handleInputChange('productDimensions', e.target.value)}
            placeholder="ex: 25 x 15 x 8 cm"
          />
          <p className="text-sm text-muted-foreground">
            Dimensions du produit emballé
          </p>
        </div>

        {/* Restock Delay */}
        <div className="space-y-2">
          <Label htmlFor="restockDelay">
            Délai de réassort (jours)
          </Label>
          <Input
            id="restockDelay"
            type="number"
            min="0"
            value={formData.restockDelay || ''}
            onChange={(e) => handleInputChange('restockDelay', parseInt(e.target.value) || 0)}
            placeholder="ex: 30"
          />
          <p className="text-sm text-muted-foreground">
            Temps entre commande et réception chez vous
          </p>
        </div>

        {/* Is Fragile */}
        <div className="space-y-2">
          <Label htmlFor="isFragile">
            Produit fragile ?
          </Label>
          <select
            id="isFragile"
            value={formData.isFragile ? 'true' : 'false'}
            onChange={(e) => handleInputChange('isFragile', e.target.value === 'true')}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="false">Non</option>
            <option value="true">Oui</option>
          </select>
          <p className="text-sm text-muted-foreground">
            Nécessite-t-il un emballage spécial ?
          </p>
        </div>

        {/* Available Variants */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="availableVariants">
            Variantes disponibles
          </Label>
          <Input
            id="availableVariants"
            type="text"
            value={formData.availableVariants || ''}
            onChange={(e) => handleInputChange('availableVariants', e.target.value)}
            placeholder="ex: 3 couleurs (noir, blanc, rouge), 2 tailles (M, L)"
          />
          <p className="text-sm text-muted-foreground">
            Couleurs, tailles, modèles disponibles chez le fournisseur
          </p>
        </div>
      </div>
    </Card>
  )
}