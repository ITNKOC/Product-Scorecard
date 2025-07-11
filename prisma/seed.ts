import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Seed product templates for different categories
  const templates = [
    {
      name: "Gadget Cuisine",
      category: "Kitchen",
      description: "Template pour les gadgets et accessoires de cuisine",
      templateData: {
        // Essential Info defaults
        category: "Kitchen",
        // Pricing defaults
        brandingCost: 2.0,
        // Qualitative defaults
        wowFactor: 4,
        explanationSimplicity: 4,
        easeOfUse: 5,
        solvesProblem: true,
        // Logistics defaults
        isFragile: true,
        // Financial defaults
        grossMarginPercentage: 65,
        estimatedReturnRate: 5,
        repurchaseFrequency: "yearly",
        // Legal considerations
        legalBarriers: "Vérifier certifications alimentaires Santé Canada"
      }
    },
    {
      name: "Accessoire Fitness",
      category: "Fitness",
      description: "Template pour les accessoires de fitness et sport",
      templateData: {
        category: "Fitness",
        brandingCost: 3.0,
        wowFactor: 3,
        explanationSimplicity: 5,
        easeOfUse: 4,
        solvesProblem: true,
        beforeAfterPotential: 5,
        isFragile: false,
        grossMarginPercentage: 70,
        estimatedReturnRate: 8,
        repurchaseFrequency: "yearly",
        crossSellUpSellPotential: "Compléments nutritionnels, équipements avancés"
      }
    },
    {
      name: "Beauté & Soins",
      category: "Beauty",
      description: "Template pour les produits de beauté et soins personnels",
      templateData: {
        category: "Beauty",
        brandingCost: 4.0,
        wowFactor: 4,
        explanationSimplicity: 3,
        easeOfUse: 4,
        solvesProblem: true,
        beforeAfterPotential: 5,
        isFragile: true,
        grossMarginPercentage: 75,
        estimatedReturnRate: 10,
        repurchaseFrequency: "monthly",
        legalBarriers: "Certifications cosmétiques Santé Canada obligatoires"
      }
    },
    {
      name: "Tech & Gadgets",
      category: "Technology",
      description: "Template pour les gadgets technologiques",
      templateData: {
        category: "Technology",
        brandingCost: 5.0,
        wowFactor: 5,
        explanationSimplicity: 2,
        easeOfUse: 3,
        isInnovative: true,
        isFragile: true,
        grossMarginPercentage: 60,
        estimatedReturnRate: 12,
        repurchaseFrequency: "yearly",
        legalBarriers: "Certifications électroniques (CE, FCC) requises"
      }
    },
    {
      name: "Maison & Décoration",
      category: "Home",
      description: "Template pour les produits de décoration et maison",
      templateData: {
        category: "Home",
        brandingCost: 3.5,
        wowFactor: 3,
        explanationSimplicity: 4,
        easeOfUse: 4,
        solvesProblem: false,
        isFragile: true,
        grossMarginPercentage: 65,
        estimatedReturnRate: 6,
        repurchaseFrequency: "rarely"
      }
    }
  ]

  // Vérifier si des templates existent déjà
  const existingTemplates = await prisma.productTemplate.findMany()
  
  if (existingTemplates.length === 0) {
    // Créer tous les templates
    await prisma.productTemplate.createMany({
      data: templates,
      skipDuplicates: true
    })
    console.log('✅ Product templates seeded successfully!')
  } else {
    console.log('ℹ️ Product templates already exist, skipping seed')
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })