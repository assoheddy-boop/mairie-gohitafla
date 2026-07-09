import { Link } from 'react-router-dom'
import {
  ChevronRight, FileText, Heart, BookOpen, Building2, Shield, Users,
  Clock, CheckCircle, AlertCircle, ArrowRight, Download, Banknote,
  ListChecks
} from 'lucide-react'
import useSEO from '../hooks/useSEO'

const demarches = [
  {
    id: 'acte-naissance',
    icon: FileText,
    title: 'Acte de naissance',
    color: 'border-blue-500',
    iconColor: 'bg-blue-50 text-blue-600',
    delai: '48 à 72 heures',
    cout: '200 FCFA (extrait) / 500 FCFA (copie intégrale)',
    description: 'L\'acte de naissance est un document officiel qui atteste de la naissance d\'une personne. Il est indispensable pour de nombreuses démarches administratives.',
    pieces: [
      'Pièce d\'identité du demandeur (CNI, passeport ou attestation d\'identité)',
      'Carnet de famille ou livret de famille (si disponible)',
      'Informations complètes sur la personne concernée (nom, prénoms, date et lieu de naissance)',
      'Noms complets des parents',
    ],
    etapes: [
      'Se présenter au service d\'état civil de la Mairie de Gohitafla ou effectuer la demande en ligne',
      'Fournir les informations et pièces requises',
      'Payer les frais de timbre',
      'Retirer le document dans le délai indiqué',
    ],
  },
  {
    id: 'acte-mariage',
    icon: Heart,
    title: 'Acte de mariage',
    color: 'border-rose-500',
    iconColor: 'bg-rose-50 text-rose-600',
    delai: '48 à 72 heures',
    cout: '500 FCFA',
    description: 'L\'acte de mariage est le document officiel qui atteste de l\'union légale entre deux personnes. Il est requis pour diverses procédures administratives et juridiques.',
    pieces: [
      'Pièce d\'identité du demandeur',
      'Date et lieu de célébration du mariage',
      'Noms complets des deux époux',
      'Numéro d\'acte de mariage (si connu)',
    ],
    etapes: [
      'Se rendre au service d\'état civil ou faire la demande en ligne',
      'Fournir les informations relatives au mariage',
      'Payer les droits de timbre',
      'Retirer le document dans le délai imparti',
    ],
  },
  {
    id: 'acte-deces',
    icon: BookOpen,
    title: 'Acte de décès',
    color: 'border-purple-500',
    iconColor: 'bg-purple-50 text-purple-600',
    delai: '48 à 72 heures',
    cout: '500 FCFA',
    description: 'L\'acte de décès est un document officiel constatant le décès d\'une personne. Il est nécessaire pour les successions, les assurances et d\'autres démarches.',
    pieces: [
      'Pièce d\'identité du demandeur',
      'Justificatif du lien de parenté avec le défunt',
      'Informations sur le défunt (nom, prénoms, date et lieu de décès)',
      'Certificat médical de décès (pour une première déclaration)',
    ],
    etapes: [
      'Se présenter au service d\'état civil ou effectuer la demande en ligne',
      'Fournir les pièces et informations requises',
      'Payer les frais de timbre',
      'Retirer le document au guichet',
    ],
  },
  {
    id: 'certificat-residence',
    icon: Building2,
    title: 'Certificat de résidence',
    color: 'border-emerald-500',
    iconColor: 'bg-emerald-50 text-emerald-600',
    delai: '24 à 48 heures',
    cout: '500 FCFA',
    description: 'Le certificat de résidence atteste que vous résidez effectivement dans la commune de Gohitafla. Il est souvent demandé pour les inscriptions scolaires, les demandes d\'emploi ou les procédures administratives.',
    pieces: [
      'Pièce d\'identité (CNI ou passeport)',
      'Justificatif de domicile (facture d\'eau, d\'électricité ou attestation du propriétaire)',
      '2 photos d\'identité récentes',
      'Attestation de résidence signée par le chef de quartier',
    ],
    etapes: [
      'Obtenir une attestation de votre chef de quartier',
      'Se présenter à la mairie avec les pièces justificatives',
      'Payer les frais',
      'Retirer le certificat dans le délai indiqué',
    ],
  },
  {
    id: 'legalisation',
    icon: Shield,
    title: 'Légalisation de documents',
    color: 'border-amber-500',
    iconColor: 'bg-amber-50 text-amber-600',
    delai: '24 heures',
    cout: '100 FCFA par document',
    description: 'La légalisation est la certification de la conformité d\'une copie à un document original. Ce service est nécessaire pour valider vos copies de documents officiels.',
    pieces: [
      'Document original à légaliser',
      'Copie(s) à certifier conforme',
      'Pièce d\'identité du demandeur',
    ],
    etapes: [
      'Se présenter au guichet de légalisation de la mairie',
      'Présenter le document original et les copies',
      'Payer les frais de légalisation',
      'Retirer les documents certifiés',
    ],
  },
  {
    id: 'certificat-celibat',
    icon: Users,
    title: 'Certificat de célibat',
    color: 'border-cyan-500',
    iconColor: 'bg-cyan-50 text-cyan-600',
    delai: '48 à 72 heures',
    cout: '1 000 FCFA',
    description: 'Le certificat de célibat atteste qu\'une personne n\'a jamais contracté de mariage. Il est souvent requis pour un projet de mariage ou pour des démarches administratives à l\'étranger.',
    pieces: [
      'Pièce d\'identité',
      'Extrait d\'acte de naissance de moins de 3 mois',
      'Certificat de résidence',
      'Déclaration sur l\'honneur de célibat',
      '2 témoins majeurs avec pièces d\'identité',
    ],
    etapes: [
      'Rassembler toutes les pièces requises',
      'Se présenter à la mairie avec les deux témoins',
      'Payer les frais de délivrance',
      'Retirer le certificat dans le délai indiqué',
    ],
  },
]

