'use client'

import { useProductFormStore } from '@/store/productFormStore'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AIAssistancePanel } from '@/components/ui/ai-assistance-panel'
import { useState } from 'react'
import { HelpCircle, TrendingUp, DollarSign, AlertCircle, BarChart3 } from 'lucide-react'

export function Step8_FinancialStrategic() {
  const { formData, updateFormData } = useProductFormStore()
  const [activeAssistance, setActiveAssistance] = useState<string | null>(null)

  const handleAssistanceClick = (field: string) => {
    setActiveAssistance(activeAssistance === field ? null : field)
  }

  const getGrowthLevel = (rate: number) => {
    if (rate >= 15) return { label: 'Très forte', color: 'text-green-600', icon: '🚀' }
    if (rate >= 10) return { label: 'Forte', color: 'text-blue-600', icon: '📈' }
    if (rate >= 5) return { label: 'Modérée', color: 'text-orange-600', icon: '📊' }
    return { label: 'Faible/Stable', color: 'text-red-600', icon: '📉' }
  }

  const getBarrierLevel = (level: number) => {
    if (level <= 2) return { label: 'Faibles', color: 'text-green-600', icon: '✅' }
    if (level <= 3) return { label: 'Modérées', color: 'text-orange-600', icon: '⚠️' }
    return { label: 'Élevées', color: 'text-red-600', icon: '❌' }
  }

  const growthInfo = formData.marketGrowthRate ? getGrowthLevel(formData.marketGrowthRate) : null
  const barrierInfo = formData.legalBarriersLevel ? getBarrierLevel(formData.legalBarriersLevel) : null

  // Calculs automatiques
  const totalInvestment = (formData.initialInvestment || 0) + (formData.marketingBudget || 0)
  const monthlyFixedCosts = (formData.storageCostPerUnit || 0) * (formData.minimumStock || 0)
  const grossMargin = formData.desiredSellingPrice && formData.unitPrice 
    ? ((formData.desiredSellingPrice - formData.unitPrice) / formData.desiredSellingPrice * 100)
    : 0

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
          💼 Données Financières & Stratégiques
        </h2>
        <p className="text-muted-foreground text-sm">
          Finalisonsons l'analyse avec les aspects financiers et réglementaires
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Taux de croissance du marché */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="marketGrowth" className="text-sm font-medium flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              Taux de croissance du marché (% annuel) *
            </Label>
            <button
              type="button"
              onClick={() => handleAssistanceClick('marketGrowth')}
              className="text-blue-500 hover:text-blue-700 transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
          <Input
            id="marketGrowth"
            type="number"
            step="0.1"
            value={formData.marketGrowthRate !== undefined ? formData.marketGrowthRate : ''}
            onChange={(e) => {
              const value = e.target.value;
              updateFormData({ marketGrowthRate: value === '' ? undefined : Number(value) });
            }}
            placeholder="Ex: 12.5"
            required
            className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
          />
          {growthInfo && (
            <div className={`text-sm ${growthInfo.color} flex items-center gap-1`}>
              <span>{growthInfo.icon}</span>
              Croissance {growthInfo.label.toLowerCase()} ({formData.marketGrowthRate}% /an)
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            Croissance annuelle du marché de votre catégorie au Canada
          </p>
          {activeAssistance === 'marketGrowth' && (
            <AIAssistancePanel
              section="financial"
              field="marketGrowth"
              context={{
                productName: formData.productName,
                category: formData.category,
                googleTrends: formData.googleTrends12MonthAverage
              }}
              onClose={() => setActiveAssistance(null)}
            />
          )}
        </div>

        {/* Investissement initial */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="initialInvestment" className="text-sm font-medium flex items-center gap-1">
              <DollarSign className="w-4 h-4" />
              Investissement initial (CAD)
            </Label>
            <button
              type="button"
              onClick={() => handleAssistanceClick('initialInvestment')}
              className="text-blue-500 hover:text-blue-700 transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
          <Input
            id="initialInvestment"
            type="number"
            min="0"
            value={formData.initialInvestment !== undefined ? formData.initialInvestment : ''}
            onChange={(e) => {
              const value = e.target.value;
              updateFormData({ initialInvestment: value === '' ? undefined : Number(value) });
            }}
            placeholder="Ex: 5000"
            className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-muted-foreground">
            Premier stock + frais de lancement + outils nécessaires
          </p>
          {activeAssistance === 'initialInvestment' && (
            <AIAssistancePanel
              section="financial"
              field="initialInvestment"
              context={{
                productName: formData.productName,
                unitPrice: formData.unitPrice,
                minimumStock: formData.minimumStock
              }}
              onClose={() => setActiveAssistance(null)}
            />
          )}
        </div>

        {/* Budget marketing */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="marketingBudget" className="text-sm font-medium flex items-center gap-1">
              <BarChart3 className="w-4 h-4" />
              Budget marketing mensuel (CAD)
            </Label>
            <button
              type="button"
              onClick={() => handleAssistanceClick('marketingBudget')}
              className="text-blue-500 hover:text-blue-700 transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
          <Input
            id="marketingBudget"
            type="number"
            min="0"
            value={formData.marketingBudget !== undefined ? formData.marketingBudget : ''}
            onChange={(e) => {
              const value = e.target.value;
              updateFormData({ marketingBudget: value === '' ? undefined : Number(value) });
            }}
            placeholder="Ex: 1500"
            className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-muted-foreground">
            Budget prévu pour Facebook Ads, Google Ads, influenceurs, etc.
          </p>
          {activeAssistance === 'marketingBudget' && (
            <AIAssistancePanel
              section="financial"
              field="marketingBudget"
              context={{
                productName: formData.productName,
                category: formData.category,
                competitionLevel: formData.competitionLevel,
                desiredSellingPrice: formData.desiredSellingPrice
              }}
              onClose={() => setActiveAssistance(null)}
            />
          )}
        </div>

        {/* Barrières légales */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="legalBarriers" className="text-sm font-medium flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              Niveau des barrières légales/réglementaires
            </Label>
            <button
              type="button"
              onClick={() => handleAssistanceClick('legalBarriers')}
              className="text-blue-500 hover:text-blue-700 transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-3">
            {[
              { value: 1, label: 'Très faibles (aucune certification requise)', color: 'bg-green-500' },
              { value: 2, label: 'Faibles (certifications simples)', color: 'bg-blue-500' },
              { value: 3, label: 'Modérées (quelques certifications)', color: 'bg-yellow-500' },
              { value: 4, label: 'Élevées (certifications complexes)', color: 'bg-orange-500' },
              { value: 5, label: 'Très élevées (réglementation stricte)', color: 'bg-red-500' }
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => updateFormData({ legalBarriersLevel: option.value })}
                className={`w-full p-3 text-left rounded-lg border transition-all duration-200 ${
                  formData.legalBarriersLevel === option.value
                    ? `${option.color} text-white border-transparent shadow-lg`
                    : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${
                    formData.legalBarriersLevel === option.value ? 'bg-white' : option.color
                  }`} />
                  <span className="text-sm font-medium">{option.label}</span>
                </div>
              </button>
            ))}
          </div>

          {barrierInfo && (
            <div className={`text-sm ${barrierInfo.color} flex items-center gap-1 mt-2`}>
              <span>{barrierInfo.icon}</span>
              Barrières {barrierInfo.label.toLowerCase()}
            </div>
          )}

          {activeAssistance === 'legalBarriers' && (
            <AIAssistancePanel
              section="financial"
              field="legalBarriers"
              context={{
                productName: formData.productName,
                category: formData.category,
                description: formData.productDescription
              }}
              onClose={() => setActiveAssistance(null)}
            />
          )}
        </div>
      </div>

      {/* Notes stratégiques */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="strategicNotes" className="text-sm font-medium">
            Notes stratégiques additionnelles
          </Label>
          <button
            type="button"
            onClick={() => handleAssistanceClick('strategicNotes')}
            className="text-blue-500 hover:text-blue-700 transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
        <Input
          id="strategicNotes"
          type="text"
          value={formData.strategicNotes || ''}
          onChange={(e) => updateFormData({ strategicNotes: e.target.value })}
          placeholder="Ex: Partenariat prévu avec influenceuse fitness, potentiel retail Walmart..."
          className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-muted-foreground">
          Informations stratégiques importantes non couvertes ailleurs
        </p>
        {activeAssistance === 'strategicNotes' && (
          <AIAssistancePanel
            section="financial"
            field="strategicNotes"
            context={{
              productName: formData.productName,
              category: formData.category,
              marketGrowthRate: formData.marketGrowthRate
            }}
            onClose={() => setActiveAssistance(null)}
          />
        )}
      </div>

      {/* Résumé financier final */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
        <h3 className="font-medium text-green-900 mb-3 flex items-center gap-2">
          💰 Résumé Financier & Stratégique
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <div className="text-lg mb-1">
              {growthInfo?.icon || '❓'}
            </div>
            <div className="font-semibold text-gray-700">Croissance</div>
            <div className="text-muted-foreground">
              {formData.marketGrowthRate ? `${formData.marketGrowthRate}% /an` : 'Non définie'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-lg mb-1">💰</div>
            <div className="font-semibold text-gray-700">Investissement</div>
            <div className="text-muted-foreground">
              {totalInvestment ? `${totalInvestment.toLocaleString()} CAD` : 'Non défini'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-lg mb-1">📊</div>
            <div className="font-semibold text-gray-700">Marge brute</div>
            <div className="text-muted-foreground">
              {grossMargin ? `${grossMargin.toFixed(1)}%` : 'Non calculée'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-lg mb-1">
              {barrierInfo?.icon || '❓'}
            </div>
            <div className="font-semibold text-gray-700">Barrières</div>
            <div className="text-muted-foreground">
              {barrierInfo?.label || 'Non définies'}
            </div>
          </div>
        </div>
      </div>

      {/* Alerte barrières élevées */}
      {formData.legalBarriersLevel && formData.legalBarriersLevel >= 4 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="font-medium text-red-900 mb-2 flex items-center gap-2">
            ⚠️ Barrières Réglementaires Élevées
          </h4>
          <div className="text-sm text-red-800 space-y-1">
            <p>• Réglementation complexe - consultez un expert avant de vous lancer</p>
            <p>• Coûts de conformité potentiellement élevés</p>
            <p>• Délais d'approbation possibles avant commercialisation</p>
            <p>• Vérifiez les requis Health Canada selon votre catégorie</p>
          </div>
        </div>
      )}

      {/* Progress indicator */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Progression de l'étape</span>
          <span className="font-medium">
            {[formData.marketGrowthRate]
              .filter(value => value !== undefined && value !== null).length} / 1 champ obligatoire
          </span>
        </div>
        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ 
              width: `${([formData.marketGrowthRate]
                .filter(value => value !== undefined && value !== null).length / 1) * 100}%` 
            }}
          />
        </div>
      </div>

      {/* Message de félicitations */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6 text-center">
        <div className="text-4xl mb-3">🎉</div>
        <h3 className="text-lg font-semibold text-purple-900 mb-2">
          Félicitations ! Analyse presque terminée
        </h3>
        <p className="text-sm text-purple-700">
          Vous avez rempli toutes les sections. Cliquez sur "Analyser le Produit" pour générer votre scorecard complet !
        </p>
      </div>
    </div>
  )
}