import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ProductAnalysisData } from '@/types/product'

interface ProductFormStore {
  formData: Partial<ProductAnalysisData>
  isLoading: boolean
  currentSection: number
  updateFormData: (data: Partial<ProductAnalysisData>) => void
  setLoading: (loading: boolean) => void
  setCurrentSection: (section: number) => void
  resetForm: () => void
  loadTemplate: (templateData: Partial<ProductAnalysisData>) => void
}

const initialFormData: Partial<ProductAnalysisData> = {
  productName: '',
  productDescription: '',
  category: '',
  sourcingUrl: '',
  unitPrice: 0,
  desiredSellingPrice: 0,
  competitorPrices: [],
  isSeasonalProduct: false,
  solvesProblem: false,
  isInnovative: false,
  isFragile: false,
  availableVariants: [],
}

export const useProductFormStore = create<ProductFormStore>()(
  persist(
    (set, get) => ({
      formData: initialFormData,
      isLoading: false,
      currentSection: 1,
      
      updateFormData: (data) => 
        set((state) => ({
          formData: { ...state.formData, ...data }
        })),
      
      setLoading: (loading) => set({ isLoading: loading }),
      
      setCurrentSection: (section) => set({ currentSection: section }),
      
      resetForm: () => set({ 
        formData: initialFormData,
        currentSection: 1,
        isLoading: false
      }),
      
      loadTemplate: (templateData) => 
        set((state) => ({
          formData: { ...state.formData, ...templateData }
        })),
    }),
    {
      name: 'product-form-storage',
      partialize: (state) => ({ formData: state.formData, currentSection: state.currentSection }),
    }
  )
)