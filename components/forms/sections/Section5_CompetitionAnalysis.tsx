'use client'

import { useProductFormStore } from '@/store/productFormStore'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { AIAssistanceButton } from '@/components/ui/ai-assistance-button'

export function Section5_CompetitionAnalysis() {
  const { formData, updateFormData } = useProductFormStore()

  const handleInputChange = (field: string, value: any) => {
    updateFormData({ [field]: value })
  }

  const RatingInput = ({ 
    field, 
    label, 
    description,
    placeholder 
  }: { 
    field: string
    label: string
    description: string
    placeholder?: string
  }) => (
    <div className="space-y-3">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              type="button"
              onClick={() => handleInputChange(field, rating)}
              className={`w-10 h-10 rounded-full border-2 text-sm font-medium transition-colors ${
                formData[field as keyof typeof formData] === rating
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-muted-foreground/20 hover:border-primary/50'
              }`}
            >
              {rating}
            </button>
          ))}
        </div>
        <AIAssistanceButton 
          section="competition"
          field={field}
          productName={formData.productName}
          category={formData.category}
        />
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">🏁 5. Analyse de la Concurrence</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Number of Direct Competitors */}
        <div className="space-y-2">
          <Label htmlFor="directCompetitorsCount">
            Nombre de concurrents directs
          </Label>
          <div className="flex gap-2">
            <Input
              id="directCompetitorsCount"
              type="number"
              min="0"
              value={formData.competitorCount || ''}
              onChange={(e) => handleInputChange('competitorCount', parseInt(e.target.value) || 0)}
              placeholder="ex: 15"
            />
            <AIAssistanceButton 
              section="competition"
              field="competitorCount"
              productName={formData.productName}
              category={formData.category}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Comptés sur Google, Amazon.ca, boutiques Shopify
          </p>
        </div>

        {/* Best Competitor URL */}
        <div className="space-y-2">
          <Label htmlFor="bestCompetitorUrl">
            Lien du meilleur concurrent
          </Label>
          <div className="flex gap-2">
            <Input
              id="bestCompetitorUrl"
              type="url"
              value={formData.competitorAdsAnalysis || ''}
              onChange={(e) => handleInputChange('competitorAdsAnalysis', e.target.value)}
              placeholder="https://example.com/produit-concurrent"
            />
            <AIAssistanceButton 
              section="competition"
              field="bestCompetitor"
              productName={formData.productName}
              category={formData.category}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            URL de la boutique concurrent la plus solide
          </p>
        </div>

        {/* Competitor Store Quality Rating */}
        <RatingInput
          field="competitorStoreQuality"
          label="Qualité de la boutique concurrente"
          description="Design, UX, vitesse, qualité des fiches produits (1=Très faible, 5=Excellente)"
        />

        {/* Competitor Monthly Visits */}
        <div className="space-y-2">
          <Label htmlFor="competitorMonthlyVisits">
            Nombre de visites mensuelles (concurrent)
          </Label>
          <div className="flex gap-2">
            <Input
              id="competitorMonthlyVisits"
              type="number"
              min="0"
              value={formData.monthlySearchVolume || ''}
              onChange={(e) => handleInputChange('monthlySearchVolume', parseInt(e.target.value) || 0)}
              placeholder="ex: 25000"
            />
            <AIAssistanceButton 
              section="competition"
              field="competitorTraffic"
              productName={formData.productName}
              category={formData.category}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Données issues de SimilarWeb, SEMrush, Ahrefs
          </p>
        </div>

        {/* Competitor Active Ads */}
        <div className="space-y-2">
          <Label htmlFor="competitorActiveAds">
            Nombre de pubs actives détectées
          </Label>
          <div className="flex gap-2">
            <Input
              id="competitorActiveAds"
              type="number"
              min="0"
              value={formData.competitionLevel || ''}
              onChange={(e) => handleInputChange('competitionLevel', parseInt(e.target.value) || 0)}
              placeholder="ex: 8"
            />
            <AIAssistanceButton 
              section="competition"
              field="competitorAds"
              productName={formData.productName}
              category={formData.category}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Meta Ads Library, Google Ads Transparency Center
          </p>
        </div>
      </div>
    </Card>
  )
}