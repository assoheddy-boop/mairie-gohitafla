import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Phone, Mail, Clock, Search } from 'lucide-react'
import SearchModal from '../SearchModal'

const navigation = [
  { name: 'Accueil', href: '/' },
  { name: 'La Mairie', href: '/la-mairie' },
  { name: 'Services', href: '/services', title: 'Services en ligne' },
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
            <div className="flex items-center justify-between h-20 gap-2 min-w-0">
              {/* Logo */}
              <Link to="/" className="flex items-center gap-2 sm:gap-3 flex-shrink-0 min-w-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-500 rounded-full flex items-center justify-center shadow-md flex-shrink-0">
                  <span className="text-white font-heading font-bold text-lg sm:text-xl">G</span>
                </div>
                <div className="hidden sm:block min-w-0">
                  <div className="font-heading font-bold text-primary-500 text-base lg:text-lg leading-tight truncate">
                    Mairie de Gohitafla
                  </div>
                  <div className="text-[10px] lg:text-xs text-gray-500 font-medium tracking-wide uppercase truncate">
                    République de Côte d'Ivoire
                  </div>
                </div>
              </Link>

              {/* Desktop nav */}
              <div className="hidden xl:flex items-center gap-0.5 min-w-0">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      title={'title' in item ? item.title : undefined}
                      className={`px-3 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                        isActive
                          ? 'bg-primary-500 text-white shadow-md'
                          : 'text-gray-700 hover:bg-primary-50 hover:text-primary-500'
                      }`}
                    >
                      {item.name}
                    </Link>
                  )
                })}
              </div>

              {/* Search + CTA */}
              <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                <button
                  onClick={() => setSearchOpen(true)}
                  className="hidden sm:flex items-center gap-2 px-3 lg:px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm text-gray-500 transition-colors group"
                >
                  <Search size={16} className="text-gray-400 group-hover:text-primary-500" />
                  <span className="hidden lg:inline">Rechercher...</span>
                  <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 bg-white rounded border border-gray-200 text-[10px] font-medium text-gray-400">
                    Ctrl+K
                  </kbd>
                </button>

                <button
                  onClick={() => setSearchOpen(true)}
                  className="sm:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
                >
                  <Search size={22} />
                </button>

                <Link
                  to="/services"
                  className="xl:hidden inline-flex items-center justify-center bg-accent-500 text-white font-semibold rounded-lg hover:bg-accent-600 transition-all shadow-md text-xs sm:text-sm py-2 px-3 sm:px-4 whitespace-nowrap flex-shrink-0"
                >
                  Services
                </Link>

                <Link
                  to="/services"
                  className="hidden xl:inline-flex items-center justify-center bg-accent-500 text-white font-semibold rounded-lg hover:bg-accent-600 transition-all shadow-md text-sm py-2.5 px-5 whitespace-nowrap flex-shrink-0"
                >
                  Demander un document
                </Link>

                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="xl:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
                >
                  {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="xl:hidden border-t bg-white">
              <div className="px-4 py-4 space-y-1">
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
                      title={'title' in item ? item.title : undefined}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                        isActive
                          ? 'bg-primary-500 text-white'
                          : 'text-gray-700 hover:bg-primary-50'
                      }`}
                    >
                      {'title' in item ? item.title : item.name}
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
