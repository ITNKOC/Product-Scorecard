'use client'

import { useProductFormStore } from '@/store/productFormStore'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { AIAssistancePanel } from '@/components/ui/ai-assistance-panel'
import { useState } from 'react'
import { HelpCircle, Package, Truck, AlertTriangle, Plus, X } from 'lucide-react'

export function Step6_LogisticsStock() {
  const { formData, updateFormData } = useProductFormStore()
  const [activeAssistance, setActiveAssistance] = useState<string | null>(null)
  const [newVariant, setNewVariant] = useState('')

  const handleAssistanceClick = (field: string) => {
    setActiveAssistance(activeAssistance === field ? null : field)
  }

  const addVariant = () => {
    if (newVariant.trim()) {
      const currentVariants = formData.availableVariants || []
      updateFormData({ 
        availableVariants: [...currentVariants, newVariant.trim()] 
      })
      setNewVariant('')
    }
  }

  const removeVariant = (index: number) => {
    const currentVariants = formData.availableVariants || []
    updateFormData({ 
      availableVariants: currentVariants.filter((_, i) => i !== index) 
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
          📦 Logistique & Stock
        </h2>
        <p className="text-muted-foreground text-sm">
          Analysons les aspects logistiques et de gestion d'inventaire
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Fragilité */}
        <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-white">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-orange-500" />
              Produit fragile ? *
            </Label>
            <button
              type="button"
              onClick={() => handleAssistanceClick('fragile')}
              className="text-blue-500 hover:text-blue-700 transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => updateFormData({ isFragile: true })}
              className={`px-6 py-3 rounded-lg border text-sm font-medium transition-all duration-200 ${
                formData.isFragile === true
                  ? 'bg-orange-500 text-white border-orange-500 shadow-lg'
                  : 'border-gray-300 hover:border-orange-400 hover:bg-orange-50'
              }`}
            >
              ⚠️ Oui, fragile
            </button>
            <button
              type="button"
              onClick={() => updateFormData({ isFragile: false })}
              className={`px-6 py-3 rounded-lg border text-sm font-medium transition-all duration-200 ${
                formData.isFragile === false
                  ? 'bg-green-500 text-white border-green-500 shadow-lg'
                  : 'border-gray-300 hover:border-green-400 hover:bg-green-50'
              }`}
            >
              ✅ Non, résistant
            </button>
          </div>
          
          <p className="text-xs text-muted-foreground">
            Impact sur l'emballage, l'expédition et les retours
          </p>
          
          {activeAssistance === 'fragile' && (
            <AIAssistancePanel
              section="logistics"
              field="fragile"
              context={{
                productName: formData.productName,
                category: formData.category,
                description: formData.productDescription
              }}
              onClose={() => setActiveAssistance(null)}
            />
          )}
        </div>

        {/* Stock minimum recommandé */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="minStock" className="text-sm font-medium flex items-center gap-1">
              <Package className="w-4 h-4" />
              Stock minimum recommandé (unités)
            </Label>
            <button
              type="button"
              onClick={() => handleAssistanceClick('minStock')}
              className="text-blue-500 hover:text-blue-700 transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
          <Input
            id="minStock"
            type="number"
            min="0"
            value={formData.minimumStock !== undefined ? formData.minimumStock : ''}
            onChange={(e) => {
              const value = e.target.value;
              updateFormData({ minimumStock: value === '' ? undefined : Number(value) });
            }}
            placeholder="Ex: 100"
            className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-muted-foreground">
            Basé sur la demande estimée et les délais de réapprovisionnement
          </p>
          {activeAssistance === 'minStock' && (
            <AIAssistancePanel
              section="logistics"
              field="minStock"
              context={{
                productName: formData.productName,
                category: formData.category,
                isFragile: formData.isFragile
              }}
              onClose={() => setActiveAssistance(null)}
            />
          )}
        </div>

        {/* Délai de livraison */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="deliveryTime" className="text-sm font-medium flex items-center gap-1">
              <Truck className="w-4 h-4" />
              Délai de livraison (jours)
            </Label>
            <button
              type="button"
              onClick={() => handleAssistanceClick('deliveryTime')}
              className="text-blue-500 hover:text-blue-700 transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
          <Input
            id="deliveryTime"
            type="number"
            min="1"
            value={formData.deliveryTime !== undefined ? formData.deliveryTime : ''}
            onChange={(e) => {
              const value = e.target.value;
              updateFormData({ deliveryTime: value === '' ? undefined : Number(value) });
            }}
            placeholder="Ex: 15"
            className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-muted-foreground">
            Délai moyen de livraison au Canada depuis la commande
          </p>
          {activeAssistance === 'deliveryTime' && (
            <AIAssistancePanel
              section="logistics"
              field="deliveryTime"
              context={{
                productName: formData.productName,
                category: formData.category,
                isFragile: formData.isFragile
              }}
              onClose={() => setActiveAssistance(null)}
            />
          )}
        </div>

        {/* Coût de stockage */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="storageCost" className="text-sm font-medium">
              Coût de stockage mensuel (CAD/unité)
            </Label>
            <button
              type="button"
              onClick={() => handleAssistanceClick('storageCost')}
              className="text-blue-500 hover:text-blue-700 transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
          <Input
            id="storageCost"
            type="number"
            step="0.01"
            min="0"
            value={formData.storageCostPerUnit !== undefined ? formData.storageCostPerUnit : ''}
            onChange={(e) => {
              const value = e.target.value;
              updateFormData({ storageCostPerUnit: value === '' ? undefined : Number(value) });
            }}
            placeholder="Ex: 0.25"
            className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-muted-foreground">
            Coût estimé de stockage par unité par mois (entrepôt, assurance, etc.)
          </p>
          {activeAssistance === 'storageCost' && (
            <AIAssistancePanel
              section="logistics"
              field="storageCost"
              context={{
                productName: formData.productName,
                category: formData.category,
                minimumStock: formData.minimumStock
              }}
              onClose={() => setActiveAssistance(null)}
            />
          )}
        </div>
      </div>

      {/* Variantes disponibles */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">
            Variantes disponibles *
          </Label>
          <button
            type="button"
            onClick={() => handleAssistanceClick('variants')}
            className="text-blue-500 hover:text-blue-700 transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
        
        {/* Variantes existantes */}
        {formData.availableVariants && formData.availableVariants.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3">
            {formData.availableVariants.map((variant, index) => (
              <div key={index} className="flex items-center justify-between bg-blue-50 rounded px-3 py-2">
                <span className="text-sm font-medium">{variant}</span>
                <button
                  type="button"
                  onClick={() => removeVariant(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Ajouter nouvelle variante */}
        <div className="flex gap-2">
          <Input
            value={newVariant}
            onChange={(e) => setNewVariant(e.target.value)}
            placeholder="Ex: Noir, Blanc, Taille S, etc."
            className="flex-1"
          />
          <Button
            type="button"
            variant="outline"
            onClick={addVariant}
            disabled={!newVariant.trim()}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        <p className="text-xs text-muted-foreground">
          Couleurs, tailles, modèles ou autres variantes du produit
        </p>
        
        {activeAssistance === 'variants' && (
          <AIAssistancePanel
            section="logistics"
            field="variants"
            context={{
              productName: formData.productName,
              category: formData.category,
              description: formData.productDescription
            }}
            onClose={() => setActiveAssistance(null)}
          />
        )}
      </div>

      {/* Résumé logistique */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
        <h3 className="font-medium text-purple-900 mb-3 flex items-center gap-2">
          🚚 Résumé Logistique
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <div className="text-lg mb-1">
              {formData.isFragile === true ? '⚠️' : formData.isFragile === false ? '✅' : '❓'}
            </div>
            <div className="font-semibold text-gray-700">Fragilité</div>
            <div className="text-muted-foreground">
              {formData.isFragile === true ? 'Fragile' : formData.isFragile === false ? 'Résistant' : 'Non défini'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-lg mb-1">📦</div>
            <div className="font-semibold text-gray-700">Stock min.</div>
            <div className="text-muted-foreground">
              {formData.minimumStock ? `${formData.minimumStock} unités` : 'Non défini'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-lg mb-1">🚛</div>
            <div className="font-semibold text-gray-700">Livraison</div>
            <div className="text-muted-foreground">
              {formData.deliveryTime ? `${formData.deliveryTime} jours` : 'Non défini'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-lg mb-1">🎨</div>
            <div className="font-semibold text-gray-700">Variantes</div>
            <div className="text-muted-foreground">
              {formData.availableVariants?.length || 0} options
            </div>
          </div>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Progression de l'étape</span>
          <span className="font-medium">
            {[formData.isFragile, formData.availableVariants?.length ? true : false]
              .filter(Boolean).length} / 2 champs obligatoires
          </span>
        </div>
        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ 
              width: `${([formData.isFragile, formData.availableVariants?.length ? true : false]
                .filter(Boolean).length / 2) * 100}%` 
            }}
          />
        </div>
      </div>
    </div>
  )
}