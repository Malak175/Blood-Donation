import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Droplet, Menu, X } from "lucide-react";
import { useState } from "react";
import type { Admin } from "@shared/schema";

interface NavigationProps {
  admin: Admin | null;
  onLogout?: () => void;
}

export function Navigation({ admin, onLogout }: NavigationProps) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/contact", label: "Contact" },
    { path: "/register", label: "Become a Donor" },
  ];

  if (admin) {
    navLinks.push({ path: "/admin", label: "Dashboard" });
  }

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-2 hover-elevate rounded-lg px-3 py-2 -ml-3 cursor-pointer" data-testid="link-home">
              <Droplet className="h-6 w-6 text-primary" fill="currentColor" />
              <span className="font-bold text-xl">BloodLife</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.path} href={link.path}>
                <div
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors hover-elevate cursor-pointer ${
                    location === link.path
                      ? "bg-accent text-accent-foreground"
                      : "text-foreground"
                  }`}
                  data-testid={`link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {link.label}
                </div>
              </Link>
            ))}
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center gap-3">
            {admin ? (
              <>
                <span className="text-sm text-muted-foreground" data-testid="text-admin-name">
                  Welcome, <span className="font-semibold text-foreground">{admin.name}</span>
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onLogout}
                  data-testid="button-logout"
                >
                  Logout
                </Button>
              </>
            ) : (
              <Link href="/login">
                <Button variant="default" size="sm" data-testid="button-login">
                  Login
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link key={link.path} href={link.path}>
                  <div
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors hover-elevate cursor-pointer ${
                      location === link.path
                        ? "bg-accent text-accent-foreground"
                        : "text-foreground"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                    data-testid={`link-mobile-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {link.label}
                  </div>
                </Link>
              ))}
              <div className="border-t border-border my-2"></div>
              {admin ? (
                <>
                  <div className="px-4 py-2 text-sm text-muted-foreground">
                    Welcome, <span className="font-semibold text-foreground">{admin.name}</span>
                  </div>
                  <Button
                    variant="outline"
                    className="mx-4"
                    onClick={() => {
                      onLogout?.();
                      setMobileMenuOpen(false);
                    }}
                    data-testid="button-mobile-logout"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <Link href="/login">
                  <div className="mx-4" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="default" className="w-full" data-testid="button-mobile-login">
                      Login
                    </Button>
                  </div>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
