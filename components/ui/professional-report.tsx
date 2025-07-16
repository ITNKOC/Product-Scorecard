'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  TrendingUp, 
  Target, 
  Users, 
  DollarSign, 
  BarChart3, 
  Zap, 
  Package, 
  Megaphone,
  CheckCircle,
  AlertTriangle,
  PlayCircle,
  Settings,
  FileText,
  Calendar
} from 'lucide-react'

interface ProfessionalReportProps {
  report: any
  analysis: any
  onRegenerate: () => void
  regenerating: boolean
}

export function ProfessionalReport({ report, analysis, onRegenerate, regenerating }: ProfessionalReportProps) {
  const [activeTab, setActiveTab] = useState('executive')

  const tabs = [
    { id: 'executive', label: 'Résumé Exécutif', icon: FileText },
    { id: 'market', label: 'Analyse Marché', icon: TrendingUp },
    { id: 'competitive', label: 'Concurrence', icon: Target },
    { id: 'customer', label: 'Customer Persona', icon: Users },
    { id: 'testing', label: 'Test Produit', icon: PlayCircle },
    { id: 'sourcing', label: 'Sourcing', icon: Package },
    { id: 'tiktok', label: 'TikTok Strategy', icon: Zap },
    { id: 'meta', label: 'Meta Ads', icon: Megaphone },
    { id: 'operations', label: 'Opérations', icon: Settings },
    { id: 'financial', label: 'Projections', icon: DollarSign },
    { id: 'roadmap', label: 'Plan d\'Action', icon: Calendar },
    { id: 'kpis', label: 'KPIs & Suivi', icon: BarChart3 }
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'executive':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Résumé Exécutif
                </h3>
                <p className="text-blue-800 leading-relaxed">{report.executiveSummary}</p>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-red-50 to-red-100 border-red-200">
                <h3 className="text-lg font-semibold text-red-900 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Évaluation des Risques
                </h3>
                <p className="text-red-800 leading-relaxed">{report.riskAssessment}</p>
              </Card>
            </div>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">SWOT Analysis Stratégique</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Forces
                  </h4>
                  <ul className="text-sm text-green-700 space-y-2">
                    {report.swotAnalysis?.strengths?.map((item: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <h4 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Faiblesses
                  </h4>
                  <ul className="text-sm text-red-700 space-y-2">
                    {report.swotAnalysis?.weaknesses?.map((item: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-red-500 mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Opportunités
                  </h4>
                  <ul className="text-sm text-blue-700 space-y-2">
                    {report.swotAnalysis?.opportunities?.map((item: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <h4 className="font-semibold text-orange-800 mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Menaces
                  </h4>
                  <ul className="text-sm text-orange-700 space-y-2">
                    {report.swotAnalysis?.threats?.map((item: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-orange-500 mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        )

      case 'market':
        return (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Analyse de Marché Complète
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Taille du Marché</h4>
                  <p className="text-gray-600 text-sm mb-4">{report.marketAnalysis?.size}</p>
                  
                  <h4 className="font-medium text-gray-800 mb-2">Croissance</h4>
                  <p className="text-gray-600 text-sm mb-4">{report.marketAnalysis?.growth}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Saisonnalité</h4>
                  <p className="text-gray-600 text-sm">{report.marketAnalysis?.seasonality}</p>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="font-medium text-gray-800 mb-3">Tendances Clés</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {report.marketAnalysis?.trends?.map((trend: string, index: number) => (
                    <div key={index} className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <p className="text-blue-800 text-sm">{trend}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Validation de la Demande</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-medium text-green-800 mb-2">Signaux Positifs</h4>
                  <ul className="space-y-1">
                    {report.demandValidation?.signals?.map((signal: string, index: number) => (
                      <li key={index} className="text-sm text-green-700 flex items-start gap-2">
                        <CheckCircle className="w-3 h-3 mt-1 flex-shrink-0" />
                        {signal}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-red-800 mb-2">Risques Identifiés</h4>
                  <ul className="space-y-1">
                    {report.demandValidation?.risks?.map((risk: string, index: number) => (
                      <li key={index} className="text-sm text-red-700 flex items-start gap-2">
                        <AlertTriangle className="w-3 h-3 mt-1 flex-shrink-0" />
                        {risk}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-blue-800 mb-2">Méthodes de Validation</h4>
                  <ul className="space-y-1">
                    {report.demandValidation?.validation_methods?.map((method: string, index: number) => (
                      <li key={index} className="text-sm text-blue-700 flex items-start gap-2">
                        <PlayCircle className="w-3 h-3 mt-1 flex-shrink-0" />
                        {method}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        )

      case 'competitive':
        return (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Analyse Concurrentielle Approfondie
              </h3>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h4 className="font-medium text-gray-800 mb-2">Positionnement Stratégique</h4>
                <p className="text-gray-700">{report.competitiveAnalysis?.positioning}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-3">Avantages Concurrentiels</h4>
                  <ul className="space-y-2">
                    {report.competitiveAnalysis?.advantages?.map((advantage: string, index: number) => (
                      <li key={index} className="text-sm text-green-700 flex items-start gap-2">
                        <CheckCircle className="w-3 h-3 mt-1 flex-shrink-0" />
                        {advantage}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <h4 className="font-semibold text-red-800 mb-3">Menaces Concurrentielles</h4>
                  <ul className="space-y-2">
                    {report.competitiveAnalysis?.threats?.map((threat: string, index: number) => (
                      <li key={index} className="text-sm text-red-700 flex items-start gap-2">
                        <AlertTriangle className="w-3 h-3 mt-1 flex-shrink-0" />
                        {threat}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-3">Points de Différenciation</h4>
                  <ul className="space-y-2">
                    {report.competitiveAnalysis?.differentiation?.map((point: string, index: number) => (
                      <li key={index} className="text-sm text-blue-700 flex items-start gap-2">
                        <Zap className="w-3 h-3 mt-1 flex-shrink-0" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        )

      case 'customer':
        return (
          <div className="space-y-6">
            <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <h3 className="text-lg font-semibold text-purple-900 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Customer Persona Détaillé
              </h3>
              <div className="prose prose-purple max-w-none">
                <p className="text-purple-800 leading-relaxed whitespace-pre-line">
                  {report.customerPersona}
                </p>
              </div>
            </Card>
          </div>
        )

      case 'testing':
        return (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <PlayCircle className="w-5 h-5" />
                Stratégie de Test Produit
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-800 mb-3">Méthodologie</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700 text-sm whitespace-pre-line">
                      {report.productTesting?.methodology}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-800 mb-3">Informations Clés</h4>
                  <div className="space-y-3">
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <span className="text-blue-800 font-medium">Quantité Test: </span>
                      <span className="text-blue-700">{report.productTesting?.quantity} unités</span>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                      <span className="text-green-800 font-medium">Timeline: </span>
                      <span className="text-green-700">{report.productTesting?.timeline}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-medium text-gray-800 mb-3">KPIs de Test</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {report.productTesting?.kpis?.map((kpi: string, index: number) => (
                    <div key={index} className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                      <p className="text-yellow-800 text-sm font-medium">{kpi}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        )

      case 'sourcing':
        return (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5" />
                Stratégie Sourcing Complète
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-800 mb-3">Critères Fournisseurs</h4>
                  <ul className="space-y-2">
                    {report.sourcingStrategy?.suppliers?.map((criteria: string, index: number) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                        <CheckCircle className="w-3 h-3 mt-1 text-green-500 flex-shrink-0" />
                        {criteria}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-800 mb-3">Tactiques de Négociation</h4>
                  <ul className="space-y-2">
                    {report.sourcingStrategy?.negotiation?.map((tactic: string, index: number) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                        <Target className="w-3 h-3 mt-1 text-blue-500 flex-shrink-0" />
                        {tactic}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-800 mb-3">Contrôle Qualité</h4>
                  <ul className="space-y-2">
                    {report.sourcingStrategy?.quality_control?.map((control: string, index: number) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                        <CheckCircle className="w-3 h-3 mt-1 text-purple-500 flex-shrink-0" />
                        {control}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-800 mb-3">Logistique</h4>
                  <ul className="space-y-2">
                    {report.sourcingStrategy?.logistics?.map((item: string, index: number) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                        <Package className="w-3 h-3 mt-1 text-orange-500 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        )

      case 'tiktok':
        return (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Stratégie TikTok Complète
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Organic Strategy */}
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-3">Stratégie Organique</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <h5 className="font-medium text-green-700 text-sm mb-1">Types de Contenu</h5>
                      <ul className="space-y-1">
                        {report.tiktokStrategy?.organic?.content_types?.map((type: string, index: number) => (
                          <li key={index} className="text-xs text-green-600">• {type}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h5 className="font-medium text-green-700 text-sm mb-1">Hooks Viraux</h5>
                      <ul className="space-y-1">
                        {report.tiktokStrategy?.organic?.hooks?.map((hook: string, index: number) => (
                          <li key={index} className="text-xs text-green-600">• {hook}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h5 className="font-medium text-green-700 text-sm mb-1">Hashtags</h5>
                      <div className="flex flex-wrap gap-1">
                        {report.tiktokStrategy?.organic?.hashtags?.map((tag: string, index: number) => (
                          <span key={index} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h5 className="font-medium text-green-700 text-sm mb-1">Planning</h5>
                      <p className="text-xs text-green-600">{report.tiktokStrategy?.organic?.posting_schedule}</p>
                    </div>
                  </div>
                </div>

                {/* Viral Content */}
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-800 mb-3">Contenu Viral</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <h5 className="font-medium text-purple-700 text-sm mb-1">Concepts</h5>
                      <ul className="space-y-1">
                        {report.tiktokStrategy?.viral_content?.concepts?.map((concept: string, index: number) => (
                          <li key={index} className="text-xs text-purple-600">• {concept}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h5 className="font-medium text-purple-700 text-sm mb-1">Triggers</h5>
                      <ul className="space-y-1">
                        {report.tiktokStrategy?.viral_content?.triggers?.map((trigger: string, index: number) => (
                          <li key={index} className="text-xs text-purple-600">• {trigger}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h5 className="font-medium text-purple-700 text-sm mb-1">Formats</h5>
                      <ul className="space-y-1">
                        {report.tiktokStrategy?.viral_content?.formats?.map((format: string, index: number) => (
                          <li key={index} className="text-xs text-purple-600">• {format}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Influencers */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-3">Influenceurs</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <h5 className="font-medium text-blue-700 text-sm mb-1">Tiers</h5>
                      <ul className="space-y-1">
                        {report.tiktokStrategy?.influencers?.tiers?.map((tier: string, index: number) => (
                          <li key={index} className="text-xs text-blue-600">• {tier}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h5 className="font-medium text-blue-700 text-sm mb-1">Critères</h5>
                      <ul className="space-y-1">
                        {report.tiktokStrategy?.influencers?.criteria?.map((criteria: string, index: number) => (
                          <li key={index} className="text-xs text-blue-600">• {criteria}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h5 className="font-medium text-blue-700 text-sm mb-1">Rémunération</h5>
                      <p className="text-xs text-blue-600">{report.tiktokStrategy?.influencers?.compensation}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )

      case 'meta':
        return (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Megaphone className="w-5 h-5" />
                Stratégie Meta Ads
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-800 mb-3">Audiences Cibles</h4>
                  <div className="space-y-2">
                    {report.metaAdsStrategy?.audiences?.map((audience: string, index: number) => (
                      <div key={index} className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                        <p className="text-blue-800 text-sm">{audience}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-800 mb-3">Angles Créatifs</h4>
                  <div className="space-y-2">
                    {report.metaAdsStrategy?.creatives?.map((creative: string, index: number) => (
                      <div key={index} className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                        <p className="text-purple-800 text-sm">{creative}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-medium text-gray-800 mb-3">Structure Budgétaire</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h5 className="font-medium text-green-800 text-sm mb-1">Budget Quotidien</h5>
                    <p className="text-green-700 text-sm">{report.metaAdsStrategy?.budgets?.daily}</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <h5 className="font-medium text-yellow-800 text-sm mb-1">Phase Test</h5>
                    <p className="text-yellow-700 text-sm">{report.metaAdsStrategy?.budgets?.testing}</p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <h5 className="font-medium text-red-800 text-sm mb-1">Phase Scale</h5>
                    <p className="text-red-700 text-sm">{report.metaAdsStrategy?.budgets?.scaling}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-medium text-gray-800 mb-3">Funnels de Conversion</h4>
                <div className="space-y-2">
                  {report.metaAdsStrategy?.funnels?.map((funnel: string, index: number) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <p className="text-gray-700 text-sm">{funnel}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        )

      case 'operations':
        return (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Plan Opérationnel
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Inventory */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-3">Gestion Inventaire</h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-blue-700 font-medium text-sm">Commande initiale: </span>
                      <span className="text-blue-600 text-sm">{report.operationalPlan?.inventory?.initial_order}</span>
                    </div>
                    <div>
                      <span className="text-blue-700 font-medium text-sm">Réapprovisionnement: </span>
                      <span className="text-blue-600 text-sm">{report.operationalPlan?.inventory?.reorder_points}</span>
                    </div>
                    <div>
                      <span className="text-blue-700 font-medium text-sm">Stock sécurité: </span>
                      <span className="text-blue-600 text-sm">{report.operationalPlan?.inventory?.safety_stock}</span>
                    </div>
                  </div>
                </div>

                {/* Fulfillment */}
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-3">Fulfillment</h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-green-700 font-medium text-sm">3PL vs Interne: </span>
                      <span className="text-green-600 text-sm">{report.operationalPlan?.fulfillment?.['3pl_vs_inhouse']}</span>
                    </div>
                    <div>
                      <span className="text-green-700 font-medium text-sm">Expédition: </span>
                      <span className="text-green-600 text-sm">{report.operationalPlan?.fulfillment?.shipping_strategy}</span>
                    </div>
                    <div>
                      <span className="text-green-700 font-medium text-sm">Retours: </span>
                      <span className="text-green-600 text-sm">{report.operationalPlan?.fulfillment?.returns_process}</span>
                    </div>
                  </div>
                </div>

                {/* Customer Service */}
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-800 mb-3">Service Client</h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-purple-700 font-medium text-sm">Canaux: </span>
                      <div className="text-purple-600 text-sm">
                        {report.operationalPlan?.customer_service?.channels?.map((channel: string, index: number) => (
                          <div key={index}>• {channel}</div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-purple-700 font-medium text-sm">Objectifs: </span>
                      <span className="text-purple-600 text-sm">{report.operationalPlan?.customer_service?.response_targets}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )

      case 'financial':
        return (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Projections Financières
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Projections */}
                <div>
                  <h4 className="font-medium text-gray-800 mb-3">Projections Chiffre d'Affaires</h4>
                  <div className="space-y-3">
                    <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                      <span className="text-green-800 font-medium">Mois 1: </span>
                      <span className="text-green-700">{report.financialProjections?.revenue?.month1}</span>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                      <span className="text-green-800 font-medium">Mois 3: </span>
                      <span className="text-green-700">{report.financialProjections?.revenue?.month3}</span>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                      <span className="text-green-800 font-medium">Mois 6: </span>
                      <span className="text-green-700">{report.financialProjections?.revenue?.month6}</span>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                      <span className="text-green-800 font-medium">Année 1: </span>
                      <span className="text-green-700">{report.financialProjections?.revenue?.month12}</span>
                    </div>
                  </div>
                </div>

                {/* Cost Structure */}
                <div>
                  <h4 className="font-medium text-gray-800 mb-3">Structure des Coûts</h4>
                  <div className="space-y-3">
                    <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                      <span className="text-red-800 font-medium">COGS: </span>
                      <span className="text-red-700">{report.financialProjections?.costs?.cogs}</span>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <span className="text-blue-800 font-medium">Marketing: </span>
                      <span className="text-blue-700">{report.financialProjections?.costs?.marketing}</span>
                    </div>
                    <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                      <span className="text-yellow-800 font-medium">Opérations: </span>
                      <span className="text-yellow-700">{report.financialProjections?.costs?.operations}</span>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <span className="text-gray-800 font-medium">Fixes: </span>
                      <span className="text-gray-700">{report.financialProjections?.costs?.fixed}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-medium text-gray-800 mb-3">Métriques ROI</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <h5 className="font-medium text-purple-800 text-sm mb-1">Période de Retour</h5>
                    <p className="text-purple-700 text-sm">{report.financialProjections?.roi?.payback_period}</p>
                  </div>
                  <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                    <h5 className="font-medium text-indigo-800 text-sm mb-1">ROAS Cibles</h5>
                    <p className="text-indigo-700 text-sm">{report.financialProjections?.roi?.roas_targets}</p>
                  </div>
                  <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
                    <h5 className="font-medium text-teal-800 text-sm mb-1">Point d'Équilibre</h5>
                    <p className="text-teal-700 text-sm">{report.financialProjections?.roi?.break_even}</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )

      case 'roadmap':
        return (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Roadmap d'Implémentation
              </h3>
              
              <div className="space-y-6">
                {report.implementationRoadmap?.phases?.map((phase: any, index: number) => (
                  <div key={index} className={`p-4 rounded-lg border-2 ${
                    index === 0 ? 'bg-blue-50 border-blue-200' :
                    index === 1 ? 'bg-green-50 border-green-200' :
                    'bg-purple-50 border-purple-200'
                  }`}>
                    <h4 className={`font-semibold mb-3 ${
                      index === 0 ? 'text-blue-800' :
                      index === 1 ? 'text-green-800' :
                      'text-purple-800'
                    }`}>
                      {phase.name}
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className={`font-medium text-sm mb-2 ${
                          index === 0 ? 'text-blue-700' :
                          index === 1 ? 'text-green-700' :
                          'text-purple-700'
                        }`}>Tâches Critiques</h5>
                        <ul className="space-y-1">
                          {phase.tasks?.map((task: string, taskIndex: number) => (
                            <li key={taskIndex} className={`text-sm flex items-start gap-2 ${
                              index === 0 ? 'text-blue-600' :
                              index === 1 ? 'text-green-600' :
                              'text-purple-600'
                            }`}>
                              <CheckCircle className="w-3 h-3 mt-1 flex-shrink-0" />
                              {task}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h5 className={`font-medium text-sm mb-2 ${
                          index === 0 ? 'text-blue-700' :
                          index === 1 ? 'text-green-700' :
                          'text-purple-700'
                        }`}>Livrables</h5>
                        <ul className="space-y-1">
                          {phase.deliverables?.map((deliverable: string, delivIndex: number) => (
                            <li key={delivIndex} className={`text-sm flex items-start gap-2 ${
                              index === 0 ? 'text-blue-600' :
                              index === 1 ? 'text-green-600' :
                              'text-purple-600'
                            }`}>
                              <Package className="w-3 h-3 mt-1 flex-shrink-0" />
                              {deliverable}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <h4 className="font-medium text-yellow-800 mb-2">Milestones Clés</h4>
                  <ul className="space-y-1">
                    {report.implementationRoadmap?.milestones?.map((milestone: string, index: number) => (
                      <li key={index} className="text-sm text-yellow-700 flex items-start gap-2">
                        <Calendar className="w-3 h-3 mt-1 flex-shrink-0" />
                        {milestone}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <h4 className="font-medium text-orange-800 mb-2">Chemin Critique</h4>
                  <p className="text-sm text-orange-700">{report.implementationRoadmap?.critical_path}</p>
                </div>
              </div>
            </Card>

            {/* Contingency Plans */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Plans de Contingence
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {Object.entries(report.contingencyPlans || {}).map(([scenario, plan]: [string, any], index) => (
                  <div key={index} className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <h4 className="font-semibold text-red-800 mb-3 capitalize">
                      {scenario.replace('_', ' ')}
                    </h4>
                    
                    <div className="space-y-3">
                      <div>
                        <h5 className="font-medium text-red-700 text-sm mb-1">Signaux d'Alerte</h5>
                        <ul className="space-y-1">
                          {plan.triggers?.map((trigger: string, triggerIndex: number) => (
                            <li key={triggerIndex} className="text-xs text-red-600 flex items-start gap-1">
                              <AlertTriangle className="w-2 h-2 mt-1 flex-shrink-0" />
                              {trigger}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h5 className="font-medium text-red-700 text-sm mb-1">Actions Correctives</h5>
                        <ul className="space-y-1">
                          {plan.actions?.map((action: string, actionIndex: number) => (
                            <li key={actionIndex} className="text-xs text-red-600 flex items-start gap-1">
                              <CheckCircle className="w-2 h-2 mt-1 flex-shrink-0" />
                              {action}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )

      case 'kpis':
        return (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Dashboard KPIs & Monitoring
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-3">KPIs Financiers</h4>
                  <ul className="space-y-2">
                    {report.kpiDashboard?.financial?.map((kpi: string, index: number) => (
                      <li key={index} className="text-sm text-green-700 flex items-start gap-2">
                        <DollarSign className="w-3 h-3 mt-1 flex-shrink-0" />
                        {kpi}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-3">KPIs Marketing</h4>
                  <ul className="space-y-2">
                    {report.kpiDashboard?.marketing?.map((kpi: string, index: number) => (
                      <li key={index} className="text-sm text-blue-700 flex items-start gap-2">
                        <TrendingUp className="w-3 h-3 mt-1 flex-shrink-0" />
                        {kpi}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-800 mb-3">KPIs Opérationnels</h4>
                  <ul className="space-y-2">
                    {report.kpiDashboard?.operational?.map((kpi: string, index: number) => (
                      <li key={index} className="text-sm text-purple-700 flex items-start gap-2">
                        <Settings className="w-3 h-3 mt-1 flex-shrink-0" />
                        {kpi}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="font-medium text-gray-800 mb-2">Fréquence de Monitoring</h4>
                <p className="text-gray-700 text-sm">{report.kpiDashboard?.monitoring_frequency}</p>
              </div>
            </Card>
          </div>
        )

      default:
        return <div>Section non trouvée</div>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header avec actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-light text-black tracking-tight">
            Rapport d'Analyse Professionnel
          </h2>
          <p className="text-gray-600 text-sm">
            Score: {report.finalScore}/100 • Version: {report.reportVersion || 'v2.0-professional'}
          </p>
        </div>
        
        <Button 
          onClick={onRegenerate}
          disabled={regenerating}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
        >
          {regenerating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Régénération...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 mr-2" />
              Régénérer le rapport
            </>
          )}
        </Button>
      </div>

      {/* Navigation par onglets */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 overflow-x-auto pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Contenu de l'onglet actif */}
      <div className="min-h-[400px]">
        {renderTabContent()}
      </div>
    </div>
  )
}