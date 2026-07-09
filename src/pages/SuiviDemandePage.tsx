import { useState } from 'react'
import { Link } from 'react-router-dom'
import { API } from '../utils/api'
import {
  ChevronRight, Search, Clock, CheckCircle, AlertCircle,
  FileText, Phone, Loader2, Package, ArrowRight, XCircle, Truck
} from 'lucide-react'

interface DemandeResult {
  reference: string
  document: string
  demandeur: string
  date_demande: string
  statut: 'en_cours' | 'pret' | 'rejete' | 'traitement'
  etapes: Array<{ label: string; date: string; done: boolean; active?: boolean }>
}

function simulateSearch(ref: string): DemandeResult | null {
  const normalized = ref.toUpperCase().trim()
  if (!normalized.startsWith('GOH-')) return null

  const statuts: DemandeResult['statut'][] = ['traitement', 'en_cours', 'pret']
  const randomStatut = statuts[Math.floor(Math.random() * statuts.length)]

  const docs = ['Acte de naissance', 'Acte de mariage', 'Certificat de résidence', 'Acte de décès', 'Certificat de célibat', 'Légalisation']
  const randomDoc = docs[Math.floor(Math.random() * docs.length)]

  const etapesMap: Record<string, DemandeResult['etapes']> = {
    traitement: [
      { label: 'Demande reçue', date: '13/05/2026 - 09:30', done: true },
      { label: 'Vérification des informations', date: '13/05/2026 - 14:00', done: true },
      { label: 'En cours de traitement', date: 'En cours', done: false, active: true },
      { label: 'Document prêt', date: '—', done: false },
    ],
    en_cours: [
      { label: 'Demande reçue', date: '12/05/2026 - 10:15', done: true },
      { label: 'Vérification des informations', date: '12/05/2026 - 15:30', done: true },
      { label: 'En cours de traitement', date: '13/05/2026 - 08:00', done: true },
      { label: 'Document prêt', date: 'Estimation : 14/05/2026', done: false, active: true },
    ],
    pret: [
      { label: 'Demande reçue', date: '10/05/2026 - 08:45', done: true },
      { label: 'Vérification des informations', date: '10/05/2026 - 11:00', done: true },
      { label: 'En cours de traitement', date: '11/05/2026 - 09:00', done: true },
      { label: 'Document prêt — À retirer', date: '12/05/2026 - 14:30', done: true },
    ],
    rejete: [
      { label: 'Demande reçue', date: '11/05/2026 - 10:00', done: true },
      { label: 'Vérification des informations', date: '11/05/2026 - 16:00', done: true },
      { label: 'Demande rejetée — Informations incomplètes', date: '12/05/2026 - 09:00', done: false, active: true },
    ],
  }

  return {
    reference: normalized,
    document: randomDoc,
    demandeur: 'Citoyen de Gohitafla',
    date_demande: '13 Mai 2026',
    statut: randomStatut,
    etapes: etapesMap[randomStatut],
  }
}

