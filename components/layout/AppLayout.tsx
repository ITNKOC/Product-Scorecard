import React from 'react';
import Logo from '@/components/ui/Logo';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface AppLayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  headerVariant?: 'default' | 'minimal';
}

export const AppLayout: React.FC<AppLayoutProps> = ({ 
  children, 
  showHeader = true, 
  headerVariant = 'default' 
}) => {
  return (
    <div className="min-h-screen bg-background">
      {showHeader && (
        <header className="border-b bg-white">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/dashboard">
                <Logo size="md" variant="default" showText={false} />
              </Link>
              
              {headerVariant === 'default' && (
                <div className="flex items-center gap-4">
                  <Link href="/analyze">
                    <Button variant="outline" size="sm">
                      Nouvelle Analyse
                    </Button>
                  </Link>
                  <Link href="/dashboard">
                    <Button variant="ghost" size="sm">
                      Dashboard
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </header>
      )}
      
      <main className={showHeader ? "" : "min-h-screen"}>
        {children}
      </main>
    </div>
  );
};

export default AppLayout;