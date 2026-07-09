import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Phone, Mail, Clock, Search } from 'lucide-react'
import SearchModal from '../SearchModal'

const navigation = [
  { name: 'Accueil', href: '/' },
  { name: 'La Mairie', href: '/la-mairie' },
  { name: 'Services en ligne', shortName: 'Services', href: '/services' },
  { name: 'Démarches', href: '/demarches' },
  { name: 'Patrimoine', href: '/patrimoine' },
  { name: 'Agenda', href: '/agenda' },
  { name: 'Actualités', href: '/actualites' },
  { name: 'Contact', href: '/contact' },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'k' || e.key === 'K') && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    setMobileMenuOpen(false)
    setSearchOpen(false)
  }, [location.pathname])

  return (
    <>
      <header className="sticky top-0 z-50">
        {/* Top bar */}
        <div className="bg-primary-500 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-10 text-sm">
              <div className="hidden md:flex items-center gap-6">
                <span className="flex items-center gap-1.5">
                  <Phone size={14} />
                  +225 XX XX XX XX XX
                </span>
                <span className="flex items-center gap-1.5">
                  <Mail size={14} />
                  contact@mairie-gohitafla.ci
                </span>
              </div>
              <div className="flex items-center gap-1.5 mx-auto md:mx-0">
                <Clock size={14} />
                Lun - Ven : 7h30 - 16h30
              </div>
            </div>
          </div>
        </div>

        {/* Main navigation */}
        <nav className="bg-white shadow-lg border-b-4 border-accent-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              {/* Logo */}
              <Link to="/" className="flex items-center gap-3 shrink-0">
                <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-white font-heading font-bold text-xl">S</span>
                </div>
                <div className="hidden sm:block">
                  <div className="font-heading font-bold text-primary-500 text-lg leading-tight">
                    Mairie de Gohitafla
                  </div>
                  <div className="text-xs text-gray-500 font-medium tracking-wide uppercase">
                    République de Côte d'Ivoire
                  </div>
                </div>
              </Link>

              {/* Desktop nav */}
              <div className="hidden lg:flex items-center gap-0.5 xl:gap-1 min-w-0 flex-1 justify-center mx-2 xl:mx-4">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`px-2 xl:px-3 2xl:px-4 py-2 rounded-lg text-xs xl:text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                        isActive
                          ? 'bg-primary-500 text-white shadow-md'
                          : 'text-gray-700 hover:bg-primary-50 hover:text-primary-500'
                      }`}
                    >
                      {'shortName' in item && item.shortName ? (
                        <>
                          <span className="xl:hidden">{item.shortName}</span>
                          <span className="hidden xl:inline">{item.name}</span>
                        </>
                      ) : (
                        item.name
                      )}
                    </Link>
                  )
                })}
              </div>

              {/* Search + CTA */}
              <div className="flex items-center gap-2 xl:gap-3 shrink-0">
                {/* Search button */}
                <button
                  onClick={() => setSearchOpen(true)}
                  className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm text-gray-500 transition-colors group"
                >
                  <Search size={16} className="text-gray-400 group-hover:text-primary-500" />
                  <span className="hidden md:inline">Rechercher...</span>
                  <kbd className="hidden md:inline-flex items-center px-1.5 py-0.5 bg-white rounded border border-gray-200 text-[10px] font-medium text-gray-400">
                    Ctrl+K
                  </kbd>
                </button>

                {/* Mobile search */}
                <button
                  onClick={() => setSearchOpen(true)}
                  className="sm:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
                >
                  <Search size={22} />
                </button>

                {/* CTA */}
                <div className="hidden lg:block">
                  <Link to="/services" className="btn-accent text-xs xl:text-sm py-2 xl:py-2.5 px-3 xl:px-5 whitespace-nowrap">
                    <span className="xl:hidden">Demander</span>
                    <span className="hidden xl:inline">Demander un document</span>
                  </Link>
                </div>

                {/* Mobile menu button */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
                >
                  {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile nav */}
          {mobileMenuOpen && (
            <div className="lg:hidden border-t bg-white">
              <div className="px-4 py-4 space-y-1">
                {/* Mobile search bar */}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false)
                    setSearchOpen(true)
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl text-gray-500 text-sm mb-3"
                >
                  <Search size={18} />
                  Rechercher un service, une démarche...
                </button>

                {navigation.map((item) => {
                  const isActive = location.pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                        isActive
                          ? 'bg-primary-500 text-white'
                          : 'text-gray-700 hover:bg-primary-50'
                      }`}
                    >
                      {item.name}
                    </Link>
                  )
                })}
                <div className="pt-3">
                  <Link
                    to="/services"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn-accent w-full text-sm text-center"
                  >
                    Demander un document
                  </Link>
                </div>
              </div>
            </div>
          )}
        </nav>
      </header>

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
