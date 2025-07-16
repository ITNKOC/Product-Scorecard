'use client'

import { useProductFormStore } from '@/store/productFormStore'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AIAssistancePanel } from '@/components/ui/ai-assistance-panel'
import { useState } from 'react'
import { HelpCircle, TrendingUp, Search, Calendar, Users } from 'lucide-react'

export function Step3_MarketTrend() {
  const { formData, updateFormData } = useProductFormStore()
  const [activeAssistance, setActiveAssistance] = useState<string | null>(null)

  const handleAssistanceClick = (field: string) => {
    setActiveAssistance(activeAssistance === field ? null : field)
  }

  const getTrendScore = (average: number) => {
    if (average >= 70) return { label: 'Excellent', color: 'text-green-600', icon: '🔥' }
    if (average >= 50) return { label: 'Bon', color: 'text-blue-600', icon: '📈' }
    if (average >= 30) return { label: 'Moyen', color: 'text-orange-600', icon: '📊' }
    return { label: 'Faible', color: 'text-red-600', icon: '📉' }
  }

  const getVolumeCategory = (volume: number) => {
    if (volume >= 10000) return { label: 'Volume élevé', color: 'text-green-600' }
    if (volume >= 1000) return { label: 'Volume modéré', color: 'text-blue-600' }
    if (volume >= 100) return { label: 'Volume faible', color: 'text-orange-600' }
    return { label: 'Volume très faible', color: 'text-red-600' }
  }

  const trendScore = formData.googleTrends12MonthAverage ? getTrendScore(formData.googleTrends12MonthAverage) : null
  const volumeCategory = formData.monthlySearchVolume ? getVolumeCategory(formData.monthlySearchVolume) : null

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
          📈 Tendance et Intérêt Marché
        </h2>
        <p className="text-muted-foreground text-sm">
          Analysons la demande et les tendances pour votre produit
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Google Trends */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="googleTrends" className="text-sm font-medium flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              Moyenne Google Trends (12 mois) *
            </Label>
            <button
              type="button"
              onClick={() => handleAssistanceClick('googleTrends')}
              className="text-blue-500 hover:text-blue-700 transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
          <Input
            id="googleTrends"
            type="number"
            step="0.1"
            min="0"
            max="100"
            value={formData.googleTrends12MonthAverage !== undefined ? formData.googleTrends12MonthAverage : ''}
            onChange={(e) => {
              const value = e.target.value;
              updateFormData({ googleTrends12MonthAverage: value === '' ? undefined : Number(value) });
            }}
            placeholder="Ex: 65.5"
            required
            className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
          />
          {trendScore && (
            <div className={`text-sm ${trendScore.color} flex items-center gap-1`}>
              <span>{trendScore.icon}</span>
              {trendScore.label} ({formData.googleTrends12MonthAverage}/100)
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            Score moyen sur Google Trends (0-100)
          </p>
          {activeAssistance === 'googleTrends' && (
            <AIAssistancePanel
              section="trends"
              field="keywordSuggestions"
              context={{
                productName: formData.productName,
                category: formData.category,
                description: formData.productDescription
              }}
              onClose={() => setActiveAssistance(null)}
            />
          )}
        </div>

        {/* Volume de recherche */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="searchVolume" className="text-sm font-medium flex items-center gap-1">
              <Search className="w-4 h-4" />
              Volume de recherche mensuel
            </Label>
            <button
              type="button"
              onClick={() => handleAssistanceClick('searchVolume')}
              className="text-blue-500 hover:text-blue-700 transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
          <Input
            id="searchVolume"
            type="number"
            min="0"
            value={formData.monthlySearchVolume !== undefined ? formData.monthlySearchVolume : ''}
            onChange={(e) => {
              const value = e.target.value;
              updateFormData({ monthlySearchVolume: value === '' ? undefined : Number(value) });
            }}
            placeholder="Ex: 8500"
            className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
          />
          {volumeCategory && (
            <div className={`text-sm ${volumeCategory.color}`}>
              {volumeCategory.label} ({formData.monthlySearchVolume?.toLocaleString()} recherches/mois)
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            Données issues d'outils SEO (Ubersuggest, SEMrush, etc.)
          </p>
          {activeAssistance === 'searchVolume' && (
            <AIAssistancePanel
              section="trends"
              field="ubersuggestGuide"
              context={{
                productName: formData.productName,
                category: formData.category,
                description: formData.productDescription,
                googleTrends: formData.googleTrends12MonthAverage
              }}
              onClose={() => setActiveAssistance(null)}
            />
          )}
        </div>

        {/* Saisonnalité */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="seasonal" className="text-sm font-medium flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              Produit saisonnier ?
            </Label>
            <button
              type="button"
              onClick={() => handleAssistanceClick('seasonality')}
              className="text-blue-500 hover:text-blue-700 transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
          <select
            id="seasonal"
            value={formData.isSeasonalProduct ? 'true' : 'false'}
            onChange={(e) => updateFormData({ isSeasonalProduct: e.target.value === 'true' })}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-200"
          >
            <option value="false">Non - Demande stable toute l'année</option>
            <option value="true">Oui - Variations saisonnières marquées</option>
          </select>
          <p className="text-xs text-muted-foreground">
            Basé sur l'analyse des tendances Google Trends
          </p>
          {activeAssistance === 'seasonality' && (
            <AIAssistancePanel
              section="market-trend"
              field="seasonality"
              context={{
                productName: formData.productName,
                category: formData.category,
                googleTrends: formData.googleTrends12MonthAverage
              }}
              onClose={() => setActiveAssistance(null)}
            />
          )}
        </div>

        {/* Popularité réseaux sociaux */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="socialMedia" className="text-sm font-medium flex items-center gap-1">
              <Users className="w-4 h-4" />
              Popularité réseaux sociaux
            </Label>
            <button
              type="button"
              onClick={() => handleAssistanceClick('socialMedia')}
              className="text-blue-500 hover:text-blue-700 transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
          <Input
            id="socialMedia"
            type="text"
            value={formData.socialMediaPopularity || ''}
            onChange={(e) => updateFormData({ socialMediaPopularity: e.target.value })}
            placeholder="Ex: TikTok: 2.5M vues, Instagram: #posturecorrector 15K posts"
            className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-muted-foreground">
            Hashtags, nombre de vues, engagement sur TikTok, Instagram, etc.
          </p>
          {activeAssistance === 'socialMedia' && (
            <AIAssistancePanel
              section="market-trend"
              field="socialMedia"
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

      {/* Analyse du potentiel marché */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
          🎯 Analyse du Potentiel Marché
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="text-2xl mb-1">
              {formData.googleTrends12MonthAverage 
                ? formData.googleTrends12MonthAverage >= 70 ? '🔥' 
                  : formData.googleTrends12MonthAverage >= 50 ? '📈' 
                  : formData.googleTrends12MonthAverage >= 30 ? '📊' : '📉'
                : '❓'
              }
            </div>
            <div className="font-semibold text-gray-700">Tendance</div>
            <div className="text-muted-foreground">
              {trendScore?.label || 'Non définie'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">
              {formData.monthlySearchVolume 
                ? formData.monthlySearchVolume >= 10000 ? '🚀' 
                  : formData.monthlySearchVolume >= 1000 ? '📊' 
                  : formData.monthlySearchVolume >= 100 ? '📉' : '🔍'
                : '❓'
              }
            </div>
            <div className="font-semibold text-gray-700">Volume</div>
            <div className="text-muted-foreground">
              {volumeCategory?.label || 'Non défini'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">
              {formData.isSeasonalProduct === true ? '🗓️' 
                : formData.isSeasonalProduct === false ? '📅' : '❓'}
            </div>
            <div className="font-semibold text-gray-700">Saisonnalité</div>
            <div className="text-muted-foreground">
              {formData.isSeasonalProduct === true ? 'Saisonnier' 
                : formData.isSeasonalProduct === false ? 'Stable' : 'Non définie'}
            </div>
          </div>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Progression de l'étape</span>
          <span className="font-medium">
            {[formData.googleTrends12MonthAverage]
              .filter(value => value !== undefined && value !== null && value !== '').length} / 1 champ obligatoire
          </span>
        </div>
        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ 
              width: `${([formData.googleTrends12MonthAverage]
                .filter(value => value !== undefined && value !== null && value !== '').length / 1) * 100}%` 
            }}
          />
        </div>
      </div>
    </div>
  )
}