export default function DemarchesPage() {
  useSEO({
    title: 'Démarches administratives',
    description: 'Guide complet des démarches administratives à la Mairie de Gohitafla : documents requis, délais, coûts et procédures.',
    path: '/demarches',
  })

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-500 to-primary-700 py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-accent-500 rounded-full -translate-x-1/3 -translate-y-1/3" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <nav className="flex items-center gap-2 text-primary-200 text-sm mb-6">
            <Link to="/" className="hover:text-white">Accueil</Link>
            <ChevronRight size={14} />
            <span className="text-white">Démarches administratives</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white">
            Démarches administratives
          </h1>
          <p className="mt-4 text-lg text-primary-100 max-w-2xl">
            Retrouvez toutes les informations nécessaires pour effectuer vos démarches 
            administratives auprès de la Mairie de Gohitafla.
          </p>
        </div>
      </section>

      {/* Info banner */}
      <section className="bg-accent-50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 flex-wrap justify-center md:justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle size={20} className="text-accent-500" />
              <p className="text-sm text-gray-700">
                <strong>Horaires du guichet :</strong> Lundi au Vendredi, de 7h30 à 12h00 et de 14h30 à 16h30
              </p>
            </div>
            <Link to="/services" className="text-accent-600 font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all">
              Faire une demande en ligne <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Demarches list */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {demarches.map((demarche) => (
              <div key={demarche.id} className={`card border-l-4 ${demarche.color} overflow-visible`}>
                <div className="p-6 md:p-8">
                  {/* Header */}
                  <div className="flex items-start gap-4 mb-6">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${demarche.iconColor}`}>
                      <demarche.icon size={28} />
                    </div>
                    <div className="flex-1">
                      <h2 className="font-heading font-bold text-2xl text-gray-900">{demarche.title}</h2>
                      <p className="text-gray-600 mt-1">{demarche.description}</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Infos pratiques */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
                        <Clock size={20} className="text-primary-500 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide">Délai de traitement</p>
                          <p className="font-semibold text-gray-900">{demarche.delai}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
                        <Banknote size={20} className="text-accent-500 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide">Coût</p>
                          <p className="font-semibold text-gray-900">{demarche.cout}</p>
                        </div>
                      </div>
                    </div>

                    {/* Pièces requises */}
                    <div>
                      <h3 className="font-heading font-bold text-sm text-gray-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                        <ListChecks size={16} className="text-primary-500" />
                        Pièces à fournir
                      </h3>
                      <ul className="space-y-2">
                        {demarche.pieces.map((piece, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                            <CheckCircle size={14} className="text-success-500 flex-shrink-0 mt-0.5" />
                            {piece}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Étapes */}
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <h3 className="font-heading font-bold text-sm text-gray-900 uppercase tracking-wide mb-4">
                      Étapes de la procédure
                    </h3>
                    <div className="grid md:grid-cols-2 gap-3">
                      {demarche.etapes.map((etape, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <span className="w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                            {i + 1}
                          </span>
                          <span className="text-sm text-gray-600">{etape}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link to={`/demande-document/${demarche.id}`} className="btn-accent text-sm">
                      Faire la demande en ligne
                      <ArrowRight size={14} className="ml-2" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