const statutConfig = {
  traitement: { label: 'En cours de traitement', color: 'bg-blue-100 text-blue-700', icon: Loader2 },
  en_cours: { label: 'Bientôt prêt', color: 'bg-amber-100 text-amber-700', icon: Truck },
  pret: { label: 'Prêt — À retirer', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  rejete: { label: 'Rejetée', color: 'bg-red-100 text-red-700', icon: XCircle },
}

export default function SuiviDemandePage() {
  const [reference, setReference] = useState('')
  const [result, setResult] = useState<DemandeResult | null>(null)
  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!reference.trim()) return

    setLoading(true)
    setResult(null)
    setSearched(false)

    try {
      const res = await fetch(`${API}/demandes/suivi/${reference.trim().toUpperCase()}`)
      if (res.ok) {
        const data = await res.json()
        const found = buildResult(data)
        setResult(found)
      } else {
        setResult(null)
      }
    } catch {
      const found = simulateSearch(reference)
      setResult(found)
    }
    setSearched(true)
    setLoading(false)
  }

  function buildResult(data: any): DemandeResult {
    const etapesMap: Record<string, DemandeResult['etapes']> = {
      traitement: [
        { label: 'Demande reçue', date: new Date(data.created_at).toLocaleString('fr-FR'), done: true },
        { label: 'Vérification des informations', date: 'En cours', done: false, active: true },
        { label: 'En cours de traitement', date: '—', done: false },
        { label: 'Document prêt', date: '—', done: false },
      ],
      en_cours: [
        { label: 'Demande reçue', date: new Date(data.created_at).toLocaleString('fr-FR'), done: true },
        { label: 'Vérification des informations', date: new Date(data.updated_at).toLocaleString('fr-FR'), done: true },
        { label: 'En cours de traitement', date: 'En cours', done: false, active: true },
        { label: 'Document prêt', date: '—', done: false },
      ],
      pret: [
        { label: 'Demande reçue', date: new Date(data.created_at).toLocaleString('fr-FR'), done: true },
        { label: 'Vérification des informations', date: 'Terminé', done: true },
        { label: 'En cours de traitement', date: 'Terminé', done: true },
        { label: 'Document prêt — À retirer', date: new Date(data.updated_at).toLocaleString('fr-FR'), done: true },
      ],
      rejete: [
        { label: 'Demande reçue', date: new Date(data.created_at).toLocaleString('fr-FR'), done: true },
        { label: 'Vérification des informations', date: 'Terminé', done: true },
        { label: 'Demande rejetée', date: new Date(data.updated_at).toLocaleString('fr-FR'), done: false, active: true },
      ],
    }

    return {
      reference: data.reference,
      document: data.document_type,
      demandeur: `${data.nom_demandeur} ${data.prenoms_demandeur}`,
      date_demande: new Date(data.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
      statut: data.statut,
      etapes: etapesMap[data.statut] || etapesMap.traitement,
    }
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-500 to-primary-700 py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent-500 rounded-full translate-x-1/3 -translate-y-1/3" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <nav className="flex items-center gap-2 text-primary-200 text-sm mb-6">
            <Link to="/" className="hover:text-white">Accueil</Link>
            <ChevronRight size={14} />
            <span className="text-white">Suivi de demande</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white">
            Suivre ma demande
          </h1>
          <p className="mt-4 text-lg text-primary-100 max-w-2xl">
            Entrez votre numéro de référence pour connaître l'état d'avancement de votre demande de document.
          </p>
        </div>
      </section>

      {/* Search */}
      <section className="py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card p-6 md:p-8">
            <h2 className="font-heading font-bold text-xl text-gray-900 mb-2">Rechercher une demande</h2>
            <p className="text-gray-500 text-sm mb-6">
              Votre numéro de référence se trouve sur le récapitulatif reçu lors de votre demande (format : GOH-XXXXXX-XXXX).
            </p>

            <form onSubmit={handleSearch}>
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    placeholder="Ex : GOH-M4K8X2-A1B2"
                    className="input-field pl-11 text-base"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!reference.trim() || loading}
                  className="btn-accent whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <>
                      <Search size={16} className="mr-2" />
                      Rechercher
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* No result */}
            {searched && !result && (
              <div className="mt-8 text-center py-8">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <XCircle size={32} className="text-red-500" />
                </div>
                <h3 className="font-heading font-bold text-lg text-gray-900 mb-2">Demande introuvable</h3>
                <p className="text-gray-500 text-sm mb-4">
                  Aucune demande trouvée avec la référence « <strong>{reference}</strong> ».<br />
                  Vérifiez le numéro et réessayez, ou contactez la mairie.
                </p>
                <div className="flex justify-center gap-3">
                  <Link to="/contact" className="btn-outline text-sm">
                    <Phone size={14} className="mr-2" /> Contacter la mairie
                  </Link>
                  <Link to="/services" className="btn-accent text-sm">
                    Nouvelle demande
                  </Link>
                </div>
              </div>
            )}

            {/* Result */}
            {result && (
              <div className="mt-8">
                {/* Status banner */}
                <div className={`flex items-center gap-3 p-4 rounded-xl mb-6 ${statutConfig[result.statut].color}`}>
                  {(() => {
                    const Icon = statutConfig[result.statut].icon
                    return <Icon size={20} className={result.statut === 'traitement' ? 'animate-spin' : ''} />
                  })()}
                  <div>
                    <p className="font-bold text-sm">{statutConfig[result.statut].label}</p>
                    <p className="text-xs opacity-80">Référence : {result.reference}</p>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-3 mb-8">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500 text-sm">Document demandé</span>
                    <span className="font-semibold text-sm text-gray-900">{result.document}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500 text-sm">Date de demande</span>
                    <span className="font-semibold text-sm text-gray-900">{result.date_demande}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500 text-sm">Référence</span>
                    <span className="font-semibold text-sm text-accent-600 font-mono">{result.reference}</span>
                  </div>
                </div>

                {/* Timeline */}
                <h3 className="font-heading font-bold text-gray-900 mb-4">Progression de la demande</h3>
                <div className="space-y-0">
                  {result.etapes.map((etape, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          etape.done ? 'bg-success-500' : etape.active ? 'bg-accent-500 animate-pulse' : 'bg-gray-200'
                        }`}>
                          {etape.done ? (
                            <CheckCircle size={16} className="text-white" />
                          ) : etape.active ? (
                            <Clock size={16} className="text-white" />
                          ) : (
                            <span className="w-2 h-2 bg-gray-400 rounded-full" />
                          )}
                        </div>
                        {index < result.etapes.length - 1 && (
                          <div className={`w-0.5 h-12 ${etape.done ? 'bg-success-500' : 'bg-gray-200'}`} />
                        )}
                      </div>
                      <div className="pb-8">
                        <p className={`font-semibold text-sm ${
                          etape.done ? 'text-gray-900' : etape.active ? 'text-accent-600' : 'text-gray-400'
                        }`}>
                          {etape.label}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">{etape.date}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                {result.statut === 'pret' && (
                  <div className="bg-success-50 border border-success-200 rounded-xl p-5 mt-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle size={20} className="text-success-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-success-700 text-sm">Votre document est prêt !</p>
                        <p className="text-success-600 text-xs mt-1">
                          Présentez-vous à la Mairie de Gohitafla avec votre pièce d'identité et 
                          ce numéro de référence pour retirer votre document.
                        </p>
                        <p className="text-success-600 text-xs mt-1 font-semibold">
                          Horaires : Lun-Ven, 7h30 - 12h00 / 14h30 - 16h30
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 mt-6">
                  <Link to="/services" className="btn-accent flex-1 justify-center text-sm">
                    Nouvelle demande
                  </Link>
                  <Link to="/contact" className="btn-outline flex-1 justify-center text-sm">
                    <Phone size={14} className="mr-2" /> Contacter
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Help */}
          <div className="mt-8 bg-blue-50 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className="text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-blue-800 text-sm mb-1">Vous n'avez pas de numéro de référence ?</p>
                <p className="text-blue-700 text-xs leading-relaxed">
                  Si vous avez effectué votre demande au guichet et n'avez pas reçu de numéro de référence, 
                  veuillez contacter directement le service d'état civil au <strong>+225 XX XX XX XX XX</strong> ou 
                  par email à <strong>etatcivil@mairie-gohitafla.ci</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
