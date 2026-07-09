import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { API } from '../utils/api'
import {
  ChevronRight, FileText, Heart, BookOpen, Building2, Shield, Users,
  CheckCircle, AlertCircle, ArrowRight, ArrowLeft, Send, Printer
} from 'lucide-react'

const documentTypes: Record<string, {
  title: string
  icon: typeof FileText
  color: string
  fields: Array<{ name: string; label: string; type: string; required: boolean; options?: string[]; placeholder?: string }>
}> = {
  'acte-naissance': {
    title: 'Acte de naissance',
    icon: FileText,
    color: 'bg-blue-500',
    fields: [
      { name: 'type_acte', label: 'Type d\'acte demandé', type: 'select', required: true, options: ['Copie intégrale', 'Extrait avec filiation', 'Extrait sans filiation'] },
      { name: 'nom', label: 'Nom de famille', type: 'text', required: true, placeholder: 'Nom de la personne concernée' },
      { name: 'prenoms', label: 'Prénoms', type: 'text', required: true, placeholder: 'Prénoms complets' },
      { name: 'date_naissance', label: 'Date de naissance', type: 'date', required: true },
      { name: 'lieu_naissance', label: 'Lieu de naissance', type: 'text', required: true, placeholder: 'Ville / Commune' },
      { name: 'nom_pere', label: 'Nom complet du père', type: 'text', required: true, placeholder: 'Nom et prénoms du père' },
      { name: 'nom_mere', label: 'Nom complet de la mère', type: 'text', required: true, placeholder: 'Nom et prénoms de la mère' },
      { name: 'motif', label: 'Motif de la demande', type: 'select', required: true, options: ['Usage administratif', 'Scolarité', 'Emploi', 'Mariage', 'Voyage', 'Autre'] },
      { name: 'nombre_copies', label: 'Nombre de copies', type: 'number', required: true, placeholder: '1' },
    ],
  },
  'acte-mariage': {
    title: 'Acte de mariage',
    icon: Heart,
    color: 'bg-rose-500',
    fields: [
      { name: 'type_acte', label: 'Type d\'acte', type: 'select', required: true, options: ['Copie intégrale', 'Extrait d\'acte'] },
      { name: 'nom_epoux', label: 'Nom de l\'époux', type: 'text', required: true, placeholder: 'Nom complet de l\'époux' },
      { name: 'nom_epouse', label: 'Nom de l\'épouse', type: 'text', required: true, placeholder: 'Nom complet de l\'épouse' },
      { name: 'date_mariage', label: 'Date du mariage', type: 'date', required: true },
      { name: 'lieu_mariage', label: 'Lieu du mariage', type: 'text', required: true, placeholder: 'Commune / Ville' },
      { name: 'motif', label: 'Motif de la demande', type: 'select', required: true, options: ['Usage administratif', 'Procédure juridique', 'Voyage', 'Autre'] },
      { name: 'nombre_copies', label: 'Nombre de copies', type: 'number', required: true, placeholder: '1' },
    ],
  },
  'acte-deces': {
    title: 'Acte de décès',
    icon: BookOpen,
    color: 'bg-purple-500',
    fields: [
      { name: 'nom_defunt', label: 'Nom du défunt', type: 'text', required: true, placeholder: 'Nom complet' },
      { name: 'prenoms_defunt', label: 'Prénoms du défunt', type: 'text', required: true, placeholder: 'Prénoms complets' },
      { name: 'date_deces', label: 'Date du décès', type: 'date', required: true },
      { name: 'lieu_deces', label: 'Lieu du décès', type: 'text', required: true, placeholder: 'Commune / Ville' },
      { name: 'lien_parente', label: 'Lien de parenté avec le défunt', type: 'select', required: true, options: ['Conjoint(e)', 'Enfant', 'Parent', 'Frère/Sœur', 'Autre'] },
      { name: 'motif', label: 'Motif de la demande', type: 'select', required: true, options: ['Succession', 'Usage administratif', 'Assurance', 'Autre'] },
      { name: 'nombre_copies', label: 'Nombre de copies', type: 'number', required: true, placeholder: '1' },
    ],
  },
  'certificat-residence': {
    title: 'Certificat de résidence',
    icon: Building2,
    color: 'bg-emerald-500',
    fields: [
      { name: 'nom', label: 'Nom de famille', type: 'text', required: true, placeholder: 'Votre nom' },
      { name: 'prenoms', label: 'Prénoms', type: 'text', required: true, placeholder: 'Vos prénoms' },
      { name: 'date_naissance', label: 'Date de naissance', type: 'date', required: true },
      { name: 'adresse', label: 'Adresse complète', type: 'textarea', required: true, placeholder: 'Quartier, rue, lot...' },
      { name: 'duree_residence', label: 'Durée de résidence', type: 'select', required: true, options: ['Moins d\'un an', '1 à 3 ans', '3 à 5 ans', 'Plus de 5 ans'] },
      { name: 'motif', label: 'Motif de la demande', type: 'select', required: true, options: ['Usage administratif', 'Scolarité', 'Emploi', 'Autre'] },
    ],
  },
  'legalisation': {
    title: 'Légalisation de documents',
    icon: Shield,
    color: 'bg-amber-500',
    fields: [
      { name: 'nom', label: 'Nom du demandeur', type: 'text', required: true, placeholder: 'Votre nom complet' },
      { name: 'prenoms', label: 'Prénoms', type: 'text', required: true, placeholder: 'Vos prénoms' },
      { name: 'type_document', label: 'Type de document à légaliser', type: 'select', required: true, options: ['Diplôme', 'Attestation', 'Certificat', 'Acte d\'état civil', 'Autre'] },
      { name: 'nombre_documents', label: 'Nombre de documents', type: 'number', required: true, placeholder: '1' },
      { name: 'motif', label: 'Motif', type: 'select', required: true, options: ['Usage administratif', 'Emploi', 'Voyage', 'Scolarité', 'Autre'] },
    ],
  },
  'certificat-celibat': {
    title: 'Certificat de célibat',
    icon: Users,
    color: 'bg-cyan-500',
    fields: [
      { name: 'nom', label: 'Nom de famille', type: 'text', required: true, placeholder: 'Votre nom' },
      { name: 'prenoms', label: 'Prénoms', type: 'text', required: true, placeholder: 'Vos prénoms' },
      { name: 'date_naissance', label: 'Date de naissance', type: 'date', required: true },
      { name: 'lieu_naissance', label: 'Lieu de naissance', type: 'text', required: true, placeholder: 'Ville / Commune' },
      { name: 'nationalite', label: 'Nationalité', type: 'text', required: true, placeholder: 'Ivoirienne' },
      { name: 'adresse', label: 'Adresse actuelle', type: 'textarea', required: true, placeholder: 'Votre adresse complète' },
      { name: 'motif', label: 'Motif', type: 'select', required: true, options: ['Mariage', 'Usage administratif', 'Autre'] },
    ],
  },
}

