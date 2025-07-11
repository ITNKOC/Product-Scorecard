'use client'

import { useProductFormStore } from '@/store/productFormStore'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { AIAssistanceButton } from '@/components/ui/ai-assistance-button'

export function Section4_QualitativeCriteria() {
  const { formData, updateFormData } = useProductFormStore()

  const handleRatingChange = (field: string, value: number) => {
    updateFormData({ [field]: value })
  }

  const handleBooleanChange = (field: string, value: boolean) => {
    updateFormData({ [field]: value })
  }

  const RatingInput = ({ 
    field, 
    label, 
    description 
  }: { 
    field: string
    label: string
    description: string
  }) => (
    <div className="space-y-3">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              type="button"
              onClick={() => handleRatingChange(field, rating)}
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
          section="qualitative"
          field={field}
          productName={formData.productName}
          category={formData.category}
        />
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )

  const BooleanInput = ({ 
    field, 
    label, 
    description 
  }: { 
    field: string
    label: string
    description: string
  }) => (
    <div className="space-y-3">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handleBooleanChange(field, true)}
            className={`px-4 py-2 rounded-md border text-sm font-medium transition-colors ${
              formData[field as keyof typeof formData] === true
                ? 'bg-green-100 text-green-800 border-green-300'
                : 'border-muted-foreground/20 hover:border-green-300'
            }`}
          >
            Oui
          </button>
          <button
            type="button"
            onClick={() => handleBooleanChange(field, false)}
            className={`px-4 py-2 rounded-md border text-sm font-medium transition-colors ${
              formData[field as keyof typeof formData] === false
                ? 'bg-red-100 text-red-800 border-red-300'
                : 'border-muted-foreground/20 hover:border-red-300'
            }`}
          >
            Non
          </button>
        </div>
        <AIAssistanceButton 
          section="qualitative"
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
        <h3 className="text-lg font-semibold">✅ 4. Critères Qualitatifs</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RatingInput
          field="wowFactor"
          label="Effet 'Wow'"
          description="Le produit surprend-il positivement au premier regard ? (1=Très faible, 5=Exceptionnel)"
        />

        <RatingInput
          field="explanationSimplicity"
          label="Simplicité d'explication"
          description="Peut-on expliquer le produit en une phrase ? (1=Très complexe, 5=Très simple)"
        />

        <RatingInput
          field="easeOfUse"
          label="Facilité d'utilisation"
          description="Le produit est-il intuitif à utiliser ? (1=Très difficile, 5=Très facile)"
        />

        <BooleanInput
          field="solvesProblem"
          label="Résout un problème ?"
          description="Le produit adresse-t-il un vrai problème du quotidien ?"
        />

        <BooleanInput
          field="isInnovative"
          label="Innovation"
          description="Le produit apporte-t-il une nouveauté par rapport à l'existant ?"
        />

        <RatingInput
          field="beforeAfterPotential"
          label="Potentiel 'Avant/Après'"
          description="Peut-on montrer une transformation visible ? (1=Aucun, 5=Spectaculaire)"
        />
      </div>
    </Card>
  )
}