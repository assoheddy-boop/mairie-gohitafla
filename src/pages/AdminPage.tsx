import { useState, useEffect, useRef, useCallback } from 'react'
import {
  Lock, BarChart3, FileText, Mail, Bell, Users, MessageSquare,
  Eye, CheckCircle, XCircle, Clock, RefreshCw,
  Inbox, Loader2, LogOut, Plus, Pencil, Trash2, Save,
  Newspaper, Calendar, AlertTriangle, X, Image, Upload, ImagePlus
} from 'lucide-react'

import { API, API_BASE } from '../utils/api'
const BASE_URL = API_BASE

function ImageUploader({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [mode, setMode] = useState<'upload' | 'url'>(value && value.startsWith('http') ? 'url' : 'upload')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const uploadFile = useCallback(async (file: File) => {
    if (!file.type.match(/image\/(jpeg|jpg|png|gif|webp)/)) {
      alert('Format non supporté. Utilisez JPG, PNG, GIF ou WebP.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Image trop lourde (max 5 Mo)')
      return
    }
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('image', file)
      const res = await fetch(`${API}/upload`, { method: 'POST', body: formData })
      const data = await res.json()
      if (data.success) {
        onChange(data.url)
      } else {
        alert(data.error || 'Erreur lors de l\'upload')
      }
    } catch {
      alert('Erreur de connexion au serveur')
    }
    setUploading(false)
  }, [onChange])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) uploadFile(file)
  }, [uploadFile])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) uploadFile(file)
  }

  const imagePreviewUrl = value
    ? value.startsWith('http') ? value : `${BASE_URL}${value}`
    : ''

  return (
    <div>
      <label className="label-field">Image</label>
      <div className="flex gap-2 mb-2">
        <button type="button" onClick={() => setMode('upload')} className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${mode === 'upload' ? 'bg-accent-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
          <Upload size={12} className="inline mr-1" /> Uploader
        </button>
        <button type="button" onClick={() => setMode('url')} className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${mode === 'url' ? 'bg-accent-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
          <Image size={12} className="inline mr-1" /> URL externe
        </button>
      </div>

      {mode === 'upload' ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
            dragOver ? 'border-accent-500 bg-accent-50' : 'border-gray-300 hover:border-accent-400 hover:bg-gray-50'
          }`}
        >
          <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/gif,image/webp" onChange={handleFileSelect} className="hidden" />
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 size={32} className="animate-spin text-accent-500" />
              <p className="text-sm text-gray-500">Upload en cours...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <ImagePlus size={32} className="text-gray-400" />
              <p className="text-sm text-gray-600 font-medium">Glissez une image ici ou cliquez pour sélectionner</p>
              <p className="text-xs text-gray-400">JPG, PNG, GIF, WebP — Max 5 Mo</p>
            </div>
          )}
        </div>
      ) : (
        <input
          className="input-field"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="https://images.unsplash.com/..."
        />
      )}

      {imagePreviewUrl && (
        <div className="mt-3 relative inline-block">
          <img src={imagePreviewUrl} alt="Aperçu" className="h-28 rounded-lg object-cover" onError={e => (e.currentTarget.style.display = 'none')} />
          <button type="button" onClick={() => onChange('')} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 shadow">
            <X size={12} />
          </button>
        </div>
      )}
    </div>
  )
}

interface Stats {
  totalDemandes: number
  demandesEnCours: number
  demandesPretes: number
  totalContacts: number
  contactsNonLus: number
  totalNewsletter: number
  totalConversations: number
}

interface Demande {
  id: number
  reference: string
  document_type: string
  nom_demandeur: string
  prenoms_demandeur: string
  telephone: string
  email: string
  statut: string
  created_at: string
}

interface Contact {
  id: number
  nom: string
  email: string
  telephone: string
  sujet: string
  message: string
  lu: number
  created_at: string
}

interface Actualite {
  id?: number
  title: string
  excerpt: string
  content: string
  category: string
  category_color: string
  image: string
  date: string
  published: number
}

interface Evenement {
  id?: number
  title: string
  description: string
  date: string
  time: string
  lieu: string
  category: string
  image: string
  featured: number
  published: number
}

interface Alerte {
  id?: number
  type: string
  message: string
  active: number
}

const statutLabels: Record<string, { label: string; color: string }> = {
  traitement: { label: 'En traitement', color: 'bg-blue-100 text-blue-700' },
  en_cours: { label: 'Bientôt prêt', color: 'bg-amber-100 text-amber-700' },
  pret: { label: 'Prêt', color: 'bg-green-100 text-green-700' },
  rejete: { label: 'Rejeté', color: 'bg-red-100 text-red-700' },
}

const categoryColors = [
  { value: 'bg-blue-100 text-blue-700', label: 'Bleu' },
  { value: 'bg-green-100 text-green-700', label: 'Vert' },
  { value: 'bg-amber-100 text-amber-700', label: 'Orange' },
  { value: 'bg-red-100 text-red-700', label: 'Rouge' },
  { value: 'bg-purple-100 text-purple-700', label: 'Violet' },
  { value: 'bg-cyan-100 text-cyan-700', label: 'Cyan' },
  { value: 'bg-pink-100 text-pink-700', label: 'Rose' },
]

type TabId = 'dashboard' | 'actualites' | 'evenements' | 'alertes' | 'demandes' | 'contacts' | 'newsletter'

const emptyActualite: Actualite = { title: '', excerpt: '', content: '', category: '', category_color: 'bg-blue-100 text-blue-700', image: '', date: new Date().toISOString().split('T')[0], published: 1 }
const emptyEvenement: Evenement = { title: '', description: '', date: '', time: '', lieu: '', category: '', image: '', featured: 0, published: 1 }
const emptyAlerte: Alerte = { type: 'info', message: '', active: 1 }

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [activeTab, setActiveTab] = useState<TabId>('dashboard')
  const [stats, setStats] = useState<Stats | null>(null)
  const [demandes, setDemandes] = useState<Demande[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [newsletter, setNewsletter] = useState<any[]>([])
  const [actualites, setActualites] = useState<Actualite[]>([])
  const [evenements, setEvenements] = useState<Evenement[]>([])
  const [alertes, setAlertes] = useState<Alerte[]>([])
  const [loading, setLoading] = useState(false)

  // Form states
  const [editingActualite, setEditingActualite] = useState<Actualite | null>(null)
  const [editingEvenement, setEditingEvenement] = useState<Evenement | null>(null)
  const [editingAlerte, setEditingAlerte] = useState<Alerte | null>(null)
  const [showActuForm, setShowActuForm] = useState(false)
  const [showEventForm, setShowEventForm] = useState(false)
  const [showAlertForm, setShowAlertForm] = useState(false)
  const [saving, setSaving] = useState(false)

  const login = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch(`${API}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (res.ok) {
        setAuthenticated(true)
        setLoginError('')
      } else {
        setLoginError('Mot de passe incorrect')
      }
    } catch {
      setLoginError('Erreur de connexion au serveur')
    }
  }

  const safeFetch = async (url: string) => {
    try {
      const res = await fetch(url)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return await res.json()
    } catch (e) {
      console.error(`Erreur chargement ${url}:`, e)
      return null
    }
  }

  const loadData = async () => {
    setLoading(true)
    const [statsData, demandesData, contactsData, newsletterData, actusData, eventsData, alertesData] = await Promise.all([
      safeFetch(`${API}/admin/stats`),
      safeFetch(`${API}/demandes`),
      safeFetch(`${API}/contacts`),
      safeFetch(`${API}/newsletter`),
      safeFetch(`${API}/actualites?all=1`),
      safeFetch(`${API}/evenements?all=1`),
      safeFetch(`${API}/alertes`),
    ])
    if (statsData) setStats(statsData)
    if (demandesData) setDemandes(demandesData)
    if (contactsData) setContacts(contactsData)
    if (newsletterData) setNewsletter(newsletterData)
    if (actusData) setActualites(actusData)
    if (eventsData) setEvenements(eventsData)
    if (alertesData) setAlertes(alertesData)
    setLoading(false)
  }

  useEffect(() => {
    if (authenticated) loadData()
  }, [authenticated])

  const updateStatut = async (reference: string, statut: string) => {
    await fetch(`${API}/demandes/${reference}/statut`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ statut }),
    })
    loadData()
  }

  const markAsRead = async (id: number) => {
    await fetch(`${API}/contacts/${id}/lu`, { method: 'PUT' })
    loadData()
  }

  // ── Actualités CRUD ──
  const saveActualite = async (data: Actualite) => {
    setSaving(true)
    try {
      if (data.id) {
        await fetch(`${API}/actualites/${data.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      } else {
        await fetch(`${API}/actualites`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      }
      setShowActuForm(false)
      setEditingActualite(null)
      loadData()
    } catch { console.error('Erreur de sauvegarde') }
    setSaving(false)
  }

  const deleteActualite = async (id: number) => {
    if (!confirm('Supprimer cette actualité ?')) return
    await fetch(`${API}/actualites/${id}`, { method: 'DELETE' })
    loadData()
  }

  // ── Événements CRUD ──
  const saveEvenement = async (data: Evenement) => {
    setSaving(true)
    try {
      if (data.id) {
        await fetch(`${API}/evenements/${data.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      } else {
        await fetch(`${API}/evenements`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      }
      setShowEventForm(false)
      setEditingEvenement(null)
      loadData()
    } catch { console.error('Erreur de sauvegarde') }
    setSaving(false)
  }

  const deleteEvenement = async (id: number) => {
    if (!confirm('Supprimer cet événement ?')) return
    await fetch(`${API}/evenements/${id}`, { method: 'DELETE' })
    loadData()
  }

  // ── Alertes CRUD ──
  const saveAlerte = async (data: Alerte) => {
    setSaving(true)
    try {
      if (data.id) {
        await fetch(`${API}/alertes/${data.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      } else {
        await fetch(`${API}/alertes`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      }
      setShowAlertForm(false)
      setEditingAlerte(null)
      loadData()
    } catch { console.error('Erreur de sauvegarde') }
    setSaving(false)
  }

  const deleteAlerte = async (id: number) => {
    if (!confirm('Supprimer cette alerte ?')) return
    await fetch(`${API}/alertes/${id}`, { method: 'DELETE' })
    loadData()
  }

  // ── Login Screen ──
  if (!authenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-20">
        <div className="max-w-md w-full mx-auto px-4">
          <div className="card p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock size={28} className="text-white" />
              </div>
              <h1 className="font-heading font-bold text-2xl text-gray-900">Administration</h1>
              <p className="text-gray-500 text-sm mt-1">Mairie de Gohitafla — Espace réservé</p>
            </div>
            <form onSubmit={login}>
              <label className="label-field">Mot de passe administrateur</label>
              <input type="password" className="input-field mb-4" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Entrez le mot de passe" required />
              {loginError && <p className="text-red-500 text-sm mb-3">{loginError}</p>}
              <button type="submit" className="btn-primary w-full"><Lock size={16} className="mr-2" />Connexion</button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'dashboard' as const, label: 'Tableau de bord', icon: BarChart3 },
    { id: 'actualites' as const, label: 'Actualités', icon: Newspaper },
    { id: 'evenements' as const, label: 'Événements', icon: Calendar },
    { id: 'alertes' as const, label: 'Alertes', icon: AlertTriangle },
    { id: 'demandes' as const, label: 'Demandes', icon: FileText },
    { id: 'contacts' as const, label: 'Messages', icon: Mail },
    { id: 'newsletter' as const, label: 'Newsletter', icon: Users },
  ]

  return (
    <div>
      {/* Header admin */}
      <div className="bg-primary-500 text-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"><Lock size={18} /></div>
            <div>
              <div className="font-heading font-bold">Administration</div>
              <div className="text-xs text-primary-200">Mairie de Gohitafla</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={loadData} className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="Rafraîchir">
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            </button>
            <button onClick={() => setAuthenticated(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="Déconnexion">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id ? 'border-accent-500 text-accent-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
                {tab.id === 'contacts' && stats && stats.contactsNonLus > 0 && (
                  <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{stats.contactsNonLus}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ══════════════════════ DASHBOARD ══════════════════════ */}
        {activeTab === 'dashboard' && stats && (
          <div className="space-y-6">
            <h2 className="font-heading font-bold text-2xl text-gray-900">Tableau de bord</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Demandes totales', value: stats.totalDemandes, icon: FileText, color: 'bg-blue-500' },
                { label: 'En cours', value: stats.demandesEnCours, icon: Clock, color: 'bg-amber-500' },
                { label: 'Prêtes', value: stats.demandesPretes, icon: CheckCircle, color: 'bg-green-500' },
                { label: 'Messages reçus', value: stats.totalContacts, icon: Mail, color: 'bg-purple-500' },
                { label: 'Non lus', value: stats.contactsNonLus, icon: Inbox, color: 'bg-red-500' },
                { label: 'Abonnés newsletter', value: stats.totalNewsletter, icon: Users, color: 'bg-cyan-500' },
                { label: 'Conversations chat', value: stats.totalConversations, icon: MessageSquare, color: 'bg-indigo-500' },
                { label: 'Actualités publiées', value: actualites.filter(a => a.published).length, icon: Newspaper, color: 'bg-teal-500' },
                { label: 'Événements', value: evenements.length, icon: Calendar, color: 'bg-orange-500' },
                { label: 'Alertes actives', value: alertes.filter(a => a.active).length, icon: AlertTriangle, color: 'bg-rose-500' },
              ].map((stat) => (
                <div key={stat.label} className="card p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}>
                      <stat.icon size={18} className="text-white" />
                    </div>
                  </div>
                  <div className="text-2xl font-heading font-bold text-gray-900">{stat.value}</div>
                  <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══════════════════════ ACTUALITÉS ══════════════════════ */}
        {activeTab === 'actualites' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading font-bold text-2xl text-gray-900">
                Actualités ({actualites.length})
              </h2>
              <button
                onClick={() => { setEditingActualite({ ...emptyActualite }); setShowActuForm(true) }}
                className="btn-primary"
              >
                <Plus size={16} className="mr-2" /> Nouvelle actualité
              </button>
            </div>

            {/* Form */}
            {showActuForm && editingActualite && (
              <div className="card p-6 mb-6 border-2 border-accent-200 bg-accent-50/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading font-bold text-lg text-gray-900">
                    {editingActualite.id ? 'Modifier l\'actualité' : 'Nouvelle actualité'}
                  </h3>
                  <button onClick={() => { setShowActuForm(false); setEditingActualite(null) }} className="p-1 hover:bg-gray-200 rounded">
                    <X size={18} />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="label-field">Titre *</label>
                    <input className="input-field" value={editingActualite.title} onChange={e => setEditingActualite({ ...editingActualite, title: e.target.value })} placeholder="Titre de l'actualité" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="label-field">Résumé / extrait *</label>
                    <textarea className="input-field" rows={2} value={editingActualite.excerpt} onChange={e => setEditingActualite({ ...editingActualite, excerpt: e.target.value })} placeholder="Court résumé affiché sur la page d'accueil" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="label-field">Contenu complet</label>
                    <textarea className="input-field" rows={4} value={editingActualite.content} onChange={e => setEditingActualite({ ...editingActualite, content: e.target.value })} placeholder="Contenu détaillé de l'actualité (optionnel)" />
                  </div>
                  <div>
                    <label className="label-field">Catégorie *</label>
                    <input className="input-field" value={editingActualite.category} onChange={e => setEditingActualite({ ...editingActualite, category: e.target.value })} placeholder="Ex: Développement, Éducation, Culture" />
                  </div>
                  <div>
                    <label className="label-field">Couleur de catégorie</label>
                    <select className="input-field" value={editingActualite.category_color} onChange={e => setEditingActualite({ ...editingActualite, category_color: e.target.value })}>
                      {categoryColors.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label-field">Date *</label>
                    <input type="date" className="input-field" value={editingActualite.date} onChange={e => setEditingActualite({ ...editingActualite, date: e.target.value })} />
                  </div>
                  <div className="md:col-span-2">
                    <ImageUploader value={editingActualite.image} onChange={url => setEditingActualite({ ...editingActualite, image: url })} />
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="actu-published" checked={!!editingActualite.published} onChange={e => setEditingActualite({ ...editingActualite, published: e.target.checked ? 1 : 0 })} className="w-4 h-4 text-accent-500" />
                    <label htmlFor="actu-published" className="text-sm font-medium text-gray-700">Publié (visible sur le site)</label>
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button onClick={() => { setShowActuForm(false); setEditingActualite(null) }} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg">Annuler</button>
                  <button onClick={() => saveActualite(editingActualite)} disabled={saving || !editingActualite.title || !editingActualite.excerpt || !editingActualite.category || !editingActualite.date} className="btn-primary disabled:opacity-50">
                    {saving ? <Loader2 size={16} className="mr-2 animate-spin" /> : <Save size={16} className="mr-2" />}
                    {editingActualite.id ? 'Enregistrer' : 'Créer'}
                  </button>
                </div>
              </div>
            )}

            {/* List */}
            {actualites.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <Newspaper size={48} className="mx-auto mb-4 opacity-30" />
                <p>Aucune actualité. Cliquez sur "Nouvelle actualité" pour commencer.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {actualites.map(a => (
                  <div key={a.id} className={`card p-5 ${!a.published ? 'opacity-60 border-l-4 border-l-gray-300' : ''}`}>
                    <div className="flex items-start gap-4">
                      {a.image && (
                        <img src={a.image.startsWith('http') ? a.image : `${BASE_URL}${a.image}`} alt={a.title} className="w-20 h-16 rounded-lg object-cover flex-shrink-0" onError={e => (e.currentTarget.style.display = 'none')} />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${a.category_color}`}>{a.category}</span>
                          {!a.published && <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-200 text-gray-600">Brouillon</span>}
                          <span className="text-xs text-gray-400">{new Date(a.date).toLocaleDateString('fr-FR')}</span>
                        </div>
                        <h3 className="font-semibold text-gray-900 mt-1 truncate">{a.title}</h3>
                        <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">{a.excerpt}</p>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button onClick={() => { setEditingActualite({ ...a }); setShowActuForm(true) }} className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg" title="Modifier">
                          <Pencil size={16} />
                        </button>
                        <button onClick={() => a.id && deleteActualite(a.id)} className="p-2 hover:bg-red-50 text-red-500 rounded-lg" title="Supprimer">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════ ÉVÉNEMENTS ══════════════════════ */}
        {activeTab === 'evenements' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading font-bold text-2xl text-gray-900">
                Événements ({evenements.length})
              </h2>
              <button
                onClick={() => { setEditingEvenement({ ...emptyEvenement }); setShowEventForm(true) }}
                className="btn-primary"
              >
                <Plus size={16} className="mr-2" /> Nouvel événement
              </button>
            </div>

            {showEventForm && editingEvenement && (
              <div className="card p-6 mb-6 border-2 border-accent-200 bg-accent-50/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading font-bold text-lg text-gray-900">
                    {editingEvenement.id ? 'Modifier l\'événement' : 'Nouvel événement'}
                  </h3>
                  <button onClick={() => { setShowEventForm(false); setEditingEvenement(null) }} className="p-1 hover:bg-gray-200 rounded">
                    <X size={18} />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="label-field">Titre *</label>
                    <input className="input-field" value={editingEvenement.title} onChange={e => setEditingEvenement({ ...editingEvenement, title: e.target.value })} placeholder="Titre de l'événement" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="label-field">Description *</label>
                    <textarea className="input-field" rows={3} value={editingEvenement.description} onChange={e => setEditingEvenement({ ...editingEvenement, description: e.target.value })} placeholder="Description de l'événement" />
                  </div>
                  <div>
                    <label className="label-field">Date *</label>
                    <input type="date" className="input-field" value={editingEvenement.date} onChange={e => setEditingEvenement({ ...editingEvenement, date: e.target.value })} />
                  </div>
                  <div>
                    <label className="label-field">Heure *</label>
                    <input type="time" className="input-field" value={editingEvenement.time} onChange={e => setEditingEvenement({ ...editingEvenement, time: e.target.value })} />
                  </div>
                  <div>
                    <label className="label-field">Lieu *</label>
                    <input className="input-field" value={editingEvenement.lieu} onChange={e => setEditingEvenement({ ...editingEvenement, lieu: e.target.value })} placeholder="Ex: Mairie de Gohitafla" />
                  </div>
                  <div>
                    <label className="label-field">Catégorie *</label>
                    <select className="input-field" value={editingEvenement.category} onChange={e => setEditingEvenement({ ...editingEvenement, category: e.target.value })}>
                      <option value="">-- Choisir --</option>
                      <option value="Officiel">Officiel</option>
                      <option value="Culture">Culture</option>
                      <option value="Jeunesse">Jeunesse</option>
                      <option value="Santé">Santé</option>
                      <option value="Éducation">Éducation</option>
                      <option value="Sport">Sport</option>
                      <option value="Environnement">Environnement</option>
                      <option value="Social">Social</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <ImageUploader value={editingEvenement.image} onChange={url => setEditingEvenement({ ...editingEvenement, image: url })} />
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="evt-featured" checked={!!editingEvenement.featured} onChange={e => setEditingEvenement({ ...editingEvenement, featured: e.target.checked ? 1 : 0 })} className="w-4 h-4" />
                      <label htmlFor="evt-featured" className="text-sm font-medium text-gray-700">Mis en avant</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="evt-published" checked={!!editingEvenement.published} onChange={e => setEditingEvenement({ ...editingEvenement, published: e.target.checked ? 1 : 0 })} className="w-4 h-4" />
                      <label htmlFor="evt-published" className="text-sm font-medium text-gray-700">Publié</label>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button onClick={() => { setShowEventForm(false); setEditingEvenement(null) }} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg">Annuler</button>
                  <button
                    onClick={() => saveEvenement(editingEvenement)}
                    disabled={saving || !editingEvenement.title || !editingEvenement.description || !editingEvenement.date || !editingEvenement.time || !editingEvenement.lieu || !editingEvenement.category}
                    className="btn-primary disabled:opacity-50"
                  >
                    {saving ? <Loader2 size={16} className="mr-2 animate-spin" /> : <Save size={16} className="mr-2" />}
                    {editingEvenement.id ? 'Enregistrer' : 'Créer'}
                  </button>
                </div>
              </div>
            )}

            {evenements.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <Calendar size={48} className="mx-auto mb-4 opacity-30" />
                <p>Aucun événement. Cliquez sur "Nouvel événement" pour commencer.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {evenements.map(evt => (
                  <div key={evt.id} className={`card p-5 ${!evt.published ? 'opacity-60 border-l-4 border-l-gray-300' : ''}`}>
                    <div className="flex items-start gap-4">
                      {evt.image && (
                        <img src={evt.image.startsWith('http') ? evt.image : `${BASE_URL}${evt.image}`} alt={evt.title} className="w-20 h-16 rounded-lg object-cover flex-shrink-0" onError={e => (e.currentTarget.style.display = 'none')} />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-accent-100 text-accent-700">{evt.category}</span>
                          {!!evt.featured && <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">Mis en avant</span>}
                          {!evt.published && <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-200 text-gray-600">Brouillon</span>}
                        </div>
                        <h3 className="font-semibold text-gray-900 mt-1 truncate">{evt.title}</h3>
                        <p className="text-sm text-gray-500 mt-0.5">{new Date(evt.date).toLocaleDateString('fr-FR')} à {evt.time} — {evt.lieu}</p>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button onClick={() => { setEditingEvenement({ ...evt }); setShowEventForm(true) }} className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg" title="Modifier">
                          <Pencil size={16} />
                        </button>
                        <button onClick={() => evt.id && deleteEvenement(evt.id)} className="p-2 hover:bg-red-50 text-red-500 rounded-lg" title="Supprimer">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════ ALERTES ══════════════════════ */}
        {activeTab === 'alertes' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading font-bold text-2xl text-gray-900">
                Alertes & Annonces ({alertes.length})
              </h2>
              <button
                onClick={() => { setEditingAlerte({ ...emptyAlerte }); setShowAlertForm(true) }}
                className="btn-primary"
              >
                <Plus size={16} className="mr-2" /> Nouvelle alerte
              </button>
            </div>

            {showAlertForm && editingAlerte && (
              <div className="card p-6 mb-6 border-2 border-accent-200 bg-accent-50/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading font-bold text-lg text-gray-900">
                    {editingAlerte.id ? 'Modifier l\'alerte' : 'Nouvelle alerte'}
                  </h3>
                  <button onClick={() => { setShowAlertForm(false); setEditingAlerte(null) }} className="p-1 hover:bg-gray-200 rounded">
                    <X size={18} />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label-field">Type d'alerte *</label>
                    <select className="input-field" value={editingAlerte.type} onChange={e => setEditingAlerte({ ...editingAlerte, type: e.target.value })}>
                      <option value="info">Information</option>
                      <option value="urgent">Urgent</option>
                      <option value="event">Événement</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2 pt-6">
                    <input type="checkbox" id="alert-active" checked={!!editingAlerte.active} onChange={e => setEditingAlerte({ ...editingAlerte, active: e.target.checked ? 1 : 0 })} className="w-4 h-4" />
                    <label htmlFor="alert-active" className="text-sm font-medium text-gray-700">Active (visible sur le site)</label>
                  </div>
                  <div className="md:col-span-2">
                    <label className="label-field">Message *</label>
                    <textarea className="input-field" rows={2} value={editingAlerte.message} onChange={e => setEditingAlerte({ ...editingAlerte, message: e.target.value })} placeholder="Message de l'alerte affiché en haut du site" />
                  </div>
                </div>
                <div className="mt-3 p-3 rounded-lg text-sm" style={{
                  backgroundColor: editingAlerte.type === 'urgent' ? '#fef2f2' : editingAlerte.type === 'event' ? '#eff6ff' : '#f0fdf4',
                  color: editingAlerte.type === 'urgent' ? '#991b1b' : editingAlerte.type === 'event' ? '#1e40af' : '#166534',
                }}>
                  <strong>Aperçu :</strong> {editingAlerte.message || '(vide)'}
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button onClick={() => { setShowAlertForm(false); setEditingAlerte(null) }} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg">Annuler</button>
                  <button onClick={() => saveAlerte(editingAlerte)} disabled={saving || !editingAlerte.message} className="btn-primary disabled:opacity-50">
                    {saving ? <Loader2 size={16} className="mr-2 animate-spin" /> : <Save size={16} className="mr-2" />}
                    {editingAlerte.id ? 'Enregistrer' : 'Créer'}
                  </button>
                </div>
              </div>
            )}

            {alertes.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <AlertTriangle size={48} className="mx-auto mb-4 opacity-30" />
                <p>Aucune alerte. Cliquez sur "Nouvelle alerte" pour en créer une.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {alertes.map(al => (
                  <div key={al.id} className={`card p-5 ${!al.active ? 'opacity-50' : ''}`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        al.type === 'urgent' ? 'bg-red-100 text-red-600' : al.type === 'event' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                      }`}>
                        {al.type === 'urgent' ? <AlertTriangle size={20} /> : al.type === 'event' ? <Calendar size={20} /> : <Bell size={20} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded ${
                            al.type === 'urgent' ? 'bg-red-100 text-red-700' : al.type === 'event' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                          }`}>{al.type}</span>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${al.active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                            {al.active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mt-1">{al.message}</p>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button onClick={() => { setEditingAlerte({ ...al }); setShowAlertForm(true) }} className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg" title="Modifier">
                          <Pencil size={16} />
                        </button>
                        <button onClick={() => al.id && deleteAlerte(al.id)} className="p-2 hover:bg-red-50 text-red-500 rounded-lg" title="Supprimer">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════ DEMANDES ══════════════════════ */}
        {activeTab === 'demandes' && (
          <div>
            <h2 className="font-heading font-bold text-2xl text-gray-900 mb-6">Demandes de documents ({demandes.length})</h2>
            {demandes.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <FileText size={48} className="mx-auto mb-4 opacity-30" />
                <p>Aucune demande pour le moment</p>
              </div>
            ) : (
              <div className="space-y-3">
                {demandes.map((d) => (
                  <div key={d.id} className="card p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-sm font-bold text-accent-600">{d.reference}</span>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statutLabels[d.statut]?.color || 'bg-gray-100 text-gray-600'}`}>
                            {statutLabels[d.statut]?.label || d.statut}
                          </span>
                        </div>
                        <p className="font-semibold text-gray-900 mt-1">{d.document_type}</p>
                        <p className="text-sm text-gray-500">{d.nom_demandeur} {d.prenoms_demandeur} — {d.telephone}</p>
                        <p className="text-xs text-gray-400 mt-1">{new Date(d.created_at).toLocaleString('fr-FR')}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <select value={d.statut} onChange={(e) => updateStatut(d.reference, e.target.value)} className="input-field py-2 px-3 text-sm w-auto">
                          <option value="traitement">En traitement</option>
                          <option value="en_cours">Bientôt prêt</option>
                          <option value="pret">Prêt</option>
                          <option value="rejete">Rejeté</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════ CONTACTS ══════════════════════ */}
        {activeTab === 'contacts' && (
          <div>
            <h2 className="font-heading font-bold text-2xl text-gray-900 mb-6">Messages de contact ({contacts.length})</h2>
            {contacts.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <Mail size={48} className="mx-auto mb-4 opacity-30" />
                <p>Aucun message pour le moment</p>
              </div>
            ) : (
              <div className="space-y-3">
                {contacts.map((c) => (
                  <div key={c.id} className={`card p-5 ${!c.lu ? 'border-l-4 border-l-accent-500' : ''}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-gray-900">{c.nom}</p>
                          {!c.lu && <span className="bg-accent-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">Nouveau</span>}
                        </div>
                        <p className="text-sm text-accent-600 font-semibold mt-0.5">{c.sujet}</p>
                        <p className="text-sm text-gray-600 mt-2 whitespace-pre-wrap">{c.message}</p>
                        <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                          <span>{c.email}</span>
                          {c.telephone && <span>{c.telephone}</span>}
                          <span>{new Date(c.created_at).toLocaleString('fr-FR')}</span>
                        </div>
                      </div>
                      {!c.lu && (
                        <button onClick={() => markAsRead(c.id)} className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg text-gray-600 font-medium transition-colors flex-shrink-0">
                          <Eye size={12} className="inline mr-1" /> Marquer lu
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════ NEWSLETTER ══════════════════════ */}
        {activeTab === 'newsletter' && (
          <div>
            <h2 className="font-heading font-bold text-2xl text-gray-900 mb-6">Abonnés newsletter ({newsletter.length})</h2>
            {newsletter.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <Users size={48} className="mx-auto mb-4 opacity-30" />
                <p>Aucun abonné pour le moment</p>
              </div>
            ) : (
              <div className="card overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 text-left">
                      <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase">#</th>
                      <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase">Email</th>
                      <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase">Date d'inscription</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {newsletter.map((sub, i) => (
                      <tr key={sub.id} className="hover:bg-gray-50">
                        <td className="px-5 py-3 text-sm text-gray-400">{i + 1}</td>
                        <td className="px-5 py-3 text-sm font-medium text-gray-900">{sub.email}</td>
                        <td className="px-5 py-3 text-sm text-gray-500">{new Date(sub.created_at).toLocaleDateString('fr-FR')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}
