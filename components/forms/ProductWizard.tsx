"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useProductFormStore } from "@/store/productFormStore";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Logo from "@/components/ui/Logo";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import Link from "next/link";
import { Step1_EssentialInfo } from "./wizard-steps/Step1_EssentialInfo";
import { Step2_PricingCosts } from "./wizard-steps/Step2_PricingCosts";
import { Step3_MarketTrend } from "./wizard-steps/Step3_MarketTrend";
import { Step4_QualitativeCriteria } from "./wizard-steps/Step4_QualitativeCriteria";
import { Step5_CompetitionAnalysis } from "./wizard-steps/Step5_CompetitionAnalysis";
import { Step6_LogisticsStock } from "./wizard-steps/Step6_LogisticsStock";
import { Step7_SocialProof } from "./wizard-steps/Step7_SocialProof";
import { Step8_FinancialStrategic } from "./wizard-steps/Step8_FinancialStrategic";

// Step Icons Components
const StepIcons = {
  1: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  ),
  2: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  3: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  ),
  4: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  ),
  5: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  6: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  ),
  7: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  8: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
    </svg>
  ),
};

const STEPS = [
  { 
    id: 1, 
    title: "Informations Essentielles", 
    requiredFields: ['productName', 'productDescription', 'category'],
    component: Step1_EssentialInfo 
  },
  { 
    id: 2, 
    title: "Prix et Coûts", 
    requiredFields: ['unitPrice', 'desiredSellingPrice'],
    component: Step2_PricingCosts 
  },
  { 
    id: 3, 
    title: "Tendance Marché", 
    requiredFields: ['googleTrends12MonthAverage'],
    component: Step3_MarketTrend 
  },
  { 
    id: 4, 
    title: "Critères Qualitatifs", 
    requiredFields: ['wowFactor', 'simplicity', 'easeOfUse', 'solvesProblem'],
    component: Step4_QualitativeCriteria 
  },
  { 
    id: 5, 
    title: "Analyse Concurrence", 
    requiredFields: ['competitionLevel'],
    component: Step5_CompetitionAnalysis 
  },
  { 
    id: 6, 
    title: "Logistique & Stock", 
    requiredFields: ['isFragile'],
    component: Step6_LogisticsStock 
  },
  { 
    id: 7, 
    title: "Preuve Sociale", 
    requiredFields: ['socialProofStrength'],
    component: Step7_SocialProof 
  },
  { 
    id: 8, 
    title: "Données Financières", 
    requiredFields: ['marketGrowthRate'],
    component: Step8_FinancialStrategic 
  },
];

interface ProductWizardProps {
  editData?: any;
}

