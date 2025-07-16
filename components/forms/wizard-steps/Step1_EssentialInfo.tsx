"use client";

import { useProductFormStore } from "@/store/productFormStore";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AIAssistancePanel } from "@/components/ui/ai-assistance-panel";
import ImageUpload from "@/components/ui/ImageUpload";
import { useState } from "react";
import { HelpCircle } from "lucide-react";

const CATEGORIES = [
  "Kitchen",
  "Fitness",
  "Beauty",
  "Technology",
  "Home",
  "Fashion",
  "Pet",
  "Garden",
  "Baby",
  "Automotive",
  "personal care",
];

export function Step1_EssentialInfo() {
  const { formData, updateFormData } = useProductFormStore();
  const [activeAssistance, setActiveAssistance] = useState<string | null>(null);

  const handleAssistanceClick = (field: string) => {
    setActiveAssistance(activeAssistance === field ? null : field);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
          📝 Informations Essentielles
        </h2>
        <p className="text-muted-foreground text-sm">
          Commençons par les informations de base de votre produit
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Name */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="productName" className="text-sm font-medium">
              Nom du produit *
            </Label>
            {/* AI assistance disabled for product name */}
          </div>
          <Input
            id="productName"
            value={formData.productName || ""}
            onChange={(e) => updateFormData({ productName: e.target.value })}
            placeholder="Ex: Correcteur de posture intelligent"
            required
            className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
          />
          {/* No AI assistance for product name */}
        </div>

        {/* Category */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="category" className="text-sm font-medium">
              Catégorie *
            </Label>
            {/* AI assistance disabled for category */}
          </div>
          <select
            id="category"
            value={formData.category || ""}
            onChange={(e) => updateFormData({ category: e.target.value })}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-200"
            required
          >
            <option value="">Sélectionner une catégorie</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {/* No AI assistance for category */}
        </div>
      </div>

      {/* Product Image */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="productImage" className="text-sm font-medium">
            Image du produit
          </Label>
          {/* AI assistance disabled for product image */}
        </div>
        <ImageUpload
          value={formData.productImageUrl}
          onChange={(url) => updateFormData({ productImageUrl: url || undefined })}
        />
        <p className="text-xs text-muted-foreground">
          Une image claire de votre produit aide à une meilleure analyse et présentation.
        </p>
        {/* No AI assistance for product image */}
      </div>

      {/* Product Description */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="productDescription" className="text-sm font-medium">
            Description du produit *
          </Label>
          <button
            type="button"
            onClick={() => handleAssistanceClick("description")}
            className="text-blue-500 hover:text-blue-700 transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
        <Textarea
          id="productDescription"
          value={formData.productDescription || ""}
          onChange={(e) =>
            updateFormData({ productDescription: e.target.value })
          }
          placeholder="Fournissez une description de base de votre produit. L'IA proposera ensuite une version améliorée et plus professionnelle."
          className="min-h-[120px] transition-all duration-200 focus:ring-2 focus:ring-blue-500"
          required
        />
        <p className="text-xs text-muted-foreground">
          📝 Saisissez d'abord votre description, puis l'IA vous proposera une version optimisée
        </p>
        {activeAssistance === "description" && (
          <AIAssistancePanel
            section="essential"
            field="descriptionImprovement"
            context={{
              productName: formData.productName,
              category: formData.category,
              description: formData.productDescription,
            }}
            onClose={() => setActiveAssistance(null)}
          />
        )}
      </div>

      {/* Sourcing URL */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="sourcingUrl" className="text-sm font-medium">
            Lien de sourcing (Alibaba)
            <span className="text-muted-foreground ml-1">(optionnel)</span>
          </Label>
          <button
            type="button"
            onClick={() => handleAssistanceClick("sourcing")}
            className="text-blue-500 hover:text-blue-700 transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
        <Input
          id="sourcingUrl"
          type="url"
          value={formData.sourcingUrl || ""}
          onChange={(e) => updateFormData({ sourcingUrl: e.target.value })}
          placeholder="https://alibaba.com/product/... (optionnel - voir guide IA)"
          className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
        />
        {activeAssistance === "sourcing" && (
          <AIAssistancePanel
            section="essential"
            field="sourcingGuide"
            context={{
              productName: formData.productName,
              category: formData.category,
              description: formData.productDescription,
            }}
            onClose={() => setActiveAssistance(null)}
          />
        )}
      </div>

      {/* Progress indicator for this step */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Progression de l'étape</span>
          <span className="font-medium">
            {
              [
                formData.productName,
                formData.category,
                formData.productDescription,
              ].filter(Boolean).length
            }{" "}
            / 3 champs obligatoires
          </span>
        </div>
        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${
                ([
                  formData.productName,
                  formData.category,
                  formData.productDescription,
                ].filter(Boolean).length /
                  3) *
                100
              }%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
