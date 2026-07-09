import { useState } from 'react'
import { Link } from 'react-router-dom'
import { API } from '../utils/api'
import {
  ChevronRight, MapPin, Phone, Mail, Clock, Send,
  CheckCircle, MessageSquare, AlertCircle, Building2, Globe
} from 'lucide-react'
import useSEO from '../hooks/useSEO'

const horaires = [
  { jour: 'Lundi', heures: '7h30 - 12h00 / 14h30 - 16h30' },
  { jour: 'Mardi', heures: '7h30 - 12h00 / 14h30 - 16h30' },
  { jour: 'Mercredi', heures: '7h30 - 12h00 / 14h30 - 16h30' },
  { jour: 'Jeudi', heures: '7h30 - 12h00 / 14h30 - 16h30' },
  { jour: 'Vendredi', heures: '7h30 - 12h00 / 14h30 - 16h30' },
  { jour: 'Samedi', heures: 'Fermé' },
  { jour: 'Dimanche', heures: 'Fermé' },
]

const servicesContact = [
  { nom: 'Standard / Accueil', tel: '+225 XX XX XX XX XX', icon: Phone },
  { nom: 'Service État Civil', tel: '+225 XX XX XX XX XX', icon: Building2 },
  { nom: 'Secrétariat du Maire', tel: '+225 XX XX XX XX XX', icon: MessageSquare },
  { nom: 'Service Technique', tel: '+225 XX XX XX XX XX', icon: Building2 },
]

