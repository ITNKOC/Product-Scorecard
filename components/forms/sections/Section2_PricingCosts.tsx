'use client'

import { useProductFormStore } from '@/store/productFormStore'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AIAssistanceButton } from '@/components/ui/ai-assistance-button'
import { Button } from '@/components/ui/button'
import { Plus, X } from 'lucide-react'
import { useState } from 'react'

export function Section2_PricingCosts() {
  const { formData, updateFormData } = useProductFormStore()
  const [newCompetitorPrice, setNewCompetitorPrice] = useState('')

  const addCompetitorPrice = () => {
    if (newCompetitorPrice && !isNaN(Number(newCompetitorPrice))) {
      const currentPrices = formData.competitorPrices || []
      updateFormData({ 
        competitorPrices: [...currentPrices, Number(newCompetitorPrice)] 
      })
      setNewCompetitorPrice('')
    }
  }

  const removeCompetitorPrice = (index: number) => {
    const currentPrices = formData.competitorPrices || []
    updateFormData({ 
      competitorPrices: currentPrices.filter((_, i) => i !== index) 
    })
  }

  const grossMargin = formData.unitPrice && formData.desiredSellingPrice 
    ? ((formData.desiredSellingPrice - formData.unitPrice) / formData.desiredSellingPrice * 100)
    : 0

  return (
    <div className="form-section">
      <h2 className="section-title">💰 2. Prix et Coûts</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Unit Price */}
        <div className="form-field">
          <div className="flex items-center justify-between mb-2">
            <Label htmlFor="unitPrice">Prix unitaire (CAD) *</Label>
            <AIAssistanceButton
              section="pricing"
              field="unitPrice"
              productName={formData.productName}
              category={formData.category}
            />
          </div>
          <Input
            id="unitPrice"
            type="number"
            step="0.01"
            min="0"
            value={formData.unitPrice || ''}
            onChange={(e) => updateFormData({ unitPrice: Number(e.target.value) })}
            placeholder="0.00"
            required
          />
          <p className="text-sm text-muted-foreground mt-1">
            Prix trouvé sur Alibaba ou donné par le fournisseur
          </p>
        </div>

        {/* Shipping Cost */}
        <div className="form-field">
          <div className="flex items-center justify-between mb-2">
            <Label htmlFor="shippingCost">Prix de livraison (CAD)</Label>
            <AIAssistanceButton
              section="pricing"
              field="shipping"
              productName={formData.productName}
              category={formData.category}
            />
          </div>
          <Input
            id="shippingCost"
            type="number"
            step="0.01"
            min="0"
            value={formData.shippingCost || ''}
            onChange={(e) => updateFormData({ shippingCost: Number(e.target.value) })}
            placeholder="0.00"
          />
          <p className="text-sm text-muted-foreground mt-1">
            Obtenu via devis ou simulation
          </p>
        </div>

        {/* Branding Cost */}
        <div className="form-field">
          <div className="flex items-center justify-between mb-2">
            <Label htmlFor="brandingCost">Coût du branding (CAD)</Label>
            <AIAssistanceButton
              section="pricing"
              field="branding"
              productName={formData.productName}
              category={formData.category}
            />
          </div>
          <Input
            id="brandingCost"
            type="number"
            step="0.01"
            min="0"
            value={formData.brandingCost || ''}
            onChange={(e) => updateFormData({ brandingCost: Number(e.target.value) })}
            placeholder="0.00"
          />
          <p className="text-sm text-muted-foreground mt-1">
            Coût du logo, packaging, etc.
          </p>
        </div>

        {/* Desired Selling Price */}
        <div className="form-field">
          <div className="flex items-center justify-between mb-2">
            <Label htmlFor="desiredSellingPrice">Prix de vente souhaité (CAD) *</Label>
            <AIAssistanceButton
              section="pricing"
              field="sellingPrice"
              productName={formData.productName}
              category={formData.category}
              unitPrice={formData.unitPrice}
              desiredSellingPrice={formData.desiredSellingPrice}
            />
          </div>
          <Input
            id="desiredSellingPrice"
            type="number"
            step="0.01"
            min="0"
            value={formData.desiredSellingPrice || ''}
            onChange={(e) => updateFormData({ desiredSellingPrice: Number(e.target.value) })}
            placeholder="0.00"
            required
          />
          {grossMargin > 0 && (
            <p className="text-sm text-green-600 mt-1">
              Marge brute: {grossMargin.toFixed(1)}%
            </p>
          )}
        </div>
      </div>

      {/* Competitor Prices */}
      <div className="form-field">
        <div className="flex items-center justify-between mb-2">
          <Label>Prix des concurrents (CAD)</Label>
          <AIAssistanceButton
            section="pricing"
            field="competitorPrices"
            productName={formData.productName}
            category={formData.category}
            unitPrice={formData.unitPrice}
            desiredSellingPrice={formData.desiredSellingPrice}
          />
        </div>
        
        {/* Current competitor prices */}
        {formData.competitorPrices && formData.competitorPrices.length > 0 && (
          <div className="mb-3 space-y-2">
            {formData.competitorPrices.map((price, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="text-sm px-3 py-1 bg-secondary rounded">
                  {price.toFixed(2)} CAD
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeCompetitorPrice(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Add new competitor price */}
        <div className="flex gap-2">
          <Input
            type="number"
            step="0.01"
            min="0"
            value={newCompetitorPrice}
            onChange={(e) => setNewCompetitorPrice(e.target.value)}
            placeholder="Prix concurrent..."
            className="flex-1"
          />
          <Button
            type="button"
            variant="outline"
            onClick={addCompetitorPrice}
            disabled={!newCompetitorPrice}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Prix recherchés sur Amazon, Google Shopping, etc.
        </p>
      </div>
    </div>
  )
}