export function ProductWizard({ editData }: ProductWizardProps) {
  const router = useRouter();
  const { formData, currentSection, setCurrentSection, resetForm, updateFormData } = useProductFormStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Load edit data when available
  useEffect(() => {
    if (editData) {
      setIsEditMode(true);
      // Map database fields to form fields
      const mappedData = {
        // Essential Information
        productName: editData.productName || '',
        productDescription: editData.productDescription || '',
        category: editData.category || '',
        sourcingUrl: editData.sourcingUrl || '',

        // Pricing & Costs
        unitPrice: editData.unitPrice || 0,
        shippingCost: editData.shippingCost || 0,
        brandingCost: editData.brandingCost || 0,
        desiredSellingPrice: editData.desiredSellingPrice || 0,
        competitorPrices: Array.isArray(editData.competitorPrices) ? editData.competitorPrices : [],

        // Market Trend & Interest
        googleTrends12MonthAverage: editData.googleTrends12MonthAverage || 0,
        monthlySearchVolume: editData.monthlySearchVolume || 0,
        isSeasonalProduct: editData.isSeasonalProduct || false,
        socialMediaPopularity: editData.socialMediaPopularity || '',

        // Qualitative Criteria
        wowFactor: editData.wowFactor || 1,
        simplicity: editData.simplicity || 1,
        easeOfUse: editData.easeOfUse || 1,
        solvesProblem: editData.solvesProblem || false,
        isInnovative: editData.isInnovative || false,
        beforeAfterPotential: editData.beforeAfterPotential || 1,

        // Competition Analysis
        competitionLevel: editData.competitionLevel || 1,
        competitorCount: editData.competitorCount || 0,
        competitorAdsAnalysis: editData.competitorAdsAnalysis || '',
        differentiationPoints: editData.differentiationPoints || '',

        // Logistics & Stock
        minimumStock: editData.minimumStock || 0,
        deliveryTime: editData.deliveryTime || 0,
        storageCostPerUnit: editData.storageCostPerUnit || 0,
        isFragile: editData.isFragile || false,
        availableVariants: Array.isArray(editData.availableVariants) ? editData.availableVariants : [],

        // Social Proof & Reviews
        socialProofStrength: editData.socialProofStrength || 1,
        averageReviewCount: editData.averageReviewCount || 0,
        averageRating: editData.averageRating || 0,
        socialEngagementRate: editData.socialEngagementRate || 0,
        ugcObservations: editData.ugcObservations || '',

        // Financial & Strategic Data
        initialInvestment: editData.initialInvestment || 0,
        marketingBudget: editData.marketingBudget || 0,
        marketGrowthRate: editData.marketGrowthRate || 0,
        legalBarriersLevel: editData.legalBarriersLevel || 1,
        strategicNotes: editData.strategicNotes || ''
      };

      updateFormData(mappedData);
    }
  }, [editData, updateFormData]);

  const currentStep = STEPS.find(step => step.id === currentSection) || STEPS[0];
  const CurrentStepComponent = currentStep.component;
  const progress = (currentSection / STEPS.length) * 100;

  // Validation des champs requis pour l'étape actuelle
  const isCurrentStepValid = () => {
    return currentStep.requiredFields.every(field => {
      const value = formData[field as keyof typeof formData];
      return value !== undefined && value !== null && value !== '';
    });
  };

  const handleNext = () => {
    if (currentSection < STEPS.length) {
      setCurrentSection(currentSection + 1);
      setError(null);
    }
  };

  const handlePrevious = () => {
    if (currentSection > 1) {
      setCurrentSection(currentSection - 1);
      setError(null);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Validation finale de tous les champs requis
      const allRequiredFields = STEPS.flatMap(step => step.requiredFields);
      const missingFields = allRequiredFields.filter(field => {
        const value = formData[field as keyof typeof formData];
        return value === undefined || value === null || value === '';
      });

      if (missingFields.length > 0) {
        setError(`Champs manquants : ${missingFields.join(', ')}`);
        return;
      }

      // Submit to API - Create or Update
      const url = isEditMode ? `/api/analyses/${editData.id}` : '/api/analyses';
      const method = isEditMode ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Erreur lors de ${isEditMode ? 'la mise à jour' : 'la soumission'}`);
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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="cursor-pointer hover:opacity-80 transition-opacity duration-200">
                <div className="block sm:hidden">
                  <Logo size="md" variant="icon" showText={false} />
                </div>
                <div className="hidden sm:block">
                  <Logo size="lg" variant="horizontal" showText={false} />
                </div>
              </Link>
            </div>
            
            {/* Title - Center */}
            <div className="text-center lg:flex-1">
              <h1 className="text-xl sm:text-3xl font-light text-black tracking-tight">
                Analyse de Produit
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 font-light mt-1 block sm:hidden">
                Étape {currentSection}/{STEPS.length}
              </p>
              <p className="text-sm text-gray-600 font-light mt-1 hidden sm:block">
                Étape {currentSection} sur {STEPS.length}
              </p>
            </div>
            
            {/* Progress Badge - Right */}
            <div className="flex-shrink-0">
              {/* Mobile Version - Compact */}
              <div className="block sm:hidden">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {Math.round((currentSection / STEPS.length) * 100)}%
                  </span>
                </div>
              </div>
              {/* Desktop Version - Full */}
              <div className="hidden sm:block">
                <div className="px-4 py-2 bg-gray-50 rounded-full border border-gray-200">
                  <span className="text-sm font-medium text-gray-700 tracking-wide">
                    {Math.round((currentSection / STEPS.length) * 100)}% complété
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-6 sm:mb-8">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-black h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-sm"></div>
                </div>
                <div>
                  <span className="font-medium text-black tracking-wide">{currentStep.title}</span>
                  {isEditMode && (
                    <span className="ml-2 px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium border border-blue-200">
                      Mode édition
                    </span>
                  )}
                </div>
              </div>
              <span className="text-sm text-gray-600 font-light">
                {currentSection} / {STEPS.length}
              </span>
            </div>
          </div>

          {/* Step Indicators - Enhanced Mobile */}
          <div className="mb-6 sm:mb-8">
            {/* Mobile Version - Compact */}
            <div className="block sm:hidden">
              <div className="relative">
                {/* Current Step Info */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                        <div className="text-white">
                          {StepIcons[currentSection as keyof typeof StepIcons]()}
                        </div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{currentStep.title}</div>
                        <div className="text-sm text-gray-600">Étape {currentSection} sur {STEPS.length}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-medium text-gray-900">{Math.round(progress)}%</div>
                      <div className="text-xs text-gray-500">Complété</div>
                    </div>
                  </div>
                </div>

                {/* Horizontal Step Navigator */}
                <div className="relative">
                  {/* Scroll Indicators */}
                  {currentSection > 3 && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-md p-1">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </div>
                  )}
                  {currentSection < STEPS.length - 2 && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-md p-1">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  )}

                  {/* Step Circles */}
                  <div className="overflow-x-auto scrollbar-hide px-6">
                    <div className="flex items-center gap-2 min-w-max py-2">
                      {STEPS.map((step, index) => (
                        <div key={step.id} className="flex items-center">
                          <div 
                            className={`
                              flex items-center justify-center w-8 h-8 rounded-full text-xs font-medium transition-all
                              ${step.id < currentSection 
                                ? 'bg-emerald-500 text-white shadow-sm' 
                                : step.id === currentSection 
                                  ? 'bg-black text-white shadow-md scale-110' 
                                  : 'bg-gray-200 text-gray-500'
                              }
                            `}
                          >
                            {step.id < currentSection ? (
                              <Check className="w-3 h-3" />
                            ) : step.id === currentSection ? (
                              <div className="text-white">
                                {StepIcons[step.id as keyof typeof StepIcons]()}
                              </div>
                            ) : (
                              step.id
                            )}
                          </div>
                          {index < STEPS.length - 1 && (
                            <div 
                              className={`
                                w-4 h-0.5 mx-1
                                ${step.id < currentSection ? 'bg-emerald-300' : 'bg-gray-300'}
                              `} 
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Version - Full */}
            <div className="hidden sm:flex items-center justify-center px-4">
              <div className="flex items-center gap-3">
                {STEPS.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <div 
                      className={`
                        flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium transition-all
                        ${step.id < currentSection 
                          ? 'bg-emerald-500 text-white shadow-md' 
                          : step.id === currentSection 
                            ? 'bg-black text-white shadow-md ring-2 ring-gray-200' 
                            : 'bg-gray-200 text-gray-600'
                        }
                      `}
                    >
                      {step.id < currentSection ? (
                        <Check className="w-5 h-5" />
                      ) : step.id === currentSection ? (
                        <div className="text-white">
                          {StepIcons[step.id as keyof typeof StepIcons]()}
                        </div>
                      ) : (
                        step.id
                      )}
                    </div>
                    {index < STEPS.length - 1 && (
                      <div 
                        className={`
                          w-8 h-0.5 mx-2
                          ${step.id < currentSection ? 'bg-emerald-500' : 'bg-gray-200'}
                        `} 
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div className="text-red-800 text-sm font-medium">{error}</div>
              </div>
            </div>
          )}

          {/* Current Step - Mobile Optimized */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-6 sm:mb-8">
            <CurrentStepComponent />
          </div>

          {/* Navigation Buttons - Mobile Optimized */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 sm:justify-between sm:items-center">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-2 order-2 sm:order-1">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                disabled={currentSection === 1 || isSubmitting}
                className="w-full sm:w-auto h-12 sm:h-10 text-base sm:text-sm border-gray-300 text-gray-700 hover:bg-gray-50 font-medium tracking-wide"
              >
                <ChevronLeft className="w-5 h-5 sm:w-4 sm:h-4 mr-2" />
                Précédent
              </Button>
              
              {isEditMode ? (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => router.push('/dashboard')}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto h-12 sm:h-10 text-base sm:text-sm text-gray-600 hover:text-gray-700 hover:bg-gray-50 font-medium tracking-wide"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Annuler
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleReset}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto h-12 sm:h-10 text-base sm:text-sm text-red-600 hover:text-red-700 hover:bg-red-50 font-medium tracking-wide"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Réinitialiser
                </Button>
              )}
            </div>

            <div className="order-1 sm:order-2">
              {currentSection === STEPS.length ? (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !isCurrentStepValid()}
                  className="w-full sm:w-auto h-12 sm:h-10 text-base sm:text-sm bg-black text-white hover:bg-gray-800 font-medium tracking-wide sm:min-w-[150px] transition-all duration-300"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sauvegarde...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      {isEditMode ? "Mettre à jour" : "Analyser le Produit"}
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  disabled={!isCurrentStepValid() || isSubmitting}
                  className="w-full sm:w-auto h-12 sm:h-10 text-base sm:text-sm bg-black text-white hover:bg-gray-800 font-medium tracking-wide sm:min-w-[120px] transition-all duration-300"
                >
                  Suivant
                  <ChevronRight className="w-5 h-5 sm:w-4 sm:h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>

          {/* Contextual Help */}
          {!isCurrentStepValid() && (
            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-amber-800 font-medium">
                  Veuillez remplir tous les champs obligatoires pour continuer.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}