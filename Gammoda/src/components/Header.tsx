import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import Logo from "./Logo";
import { siteConfig } from "../config/siteConfig";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "./ui/button";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();

  const navigation = [
    { name: "Home", href: siteConfig.links.home },
    { name: "About", href: siteConfig.links.about },
    { name: "Portfolio", href: siteConfig.links.portfolio },
    { name: "Careers", href: siteConfig.links.careers },
    { name: "Contact", href: siteConfig.links.contact },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <div className="flex lg:flex-1">
          <Link to="/" className="-m-1.5 p-1.5">
            <Logo />
          </Link>
        </div>

        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <div className="hidden lg:flex lg:gap-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`text-gray-900 transition-colors hover:text-blue-600 ${
                isActive(item.href) ? "border-b-2 border-blue-600" : ""
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-3">
          {isAuthenticated ? (
            <>
              <Link to={siteConfig.links.dashboard}>
                <Button variant="outline">Dashboard</Button>
              </Link>
            </>
          ) : (
            <>
              <Link to={siteConfig.links.login}>
                <Button variant="outline">Sign In</Button>
              </Link>
              <Link to={siteConfig.links.register}>
                <Button>Get Started</Button>
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden">
          <div className="fixed inset-0 z-50" />
          <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <Link to="/" className="-m-1.5 p-1.5" onClick={() => setMobileMenuOpen(false)}>
                <Logo />
              </Link>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="-mx-3 block rounded-lg px-3 py-2 text-gray-900 hover:bg-gray-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
                <div className="py-6 space-y-2">
                  {isAuthenticated ? (
                    <Link to={siteConfig.links.dashboard} onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full">Dashboard</Button>
                    </Link>
                  ) : (
                    <>
                      <Link to={siteConfig.links.login} onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full">
                          Sign In
                        </Button>
                      </Link>
                      <Link to={siteConfig.links.register} onClick={() => setMobileMenuOpen(false)}>
                        <Button className="w-full">Get Started</Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
