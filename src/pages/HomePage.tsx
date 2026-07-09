import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  FileText, Users, Building2, Heart, Shield, BookOpen,
  ArrowRight, Calendar, MapPin, ChevronRight, Star,
  Clock, Phone, Newspaper, Award, TrendingUp
} from 'lucide-react'
import AnimateOnScroll from '../components/AnimateOnScroll'
import useSEO from '../hooks/useSEO'
import { resolveImageUrl } from '../utils/imageUrl'
import { API } from '../utils/api'

const services = [
  {
    icon: FileText,
    title: 'Acte de naissance',
    description: 'Demandez une copie intégrale ou un extrait d\'acte de naissance en ligne.',
    href: '/demande-document/acte-naissance',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: Heart,
    title: 'Acte de mariage',
    description: 'Obtenez votre acte de mariage ou une copie certifiée conforme.',
    href: '/demande-document/acte-mariage',
    color: 'bg-rose-50 text-rose-600',
  },
  {
    icon: BookOpen,
    title: 'Acte de décès',
    description: 'Demandez un acte de décès pour vos démarches administratives.',
    href: '/demande-document/acte-deces',
    color: 'bg-purple-50 text-purple-600',
  },
  {
    icon: Building2,
    title: 'Certificat de résidence',
    description: 'Obtenez votre certificat de résidence rapidement.',
    href: '/demande-document/certificat-residence',
    color: 'bg-emerald-50 text-emerald-600',
  },
  {
    icon: Shield,
    title: 'Légalisation',
    description: 'Faites légaliser vos documents officiels.',
    href: '/demande-document/legalisation',
    color: 'bg-amber-50 text-amber-600',
  },
  {
    icon: Users,
    title: 'Certificat de célibat',
    description: 'Obtenez votre certificat de célibat pour vos démarches.',
    href: '/demande-document/certificat-celibat',
    color: 'bg-cyan-50 text-cyan-600',
  },
]

