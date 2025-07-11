'use client'

import { useProductFormStore } from '@/store/productFormStore'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { AIAssistanceButton } from '@/components/ui/ai-assistance-button'

export function Section3_MarketTrend() {
  const { formData, updateFormData } = useProductFormStore()

  const handleInputChange = (field: string, value: any) => {
    updateFormData({ [field]: value })
  }

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">📈 3. Tendance et Intérêt Marché</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Google Trends Average */}
        <div className="space-y-2">
          <Label htmlFor="googleTrends12MonthAverage">
            Moyenne tendance sur 12 mois (Google Trends)
          </Label>
          <div className="flex gap-2">
            <Input
              id="googleTrends12MonthAverage"
              type="number"
              step="0.1"
              min="0"
              max="100"
              value={formData.googleTrends12MonthAverage || ''}
              onChange={(e) => handleInputChange('googleTrends12MonthAverage', parseFloat(e.target.value) || 0)}
              placeholder="ex: 65.5"
            />
            <AIAssistanceButton 
              section="market-trend"
              field="googleTrends"
              productName={formData.productName}
              category={formData.category}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Score moyen sur 12 mois (0-100)
          </p>
        </div>

        {/* Monthly Search Volume */}
        <div className="space-y-2">
          <Label htmlFor="monthlySearchVolume">
            Volume de recherche mensuel moyen
          </Label>
          <div className="flex gap-2">
            <Input
              id="monthlySearchVolume"
              type="number"
              min="0"
              value={formData.monthlySearchVolume || ''}
              onChange={(e) => handleInputChange('monthlySearchVolume', parseInt(e.target.value) || 0)}
              placeholder="ex: 8500"
            />
            <AIAssistanceButton 
              section="market-trend"
              field="searchVolume"
              productName={formData.productName}
              category={formData.category}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Données issues d'outils SEO (Ubersuggest, SEMrush, etc.)
          </p>
        </div>

        {/* Seasonal Product */}
        <div className="space-y-2">
          <Label htmlFor="isSeasonalProduct">
            Produit saisonnier ?
          </Label>
          <div className="flex gap-2">
            <select
              id="isSeasonalProduct"
              value={formData.isSeasonalProduct ? 'true' : 'false'}
              onChange={(e) => handleInputChange('isSeasonalProduct', e.target.value === 'true')}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="false">Non</option>
              <option value="true">Oui</option>
            </select>
            <AIAssistanceButton 
              section="market-trend"
              field="seasonality"
              productName={formData.productName}
              category={formData.category}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Basé sur l'analyse Google Trends
          </p>
        </div>

        {/* Social Media Popularity */}
        <div className="space-y-2">
          <Label htmlFor="socialMediaPopularity">
            Popularité sur réseaux sociaux
          </Label>
          <div className="flex gap-2">
            <Input
              id="socialMediaPopularity"
              type="text"
              value={formData.socialMediaPopularity || ''}
              onChange={(e) => handleInputChange('socialMediaPopularity', e.target.value)}
              placeholder="ex: TikTok: 2.5M vues, Instagram: #producttrend"
            />
            <AIAssistanceButton 
              section="market-trend"
              field="socialMedia"
              productName={formData.productName}
              category={formData.category}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Hashtags, nombre de vues, engagement sur TikTok, Instagram, etc.
          </p>
        </div>
      </div>
    </Card>
  )
}