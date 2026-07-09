import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Calendar, ArrowRight, Newspaper, MapPin, CheckCircle, Loader2 } from 'lucide-react'
import useSEO from '../hooks/useSEO'
import { resolveImageUrl } from '../utils/imageUrl'

import { API } from '../utils/api'

function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = async () => {
    if (!email) return
    try {
      await fetch(`${API}/newsletter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
    } catch {}
    setSubscribed(true)
  }

  return (
    <section className="py-16 bg-primary-500">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-white mb-4">
          Restez informés
        </h2>
        <p className="text-primary-100 mb-8">
          Inscrivez-vous pour recevoir les actualités de la Mairie de Gohitafla directement dans votre boîte mail.
        </p>
        {subscribed ? (
          <div className="flex items-center justify-center gap-3 bg-white/20 rounded-xl px-6 py-4 max-w-md mx-auto">
            <CheckCircle size={24} className="text-white" />
            <p className="text-white font-semibold">Merci ! Vous êtes inscrit(e) à la newsletter.</p>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Votre adresse email"
              className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-accent-500 outline-none"
            />
            <button onClick={handleSubscribe} className="btn-accent whitespace-nowrap">
              S'inscrire
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

interface Actualite {
  id: number
  title: string
  excerpt: string
  content: string
  category: string
  category_color: string
  image: string
  date: string
  published: number
}

const fallbackActualites: Actualite[] = [
  { id: 1, title: 'Modernisation des services d\'état civil de Gohitafla', excerpt: 'La mairie de Gohitafla lance un vaste programme de numérisation des registres d\'état civil. Ce projet vise à réduire les délais de délivrance des actes et à sécuriser les archives communales.', content: '', category: 'Modernisation', category_color: 'bg-blue-100 text-blue-700', image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=500&fit=crop', date: '2026-05-10', published: 1 },
  { id: 2, title: 'Réhabilitation des routes communales : 5 milliards FCFA investis', excerpt: 'Le conseil municipal a approuvé un budget de 5 milliards FCFA pour la réfection des principales artères de la commune.', content: '', category: 'Infrastructures', category_color: 'bg-emerald-100 text-emerald-700', image: 'https://images.unsplash.com/photo-1590496793929-36417d3117de?w=800&h=500&fit=crop', date: '2026-05-05', published: 1 },
  { id: 3, title: 'Grande campagne de salubrité dans tous les quartiers', excerpt: 'La municipalité organise une opération d\'envergure de nettoyage et d\'assainissement. Tous les quartiers seront concernés.', content: '', category: 'Environnement', category_color: 'bg-green-100 text-green-700', image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&h=500&fit=crop', date: '2026-04-28', published: 1 },
  { id: 4, title: 'Construction d\'un nouveau centre de santé communautaire', excerpt: 'Un nouveau centre de santé sera construit dans le quartier sud de Gohitafla.', content: '', category: 'Santé', category_color: 'bg-rose-100 text-rose-700', image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&h=500&fit=crop', date: '2026-04-20', published: 1 },
  { id: 5, title: 'Festival culturel de Gohitafla : 3ème édition annoncée', excerpt: 'La 3ème édition du festival culturel de Gohitafla se tiendra du 15 au 20 juin 2026.', content: '', category: 'Culture', category_color: 'bg-purple-100 text-purple-700', image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=500&fit=crop', date: '2026-04-15', published: 1 },
  { id: 6, title: 'Programme de bourses scolaires : inscriptions ouvertes', excerpt: 'La mairie lance son programme annuel de bourses scolaires pour les élèves méritants.', content: '', category: 'Éducation', category_color: 'bg-amber-100 text-amber-700', image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=500&fit=crop', date: '2026-04-10', published: 1 },
]

export default function ActualitesPage() {
  const [actualites, setActualites] = useState<Actualite[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('Tous')

  useSEO({
    title: 'Actualités',
    description: 'Suivez les dernières actualités de Gohitafla : projets de développement, événements culturels, décisions du conseil municipal.',
    path: '/actualites',
  })

  useEffect(() => {
    fetch(`${API}/actualites`)
      .then(r => r.json())
      .then(data => {
        setActualites(data.length > 0 ? data : fallbackActualites)
        setLoading(false)
      })
      .catch(() => {
        setActualites(fallbackActualites)
        setLoading(false)
      })
  }, [])

  const categories = ['Tous', ...Array.from(new Set(actualites.map(a => a.category)))]
  const filtered = selectedCategory === 'Tous' ? actualites : actualites.filter(a => a.category === selectedCategory)

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 size={40} className="animate-spin text-primary-500" />
      </div>
    )
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-500 to-primary-700 py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-success-500 rounded-full translate-x-1/3 translate-y-1/3" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <nav className="flex items-center gap-2 text-primary-200 text-sm mb-6">
            <Link to="/" className="hover:text-white">Accueil</Link>
            <ChevronRight size={14} />
            <span className="text-white">Actualités</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white">
            Actualités & Événements
          </h1>
          <p className="mt-4 text-lg text-primary-100 max-w-2xl">
            Suivez les dernières nouvelles, projets et événements de la commune de Gohitafla.
          </p>
        </div>
      </section>

      {/* Categories filter */}
      <section className="bg-white border-b sticky top-[7.5rem] z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 py-4 overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* News grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <Newspaper size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Aucune actualité dans cette catégorie.</p>
            </div>
          ) : (
            <>
              {/* Featured article */}
              <div className="card mb-10 overflow-hidden">
                <div className="grid md:grid-cols-2">
                  <div className="relative min-h-[300px] overflow-hidden bg-gray-200">
                    {filtered[0].image && (
                      <img src={resolveImageUrl(filtered[0].image)} alt={filtered[0].title} className="absolute inset-0 w-full h-full object-cover" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  </div>
                  <div className="p-8 md:p-12 flex flex-col justify-center">
                    <span className={`inline-block w-fit px-3 py-1 rounded-full text-xs font-bold mb-4 ${filtered[0].category_color}`}>
                      {filtered[0].category}
                    </span>
                    <h2 className="font-heading font-bold text-2xl md:text-3xl text-gray-900 mb-4">
                      {filtered[0].title}
                    </h2>
                    <p className="text-gray-600 leading-relaxed mb-6">{filtered[0].excerpt}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={14} />
                        {new Date(filtered[0].date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin size={14} />
                        Gohitafla
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.slice(1).map((actu) => (
                  <article key={actu.id} className="card group hover:-translate-y-1">
                    <div className="h-44 relative overflow-hidden bg-gray-200">
                      {actu.image && (
                        <img src={resolveImageUrl(actu.image)} alt={actu.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold ${actu.category_color}`}>
                        {actu.category}
                      </span>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                        <Calendar size={14} />
                        {new Date(actu.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </div>
                      <h3 className="font-heading font-bold text-lg text-gray-900 mb-3 group-hover:text-primary-500 transition-colors line-clamp-2">
                        {actu.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">{actu.excerpt}</p>
                      <button className="inline-flex items-center mt-4 text-accent-500 font-semibold text-sm hover:gap-2 transition-all">
                        Lire la suite <ArrowRight size={14} className="ml-1" />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <NewsletterSection />
    </div>
  )
}