export default function ContactPage() {
  useSEO({
    title: 'Contact',
    description: 'Contactez la Mairie de Gohitafla. Adresse, téléphone, email et formulaire de contact pour toutes vos demandes.',
    path: '/contact',
  })

  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    const form = e.target as HTMLFormElement
    const data = Object.fromEntries(new FormData(form))
    try {
      await fetch(`${API}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
    } catch {}
    setSending(false)
    setSubmitted(true)
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-500 to-primary-700 py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/2 right-0 w-96 h-96 bg-accent-500 rounded-full translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <nav className="flex items-center gap-2 text-primary-200 text-sm mb-6">
            <Link to="/" className="hover:text-white">Accueil</Link>
            <ChevronRight size={14} />
            <span className="text-white">Contact</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white">
            Contactez-nous
          </h1>
          <p className="mt-4 text-lg text-primary-100 max-w-2xl">
            Nous sommes à votre écoute. N'hésitez pas à nous contacter pour toute question 
            ou demande d'information.
          </p>
        </div>
      </section>

      {/* Contact info cards */}
      <section className="py-12 -mt-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="card p-6 text-center group hover:-translate-y-1">
              <div className="w-14 h-14 bg-primary-50 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-500 transition-colors">
                <MapPin size={28} className="text-primary-500 group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-heading font-bold text-gray-900 mb-2">Adresse</h3>
              <p className="text-gray-600 text-sm">
                Mairie de Gohitafla<br />
                Centre-ville, Gohitafla<br />
                Côte d'Ivoire
              </p>
            </div>
            <div className="card p-6 text-center group hover:-translate-y-1">
              <div className="w-14 h-14 bg-accent-50 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-accent-500 transition-colors">
                <Phone size={28} className="text-accent-500 group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-heading font-bold text-gray-900 mb-2">Téléphone</h3>
              <p className="text-gray-600 text-sm">
                Standard : +225 XX XX XX XX XX<br />
                Fax : +225 XX XX XX XX XX
              </p>
            </div>
            <div className="card p-6 text-center group hover:-translate-y-1">
              <div className="w-14 h-14 bg-success-50 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-success-500 transition-colors">
                <Mail size={28} className="text-success-500 group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-heading font-bold text-gray-900 mb-2">Email</h3>
              <p className="text-gray-600 text-sm">
                contact@mairie-gohitafla.ci<br />
                etatcivil@mairie-gohitafla.ci
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Form + info */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Form */}
            <div className="lg:col-span-3">
              <h2 className="section-title mb-2">Envoyez-nous un message</h2>
              <p className="text-gray-600 mb-8">
                Remplissez le formulaire ci-dessous et nous vous répondrons dans les meilleurs délais.
              </p>

              {submitted ? (
                <div className="card p-8 text-center">
                  <div className="w-16 h-16 bg-success-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} className="text-success-500" />
                  </div>
                  <h3 className="font-heading font-bold text-xl text-gray-900 mb-2">
                    Message envoyé !
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Merci pour votre message. Nous vous répondrons dans les meilleurs délais.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="btn-primary"
                  >
                    Envoyer un autre message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="card p-6 md:p-8">
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="label-field">Nom complet *</label>
                      <input name="nom" type="text" className="input-field" placeholder="Votre nom et prénoms" required />
                    </div>
                    <div>
                      <label className="label-field">Téléphone</label>
                      <input name="telephone" type="tel" className="input-field" placeholder="+225 XX XX XX XX XX" />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="label-field">Adresse email *</label>
                    <input name="email" type="email" className="input-field" placeholder="votre.email@exemple.com" required />
                  </div>
                  <div className="mb-4">
                    <label className="label-field">Objet *</label>
                    <select name="sujet" className="input-field" required>
                      <option value="">Sélectionnez un objet</option>
                      <option>Renseignement général</option>
                      <option>État civil</option>
                      <option>Urbanisme</option>
                      <option>Réclamation</option>
                      <option>Suggestion</option>
                      <option>Autre</option>
                    </select>
                  </div>
                  <div className="mb-6">
                    <label className="label-field">Message *</label>
                    <textarea
                      name="message"
                      className="input-field min-h-[150px]"
                      placeholder="Décrivez votre demande en détail..."
                      required
                    />
                  </div>

                  <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-4 mb-6">
                    <AlertCircle size={18} className="text-gray-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-gray-500">
                      Les informations recueillies sont destinées à la Mairie de Gohitafla pour le traitement 
                      de votre demande. Conformément à la réglementation, vous disposez d'un droit d'accès, 
                      de rectification et de suppression de vos données.
                    </p>
                  </div>

                  <button type="submit" disabled={sending} className="btn-accent w-full justify-center text-base disabled:opacity-50">
                    <Send size={18} className="mr-2" />
                    {sending ? 'Envoi en cours...' : 'Envoyer le message'}
                  </button>
                </form>
              )}
            </div>

            {/* Side info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Horaires */}
              <div className="card p-6">
                <h3 className="font-heading font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                  <Clock size={20} className="text-accent-500" />
                  Horaires d'ouverture
                </h3>
                <div className="space-y-2">
                  {horaires.map((h) => (
                    <div key={h.jour} className="flex justify-between py-2 border-b border-gray-50 last:border-0">
                      <span className="font-medium text-gray-700 text-sm">{h.jour}</span>
                      <span className={`text-sm ${h.heures === 'Fermé' ? 'text-red-500 font-semibold' : 'text-gray-600'}`}>
                        {h.heures}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Services contacts */}
              <div className="card p-6">
                <h3 className="font-heading font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                  <Phone size={20} className="text-primary-500" />
                  Contacts des services
                </h3>
                <div className="space-y-4">
                  {servicesContact.map((service) => (
                    <div key={service.nom} className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <service.icon size={18} className="text-primary-500" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-gray-900">{service.nom}</p>
                        <p className="text-xs text-gray-500">{service.tel}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Map placeholder */}
              <div className="card overflow-hidden">
                <div className="bg-gradient-to-br from-primary-100 to-primary-200 h-64 flex items-center justify-center">
                  <div className="text-center">
                    <Globe size={48} className="text-primary-400 mx-auto mb-3" />
                    <p className="text-primary-600 font-semibold">Localisation</p>
                    <p className="text-primary-400 text-sm mt-1">Gohitafla, Côte d'Ivoire</p>
                    <p className="text-primary-400 text-xs mt-1">Région de la Marahoué</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