const fallbackActus = [
  { id: 1, title: 'Modernisation des services d\'état civil', excerpt: 'La mairie de Gohitafla lance un vaste programme de numérisation des registres d\'état civil pour améliorer le service aux citoyens.', date: '2026-05-10', category: 'Modernisation', image: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=400&h=250&fit=crop', category_color: 'bg-blue-100 text-blue-700' },
  { id: 2, title: 'Réhabilitation des routes communales', excerpt: 'Le conseil municipal a voté le budget pour la réfection des principales voies de la commune de Gohitafla.', date: '2026-05-05', category: 'Infrastructures', image: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=400&h=250&fit=crop', category_color: 'bg-emerald-100 text-emerald-700' },
  { id: 3, title: 'Campagne de salubrité communale', excerpt: 'Une grande opération de nettoyage et d\'assainissement est organisée dans tous les quartiers de Gohitafla.', date: '2026-04-28', category: 'Environnement', image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&h=250&fit=crop', category_color: 'bg-green-100 text-green-700' },
]

const chiffres = [
  { value: '50 000+', label: 'Habitants', icon: Users },
  { value: '1 200+', label: 'Documents traités/mois', icon: FileText },
  { value: '15', label: 'Services municipaux', icon: Building2 },
  { value: '100%', label: 'Engagement citoyen', icon: Award },
]

export default function HomePage() {
  const [actualites, setActualites] = useState(fallbackActus)

  useEffect(() => {
    fetch(`${API}/actualites`)
      .then(r => r.json())
      .then(data => { if (data.length > 0) setActualites(data.slice(0, 3)) })
      .catch(() => {})
  }, [])

  useSEO({
    title: 'Accueil',
    description: 'Site officiel de la Mairie de Gohitafla. Demandez vos documents administratifs en ligne, suivez vos démarches et restez informé des actualités de la commune.',
    path: '/',
  })

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[600px] md:min-h-[700px] overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="/mairie-gohitafla.png"
            alt="Mairie de Gohitafla"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/95 via-primary-500/80 to-primary-500/40" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Star size={16} className="text-accent-500" />
              Portail officiel de la commune
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white leading-tight">
              Mairie de{' '}
              <span className="text-accent-500">Gohitafla</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-white/90 leading-relaxed max-w-xl">
              Au service des citoyens de Gohitafla. Effectuez vos démarches administratives 
              en ligne, suivez les actualités de votre commune et restez connectés.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/services" className="inline-flex items-center justify-center px-8 py-4 bg-accent-500 text-white font-bold rounded-lg hover:bg-accent-600 transition-all shadow-lg hover:shadow-xl text-base">
                Demander un document
                <ArrowRight size={18} className="ml-2" />
              </Link>
              <Link to="/la-mairie" className="inline-flex items-center justify-center px-8 py-4 bg-white/15 backdrop-blur-sm border-2 border-white/30 text-white font-semibold rounded-lg hover:bg-white/25 transition-all duration-200">
                Découvrir la mairie
              </Link>
            </div>

            {/* Quick access pills */}
            <div className="mt-10 flex flex-wrap gap-2">
              {[
                { icon: FileText, label: 'Acte de naissance', href: '/demande-document/acte-naissance' },
                { icon: Heart, label: 'Acte de mariage', href: '/demande-document/acte-mariage' },
                { icon: Building2, label: 'Certificat de résidence', href: '/demande-document/certificat-residence' },
                { icon: Shield, label: 'Légalisation', href: '/demande-document/legalisation' },
              ].map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white text-sm font-medium px-4 py-2.5 rounded-full transition-all border border-white/10"
                >
                  <item.icon size={14} />
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Decorative wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 100" fill="none" className="w-full">
            <path d="M0 50L48 45C96 40 192 30 288 35C384 40 480 60 576 65C672 70 768 60 864 50C960 40 1056 30 1152 35C1248 40 1344 60 1392 70L1440 80V100H1392C1344 100 1248 100 1152 100C1056 100 960 100 864 100C768 100 672 100 576 100C480 100 384 100 288 100C192 100 96 100 48 100H0V50Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Key figures */}
      <section className="py-6 -mt-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {chiffres.map((item, index) => (
              <AnimateOnScroll key={item.label} delay={index * 100}>
              <div className="card p-6 text-center group hover:-translate-y-1">
                <div className="w-12 h-12 bg-accent-50 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-accent-500 transition-colors">
                  <item.icon size={24} className="text-accent-500 group-hover:text-white transition-colors" />
                </div>
                <div className="text-2xl md:text-3xl font-heading font-bold text-primary-500">{item.value}</div>
                <div className="text-sm text-gray-500 mt-1">{item.label}</div>
              </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block bg-accent-50 text-accent-600 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
              Services en ligne
            </span>
            <h2 className="section-title">Vos démarches simplifiées</h2>
            <p className="section-subtitle mx-auto">
              Effectuez vos demandes de documents administratifs directement en ligne. 
              Simple, rapide et sécurisé.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <AnimateOnScroll key={service.title} delay={index * 80}>
              <Link to={service.href} className="card p-6 group hover:-translate-y-1 block">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${service.color}`}>
                  <service.icon size={28} />
                </div>
                <h3 className="font-heading font-bold text-lg text-gray-900 mb-2 group-hover:text-primary-500 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">{service.description}</p>
                <span className="inline-flex items-center text-accent-500 font-semibold text-sm group-hover:gap-2 transition-all">
                  Faire la demande <ArrowRight size={16} className="ml-1" />
                </span>
              </Link>
              </AnimateOnScroll>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/services" className="btn-outline">
              Voir tous les services
              <ArrowRight size={18} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* About section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <AnimateOnScroll><div>
              <span className="inline-block bg-primary-50 text-primary-500 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
                Notre commune
              </span>
              <h2 className="section-title">Bienvenue à Gohitafla</h2>
              <p className="text-gray-600 mt-6 leading-relaxed">
                Gohitafla est une commune dynamique située en Côte d'Ivoire, dans la région de la Marahoué. 
                Terre du peuple Gouro, riche du Zaouli inscrit à l'UNESCO, Gohitafla est une commune 
                en plein essor qui allie tradition et modernité.
              </p>
              <p className="text-gray-600 mt-4 leading-relaxed">
                La mairie s'engage chaque jour à offrir des services de qualité à ses citoyens, 
                à promouvoir le développement économique et social, et à garantir le bien-être 
                de toute la population.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <TrendingUp className="text-success-500" size={24} />
                  <div>
                    <div className="font-bold text-gray-900">Développement</div>
                    <div className="text-xs text-gray-500">Projets en cours</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <Users className="text-primary-500" size={24} />
                  <div>
                    <div className="font-bold text-gray-900">Proximité</div>
                    <div className="text-xs text-gray-500">Au service des citoyens</div>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <Link to="/la-mairie" className="btn-primary">
                  En savoir plus
                  <ArrowRight size={18} className="ml-2" />
                </Link>
              </div>
            </div></AnimateOnScroll>

            <AnimateOnScroll delay={200}><div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="/mairie-gohitafla.png"
                  alt="Bâtiment de la Mairie de Gohitafla"
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-accent-500 rounded-2xl -z-10" />
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-success-500 rounded-xl -z-10" />
              <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg">
                <p className="font-heading font-bold text-primary-500 text-sm">Mairie de Gohitafla</p>
                <p className="text-xs text-gray-500">Siège de l'administration communale</p>
              </div>
            </div></AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* Mot du Maire */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <img src="/mairie-gohitafla.png" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-primary-500/90" />
        </div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-10">
            {/* Photo du maire */}
            <div className="flex-shrink-0">
              <div className="w-44 h-44 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-white/30 shadow-2xl">
                <img
                  src="/maire-gohitafla.png"
                  alt="Naya Jarvis Zamble - Maire de Gohitafla"
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>
            {/* Texte */}
            <div className="text-center md:text-left">
              <span className="inline-block bg-white/10 text-white px-4 py-1.5 rounded-full text-sm font-semibold mb-5">
                Mot du Maire
              </span>
              <blockquote className="text-lg md:text-xl text-white leading-relaxed italic font-light">
                « Chers concitoyens de Gohitafla, notre commune est engagée dans une dynamique de 
                développement sans précédent. Ensemble, nous bâtissons une ville moderne, inclusive 
                et prospère. La modernisation de nos services administratifs est une priorité pour 
                faciliter votre quotidien. »
              </blockquote>
              <div className="mt-6">
                <div className="font-heading font-bold text-white text-lg">Naya Jarvis Zamble</div>
                <div className="text-primary-200 text-sm">Maire de la commune de Gohitafla</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* News section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block bg-success-50 text-success-600 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
              Actualités
            </span>
            <h2 className="section-title">Les dernières nouvelles</h2>
            <p className="section-subtitle mx-auto">
              Restez informés des dernières actualités et événements de la commune de Gohitafla.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {actualites.map((actu) => (
              <article key={actu.id} className="card group hover:-translate-y-1">
                <div className="h-48 relative overflow-hidden bg-gradient-to-br from-primary-400 to-primary-600">
                  {actu.image ? (
                    <img src={resolveImageUrl(actu.image)} alt={actu.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Newspaper size={48} className="text-white/30" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="bg-accent-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      {actu.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                    <Calendar size={14} />
                    {new Date(actu.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                  <h3 className="font-heading font-bold text-lg text-gray-900 mb-2 group-hover:text-primary-500 transition-colors">
                    {actu.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{actu.excerpt}</p>
                  <Link to="/actualites" className="inline-flex items-center mt-4 text-accent-500 font-semibold text-sm hover:gap-2 transition-all">
                    Lire la suite <ArrowRight size={14} className="ml-1" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/actualites" className="btn-outline">
              Toutes les actualités
              <ArrowRight size={18} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-accent-500 to-accent-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white">
            Besoin d'un document administratif ?
          </h2>
          <p className="mt-4 text-lg text-white/90 max-w-2xl mx-auto">
            Effectuez votre demande en ligne en quelques clics. Nos services traitent 
            votre demande dans les meilleurs délais.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/services"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-accent-600 font-bold rounded-lg hover:bg-gray-50 transition-all shadow-lg text-base"
            >
              Commencer ma demande
              <ArrowRight size={18} className="ml-2" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-all text-base"
            >
              <Phone size={18} className="mr-2" />
              Nous contacter
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
