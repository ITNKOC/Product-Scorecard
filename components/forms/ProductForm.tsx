"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import { useProductFormStore } from "@/store/productFormStore";
import { Button } from "@/components/ui/button";
import { Section1_EssentialInfo } from "./sections/Section1_EssentialInfo";
import { Section2_PricingCosts } from "./sections/Section2_PricingCosts";
import { Section3_MarketTrend } from "./sections/Section3_MarketTrend";
import { Section4_QualitativeCriteria } from "./sections/Section4_QualitativeCriteria";
import { Section5_CompetitionAnalysis } from "./sections/Section5_CompetitionAnalysis";
import { Section6_LogisticsStock } from "./sections/Section6_LogisticsStock";
import { Section7_SocialProof } from "./sections/Section7_SocialProof";
import { Section8_FinancialStrategic } from "./sections/Section8_FinancialStrategic";

interface ProductFormProps {
  selectedTemplate?: string | null;
}

export function ProductForm({ selectedTemplate }: ProductFormProps) {
  const router = useRouter();
  const { formData, updateFormData, resetForm } = useProductFormStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateForm = () => {
    const requiredFields = [
      'productName',
      'productDescription', 
      'category',
      'unitPrice',
      'desiredSellingPrice'
    ];
    
    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData]) {
        return `Le champ "${field}" est requis.`;
      }
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Validate form
      const validationError = validateForm();
      if (validationError) {
        setError(validationError);
        return;
      }

      // Submit to API
      const response = await fetch('/api/analyses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la soumission');
      }

      const analysis = await response.json();
      
      // Reset form and redirect to dashboard
      resetForm();
      router.push('/dashboard');
    } catch (error) {
      console.error("Error submitting form:", error);
      setError('Une erreur est survenue lors de la soumission. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    if (confirm("Êtes-vous sûr de vouloir réinitialiser le formulaire ?")) {
      resetForm();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Analyse de Produit
        </h1>
        <p className="text-muted-foreground">
          Remplissez tous les champs pour obtenir une analyse complète de votre
          produit.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <div className="flex">
            <div className="text-red-800 text-sm">{error}</div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Essential Information */}
        <Section1_EssentialInfo />

        {/* Section 2: Pricing & Costs */}
        <Section2_PricingCosts />
        {/* 
        Section 3: Market Trend & Interest */}
        <Section3_MarketTrend />

        {/* Section 4: Qualitative Criteria */}
        <Section4_QualitativeCriteria />

        {/* Section 5: Competition Analysis */}
        <Section5_CompetitionAnalysis />

        {/* Section 6: Logistics & Stock */}
        <Section6_LogisticsStock />

        {/* Section 7: Social Proof & Reviews */}
        <Section7_SocialProof />

        {/* Section 8: Financial & Strategic Data */}
        <Section8_FinancialStrategic />

        {/* Form Actions */}
        <div className="flex justify-between items-center pt-8 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            disabled={isSubmitting}
          >
            Réinitialiser
          </Button>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="min-w-[150px]"
          >
            {isSubmitting ? "Génération..." : "Analyser le Produit"}
          </Button>
        </div>
      </form>
    </div>
  );
}
