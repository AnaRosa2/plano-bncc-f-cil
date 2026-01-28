import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Home, ChevronRight, Sun, Moon, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/theme-provider';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface HeaderProps {
  breadcrumbs?: BreadcrumbItem[];
}

const Header: React.FC<HeaderProps> = ({ breadcrumbs = [] }) => {
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const isHome = location.pathname === '/';

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo e Nome */}
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <BookOpen className="h-8 w-8 text-primary" />
          <div className="hidden sm:block">
            <h1 className="text-lg font-heading font-semibold text-foreground">Plano BNCC</h1>
            <p className="text-xs text-muted-foreground">Sistema de Planejamento</p>
          </div>
        </Link>

        {/* Breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <nav className="hidden md:flex items-center gap-1 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
              <Home className="h-4 w-4" />
            </Link>
            {breadcrumbs.map((item, index) => (
              <React.Fragment key={index}>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                {item.href ? (
                  <Link
                    to={item.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-foreground font-medium">{item.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            title="Alternar Tema"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          {!isHome && (
            <Button variant="ghost" size="sm" asChild>
              <Link to="/">
                <Home className="h-4 w-4 mr-1" />
                Início
              </Link>
            </Button>
          )}

          {isHome && (
            <Button size="sm" asChild className="hidden sm:flex">
              <Link to="/disciplina/nova">
                <Plus className="h-4 w-4 mr-1" />
                Disciplina
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
