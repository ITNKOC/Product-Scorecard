import jsPDF from 'jspdf';
import { ProductAnalysisWithUser } from '@/types/product';

interface AnalysisWithMargin extends ProductAnalysisWithUser {
  grossMarginPercentage: number;
}

export const generateAnalysisPDF = (analysis: AnalysisWithMargin) => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  let yPosition = 20;
  const lineHeight = 7;
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);

  // Helper function to add text with word wrapping
  const addText = (text: string, x: number, size: number = 10, style: 'normal' | 'bold' = 'normal') => {
    pdf.setFontSize(size);
    pdf.setFont('helvetica', style);
    
    if (yPosition > pageHeight - 30) {
      pdf.addPage();
      yPosition = 20;
    }
    
    const lines = pdf.splitTextToSize(text, contentWidth - x + margin);
    pdf.text(lines, x, yPosition);
    yPosition += lines.length * lineHeight;
    return yPosition;
  };

  // Helper function to add a section header
  const addSectionHeader = (title: string) => {
    yPosition += 5;
    pdf.setFillColor(59, 130, 246); // Blue background
    pdf.rect(margin, yPosition - 5, contentWidth, 12, 'F');
    pdf.setTextColor(255, 255, 255); // White text
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text(title, margin + 5, yPosition + 3);
    pdf.setTextColor(0, 0, 0); // Reset to black
    yPosition += 15;
  };

  // Helper function to add key-value pairs
  const addKeyValue = (key: string, value: string | number | null | undefined, unit: string = '') => {
    const displayValue = value !== null && value !== undefined ? `${value}${unit}` : 'N/A';
    addText(`${key}: `, margin, 10, 'bold');
    yPosition -= lineHeight;
    addText(`${displayValue}`, margin + 60, 10);
  };

  // Title Page
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text('RAPPORT D\'ANALYSE PRODUIT', pageWidth / 2, 40, { align: 'center' });
  
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'normal');
  pdf.text(analysis.productName, pageWidth / 2, 60, { align: 'center' });
  
  pdf.setFontSize(12);
  pdf.text(`Catégorie: ${analysis.category}`, pageWidth / 2, 75, { align: 'center' });
  pdf.text(`Généré le: ${new Date().toLocaleDateString('fr-FR')}`, pageWidth / 2, 90, { align: 'center' });
  
  // Score global (if available)
  if (analysis.finalScore) {
    yPosition = 110;
    pdf.setFillColor(34, 197, 94); // Green background
    if (analysis.finalScore < 60) pdf.setFillColor(239, 68, 68); // Red for low scores
    else if (analysis.finalScore < 80) pdf.setFillColor(245, 158, 11); // Yellow for medium scores
    
    pdf.rect(pageWidth / 2 - 30, yPosition, 60, 20, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`Score: ${Math.round(analysis.finalScore)}/100`, pageWidth / 2, yPosition + 13, { align: 'center' });
    pdf.setTextColor(0, 0, 0);
  }

  // New page for detailed analysis
  pdf.addPage();
  yPosition = 20;

  // 1. Informations Essentielles
  addSectionHeader('1. INFORMATIONS ESSENTIELLES');
  addKeyValue('Nom du produit', analysis.productName);
  addKeyValue('Catégorie', analysis.category);
  if (analysis.sourcingUrl) {
    addText('URL Fournisseur: ', margin, 10, 'bold');
    yPosition -= lineHeight;
    addText(analysis.sourcingUrl, margin + 60, 10);
  }
  
  yPosition += 5;
  addText('Description:', margin, 10, 'bold');
  addText(analysis.productDescription, margin, 10);

  // 2. Analyse Financière
  addSectionHeader('2. ANALYSE FINANCIÈRE');
  addKeyValue('Prix unitaire', analysis.unitPrice, '€');
  addKeyValue('Frais de livraison', analysis.shippingCost, '€');
  addKeyValue('Coût branding', analysis.brandingCost, '€');
  addKeyValue('Prix de vente souhaité', analysis.desiredSellingPrice, '€');
  addKeyValue('Marge brute', Math.round(analysis.grossMarginPercentage), '%');
  if (analysis.storageCostPerUnit) {
    addKeyValue('Coût stockage/unité', analysis.storageCostPerUnit, '€');
  }

  // 3. Analyse de Marché
  addSectionHeader('3. ANALYSE DE MARCHÉ');
  addKeyValue('Volume de recherche mensuel', analysis.monthlySearchVolume ? (analysis.monthlySearchVolume / 1000).toFixed(1) + 'K' : null);
  addKeyValue('Tendance Google (12 mois)', analysis.googleTrends12MonthAverage, '/100');
  addKeyValue('Produit saisonnier', analysis.isSeasonalProduct ? 'Oui' : 'Non');
  addKeyValue('Taux de croissance du marché', analysis.marketGrowthRate, '%');

  // 4. Analyse Concurrentielle
  addSectionHeader('4. ANALYSE CONCURRENTIELLE');
  addKeyValue('Niveau de concurrence', analysis.competitionLevel, '/5');
  addKeyValue('Nombre de concurrents directs', analysis.competitorCount);
  addKeyValue('Note moyenne des concurrents', analysis.averageRating, '/5');
  
  if (analysis.differentiationPoints) {
    yPosition += 5;
    addText('Points de différenciation:', margin, 10, 'bold');
    addText(analysis.differentiationPoints, margin, 10);
  }

  // 5. Critères Qualitatifs
  addSectionHeader('5. CRITÈRES QUALITATIFS');
  addKeyValue('Facteur WOW', analysis.wowFactor, '/5');
  addKeyValue('Simplicité', analysis.simplicity, '/5');
  addKeyValue('Facilité d\'utilisation', analysis.easeOfUse, '/5');
  addKeyValue('Résout un problème', analysis.solvesProblem ? 'Oui' : 'Non');
  addKeyValue('Produit innovant', analysis.isInnovative ? 'Oui' : 'Non');
  addKeyValue('Potentiel avant/après', analysis.beforeAfterPotential, '/5');

  // 6. Logistique et Stock
  addSectionHeader('6. LOGISTIQUE ET STOCK');
  addKeyValue('Stock minimum requis', analysis.minimumStock, ' unités');
  addKeyValue('Délai de livraison', analysis.deliveryTime, ' jours');
  addKeyValue('Produit fragile', analysis.isFragile ? 'Oui' : 'Non');
  if (analysis.availableVariants && Array.isArray(analysis.availableVariants)) {
    addKeyValue('Variantes disponibles', analysis.availableVariants.join(', '));
  }

  // 7. Preuve Sociale et Avis
  addSectionHeader('7. PREUVE SOCIALE ET AVIS');
  addKeyValue('Force de la preuve sociale', analysis.socialProofStrength, '/5');
  addKeyValue('Nombre moyen d\'avis', analysis.averageReviewCount);
  addKeyValue('Taux d\'engagement social', analysis.socialEngagementRate, '%');

  // 8. Données Stratégiques et Financières
  if (analysis.initialInvestment || analysis.marketingBudget || analysis.legalBarriersLevel) {
    addSectionHeader('8. DONNÉES STRATÉGIQUES');
    if (analysis.initialInvestment) {
      addKeyValue('Investissement initial', analysis.initialInvestment, '€');
    }
    if (analysis.marketingBudget) {
      addKeyValue('Budget marketing', analysis.marketingBudget, '€');
    }
    if (analysis.legalBarriersLevel) {
      addKeyValue('Barrières légales', analysis.legalBarriersLevel, '/5');
    }
    if (analysis.strategicNotes) {
      yPosition += 5;
      addText('Notes stratégiques:', margin, 10, 'bold');
      addText(analysis.strategicNotes, margin, 10);
    }
  }

  // AI Report Section
  if (analysis.analysisReports && analysis.analysisReports.length > 0) {
    const report = analysis.analysisReports[0];
    
    pdf.addPage();
    yPosition = 20;
    
    addSectionHeader('RAPPORT D\'ANALYSE STRATÉGIQUE IA');
    
    // Customer Persona
    if (report.customerPersona) {
      addText('PERSONA CLIENT CIBLE', margin, 12, 'bold');
      yPosition += 3;
      addText(report.customerPersona, margin, 10);
      yPosition += 10;
    }

    // SWOT Analysis
    if (report.swotAnalysis) {
      const swot = typeof report.swotAnalysis === 'string' 
        ? JSON.parse(report.swotAnalysis) 
        : report.swotAnalysis;
      
      addText('ANALYSE SWOT', margin, 12, 'bold');
      yPosition += 5;
      
      if (swot.strengths?.length > 0) {
        addText('Forces:', margin, 10, 'bold');
        swot.strengths.forEach((strength: string) => {
          addText(`• ${strength}`, margin + 10, 10);
        });
        yPosition += 5;
      }
      
      if (swot.weaknesses?.length > 0) {
        addText('Faiblesses:', margin, 10, 'bold');
        swot.weaknesses.forEach((weakness: string) => {
          addText(`• ${weakness}`, margin + 10, 10);
        });
        yPosition += 5;
      }
      
      if (swot.opportunities?.length > 0) {
        addText('Opportunités:', margin, 10, 'bold');
        swot.opportunities.forEach((opportunity: string) => {
          addText(`• ${opportunity}`, margin + 10, 10);
        });
        yPosition += 5;
      }
      
      if (swot.threats?.length > 0) {
        addText('Menaces:', margin, 10, 'bold');
        swot.threats.forEach((threat: string) => {
          addText(`• ${threat}`, margin + 10, 10);
        });
        yPosition += 10;
      }
    }

    // Marketing Strategy
    if (report.marketingStrategy) {
      const marketing = typeof report.marketingStrategy === 'string' 
        ? JSON.parse(report.marketingStrategy) 
        : report.marketingStrategy;
      
      addText('STRATÉGIE MARKETING', margin, 12, 'bold');
      yPosition += 3;
      
      if (marketing.channels?.length > 0) {
        addText('Canaux recommandés:', margin, 10, 'bold');
        marketing.channels.forEach((channel: string) => {
          addText(`• ${channel}`, margin + 10, 10);
        });
        yPosition += 5;
      }
      
      if (marketing.angles?.length > 0) {
        addText('Angles créatifs:', margin, 10, 'bold');
        marketing.angles.forEach((angle: string) => {
          addText(`• ${angle}`, margin + 10, 10);
        });
      }
    }
  }

  // Footer on each page
  const totalPages = pdf.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.text(
      `Page ${i} / ${totalPages} - ${analysis.productName} - ${new Date().toLocaleDateString('fr-FR')}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
  }

  return pdf;
};

export const downloadAnalysisPDF = async (analysisId: string, productName: string) => {
  try {
    const response = await fetch(`/api/export/pdf/${analysisId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch analysis data');
    }
    
    const analysisData = await response.json();
    const pdf = generateAnalysisPDF(analysisData);
    
    // Generate filename
    const sanitizedProductName = productName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `analyse_${sanitizedProductName}_${timestamp}.pdf`;
    
    // Download the PDF
    pdf.save(filename);
    
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};