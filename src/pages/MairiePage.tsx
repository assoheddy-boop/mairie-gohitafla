import { Link } from 'react-router-dom'
import {
  Users, Building2, Award, Target, Eye, Heart,
  ChevronRight, Phone, Mail, Briefcase
} from 'lucide-react'
import useSEO from '../hooks/useSEO'

const conseilMunicipal = [
  { nom: 'Adjoint au Maire', role: '1er Adjoint au Maire', domaine: 'Administration générale' },
  { nom: 'Adjoint au Maire', role: '2ème Adjoint au Maire', domaine: 'Affaires sociales' },
  { nom: 'Adjoint au Maire', role: '3ème Adjoint au Maire', domaine: 'Urbanisme et Habitat' },
  { nom: 'Conseiller Municipal', role: 'Conseiller', domaine: 'Éducation et Culture' },
  { nom: 'Conseiller Municipal', role: 'Conseiller', domaine: 'Jeunesse et Sports' },
  { nom: 'Conseiller Municipal', role: 'Conseiller', domaine: 'Environnement et Salubrité' },
]

const services = [
  { nom: 'Service État Civil', description: 'Gestion des actes de naissance, mariage, décès', icon: Briefcase },
  { nom: 'Service Technique', description: 'Urbanisme, voirie, infrastructures', icon: Building2 },
  { nom: 'Service Social', description: 'Action sociale, aide aux populations vulnérables', icon: Heart },
  { nom: 'Service Financier', description: 'Budget, fiscalité locale, comptabilité', icon: Award },
  { nom: 'Secrétariat Général', description: 'Coordination administrative, courrier', icon: Briefcase },
  { nom: 'Service Jeunesse & Sports', description: 'Animation, loisirs, équipements sportifs', icon: Users },
]

export default function MairiePage() {
  useSEO({
    title: 'La Mairie',
    description: 'Découvrez la Mairie de Gohitafla : le mot du maire, le conseil municipal, les services et la vision pour le développement de la commune.',
    path: '/la-mairie',
  })

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-500 to-primary-700 py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <nav className="flex items-center gap-2 text-primary-200 text-sm mb-6">
            <Link to="/" className="hover:text-white">Accueil</Link>
            <ChevronRight size={14} />
            <span className="text-white">La Mairie</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white">
            La Mairie de Gohitafla
          </h1>
          <p className="mt-4 text-lg text-primary-100 max-w-2xl">
            Découvrez l'équipe municipale, nos missions et notre engagement au service 
            des citoyens de Gohitafla.
          </p>
        </div>
      </section>

      {/* Mot du Maire */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-12 items-start">
            <div className="lg:col-span-2">
              <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl p-8 text-center">
                <div className="w-40 h-40 rounded-full mx-auto overflow-hidden border-4 border-white/30 shadow-xl mb-6">
                  <img src="/maire-gohitafla.png" alt="Naya Jarvis Zamble - Maire de Gohitafla" className="w-full h-full object-cover object-top" />
                </div>
                <h3 className="text-white font-heading font-bold text-xl">Naya Jarvis Zamble</h3>
                <p className="text-primary-200 mt-2">Maire de la commune de Gohitafla</p>
                <div className="mt-6 space-y-2">
                  <div className="flex items-center justify-center gap-2 text-primary-200 text-sm">
                    <Phone size={14} />
                    +225 XX XX XX XX XX
                  </div>
                  <div className="flex items-center justify-center gap-2 text-primary-200 text-sm">
                    <Mail size={14} />
                    maire@mairie-gohitafla.ci
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              <span className="inline-block bg-accent-50 text-accent-600 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
                Mot du Maire
              </span>
              <h2 className="section-title mb-6">Au service de Gohitafla</h2>
              <div className="prose prose-lg text-gray-600 space-y-4">
                <p>
                  Chers concitoyens, chères concitoyennes de Gohitafla,
                </p>
                <p>
                  C'est avec un profond engagement et un sens aigu de la responsabilité que nous 
                  œuvrons chaque jour au développement de notre belle commune. Gohitafla, terre d'hospitalité 
                  du peuple Gouro et du Zaouli, mérite le meilleur.
                </p>
                <p>
                  Notre vision est claire : faire de Gohitafla une commune moderne, bien administrée, 
                  où chaque citoyen a accès à des services publics de qualité. La mise en place de ce 
                  portail numérique s'inscrit dans cette dynamique de modernisation.
                </p>
                <p>
                  Grâce à ce site, vous pouvez désormais effectuer vos démarches administratives en ligne, 
                  suivre l'avancement de vos demandes et rester informés des projets et événements de la commune.
                </p>
                <p>
                  Ensemble, construisons le Gohitafla de demain !
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="section-title">Notre vision & nos missions</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card p-8 text-center group hover:-translate-y-1">
              <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:bg-primary-500 transition-colors">
                <Eye size={32} className="text-primary-500 group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-heading font-bold text-xl text-gray-900 mb-3">Notre Vision</h3>
              <p className="text-gray-600 leading-relaxed">
                Faire de Gohitafla une commune de référence en matière de gouvernance locale, 
                de développement durable et de bien-être des populations.
              </p>
            </div>
            <div className="card p-8 text-center group hover:-translate-y-1">
              <div className="w-16 h-16 bg-accent-50 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:bg-accent-500 transition-colors">
                <Target size={32} className="text-accent-500 group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-heading font-bold text-xl text-gray-900 mb-3">Nos Missions</h3>
              <p className="text-gray-600 leading-relaxed">
                Assurer les services publics essentiels, promouvoir le développement économique et social, 
                et garantir la sécurité et la salubrité de la commune.
              </p>
            </div>
            <div className="card p-8 text-center group hover:-translate-y-1">
              <div className="w-16 h-16 bg-success-50 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:bg-success-500 transition-colors">
                <Heart size={32} className="text-success-500 group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-heading font-bold text-xl text-gray-900 mb-3">Nos Valeurs</h3>
              <p className="text-gray-600 leading-relaxed">
                Transparence, proximité, équité et engagement. Nous plaçons le citoyen au cœur 
                de toutes nos actions pour un service public exemplaire.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Conseil Municipal */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block bg-primary-50 text-primary-500 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
              Équipe municipale
            </span>
            <h2 className="section-title">Le Conseil Municipal</h2>
            <p className="section-subtitle mx-auto">
              L'équipe municipale œuvre au quotidien pour le développement de la commune.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {conseilMunicipal.map((membre, index) => (
              <div key={index} className="card p-6 flex items-start gap-4 group hover:-translate-y-1">
                <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary-500 transition-colors">
                  <Users size={24} className="text-primary-500 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-gray-900">{membre.nom}</h3>
                  <p className="text-accent-500 text-sm font-semibold">{membre.role}</p>
                  <p className="text-gray-500 text-sm mt-1">{membre.domaine}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services municipaux */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block bg-accent-50 text-accent-600 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
              Organisation
            </span>
            <h2 className="section-title">Les services municipaux</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <div key={index} className="card p-6 group hover:-translate-y-1">
                <div className="w-12 h-12 bg-accent-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-accent-500 transition-colors">
                  <service.icon size={24} className="text-accent-500 group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-heading font-bold text-gray-900 mb-2">{service.nom}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
