import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ChevronRight, X, ChevronLeft, ChevronDown, Camera, Filter,
  ZoomIn, Image as ImageIcon
} from 'lucide-react'
import AnimateOnScroll from '../components/AnimateOnScroll'
import useSEO from '../hooks/useSEO'

interface Photo {
  id: number
  title: string
  category: string
  description: string
  color: string
  icon: string
}

const photoCategories = ['Toutes', 'Mairie', 'Événements', 'Patrimoine', 'Projets', 'Vie quotidienne']

const photos: Photo[] = [
  { id: 1, title: 'Façade de la Mairie de Gohitafla', category: 'Mairie', description: 'Bâtiment principal de l\'administration communale', color: 'from-primary-400 to-primary-600', icon: '🏛️' },
  { id: 2, title: 'Conseil municipal en session', category: 'Mairie', description: 'Session ordinaire du conseil municipal', color: 'from-blue-400 to-blue-600', icon: '👥' },
  { id: 3, title: 'Festival du Zaouli 2025', category: 'Événements', description: 'Danse traditionnelle Gouro inscrite à l\'UNESCO', color: 'from-purple-400 to-purple-600', icon: '🎭' },
  { id: 4, title: 'Danses traditionnelles Gouro', category: 'Patrimoine', description: 'Spectacle de danses lors du Zaouli', color: 'from-rose-400 to-rose-600', icon: '💃' },
  { id: 5, title: 'Inauguration de la route Gohitafla-Abidjan', category: 'Projets', description: 'Cérémonie d\'inauguration de la route bitumée', color: 'from-emerald-400 to-emerald-600', icon: '🛣️' },
  { id: 6, title: 'Marché central de Gohitafla', category: 'Vie quotidienne', description: 'Activité commerciale au marché central', color: 'from-amber-400 to-amber-600', icon: '🏪' },
  { id: 7, title: 'École primaire rénovée', category: 'Projets', description: 'Nouveau bâtiment de l\'école primaire publique', color: 'from-teal-400 to-teal-600', icon: '🏫' },
  { id: 8, title: 'Cérémonie de la fête nationale', category: 'Événements', description: 'Célébration du 7 août à Gohitafla', color: 'from-orange-400 to-orange-600', icon: '🇨🇮' },
  { id: 9, title: 'Forêt sacrée de Gohitafla', category: 'Patrimoine', description: 'Site sacré du peuple Gouro', color: 'from-green-500 to-green-700', icon: '🌳' },
  { id: 10, title: 'Centre de santé communautaire', category: 'Projets', description: 'Nouveau centre de santé équipé', color: 'from-cyan-400 to-cyan-600', icon: '🏥' },
  { id: 11, title: 'Tournoi de football inter-quartiers', category: 'Événements', description: 'Compétition sportive annuelle', color: 'from-lime-500 to-lime-700', icon: '⚽' },
  { id: 12, title: 'Paysage de la commune', category: 'Vie quotidienne', description: 'Vue panoramique de Gohitafla et ses environs', color: 'from-sky-400 to-sky-600', icon: '🌅' },
]

export default function GaleriePage() {
  const [selectedCategory, setSelectedCategory] = useState('Toutes')
  const [lightbox, setLightbox] = useState<Photo | null>(null)

  useSEO({
    title: 'Galerie Photos',
    description: 'Découvrez Gohitafla en images : la mairie, les événements, le patrimoine culturel et les projets de développement.',
    path: '/galerie',
  })

  const filtered = selectedCategory === 'Toutes'
    ? photos
    : photos.filter((p) => p.category === selectedCategory)

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-500 to-primary-700 py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/2 w-[600px] h-[600px] bg-accent-500 rounded-full -translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <nav className="flex items-center gap-2 text-primary-200 text-sm mb-6">
            <Link to="/" className="hover:text-white">Accueil</Link>
            <ChevronRight size={14} />
            <span className="text-white">Galerie</span>
          </nav>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
              <Camera size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-white">
                Galerie photos
              </h1>
              <p className="mt-2 text-lg text-primary-100">
                Gohitafla en images — {photos.length} photos
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur-sm z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-3">
            <Filter size={16} className="text-gray-400" />
            {photoCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <ImageIcon size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Aucune photo dans cette catégorie.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((photo, index) => (
                <AnimateOnScroll key={photo.id} delay={index * 60}>
                  <div
                    className="group cursor-pointer rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all hover:-translate-y-1"
                    onClick={() => setLightbox(photo)}
                  >
                    <div className={`bg-gradient-to-br ${photo.color} aspect-[4/3] flex items-center justify-center relative`}>
                      <span className="text-6xl">{photo.icon}</span>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <ZoomIn size={32} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                    <div className="p-4 bg-white">
                      <span className="text-xs font-semibold text-accent-500">{photo.category}</span>
                      <h3 className="font-heading font-bold text-sm text-gray-900 mt-1 line-clamp-1">
                        {photo.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-1">{photo.description}</p>
                    </div>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 text-white/70 hover:text-white z-50"
          >
            <X size={28} />
          </button>

          <div
            className="max-w-3xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`bg-gradient-to-br ${lightbox.color} aspect-video rounded-xl flex items-center justify-center mb-4`}>
              <span className="text-9xl">{lightbox.icon}</span>
            </div>
            <div className="text-center">
              <h3 className="font-heading font-bold text-xl text-white">{lightbox.title}</h3>
              <p className="text-white/60 text-sm mt-1">{lightbox.description}</p>
              <span className="inline-block mt-3 text-xs font-semibold text-accent-400 bg-accent-500/20 px-3 py-1 rounded-full">
                {lightbox.category}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
