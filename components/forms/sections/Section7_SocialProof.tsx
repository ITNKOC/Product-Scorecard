'use client'

import { useProductFormStore } from '@/store/productFormStore'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { AIAssistanceButton } from '@/components/ui/ai-assistance-button'

export function Section7_SocialProof() {
  const { formData, updateFormData } = useProductFormStore()

  const handleInputChange = (field: string, value: any) => {
    updateFormData({ [field]: value })
  }

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">⭐ 7. Preuves Sociales et Avis</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Similar Products Review Count */}
        <div className="space-y-2">
          <Label htmlFor="similarProductsReviewCount">
            Nombre d'avis sur produits similaires
          </Label>
          <div className="flex gap-2">
            <Input
              id="similarProductsReviewCount"
              type="number"
              min="0"
              value={formData.similarProductsReviewCount || ''}
              onChange={(e) => handleInputChange('similarProductsReviewCount', parseInt(e.target.value) || 0)}
              placeholder="ex: 1250"
            />
            <AIAssistanceButton 
              section="social-proof"
              field="reviewCount"
              productName={formData.productName}
              category={formData.category}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Nombre total d'avis sur Amazon, boutiques concurrentes
          </p>
        </div>

        {/* Average Rating */}
        <div className="space-y-2">
          <Label htmlFor="averageRating">
            Note moyenne (/5)
          </Label>
          <div className="flex gap-2">
            <Input
              id="averageRating"
              type="number"
              step="0.1"
              min="0"
              max="5"
              value={formData.averageRating || ''}
              onChange={(e) => handleInputChange('averageRating', parseFloat(e.target.value) || 0)}
              placeholder="ex: 4.2"
            />
            <AIAssistanceButton 
              section="social-proof"
              field="rating"
              productName={formData.productName}
              category={formData.category}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Note moyenne pondérée des produits similaires
          </p>
        </div>

        {/* Positive Review Example */}
        <div className="space-y-2">
          <Label htmlFor="positiveReviewExample">
            Exemple de commentaire positif
          </Label>
          <div className="flex gap-2 items-start">
            <Textarea
              id="positiveReviewExample"
              value={formData.positiveReviewExample || ''}
              onChange={(e) => handleInputChange('positiveReviewExample', e.target.value)}
              placeholder="ex: 'Incroyable ! Ce produit a complètement résolu mon problème de...'"
              rows={3}
              className="flex-1"
            />
            <AIAssistanceButton 
              section="social-proof"
              field="positiveReview"
              productName={formData.productName}
              category={formData.category}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Copier-coller un avis réel positif représentatif
          </p>
        </div>

        {/* Negative Review Example */}
        <div className="space-y-2">
          <Label htmlFor="negativeReviewExample">
            Exemple de commentaire négatif
          </Label>
          <div className="flex gap-2 items-start">
            <Textarea
              id="negativeReviewExample"
              value={formData.negativeReviewExample || ''}
              onChange={(e) => handleInputChange('negativeReviewExample', e.target.value)}
              placeholder="ex: 'La qualité n'est pas au rendez-vous, le matériel s'abîme rapidement...'"
              rows={3}
              className="flex-1"
            />
            <AIAssistanceButton 
              section="social-proof"
              field="negativeReview"
              productName={formData.productName}
              category={formData.category}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Copier-coller un avis négatif pour identifier les points d'attention
          </p>
        </div>

        {/* Engagement Rate */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="engagementRate">
            Taux d'engagement (réseaux sociaux)
          </Label>
          <div className="flex gap-2">
            <Input
              id="engagementRate"
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={formData.engagementRate || ''}
              onChange={(e) => handleInputChange('engagementRate', parseFloat(e.target.value) || 0)}
              placeholder="ex: 3.5"
            />
            <span className="flex items-center text-sm text-muted-foreground">%</span>
            <AIAssistanceButton 
              section="social-proof"
              field="engagement"
              productName={formData.productName}
              category={formData.category}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Formule : (likes + partages + commentaires) / vues × 100
          </p>
        </div>
      </div>
    </Card>
  )
}