'use client'

import { useProductFormStore } from '@/store/productFormStore'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { AIAssistancePanel } from '@/components/ui/ai-assistance-panel'
import { useState } from 'react'
import { HelpCircle, Plus, X, Calculator } from 'lucide-react'

export function Step2_PricingCosts() {
  const { formData, updateFormData } = useProductFormStore()
  const [activeAssistance, setActiveAssistance] = useState<string | null>(null)
  const [newCompetitorPrice, setNewCompetitorPrice] = useState('')

  const handleAssistanceClick = (field: string) => {
    setActiveAssistance(activeAssistance === field ? null : field)
  }

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

  // Calculs automatiques
  const totalCosts = (formData.unitPrice || 0) + (formData.shippingCost || 0) + (formData.brandingCost || 0)
  const grossMargin = formData.desiredSellingPrice && totalCosts 
    ? ((formData.desiredSellingPrice - totalCosts) / formData.desiredSellingPrice * 100)
    : 0
  const competitorAverage = formData.competitorPrices?.length 
    ? formData.competitorPrices.reduce((sum, price) => sum + price, 0) / formData.competitorPrices.length
    : 0

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
          💰 Prix et Coûts
        </h2>
        <p className="text-muted-foreground text-sm">
          Analysons la rentabilité et le positionnement prix de votre produit
        </p>
      </div>

      {/* Coûts de base */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Prix unitaire */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="unitPrice" className="text-sm font-medium">
              Prix unitaire (CAD) *
            </Label>
            <button
              type="button"
              onClick={() => handleAssistanceClick('unitPrice')}
              className="text-blue-500 hover:text-blue-700 transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
          <Input
            id="unitPrice"
            type="number"
            step="0.01"
            min="0"
            value={formData.unitPrice !== undefined ? formData.unitPrice : ''}
            onChange={(e) => {
              const value = e.target.value;
              updateFormData({ unitPrice: value === '' ? undefined : Number(value) });
            }}
            placeholder="Ex: 12.50"
            required
            className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-muted-foreground">
            Prix trouvé sur Alibaba ou donné par le fournisseur
          </p>
          {activeAssistance === 'unitPrice' && (
            <AIAssistancePanel
              section="pricing"
              field="unitPrice"
              context={{
                productName: formData.productName,
                category: formData.category,
                description: formData.productDescription
              }}
              onClose={() => setActiveAssistance(null)}
            />
          )}
        </div>

        {/* Prix de livraison */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="shippingCost" className="text-sm font-medium">
              Prix de livraison (CAD)
            </Label>
            <button
              type="button"
              onClick={() => handleAssistanceClick('shipping')}
              className="text-blue-500 hover:text-blue-700 transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
          <Input
            id="shippingCost"
            type="number"
            step="0.01"
            min="0"
            value={formData.shippingCost !== undefined ? formData.shippingCost : ''}
            onChange={(e) => {
              const value = e.target.value;
              updateFormData({ shippingCost: value === '' ? undefined : Number(value) });
            }}
            placeholder="Ex: 8.20"
            className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-muted-foreground">
            Obtenu via devis ou simulation d'expédition
          </p>
          {activeAssistance === 'shipping' && (
            <AIAssistancePanel
              section="pricing"
              field="shipping"
              context={{
                productName: formData.productName,
                category: formData.category,
                unitPrice: formData.unitPrice
              }}
              onClose={() => setActiveAssistance(null)}
            />
          )}
        </div>

        {/* Coût branding */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="brandingCost" className="text-sm font-medium">
              Coût du branding (CAD)
            </Label>
            <button
              type="button"
              onClick={() => handleAssistanceClick('branding')}
              className="text-blue-500 hover:text-blue-700 transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
          <Input
            id="brandingCost"
            type="number"
            step="0.01"
            min="0"
            value={formData.brandingCost !== undefined ? formData.brandingCost : ''}
            onChange={(e) => {
              const value = e.target.value;
              updateFormData({ brandingCost: value === '' ? undefined : Number(value) });
            }}
            placeholder="Ex: 3.75"
            className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-muted-foreground">
            Coût du logo, packaging, étiquetage, etc.
          </p>
          {activeAssistance === 'branding' && (
            <AIAssistancePanel
              section="pricing"
              field="branding"
              context={{
                productName: formData.productName,
                category: formData.category,
                unitPrice: formData.unitPrice
              }}
              onClose={() => setActiveAssistance(null)}
            />
          )}
        </div>

        {/* Prix de vente */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="desiredSellingPrice" className="text-sm font-medium">
              Prix de vente souhaité (CAD) *
            </Label>
            <button
              type="button"
              onClick={() => handleAssistanceClick('sellingPrice')}
              className="text-blue-500 hover:text-blue-700 transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
          <Input
            id="desiredSellingPrice"
            type="number"
            step="0.01"
            min="0"
            value={formData.desiredSellingPrice !== undefined ? formData.desiredSellingPrice : ''}
            onChange={(e) => {
              const value = e.target.value;
              updateFormData({ desiredSellingPrice: value === '' ? undefined : Number(value) });
            }}
            placeholder="Ex: 39.99"
            required
            className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
          />
          {grossMargin > 0 && (
            <div className={`text-sm mt-1 ${grossMargin >= 60 ? 'text-green-600' : grossMargin >= 40 ? 'text-orange-600' : 'text-red-600'}`}>
              <Calculator className="w-3 h-3 inline mr-1" />
              Marge brute: {grossMargin.toFixed(1)}% 
              {grossMargin >= 60 ? ' 🎉' : grossMargin >= 40 ? ' ⚠️' : ' ❌'}
            </div>
          )}
          {activeAssistance === 'sellingPrice' && (
            <AIAssistancePanel
              section="pricing"
              field="autoSellingPrice"
              context={{
                productName: formData.productName,
                category: formData.category,
                unitPrice: formData.unitPrice,
                shippingCost: formData.shippingCost,
                brandingCost: formData.brandingCost,
                totalCosts: totalCosts,
                competitorPrices: formData.competitorPrices
              }}
              onClose={() => setActiveAssistance(null)}
            />
          )}
        </div>
      </div>

      {/* Analyse concurrentielle prix */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">
            Prix des concurrents (CAD)
          </Label>
          {/* AI assistance disabled for competitor prices */}
        </div>
        
        {/* Prix existants */}
        {formData.competitorPrices && formData.competitorPrices.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
            {formData.competitorPrices.map((price, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 rounded px-3 py-2">
                <span className="text-sm font-medium">{price.toFixed(2)} CAD</span>
                <button
                  type="button"
                  onClick={() => removeCompetitorPrice(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Ajouter nouveau prix */}
        <div className="flex gap-2">
          <Input
            type="number"
            step="0.01"
            min="0"
            value={newCompetitorPrice}
            onChange={(e) => setNewCompetitorPrice(e.target.value)}
            placeholder="Ex: 34.99"
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
        
        {/* No AI assistance for competitor prices */}
      </div>

      {/* Résumé financier */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-3">📊 Résumé Financier</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-muted-foreground">Coût total</div>
            <div className="font-semibold">{totalCosts.toFixed(2)} CAD</div>
          </div>
          <div>
            <div className="text-muted-foreground">Prix de vente</div>
            <div className="font-semibold">{(formData.desiredSellingPrice || 0).toFixed(2)} CAD</div>
          </div>
          <div>
            <div className="text-muted-foreground">Marge brute</div>
            <div className={`font-semibold ${grossMargin >= 60 ? 'text-green-600' : grossMargin >= 40 ? 'text-orange-600' : 'text-red-600'}`}>
              {grossMargin.toFixed(1)}%
            </div>
          </div>
          <div>
            <div className="text-muted-foreground">Prix concurrents moy.</div>
            <div className="font-semibold">{competitorAverage.toFixed(2)} CAD</div>
          </div>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Progression de l'étape</span>
          <span className="font-medium">
            {[formData.unitPrice, formData.desiredSellingPrice]
              .filter(Boolean).length} / 2 champs obligatoires
          </span>
        </div>
        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ 
              width: `${([formData.unitPrice, formData.desiredSellingPrice]
                .filter(Boolean).length / 2) * 100}%` 
            }}
          />
        </div>
      </div>
    </div>
  )
}