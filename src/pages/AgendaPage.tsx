import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  ChevronRight, Calendar, MapPin, Clock,
  Star, Filter, Loader2
} from 'lucide-react'
import AnimateOnScroll from '../components/AnimateOnScroll'
import useSEO from '../hooks/useSEO'
import { resolveImageUrl } from '../utils/imageUrl'

import { API } from '../utils/api'

interface Event {
  id: number
  title: string
  date: string
  time: string
  lieu: string
  category: string
  description: string
  featured: number
  image?: string
}

const categoryColors: Record<string, string> = {
  'Officiel': 'bg-primary-100 text-primary-700',
  'Conseil municipal': 'bg-primary-100 text-primary-700',
  'Culture': 'bg-purple-100 text-purple-700',
  'Sport': 'bg-green-100 text-green-700',
  'Social': 'bg-rose-100 text-rose-700',
  'Développement': 'bg-amber-100 text-amber-700',
  'Santé': 'bg-cyan-100 text-cyan-700',
  'Éducation': 'bg-indigo-100 text-indigo-700',
  'Jeunesse': 'bg-orange-100 text-orange-700',
  'Environnement': 'bg-emerald-100 text-emerald-700',
}

const fallbackEvents: Event[] = [
  { id: 1, title: 'Session ordinaire du Conseil Municipal', date: '2026-05-20', time: '09:00 - 13:00', lieu: 'Salle du Conseil, Mairie de Gohitafla', category: 'Officiel', description: 'Session ordinaire portant sur le budget 2026 et les projets de développement communal.', featured: 1, image: 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?w=600&h=400&fit=crop' },
  { id: 2, title: 'Festival du Zaouli 2026', date: '2026-06-15', time: '06:00 - 18:00', lieu: 'Place centrale de Gohitafla', category: 'Culture', description: 'Grande célébration annuelle du Zaouli, danse traditionnelle emblématique du peuple Gouro, inscrite au patrimoine de l\'UNESCO.', featured: 1, image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&h=400&fit=crop' },
  { id: 3, title: 'Journée de vaccination gratuite', date: '2026-05-25', time: '08:00 - 16:00', lieu: 'Centre de santé communal', category: 'Santé', description: 'Campagne de vaccination gratuite pour les enfants de 0 à 5 ans.', featured: 0, image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=400&fit=crop' },
  { id: 4, title: 'Tournoi inter-quartiers de football', date: '2026-06-01', time: '14:00 - 18:00', lieu: 'Stade municipal de Gohitafla', category: 'Sport', description: 'Compétition sportive réunissant les équipes de tous les quartiers.', featured: 0, image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&h=400&fit=crop' },
]

const months = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
]

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return {
    day: d.getDate(),
    month: months[d.getMonth()],
    monthShort: months[d.getMonth()].substring(0, 3),
    year: d.getFullYear(),
    weekday: d.toLocaleDateString('fr-FR', { weekday: 'long' }),
    full: d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
  }
}

export default function AgendaPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('Tous')

  useSEO({
    title: 'Agenda Municipal',
    description: 'Consultez les événements et activités de la commune de Gohitafla : conseils municipaux, fêtes, événements culturels et sportifs.',
    path: '/agenda',
  })

  useEffect(() => {
    fetch(`${API}/evenements`)
      .then(r => r.json())
      .then(data => {
        setEvents(data.length > 0 ? data : fallbackEvents)
        setLoading(false)
      })
      .catch(() => {
        setEvents(fallbackEvents)
        setLoading(false)
      })
  }, [])

  const categories = ['Tous', ...Array.from(new Set(events.map(e => e.category)))]
  const filtered = selectedCategory === 'Tous' ? events : events.filter((e) => e.category === selectedCategory)
  const sorted = [...filtered].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  const featured = events.filter((e) => !!e.featured)

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
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-500 rounded-full -translate-x-1/3 translate-y-1/3" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <nav className="flex items-center gap-2 text-primary-200 text-sm mb-6">
            <Link to="/" className="hover:text-white">Accueil</Link>
            <ChevronRight size={14} />
            <span className="text-white">Agenda</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white">
            Agenda municipal
          </h1>
          <p className="mt-4 text-lg text-primary-100 max-w-2xl">
            Retrouvez tous les événements, réunions et activités de la commune de Gohitafla.
          </p>
        </div>
      </section>

      {/* Featured events */}
      {featured.length > 0 && (
        <section className="py-12 -mt-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-6">
              {featured.map((event) => {
                const d = formatDate(event.date)
                return (
                  <AnimateOnScroll key={event.id}>
                    <div className="card p-0 overflow-hidden border-2 border-accent-200">
                      <div className="bg-accent-500 px-5 py-2 flex items-center gap-2">
                        <Star size={14} className="text-white" />
                        <span className="text-white text-xs font-bold uppercase tracking-wider">À ne pas manquer</span>
                      </div>
                      {event.image && (
                        <div className="h-40 overflow-hidden">
                          <img src={resolveImageUrl(event.image)} alt={event.title} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="p-6 flex gap-5">
                        <div className="bg-primary-50 rounded-xl px-4 py-3 text-center flex-shrink-0">
                          <div className="text-3xl font-heading font-bold text-primary-500">{d.day}</div>
                          <div className="text-xs text-primary-400 font-semibold uppercase">{d.monthShort}</div>
                        </div>
                        <div className="min-w-0">
                          <span className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full mb-2 ${categoryColors[event.category] || 'bg-gray-100 text-gray-700'}`}>
                            {event.category}
                          </span>
                          <h3 className="font-heading font-bold text-gray-900 mb-2">{event.title}</h3>
                          <p className="text-sm text-gray-500 mb-3 line-clamp-2">{event.description}</p>
                          <div className="flex flex-wrap gap-3 text-xs text-gray-400">
                            <span className="flex items-center gap-1"><Clock size={12} /> {event.time}</span>
                            <span className="flex items-center gap-1"><MapPin size={12} /> {event.lieu}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </AnimateOnScroll>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Filters */}
      <section className="py-8 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-3">
            <Filter size={16} className="text-gray-400" />
            {categories.map((cat) => (
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

      {/* Events list */}
      <section className="py-8 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-heading font-bold text-2xl text-gray-900">
              {sorted.length} événement{sorted.length > 1 ? 's' : ''} à venir
            </h2>
          </div>

          {sorted.length === 0 ? (
            <div className="text-center py-16">
              <Calendar size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Aucun événement dans cette catégorie.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sorted.map((event, index) => {
                const d = formatDate(event.date)
                return (
                  <AnimateOnScroll key={event.id} delay={index * 60}>
                    <div className="card p-0 flex hover:-translate-y-0.5 transition-transform overflow-hidden">
                      {event.image && (
                        <div className="hidden sm:block w-32 flex-shrink-0 overflow-hidden">
                          <img src={resolveImageUrl(event.image)} alt={event.title} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="p-5 flex gap-5 flex-1">
                        <div className="bg-primary-50 rounded-xl px-4 py-3 text-center flex-shrink-0 min-w-[70px]">
                          <div className="text-2xl font-heading font-bold text-primary-500">{d.day}</div>
                          <div className="text-xs text-primary-400 font-semibold uppercase">{d.monthShort}</div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <span className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full mb-1.5 ${categoryColors[event.category] || 'bg-gray-100 text-gray-700'}`}>
                                {event.category}
                              </span>
                              <h3 className="font-heading font-bold text-gray-900">{event.title}</h3>
                            </div>
                            <span className="text-xs text-gray-400 capitalize flex-shrink-0 hidden sm:block">{d.weekday}</span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1 mb-2 line-clamp-2">{event.description}</p>
                          <div className="flex flex-wrap gap-4 text-xs text-gray-400">
                            <span className="flex items-center gap-1"><Clock size={12} /> {event.time}</span>
                            <span className="flex items-center gap-1"><MapPin size={12} /> {event.lieu}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </AnimateOnScroll>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
