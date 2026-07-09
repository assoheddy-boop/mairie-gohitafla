import { Link } from 'react-router-dom'
import {
  FileText, Heart, BookOpen, Building2, Shield, Users,
  ChevronRight, ArrowRight, Clock, CheckCircle, Search,
  AlertCircle, HelpCircle
} from 'lucide-react'
import useSEO from '../hooks/useSEO'

const documents = [
  {
    id: 'acte-naissance',
    icon: FileText,
    title: 'Acte de naissance',
    description: 'Copie intégrale, extrait avec filiation ou extrait sans filiation',
    delai: '48h - 72h',
    pieces: ['Pièce d\'identité du demandeur', 'Informations sur la personne concernée'],
    color: 'bg-blue-500',
    lightColor: 'bg-blue-50 text-blue-600',
  },
  {
    id: 'acte-mariage',
    icon: Heart,
    title: 'Acte de mariage',
    description: 'Copie intégrale ou extrait d\'acte de mariage',
    delai: '48h - 72h',
    pieces: ['Pièce d\'identité', 'Date et lieu du mariage', 'Noms des époux'],
    color: 'bg-rose-500',
    lightColor: 'bg-rose-50 text-rose-600',
  },
  {
    id: 'acte-deces',
    icon: BookOpen,
    title: 'Acte de décès',
    description: 'Copie intégrale ou extrait d\'acte de décès',
    delai: '48h - 72h',
    pieces: ['Pièce d\'identité du demandeur', 'Informations sur le défunt'],
    color: 'bg-purple-500',
    lightColor: 'bg-purple-50 text-purple-600',
  },
  {
    id: 'certificat-residence',
    icon: Building2,
    title: 'Certificat de résidence',
    description: 'Attestation officielle de domicile dans la commune',
    delai: '24h - 48h',
    pieces: ['Pièce d\'identité', 'Justificatif de domicile', 'Photo d\'identité'],
    color: 'bg-emerald-500',
    lightColor: 'bg-emerald-50 text-emerald-600',
  },
  {
    id: 'legalisation',
    icon: Shield,
    title: 'Légalisation de documents',
    description: 'Certification conforme de copies de documents officiels',
    delai: '24h',
    pieces: ['Document original', 'Copie à légaliser', 'Pièce d\'identité'],
    color: 'bg-amber-500',
    lightColor: 'bg-amber-50 text-amber-600',
  },
  {
    id: 'certificat-celibat',
    icon: Users,
    title: 'Certificat de célibat',
    description: 'Attestation de non-mariage pour vos démarches',
    delai: '48h - 72h',
    pieces: ['Pièce d\'identité', 'Extrait d\'acte de naissance', 'Certificat de résidence'],
    color: 'bg-cyan-500',
    lightColor: 'bg-cyan-50 text-cyan-600',
  },
]

const etapes = [
  { num: '01', title: 'Choisir le document', description: 'Sélectionnez le type de document dont vous avez besoin.' },
  { num: '02', title: 'Remplir le formulaire', description: 'Complétez le formulaire avec vos informations personnelles.' },
  { num: '03', title: 'Soumettre la demande', description: 'Validez et envoyez votre demande. Un numéro de suivi vous sera attribué.' },
  { num: '04', title: 'Retirer le document', description: 'Présentez-vous à la mairie avec votre pièce d\'identité et votre numéro de suivi.' },
]

export default function ServicesPage() {
  useSEO({
    title: 'Services en ligne',
    description: 'Demandez vos documents administratifs en ligne : acte de naissance, acte de mariage, certificat de résidence et plus.',
    path: '/services',
  })

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-500 to-primary-700 py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-500 rounded-full -translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <nav className="flex items-center gap-2 text-primary-200 text-sm mb-6">
            <Link to="/" className="hover:text-white">Accueil</Link>
            <ChevronRight size={14} />
            <span className="text-white">Services en ligne</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white">
            Services en ligne
          </h1>
          <p className="mt-4 text-lg text-primary-100 max-w-2xl">
            Effectuez vos demandes de documents administratifs directement en ligne. 
            Simple, rapide et sécurisé.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-accent-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-heading font-bold text-primary-500 text-center mb-10">
            Comment ça marche ?
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {etapes.map((etape, index) => (
              <div key={etape.num} className="relative">
                <div className="bg-white rounded-xl p-6 text-center relative z-10">
                  <div className="w-12 h-12 bg-accent-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-heading font-bold">
                    {etape.num}
                  </div>
                  <h3 className="font-heading font-bold text-gray-900 mb-2">{etape.title}</h3>
                  <p className="text-gray-600 text-sm">{etape.description}</p>
                </div>
                {index < etapes.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 z-20">
                    <ChevronRight size={24} className="text-accent-500" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Documents list */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block bg-primary-50 text-primary-500 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
              Documents disponibles
            </span>
            <h2 className="section-title">Quel document souhaitez-vous ?</h2>
            <p className="section-subtitle mx-auto">
              Sélectionnez le document que vous souhaitez demander pour commencer la procédure.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((doc) => (
              <div key={doc.id} className="card overflow-hidden group hover:-translate-y-1">
                <div className={`h-2 ${doc.color}`} />
                <div className="p-6">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${doc.lightColor}`}>
                    <doc.icon size={28} />
                  </div>
                  <h3 className="font-heading font-bold text-xl text-gray-900 mb-2">
                    {doc.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">{doc.description}</p>

                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <Clock size={14} className="text-accent-500" />
                    Délai : <span className="font-semibold text-gray-700">{doc.delai}</span>
                  </div>

                  <div className="mb-5">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Pièces requises :</p>
                    <ul className="space-y-1">
                      {doc.pieces.map((piece, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                          <CheckCircle size={14} className="text-success-500 flex-shrink-0 mt-0.5" />
                          {piece}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    to={`/demande-document/${doc.id}`}
                    className="btn-accent w-full text-sm justify-center"
                  >
                    Faire la demande
                    <ArrowRight size={16} className="ml-2" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="section-title">Questions fréquentes</h2>
          </div>
          <div className="space-y-4">
            {[
              {
                q: 'Combien de temps faut-il pour obtenir un document ?',
                a: 'Le délai varie selon le type de document demandé. En général, comptez entre 24h et 72h ouvrables après la soumission de votre demande complète.',
              },
              {
                q: 'Quels sont les frais pour les demandes de documents ?',
                a: 'Les frais varient selon le type de document. Les tarifs sont fixés par arrêté municipal et sont affichés au niveau de chaque formulaire de demande.',
              },
              {
                q: 'Comment puis-je suivre ma demande ?',
                a: 'Après soumission de votre demande, vous recevrez un numéro de suivi. Vous pourrez utiliser ce numéro pour suivre l\'avancement de votre demande.',
              },
              {
                q: 'Puis-je faire une demande pour une autre personne ?',
                a: 'Oui, vous pouvez faire une demande pour un membre de votre famille. Il vous sera demandé de justifier le lien de parenté et de fournir les informations nécessaires.',
              },
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-heading font-bold text-gray-900 flex items-start gap-3">
                  <HelpCircle size={20} className="text-accent-500 flex-shrink-0 mt-0.5" />
                  {faq.q}
                </h3>
                <p className="text-gray-600 mt-3 ml-8 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
