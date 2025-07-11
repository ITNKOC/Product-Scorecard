'use client'

import { useProductFormStore } from '@/store/productFormStore'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { AIAssistanceButton } from '@/components/ui/ai-assistance-button'

const CATEGORIES = [
  'Kitchen',
  'Fitness',
  'Beauty',
  'Technology',
  'Home',
  'Fashion',
  'Pet',
  'Garden',
  'Baby',
  'Automotive'
]

export function Section1_EssentialInfo() {
  const { formData, updateFormData } = useProductFormStore()

  return (
    <div className="form-section">
      <h2 className="section-title">📝 1. Informations Essentielles</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Name */}
        <div className="form-field">
          <div className="flex items-center justify-between mb-2">
            <Label htmlFor="productName">Nom du produit *</Label>
            <AIAssistanceButton
              section="essential"
              field="productName"
              productName={formData.productName}
              category={formData.category}
            />
          </div>
          <Input
            id="productName"
            value={formData.productName || ''}
            onChange={(e) => updateFormData({ productName: e.target.value })}
            placeholder="Ex: Coupe-légumes spiralé automatique"
            required
          />
        </div>

        {/* Category */}
        <div className="form-field">
          <div className="flex items-center justify-between mb-2">
            <Label htmlFor="category">Catégorie *</Label>
            <AIAssistanceButton
              section="essential"
              field="category"
              productName={formData.productName}
              category={formData.category}
            />
          </div>
          <select
            id="category"
            value={formData.category || ''}
            onChange={(e) => updateFormData({ category: e.target.value })}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            required
          >
            <option value="">Sélectionner une catégorie</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Product Description */}
      <div className="form-field">
        <div className="flex items-center justify-between mb-2">
          <Label htmlFor="productDescription">Description du produit *</Label>
          <AIAssistanceButton
            section="essential"
            field="description"
            productName={formData.productName}
            category={formData.category}
          />
        </div>
        <Textarea
          id="productDescription"
          value={formData.productDescription || ''}
          onChange={(e) => updateFormData({ productDescription: e.target.value })}
          placeholder="Décrivez l'usage, les matériaux, la cible, les bénéfices..."
          className="min-h-[100px]"
          required
        />
        <p className="text-sm text-muted-foreground mt-1">
          Décrivez précisément l'usage, les matériaux, la cible et les bénéfices du produit.
        </p>
      </div>

      {/* Sourcing URL */}
      <div className="form-field">
        <div className="flex items-center justify-between mb-2">
          <Label htmlFor="sourcingUrl">Lien de sourcing (Alibaba)</Label>
          <AIAssistanceButton
            section="essential"
            field="sourcing"
            productName={formData.productName}
            category={formData.category}
          />
        </div>
        <Input
          id="sourcingUrl"
          type="url"
          value={formData.sourcingUrl || ''}
          onChange={(e) => updateFormData({ sourcingUrl: e.target.value })}
          placeholder="https://alibaba.com/product/..."
        />
        <p className="text-sm text-muted-foreground mt-1">
          L'IA peut vous recommander des mots-clés et filtres pour trouver des fournisseurs fiables.
        </p>
      </div>
    </div>
  )
}