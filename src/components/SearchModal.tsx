import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search, X, FileText, Heart, BookOpen, Building2, Shield, Users,
  ArrowRight, Newspaper, Phone, MapPin, Info, Clock, Briefcase,
  Calendar, Camera, ClipboardList, Landmark
} from 'lucide-react'

interface SearchItem {
  title: string
  description: string
  href: string
  icon: typeof FileText
  category: string
}

const searchItems: SearchItem[] = [
  // Services / Documents
  { title: 'Acte de naissance', description: 'Demander une copie intégrale ou un extrait d\'acte de naissance', href: '/demande-document/acte-naissance', icon: FileText, category: 'Services' },
  { title: 'Acte de mariage', description: 'Obtenir votre acte de mariage ou une copie certifiée conforme', href: '/demande-document/acte-mariage', icon: Heart, category: 'Services' },
  { title: 'Acte de décès', description: 'Demander un acte de décès pour vos démarches administratives', href: '/demande-document/acte-deces', icon: BookOpen, category: 'Services' },
  { title: 'Certificat de résidence', description: 'Obtenir votre certificat de résidence rapidement', href: '/demande-document/certificat-residence', icon: Building2, category: 'Services' },
  { title: 'Légalisation de documents', description: 'Faire légaliser vos documents officiels', href: '/demande-document/legalisation', icon: Shield, category: 'Services' },
  { title: 'Certificat de célibat', description: 'Obtenir votre certificat de célibat', href: '/demande-document/certificat-celibat', icon: Users, category: 'Services' },

  // Pages
  { title: 'Accueil', description: 'Page d\'accueil du site de la Mairie de Gohitafla', href: '/', icon: Building2, category: 'Pages' },
  { title: 'La Mairie', description: 'Mot du maire, conseil municipal, organigramme des services', href: '/la-mairie', icon: Info, category: 'Pages' },
  { title: 'Services en ligne', description: 'Tous les services et documents disponibles en ligne', href: '/services', icon: Briefcase, category: 'Pages' },
  { title: 'Démarches administratives', description: 'Guide complet des démarches, pièces requises et délais', href: '/demarches', icon: FileText, category: 'Pages' },
  { title: 'Patrimoine & Culture', description: 'Le Zaouli, les traditions Gouro, les villages et l\'histoire de Gohitafla', href: '/patrimoine', icon: Landmark, category: 'Pages' },
  { title: 'Actualités', description: 'Les dernières nouvelles et événements de Gohitafla', href: '/actualites', icon: Newspaper, category: 'Pages' },
  { title: 'Agenda municipal', description: 'Calendrier des événements, réunions et activités de la commune', href: '/agenda', icon: Calendar, category: 'Pages' },
  { title: 'Galerie photos', description: 'Découvrez Gohitafla en images : mairie, événements et patrimoine', href: '/galerie', icon: Camera, category: 'Pages' },
  { title: 'Suivi de demande', description: 'Suivez l\'avancement de votre demande de document', href: '/suivi', icon: ClipboardList, category: 'Pages' },
  { title: 'Contact', description: 'Formulaire de contact, adresse et horaires', href: '/contact', icon: Phone, category: 'Pages' },

  // Informations
  { title: 'Horaires d\'ouverture', description: 'Lundi au Vendredi : 7h30 - 12h00 / 14h30 - 16h30', href: '/contact', icon: Clock, category: 'Informations' },
  { title: 'Adresse de la mairie', description: 'Centre-ville, Gohitafla, Côte d\'Ivoire', href: '/contact', icon: MapPin, category: 'Informations' },
  { title: 'Conseil municipal', description: 'Composition et rôles du conseil municipal de Gohitafla', href: '/la-mairie', icon: Users, category: 'Informations' },
  { title: 'État civil', description: 'Service d\'état civil : naissances, mariages, décès', href: '/services', icon: FileText, category: 'Informations' },
]

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  const filtered = query.length > 0
    ? searchItems.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
      )
    : []

  const grouped = filtered.reduce<Record<string, SearchItem[]>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = []
    acc[item.category].push(item)
    return acc
  }, {})

  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
      if (!isOpen) {
        if ((e.key === 'k' || e.key === 'K') && (e.ctrlKey || e.metaKey)) {
          e.preventDefault()
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const handleSelect = (href: string) => {
    navigate(href)
    onClose()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => Math.min(prev + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => Math.max(prev - 1, 0))
    } else if (e.key === 'Enter' && filtered[selectedIndex]) {
      handleSelect(filtered[selectedIndex].href)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative max-w-2xl mx-auto mt-[10vh] px-4">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
          {/* Search input */}
          <div className="flex items-center gap-3 px-5 border-b border-gray-100">
            <Search size={22} className="text-gray-400 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Rechercher un service, une démarche, une page..."
              className="flex-1 py-4 text-lg outline-none placeholder:text-gray-400 bg-transparent"
            />
            <button
              onClick={onClose}
              className="flex items-center gap-1 px-2 py-1 rounded-md bg-gray-100 text-gray-500 text-xs font-medium hover:bg-gray-200 transition-colors"
            >
              <X size={14} />
              ESC
            </button>
          </div>

          {/* Results */}
          <div className="max-h-[60vh] overflow-y-auto">
            {query.length === 0 ? (
              <div className="px-5 py-8 text-center">
                <Search size={40} className="text-gray-200 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">
                  Tapez pour rechercher un service, un document ou une information
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {['Acte de naissance', 'Mariage', 'Résidence', 'Contact'].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setQuery(tag)}
                      className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full text-xs font-medium hover:bg-primary-50 hover:text-primary-500 transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            ) : filtered.length === 0 ? (
              <div className="px-5 py-8 text-center">
                <p className="text-gray-500 text-sm">
                  Aucun résultat pour « <strong>{query}</strong> »
                </p>
                <p className="text-gray-400 text-xs mt-2">
                  Essayez avec d'autres termes ou consultez nos services
                </p>
              </div>
            ) : (
              <div className="py-2">
                {Object.entries(grouped).map(([category, items]) => (
                  <div key={category}>
                    <div className="px-5 py-2">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{category}</p>
                    </div>
                    {items.map((item) => {
                      const globalIndex = filtered.indexOf(item)
                      const isSelected = globalIndex === selectedIndex
                      return (
                        <button
                          key={`${item.title}-${item.href}`}
                          onClick={() => handleSelect(item.href)}
                          onMouseEnter={() => setSelectedIndex(globalIndex)}
                          className={`w-full flex items-center gap-4 px-5 py-3 text-left transition-colors ${
                            isSelected ? 'bg-primary-50' : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            isSelected ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-500'
                          }`}>
                            <item.icon size={20} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`font-semibold text-sm truncate ${
                              isSelected ? 'text-primary-500' : 'text-gray-900'
                            }`}>
                              {item.title}
                            </p>
                            <p className="text-xs text-gray-500 truncate">{item.description}</p>
                          </div>
                          {isSelected && (
                            <ArrowRight size={16} className="text-primary-500 flex-shrink-0" />
                          )}
                        </button>
                      )
                    })}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {filtered.length > 0 && (
            <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between text-xs text-gray-400">
              <span>{filtered.length} résultat{filtered.length > 1 ? 's' : ''}</span>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white rounded border text-[10px]">↑↓</kbd> naviguer
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white rounded border text-[10px]">↵</kbd> ouvrir
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
