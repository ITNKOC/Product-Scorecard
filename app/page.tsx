"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Logo from "@/components/ui/Logo";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-10 py-4 sm:py-6 lg:py-8 px-4 sm:px-6">
        <div className="container mx-auto flex justify-center items-center">
          {/* Logo responsive: icon sur mobile, horizontal sur desktop */}
          <Link href="/" className="cursor-pointer hover:opacity-80 transition-opacity duration-200">
            <div className="block sm:hidden">
              <Logo size="lg" variant="icon" showText={false} />
            </div>
            <div className="hidden sm:block">
              <Logo size="xl" variant="horizontal" showText={false} />
            </div>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 sm:pt-40 lg:pt-48 pb-16 sm:pb-20 lg:pb-24 px-4 sm:px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center space-y-8 sm:space-y-10 lg:space-y-12">
            {/* Hero Title */}
            <div className="space-y-6 sm:space-y-8">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light text-black leading-tight tracking-tight">
                Validez vos produits
                <br />
                <span className="font-medium">avec intelligence</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700 max-w-3xl lg:max-w-4xl mx-auto leading-relaxed font-light px-4 sm:px-0">
                Une plateforme d'analyse et de validation de produits e-commerce alimentée par l'intelligence artificielle. 
                Obtenez des insights précis et des recommandations stratégiques pour maximiser vos chances de succès.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center pt-8 sm:pt-10 lg:pt-12 px-4 sm:px-0">
              <Link href="/analyze" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto text-base sm:text-lg px-8 sm:px-12 py-4 bg-black text-white hover:bg-gray-800 transition-all duration-300 font-medium tracking-wide min-h-[48px]"
                >
                  Commencer l'analyse
                </Button>
              </Link>
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto text-base sm:text-lg px-8 sm:px-12 py-4 border-2 border-black text-black hover:bg-black hover:text-white transition-all duration-300 font-medium tracking-wide min-h-[48px]"
                >
                  Consulter mes analyses
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20 lg:py-32 px-4 sm:px-6 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-black mb-4 sm:mb-6 tracking-tight px-4 sm:px-0">
              Une approche méthodique
            </h2>
            <p className="text-lg sm:text-xl text-gray-700 max-w-2xl lg:max-w-3xl mx-auto font-light leading-relaxed px-4 sm:px-0">
              Notre plateforme combine expertise métier et intelligence artificielle 
              pour vous offrir une analyse complète et objective de vos produits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
            <div className="text-center group px-4 sm:px-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-black rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8 group-hover:scale-105 transition-transform duration-300">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-medium mb-3 sm:mb-4 text-black tracking-wide">
                Analyse Multi-Critères
              </h3>
              <p className="text-gray-700 leading-relaxed font-light text-base sm:text-base">
                Évaluation systématique sur plus de 40 critères structurés 
                couvrant tous les aspects de la viabilité commerciale.
              </p>
            </div>

            <div className="text-center group px-4 sm:px-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-black rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8 group-hover:scale-105 transition-transform duration-300">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-medium mb-3 sm:mb-4 text-black tracking-wide">
                Intelligence Artificielle
              </h3>
              <p className="text-gray-700 leading-relaxed font-light text-base sm:text-base">
                Assistance contextuelle et recommandations personnalisées 
                basées sur l'analyse de vos données spécifiques.
              </p>
            </div>

            <div className="text-center group px-4 sm:px-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-black rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8 group-hover:scale-105 transition-transform duration-300">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-medium mb-3 sm:mb-4 text-black tracking-wide">
                Rapports Détaillés
              </h3>
              <p className="text-gray-700 leading-relaxed font-light text-base sm:text-base">
                Score de viabilité sur 100 points accompagné d'une stratégie 
                marketing et de recommandations actionables.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-16 sm:py-20 lg:py-32 px-4 sm:px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-black mb-4 sm:mb-6 tracking-tight px-4 sm:px-0">
              Processus en trois étapes
            </h2>
            <p className="text-lg sm:text-xl text-gray-700 font-light leading-relaxed max-w-2xl lg:max-w-3xl mx-auto px-4 sm:px-0">
              Une méthodologie éprouvée pour une analyse rigoureuse et des résultats fiables.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 sm:gap-14 lg:gap-16">
            <div className="text-center px-4 sm:px-0">
              <div className="relative mb-6 sm:mb-8">
                <div className="w-20 h-20 sm:w-24 sm:h-24 border-2 border-black rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <span className="text-2xl sm:text-3xl font-light text-black">01</span>
                </div>
              </div>
              <h3 className="text-xl sm:text-2xl font-medium mb-4 sm:mb-6 text-black tracking-wide">
                Collecte des données
              </h3>
              <p className="text-gray-700 leading-relaxed font-light text-base sm:text-lg">
                Renseignez les informations de votre produit à travers 
                notre interface guidée en huit sections structurées.
              </p>
            </div>

            <div className="text-center px-4 sm:px-0">
              <div className="relative mb-6 sm:mb-8">
                <div className="w-20 h-20 sm:w-24 sm:h-24 border-2 border-black rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <span className="text-2xl sm:text-3xl font-light text-black">02</span>
                </div>
              </div>
              <h3 className="text-xl sm:text-2xl font-medium mb-4 sm:mb-6 text-black tracking-wide">
                Analyse algorithmique
              </h3>
              <p className="text-gray-700 leading-relaxed font-light text-base sm:text-lg">
                Notre algorithme traite vos données selon des critères 
                économiques éprouvés et génère votre score de viabilité.
              </p>
            </div>

            <div className="text-center px-4 sm:px-0">
              <div className="relative mb-6 sm:mb-8">
                <div className="w-20 h-20 sm:w-24 sm:h-24 border-2 border-black rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <span className="text-2xl sm:text-3xl font-light text-black">03</span>
                </div>
              </div>
              <h3 className="text-xl sm:text-2xl font-medium mb-4 sm:mb-6 text-black tracking-wide">
                Stratégie personnalisée
              </h3>
              <p className="text-gray-700 leading-relaxed font-light text-base sm:text-lg">
                Recevez un rapport détaillé avec recommandations stratégiques 
                et plan d'action pour optimiser votre lancement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 lg:py-32 px-4 sm:px-6 bg-black">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="text-white">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light mb-6 sm:mb-8 tracking-tight px-4 sm:px-0">
              Prêt pour l'analyse ?
            </h2>
            <p className="text-lg sm:text-xl mb-8 sm:mb-10 lg:mb-12 text-gray-300 font-light leading-relaxed max-w-2xl lg:max-w-3xl mx-auto px-4 sm:px-0">
              Rejoignez les entrepreneurs qui font confiance à notre plateforme 
              pour valider leurs concepts produits avec rigueur et précision.
            </p>
            <Link href="/analyze" className="w-full sm:w-auto inline-block px-4 sm:px-0">
              <Button
                size="lg"
                className="w-full sm:w-auto text-base sm:text-lg px-8 sm:px-12 py-4 bg-white text-black hover:bg-gray-100 transition-all duration-300 font-medium tracking-wide min-h-[48px]"
              >
                Démarrer l'analyse
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-white border-t border-gray-200">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12">
            <div className="col-span-1 sm:col-span-2 lg:col-span-2 text-center sm:text-left">
              <div className="mb-4 sm:mb-6">
                {/* Logo responsive: icon sur mobile, horizontal sur desktop */}
                <div className="flex justify-center sm:justify-start">
                  <div className="block sm:hidden">
                    <Logo size="md" variant="icon" showText={false} />
                  </div>
                  <div className="hidden sm:block">
                    <Logo size="lg" variant="horizontal" showText={false} />
                  </div>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed font-light text-base sm:text-lg max-w-md mx-auto sm:mx-0">
                Plateforme d'analyse et de validation de produits e-commerce 
                alimentée par l'intelligence artificielle.
              </p>
            </div>
            <div className="text-center sm:text-left">
              <h4 className="font-medium mb-4 sm:mb-6 text-black text-base sm:text-lg tracking-wide">Plateforme</h4>
              <ul className="space-y-3 sm:space-y-4 text-gray-700 font-light">
                <li>
                  <Link
                    href="/analyze"
                    className="hover:text-black transition-colors leading-relaxed text-sm sm:text-base"
                  >
                    Analyse de produit
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard"
                    className="hover:text-black transition-colors leading-relaxed text-sm sm:text-base"
                  >
                    Tableau de bord
                  </Link>
                </li>
                <li className="hover:text-black transition-colors cursor-pointer leading-relaxed text-sm sm:text-base">
                  Assistant IA
                </li>
                <li className="hover:text-black transition-colors cursor-pointer leading-relaxed text-sm sm:text-base">
                  Rapports détaillés
                </li>
              </ul>
            </div>
            <div className="text-center sm:text-left">
              <h4 className="font-medium mb-4 sm:mb-6 text-black text-base sm:text-lg tracking-wide">Ressources</h4>
              <ul className="space-y-3 sm:space-y-4 text-gray-700 font-light">
                <li className="hover:text-black transition-colors cursor-pointer leading-relaxed text-sm sm:text-base">
                  Documentation
                </li>
                <li className="hover:text-black transition-colors cursor-pointer leading-relaxed text-sm sm:text-base">
                  Guide utilisateur
                </li>
                <li className="hover:text-black transition-colors cursor-pointer leading-relaxed text-sm sm:text-base">
                  Questions fréquentes
                </li>
                <li className="hover:text-black transition-colors cursor-pointer leading-relaxed text-sm sm:text-base">
                  Support technique
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-12 sm:mt-14 lg:mt-16 pt-6 sm:pt-8 text-center">
            <p className="text-gray-600 font-light text-sm sm:text-base">&copy; 2024. Tous droits réservés.</p>
          </div>
        </div>
      </footer>

    </main>
  );
}
