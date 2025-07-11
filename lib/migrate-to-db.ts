// Script de migration : localStorage vers PostgreSQL
// À exécuter une seule fois pour transférer les données existantes

import { PrismaClient } from '@prisma/client'
import { localStorage_db } from './storage'

const prisma = new PrismaClient()

export async function migrateLocalStorageToDatabase() {
  try {
    console.log('🚀 Début de la migration localStorage → PostgreSQL...')
    
    // 1. Migrer les analyses
    const localAnalyses = localStorage_db.getAnalyses()
    console.log(`📊 ${localAnalyses.length} analyses trouvées dans localStorage`)
    
    if (localAnalyses.length === 0) {
      console.log('✅ Aucune donnée à migrer')
      return
    }

    // 2. Créer un utilisateur temporaire
    const tempUser = await prisma.user.upsert({
      where: { id: 'temp-user-id' },
      update: {},
      create: {
        id: 'temp-user-id',
        email: 'temp@example.com',
        name: 'Utilisateur Test'
      }
    })
    console.log('👤 Utilisateur temporaire créé/trouvé')

    // 3. Migrer chaque analyse
    let migratedCount = 0
    for (const localAnalysis of localAnalyses) {
      try {
        // Vérifier si l'analyse existe déjà
        const existing = await prisma.productAnalysis.findFirst({
          where: {
            productName: localAnalysis.productName,
            userId: tempUser.id
          }
        })

        if (existing) {
          console.log(`⏭️  Analyse "${localAnalysis.productName}" déjà migrée`)
          continue
        }

        // Créer l'analyse dans PostgreSQL
        const { id, createdAt, updatedAt, userId, ...analysisData } = localAnalysis
        
        const newAnalysis = await prisma.productAnalysis.create({
          data: {
            userId: tempUser.id,
            ...analysisData
          }
        })

        // Migrer les rapports associés
        const localReports = localStorage_db.getReportsByAnalysisId(localAnalysis.id)
        
        for (const localReport of localReports) {
          const { id: reportId, createdAt: reportCreatedAt, productAnalysisId, userId: reportUserId, ...reportData } = localReport
          
          await prisma.analysisReport.create({
            data: {
              productAnalysisId: newAnalysis.id,
              userId: tempUser.id,
              ...reportData
            }
          })
        }

        migratedCount++
        console.log(`✅ Analyse "${localAnalysis.productName}" migrée avec ${localReports.length} rapport(s)`)
        
      } catch (error) {
        console.error(`❌ Erreur lors de la migration de "${localAnalysis.productName}":`, error)
      }
    }

    console.log(`🎉 Migration terminée ! ${migratedCount}/${localAnalyses.length} analyses migrées`)
    
    // 4. Optionnel : nettoyer localStorage après migration réussie
    if (migratedCount === localAnalyses.length) {
      console.log('🧹 Nettoyage de localStorage...')
      localStorage_db.clearAll()
      console.log('✅ localStorage nettoyé')
    }

  } catch (error) {
    console.error('❌ Erreur durant la migration:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Fonction utilitaire pour afficher les données migrées
export async function displayMigratedData() {
  try {
    const analyses = await prisma.productAnalysis.findMany({
      include: {
        user: true,
        analysisReports: true
      }
    })

    console.log('\n📊 Données migrées dans PostgreSQL:')
    console.log(`- ${analyses.length} analyses`)
    
    analyses.forEach((analysis, index) => {
      console.log(`  ${index + 1}. "${analysis.productName}" (${analysis.category})`)
      console.log(`     Score: ${analysis.finalScore || 'N/A'}/100`)
      console.log(`     Rapports: ${analysis.analysisReports.length}`)
    })
    
  } catch (error) {
    console.error('Erreur lors de l\'affichage:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Script exécutable
if (require.main === module) {
  migrateLocalStorageToDatabase()
    .then(() => displayMigratedData())
    .catch(console.error)
}