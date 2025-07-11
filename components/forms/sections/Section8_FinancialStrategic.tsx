'use client'

import { useProductFormStore } from '@/store/productFormStore'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { AIAssistanceButton } from '@/components/ui/ai-assistance-button'

export function Section8_FinancialStrategic() {
  const { formData, updateFormData } = useProductFormStore()

  const handleInputChange = (field: string, value: any) => {
    updateFormData({ [field]: value })
  }

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">📊 8. Données Financières et Stratégiques</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gross Margin Percentage */}
        <div className="space-y-2">
          <Label htmlFor="grossMarginPercentage">
            Marge brute (%)
          </Label>
          <div className="flex gap-2">
            <Input
              id="grossMarginPercentage"
              type="number"
              step="0.1"
              min="0"
              max="100"
              value={formData.grossMarginPercentage || ''}
              onChange={(e) => handleInputChange('grossMarginPercentage', parseFloat(e.target.value) || 0)}
              placeholder="ex: 65.5"
            />
            <span className="flex items-center text-sm text-muted-foreground">%</span>
            <AIAssistanceButton 
              section="financial"
              field="grossMargin"
              productName={formData.productName}
              unitPrice={formData.unitPrice}
              desiredSellingPrice={formData.desiredSellingPrice}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            (Prix de vente - Coûts totaux) / Prix de vente × 100
          </p>
        </div>

        {/* Break Even Point */}
        <div className="space-y-2">
          <Label htmlFor="breakEvenPoint">
            Seuil de rentabilité (unités)
          </Label>
          <div className="flex gap-2">
            <Input
              id="breakEvenPoint"
              type="number"
              min="0"
              value={formData.breakEvenPoint || ''}
              onChange={(e) => handleInputChange('breakEvenPoint', parseInt(e.target.value) || 0)}
              placeholder="ex: 150"
            />
            <AIAssistanceButton 
              section="financial"
              field="breakEven"
              productName={formData.productName}
              category={formData.category}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Nombre d'unités à vendre pour couvrir les coûts fixes
          </p>
        </div>

        {/* Market Growth Rate */}
        <div className="space-y-2">
          <Label htmlFor="marketGrowthRate">
            Taux de croissance du marché (%)
          </Label>
          <div className="flex gap-2">
            <Input
              id="marketGrowthRate"
              type="number"
              step="0.1"
              value={formData.marketGrowthRate || ''}
              onChange={(e) => handleInputChange('marketGrowthRate', parseFloat(e.target.value) || 0)}
              placeholder="ex: 12.5"
            />
            <span className="flex items-center text-sm text-muted-foreground">%</span>
            <AIAssistanceButton 
              section="financial"
              field="marketGrowth"
              productName={formData.productName}
              category={formData.category}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Croissance annuelle du secteur/niche
          </p>
        </div>

        {/* Estimated Return Rate */}
        <div className="space-y-2">
          <Label htmlFor="estimatedReturnRate">
            Taux de retour estimé (%)
          </Label>
          <div className="flex gap-2">
            <Input
              id="estimatedReturnRate"
              type="number"
              step="0.1"
              min="0"
              max="100"
              value={formData.estimatedReturnRate || ''}
              onChange={(e) => handleInputChange('estimatedReturnRate', parseFloat(e.target.value) || 0)}
              placeholder="ex: 3.2"
            />
            <span className="flex items-center text-sm text-muted-foreground">%</span>
            <AIAssistanceButton 
              section="financial"
              field="returnRate"
              productName={formData.productName}
              category={formData.category}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Pourcentage de retours/remboursements prévus
          </p>
        </div>

        {/* Repurchase Frequency */}
        <div className="space-y-2">
          <Label htmlFor="repurchaseFrequency">
            Fréquence de rachat
          </Label>
          <div className="flex gap-2">
            <select
              id="repurchaseFrequency"
              value={formData.repurchaseFrequency || ''}
              onChange={(e) => handleInputChange('repurchaseFrequency', e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Sélectionner...</option>
              <option value="jamais">Jamais (achat unique)</option>
              <option value="annuel">Annuel</option>
              <option value="semestriel">Semestriel</option>
              <option value="trimestriel">Trimestriel</option>
              <option value="mensuel">Mensuel</option>
              <option value="hebdomadaire">Hebdomadaire</option>
            </select>
            <AIAssistanceButton 
              section="financial"
              field="repurchase"
              productName={formData.productName}
              category={formData.category}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            À quelle fréquence le client rachète-t-il le produit ?
          </p>
        </div>

        {/* Legal Barriers */}
        <div className="space-y-2">
          <Label htmlFor="legalBarriers">
            Barrières légales (certifications, normes)
          </Label>
          <div className="flex gap-2 items-start">
            <Textarea
              id="legalBarriers"
              value={formData.legalBarriers || ''}
              onChange={(e) => handleInputChange('legalBarriers', e.target.value)}
              placeholder="ex: Certification CE requise, normes de sécurité Santé Canada..."
              rows={3}
              className="flex-1"
            />
            <AIAssistanceButton 
              section="financial"
              field="legalBarriers"
              productName={formData.productName}
              category={formData.category}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Certifications, normes, restrictions d'importation au Canada
          </p>
        </div>

        {/* Cross-sell/Up-sell Potential */}
        <div className="space-y-2">
          <Label htmlFor="crossSellUpSellPotential">
            Potentiel de cross-selling / up-selling
          </Label>
          <div className="flex gap-2 items-start">
            <Textarea
              id="crossSellUpSellPotential"
              value={formData.crossSellUpSellPotential || ''}
              onChange={(e) => handleInputChange('crossSellUpSellPotential', e.target.value)}
              placeholder="ex: Accessoires compatibles, version premium, produits complémentaires..."
              rows={3}
              className="flex-1"
            />
            <AIAssistanceButton 
              section="financial"
              field="crossSell"
              productName={formData.productName}
              category={formData.category}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Produits complémentaires, accessoires, versions améliorées
          </p>
        </div>
      </div>
    </Card>
  )
}