export default function DemandeDocumentPage() {
  const { type } = useParams<{ type: string }>()
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [demandeurInfo, setDemandeurInfo] = useState({
    nom_demandeur: '',
    prenoms_demandeur: '',
    telephone: '',
    email: '',
  })

  const doc = type ? documentTypes[type] : null

  if (!doc) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-heading font-bold text-gray-900 mb-2">Document non trouvé</h2>
          <p className="text-gray-600 mb-6">Le type de document demandé n'existe pas.</p>
          <Link to="/services" className="btn-primary">
            <ArrowLeft size={16} className="mr-2" />
            Retour aux services
          </Link>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const reference = `GOH-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`

    try {
      await fetch(`${API}/demandes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reference,
          document_type: doc.title,
          nom_demandeur: demandeurInfo.nom_demandeur,
          prenoms_demandeur: demandeurInfo.prenoms_demandeur,
          telephone: demandeurInfo.telephone,
          email: demandeurInfo.email,
          form_data: formData,
        }),
      })
    } catch {}

    setFormData(prev => ({ ...prev, reference }))
    setSubmitted(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (submitted) {
    return (
      <div>
        <section className="bg-gradient-to-br from-success-500 to-success-700 py-16 md:py-24">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} className="text-success-500" />
            </div>
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-white">
              Demande envoyée avec succès !
            </h1>
            <p className="mt-4 text-lg text-success-100">
              Votre demande de <strong>{doc.title}</strong> a été enregistrée.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="card p-8">
              <h2 className="font-heading font-bold text-xl text-gray-900 mb-6">Récapitulatif de votre demande</h2>

              <div className="bg-accent-50 rounded-xl p-6 mb-6">
                <p className="text-sm text-gray-600">Numéro de référence</p>
                <p className="text-2xl font-heading font-bold text-accent-600 mt-1">
                  {formData.reference}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Conservez ce numéro pour suivre votre demande et retirer votre document.
                </p>
              </div>

              <div className="space-y-3 mb-8">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Document demandé</span>
                  <span className="font-semibold text-gray-900">{doc.title}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Demandeur</span>
                  <span className="font-semibold text-gray-900">
                    {demandeurInfo.nom_demandeur} {demandeurInfo.prenoms_demandeur}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Téléphone</span>
                  <span className="font-semibold text-gray-900">{demandeurInfo.telephone}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Statut</span>
                  <span className="inline-flex items-center gap-1.5 text-accent-600 font-semibold">
                    <span className="w-2 h-2 bg-accent-500 rounded-full animate-pulse" />
                    En cours de traitement
                  </span>
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-5 mb-8">
                <div className="flex items-start gap-3">
                  <AlertCircle size={20} className="text-blue-500 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-semibold mb-1">Prochaines étapes :</p>
                    <ol className="list-decimal ml-4 space-y-1">
                      <li>Votre demande sera traitée dans un délai de 48 à 72 heures ouvrables.</li>
                      <li>Vous serez contacté(e) par téléphone lorsque votre document sera prêt.</li>
                      <li>Présentez-vous à la mairie avec votre pièce d'identité et ce numéro de référence.</li>
                    </ol>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => window.print()}
                  className="btn-outline flex-1 justify-center"
                >
                  <Printer size={16} className="mr-2" />
                  Imprimer le récépissé
                </button>
                <Link to={`/suivi`} className="btn-accent flex-1 justify-center">
                  <ArrowRight size={16} className="mr-2" />
                  Suivre ma demande
                </Link>
                <Link to="/services" className="btn-primary flex-1 justify-center">
                  Nouvelle demande
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }

  const Icon = doc.icon

  return (
    <div>
      {/* Hero */}
      <section className={`${doc.color} py-12 md:py-16`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-white/70 text-sm mb-6">
            <Link to="/" className="hover:text-white">Accueil</Link>
            <ChevronRight size={14} />
            <Link to="/services" className="hover:text-white">Services</Link>
            <ChevronRight size={14} />
            <span className="text-white">{doc.title}</span>
          </nav>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
              <Icon size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-heading font-bold text-white">
                Demande de {doc.title.toLowerCase()}
              </h1>
              <p className="text-white/80 mt-1">Remplissez le formulaire ci-dessous pour effectuer votre demande</p>
            </div>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSubmit}>
            {/* Demandeur info */}
            <div className="card p-6 md:p-8 mb-6">
              <h2 className="font-heading font-bold text-xl text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                Informations du demandeur
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="label-field">Nom du demandeur *</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Votre nom"
                    required
                    value={demandeurInfo.nom_demandeur}
                    onChange={(e) => setDemandeurInfo(prev => ({ ...prev, nom_demandeur: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="label-field">Prénoms du demandeur *</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Vos prénoms"
                    required
                    value={demandeurInfo.prenoms_demandeur}
                    onChange={(e) => setDemandeurInfo(prev => ({ ...prev, prenoms_demandeur: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="label-field">Téléphone *</label>
                  <input
                    type="tel"
                    className="input-field"
                    placeholder="+225 XX XX XX XX XX"
                    required
                    value={demandeurInfo.telephone}
                    onChange={(e) => setDemandeurInfo(prev => ({ ...prev, telephone: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="label-field">Email (optionnel)</label>
                  <input
                    type="email"
                    className="input-field"
                    placeholder="votre.email@exemple.com"
                    value={demandeurInfo.email}
                    onChange={(e) => setDemandeurInfo(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            {/* Document specific fields */}
            <div className="card p-6 md:p-8 mb-6">
              <h2 className="font-heading font-bold text-xl text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                Informations sur le document
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {doc.fields.map((field) => (
                  <div key={field.name} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                    <label className="label-field">
                      {field.label} {field.required && '*'}
                    </label>
                    {field.type === 'select' ? (
                      <select
                        className="input-field"
                        required={field.required}
                        value={formData[field.name] || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, [field.name]: e.target.value }))}
                      >
                        <option value="">Sélectionnez...</option>
                        {field.options?.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : field.type === 'textarea' ? (
                      <textarea
                        className="input-field min-h-[100px]"
                        placeholder={field.placeholder}
                        required={field.required}
                        value={formData[field.name] || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, [field.name]: e.target.value }))}
                      />
                    ) : (
                      <input
                        type={field.type}
                        className="input-field"
                        placeholder={field.placeholder}
                        required={field.required}
                        value={formData[field.name] || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, [field.name]: e.target.value }))}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Submit */}
            <div className="card p-6 md:p-8">
              <div className="flex items-start gap-3 bg-amber-50 rounded-xl p-4 mb-6">
                <AlertCircle size={20} className="text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800">
                  En soumettant ce formulaire, vous certifiez que les informations fournies sont exactes. 
                  Toute fausse déclaration est passible de poursuites judiciaires.
                </p>
              </div>

              <label className="flex items-start gap-3 mb-6 cursor-pointer">
                <input type="checkbox" required className="mt-1 w-4 h-4 text-primary-500 rounded" />
                <span className="text-sm text-gray-600">
                  Je certifie l'exactitude des informations fournies et j'accepte les conditions 
                  d'utilisation du service en ligne de la Mairie de Gohitafla. *
                </span>
              </label>

              <div className="flex flex-wrap gap-4">
                <Link to="/services" className="btn-outline flex-1 justify-center">
                  <ArrowLeft size={16} className="mr-2" />
                  Retour
                </Link>
                <button type="submit" className="btn-accent flex-1 justify-center">
                  <Send size={16} className="mr-2" />
                  Soumettre la demande
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}
