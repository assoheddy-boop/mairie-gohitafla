import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { io, Socket } from 'socket.io-client'
import {
  MessageCircle, X, Send, Bot, ArrowRight,
  FileText, Heart, BookOpen, Building2, Shield, Users,
  Phone, Clock, MapPin, HelpCircle, Sparkles, RotateCcw,
  Headphones, UserCheck, Loader2, ArrowLeft
} from 'lucide-react'

import { API_BASE } from '../utils/api'

const SERVER_URL = API_BASE

interface Message {
  id: string
  type: 'bot' | 'user' | 'agent' | 'system'
  text: string
  options?: QuickOption[]
  timestamp: Date
}

interface QuickOption {
  label: string
  action: string
  icon?: typeof FileText
}

type ChatMode = 'bot' | 'connecting' | 'agent'

const WELCOME_OPTIONS: QuickOption[] = [
  { label: 'Demander un document', action: 'documents', icon: FileText },
  { label: 'Connaître les horaires', action: 'horaires', icon: Clock },
  { label: 'Contacter la mairie', action: 'contact', icon: Phone },
  { label: 'Parler à un agent', action: 'agent', icon: Headphones },
  { label: 'Suivre une demande', action: 'suivi', icon: HelpCircle },
  { label: 'Voir les actualités', action: 'actualites', icon: Sparkles },
]

const DOCUMENT_OPTIONS: QuickOption[] = [
  { label: 'Acte de naissance', action: 'doc_naissance', icon: FileText },
  { label: 'Acte de mariage', action: 'doc_mariage', icon: Heart },
  { label: 'Acte de décès', action: 'doc_deces', icon: BookOpen },
  { label: 'Certificat de résidence', action: 'doc_residence', icon: Building2 },
  { label: 'Légalisation', action: 'doc_legalisation', icon: Shield },
  { label: 'Certificat de célibat', action: 'doc_celibat', icon: Users },
  { label: '← Retour au menu', action: 'menu', icon: RotateCcw },
]

interface KnowledgeEntry {
  keywords: string[]
  response: string
  options?: QuickOption[]
}

const knowledgeBase: KnowledgeEntry[] = [
  {
    keywords: ['bonjour', 'salut', 'bonsoir', 'hello', 'coucou', 'hey'],
    response: 'Bonjour et bienvenue ! 😊 Je suis l\'assistant virtuel de la Mairie de Gohitafla. Comment puis-je vous aider aujourd\'hui ?',
    options: WELCOME_OPTIONS,
  },
  {
    keywords: ['merci', 'remercie', 'thanks'],
    response: 'Je vous en prie ! C\'est un plaisir de vous aider. N\'hésitez pas si vous avez d\'autres questions. 😊',
    options: [{ label: 'Autre question', action: 'menu', icon: HelpCircle }],
  },
  {
    keywords: ['au revoir', 'bye', 'bbye', 'a bientot', 'à bientôt'],
    response: 'Au revoir et à bientôt ! N\'hésitez pas à revenir si vous avez besoin d\'aide. La Mairie de Gohitafla est à votre service. 👋',
  },
  {
    keywords: ['agent', 'humain', 'personne', 'quelqu\'un', 'conseiller', 'parler', 'assistance', 'aide humaine', 'vrai personne'],
    response: '👨‍💼 Vous souhaitez parler à un agent de la Mairie ? Je vais vous mettre en relation.',
    options: [
      { label: 'Oui, parler à un agent', action: 'agent', icon: Headphones },
      { label: 'Non, continuer avec le bot', action: 'menu', icon: Bot },
    ],
  },
  {
    keywords: ['document', 'papier', 'demande', 'obtenir', 'commander'],
    response: 'Vous souhaitez demander un document ? Voici les documents disponibles en ligne. Lequel vous intéresse ?',
    options: DOCUMENT_OPTIONS,
  },
  {
    keywords: ['naissance', 'né', 'extrait', 'copie integrale', 'copie intégrale'],
    response: '📄 **Acte de naissance**\n\nVous pouvez demander :\n• Copie intégrale\n• Extrait avec filiation\n• Extrait sans filiation\n\n**Pièces requises :** Pièce d\'identité, informations sur la personne concernée\n\n**Délai :** 48 à 72 heures\n**Coût :** 200 à 500 FCFA',
    options: [
      { label: 'Faire la demande', action: 'go_naissance', icon: ArrowRight },
      { label: 'Parler à un agent', action: 'agent', icon: Headphones },
      { label: 'Autre document', action: 'documents', icon: FileText },
    ],
  },
  {
    keywords: ['mariage', 'marié', 'épouser', 'union', 'noce'],
    response: '💍 **Acte de mariage**\n\nCopie intégrale ou extrait d\'acte de mariage.\n\n**Pièces :** Pièce d\'identité, date et lieu du mariage, noms des époux\n**Délai :** 48 à 72h — **Coût :** 500 FCFA',
    options: [
      { label: 'Faire la demande', action: 'go_mariage', icon: ArrowRight },
      { label: 'Parler à un agent', action: 'agent', icon: Headphones },
      { label: 'Autre document', action: 'documents', icon: FileText },
    ],
  },
  {
    keywords: ['décès', 'deces', 'mort', 'défunt', 'defunt'],
    response: '📋 **Acte de décès**\n\n**Pièces :** Pièce d\'identité, lien de parenté, infos du défunt\n**Délai :** 48 à 72h — **Coût :** 500 FCFA',
    options: [
      { label: 'Faire la demande', action: 'go_deces', icon: ArrowRight },
      { label: 'Parler à un agent', action: 'agent', icon: Headphones },
      { label: 'Autre document', action: 'documents', icon: FileText },
    ],
  },
  {
    keywords: ['résidence', 'residence', 'domicile', 'habite', 'habiter', 'adresse'],
    response: '🏠 **Certificat de résidence**\n\n**Pièces :** Pièce d\'identité, justificatif de domicile, 2 photos, attestation du chef de quartier\n**Délai :** 24 à 48h — **Coût :** 500 FCFA',
    options: [
      { label: 'Faire la demande', action: 'go_residence', icon: ArrowRight },
      { label: 'Parler à un agent', action: 'agent', icon: Headphones },
      { label: 'Autre document', action: 'documents', icon: FileText },
    ],
  },
  {
    keywords: ['légalisation', 'legalisation', 'légaliser', 'legaliser', 'certifier', 'conforme'],
    response: '✅ **Légalisation de documents**\n\n**Pièces :** Document original + copies + pièce d\'identité\n**Délai :** 24h — **Coût :** 100 FCFA/doc',
    options: [
      { label: 'Faire la demande', action: 'go_legalisation', icon: ArrowRight },
      { label: 'Parler à un agent', action: 'agent', icon: Headphones },
      { label: 'Autre document', action: 'documents', icon: FileText },
    ],
  },
  {
    keywords: ['célibat', 'celibat', 'célibataire', 'celibataire', 'non marié'],
    response: '📝 **Certificat de célibat**\n\n**Pièces :** Pièce d\'identité, extrait de naissance (-3 mois), certificat de résidence, 2 témoins\n**Délai :** 48 à 72h — **Coût :** 1 000 FCFA',
    options: [
      { label: 'Faire la demande', action: 'go_celibat', icon: ArrowRight },
      { label: 'Parler à un agent', action: 'agent', icon: Headphones },
      { label: 'Autre document', action: 'documents', icon: FileText },
    ],
  },
  {
    keywords: ['horaire', 'heure', 'ouvert', 'ouverture', 'fermé', 'fermeture', 'quand', 'ouvre'],
    response: '🕐 **Horaires d\'ouverture**\n\n• **Lundi à Vendredi :** 7h30 - 12h00 / 14h30 - 16h30\n• **Samedi & Dimanche :** Fermé',
    options: [
      { label: 'Contacter la mairie', action: 'contact', icon: Phone },
      { label: 'Parler à un agent', action: 'agent', icon: Headphones },
      { label: 'Retour au menu', action: 'menu', icon: RotateCcw },
    ],
  },
  {
    keywords: ['contact', 'téléphone', 'telephone', 'appeler', 'joindre', 'numéro', 'numero', 'email', 'mail'],
    response: '📞 **Contacts**\n\n• **Tél :** +225 XX XX XX XX XX\n• **Email :** contact@mairie-gohitafla.ci\n• **État civil :** etatcivil@mairie-gohitafla.ci',
    options: [
      { label: 'Parler à un agent', action: 'agent', icon: Headphones },
      { label: 'Formulaire de contact', action: 'go_contact', icon: Phone },
      { label: 'Retour au menu', action: 'menu', icon: RotateCcw },
    ],
  },
  {
    keywords: ['où', 'ou', 'localisation', 'situe', 'trouver', 'aller', 'venir', 'lieu'],
    response: '📍 **Adresse**\n\nMairie de Gohitafla, Centre-ville\nRégion de l\'Marahoué, Côte d\'Ivoire',
    options: [
      { label: 'Contacter', action: 'contact', icon: Phone },
      { label: 'Horaires', action: 'horaires', icon: Clock },
      { label: 'Retour au menu', action: 'menu', icon: RotateCcw },
    ],
  },
  {
    keywords: ['suivi', 'suivre', 'état', 'etat', 'avancement', 'prêt', 'pret', 'statut', 'référence', 'reference'],
    response: '🔍 **Suivi de demande**\n\nMunissez-vous de votre **numéro de référence** (GOH-XXXXXX-XXXX).\n\nSi besoin, contactez l\'état civil :\n• **Tél :** +225 XX XX XX XX XX\n• **Email :** etatcivil@mairie-gohitafla.ci',
    options: [
      { label: 'Parler à un agent', action: 'agent', icon: Headphones },
      { label: 'Nouvelle demande', action: 'documents', icon: FileText },
      { label: 'Retour au menu', action: 'menu', icon: RotateCcw },
    ],
  },
  {
    keywords: ['actualité', 'actualite', 'news', 'nouvelle', 'événement', 'evenement', 'info', 'projet'],
    response: '📰 **Actualités de Gohitafla**\n\n• Modernisation des services d\'état civil\n• Réhabilitation des routes communales\n• Festival culturel (3ème édition)\n• Programme de bourses scolaires',
    options: [
      { label: 'Voir les actualités', action: 'go_actualites', icon: Sparkles },
      { label: 'Retour au menu', action: 'menu', icon: RotateCcw },
    ],
  },
  {
    keywords: ['maire', 'mairie', 'conseil', 'municipal', 'élu', 'elu'],
    response: '🏛️ **La Mairie de Gohitafla**\n\nServices : État Civil, Technique, Social, Financier, Secrétariat Général',
    options: [
      { label: 'Découvrir la mairie', action: 'go_mairie', icon: Building2 },
      { label: 'Parler à un agent', action: 'agent', icon: Headphones },
      { label: 'Retour au menu', action: 'menu', icon: RotateCcw },
    ],
  },
  {
    keywords: ['démarche', 'demarche', 'procédure', 'procedure', 'comment', 'faire', 'pièce', 'piece', 'fournir', 'délai', 'delai', 'coût', 'cout', 'prix', 'tarif', 'combien'],
    response: '📋 **Démarches**\n\nConsultez notre page dédiée pour les pièces, délais et coûts de chaque document.',
    options: [
      { label: 'Voir les démarches', action: 'go_demarches', icon: FileText },
      { label: 'Parler à un agent', action: 'agent', icon: Headphones },
      { label: 'Retour au menu', action: 'menu', icon: RotateCcw },
    ],
  },
]

const actionRoutes: Record<string, string> = {
  go_naissance: '/demande-document/acte-naissance',
  go_mariage: '/demande-document/acte-mariage',
  go_deces: '/demande-document/acte-deces',
  go_residence: '/demande-document/certificat-residence',
  go_legalisation: '/demande-document/legalisation',
  go_celibat: '/demande-document/certificat-celibat',
  go_contact: '/contact',
  go_actualites: '/actualites',
  go_mairie: '/la-mairie',
  go_demarches: '/demarches',
  go_services: '/services',
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2)
}

function findResponse(input: string): { text: string; options?: QuickOption[] } {
  const normalized = input.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  for (const entry of knowledgeBase) {
    for (const keyword of entry.keywords) {
      const nk = keyword.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      if (normalized.includes(nk)) return { text: entry.response, options: entry.options }
    }
  }
  return { text: 'Je ne suis pas sûr de comprendre. Reformulez ou choisissez une option ci-dessous. 🤔', options: WELCOME_OPTIONS }
}

function formatMessage(text: string) {
  return text.split('\n').map((line, i) => {
    const formatted = line
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/• /g, '<span class="text-accent-500 mr-1">•</span> ')
    return <span key={i} className="block" dangerouslySetInnerHTML={{ __html: formatted || '&nbsp;' }} />
  })
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [chatMode, setChatMode] = useState<ChatMode>('bot')
  const [agentName, setAgentName] = useState('')
  const [agentService, setAgentService] = useState('')
  const [showAgentForm, setShowAgentForm] = useState(false)
  const [agentFormData, setAgentFormData] = useState({ nom: '', telephone: '', sujet: '' })
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [waitingPosition, setWaitingPosition] = useState(0)

  const socketRef = useRef<Socket | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (messages.length === 0 && isOpen) {
      addBotMessage(
        'Bonjour ! 👋 Je suis **GohitaflaBot**, l\'assistant virtuel de la Mairie de Gohitafla.\n\nComment puis-je vous aider ?',
        WELCOME_OPTIONS
      )
    }
  }, [isOpen])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 300)
  }, [isOpen])

  useEffect(() => {
    return () => { socketRef.current?.disconnect() }
  }, [])

  const addMessage = useCallback((type: Message['type'], text: string, options?: QuickOption[]) => {
    setMessages(prev => [...prev, { id: generateId(), type, text, options, timestamp: new Date() }])
  }, [])

  const addBotMessage = useCallback((text: string, options?: QuickOption[]) => {
    setIsTyping(true)
    setTimeout(() => {
      setMessages(prev => [...prev, { id: generateId(), type: 'bot', text, options, timestamp: new Date() }])
      setIsTyping(false)
    }, 600 + Math.random() * 400)
  }, [])

  const connectToServer = useCallback(() => {
    if (socketRef.current?.connected) return

    const s = io(SERVER_URL)
    socketRef.current = s

    s.on('citizen:waiting', (data: { conversationId: string; position: number }) => {
      setConversationId(data.conversationId)
      setWaitingPosition(data.position)
    })

    s.on('chat:agent_connected', (data: { conversationId: string; agent: { nom: string; service: string } }) => {
      setAgentName(data.agent.nom)
      setAgentService(data.agent.service)
      setChatMode('agent')
      setIsTyping(false)
      setMessages(prev => [...prev, {
        id: generateId(), type: 'system',
        text: `✅ **${data.agent.nom}** du service **${data.agent.service}** a pris en charge votre conversation.`,
        timestamp: new Date(),
      }])
    })

    s.on('chat:message', (data: { sender_type: string; sender_name: string; content: string }) => {
      if (data.sender_type === 'agent') {
        setIsTyping(false)
        setMessages(prev => [...prev, {
          id: generateId(), type: 'agent', text: data.content, timestamp: new Date(),
        }])
      }
    })

    s.on('chat:typing', ({ sender }: { sender: string }) => {
      if (sender === 'agent') {
        setIsTyping(true)
        setTimeout(() => setIsTyping(false), 3000)
      }
    })

    s.on('chat:closed', () => {
      setChatMode('bot')
      setConversationId(null)
      setMessages(prev => [...prev, {
        id: generateId(), type: 'system',
        text: '📌 L\'agent a clôturé la conversation. Merci pour votre confiance !',
        timestamp: new Date(),
      }])
      setTimeout(() => {
        addBotMessage('Vous êtes de retour avec **GohitaflaBot**. Puis-je vous aider pour autre chose ?', WELCOME_OPTIONS)
      }, 1000)
    })
  }, [addBotMessage])

  const submitAgentForm = (e: React.FormEvent) => {
    e.preventDefault()
    if (!agentFormData.nom || !agentFormData.telephone || !agentFormData.sujet) return

    setShowAgentForm(false)
    setChatMode('connecting')

    addMessage('user', `Je souhaite parler à un agent.\nSujet : ${agentFormData.sujet}`)
    addMessage('system', '🔄 Connexion au service de la Mairie... Recherche d\'un agent disponible.')

    connectToServer()

    setTimeout(() => {
      if (socketRef.current?.connected) {
        socketRef.current.emit('citizen:request_agent', {
          nom: agentFormData.nom,
          telephone: agentFormData.telephone,
          sujet: agentFormData.sujet,
        })
        addMessage('system', '⏳ Vous êtes en file d\'attente. Un agent va vous prendre en charge sous peu...')
      } else {
        addMessage('system', '⚠️ Impossible de se connecter au serveur. Les agents ne sont peut-être pas disponibles actuellement.')
        setChatMode('bot')
        addBotMessage('Le service de messagerie directe est temporairement indisponible. Vous pouvez :\n• Appeler le **+225 XX XX XX XX XX**\n• Envoyer un email à **contact@mairie-gohitafla.ci**\n• Utiliser le formulaire de contact', [
          { label: 'Formulaire de contact', action: 'go_contact', icon: Phone },
          { label: 'Retour au menu', action: 'menu', icon: RotateCcw },
        ])
      }
    }, 1500)
  }

  const handleSend = () => {
    const text = input.trim()
    if (!text) return

    addMessage('user', text)
    setInput('')

    if (chatMode === 'agent' && conversationId && socketRef.current) {
      socketRef.current.emit('citizen:message', { conversationId, content: text })
      socketRef.current.emit('citizen:typing', { conversationId })
    } else {
      const response = findResponse(text)
      addBotMessage(response.text, response.options)
    }
  }

  const handleOption = (option: QuickOption) => {
    addMessage('user', option.label)

    if (option.action === 'agent') {
      setShowAgentForm(true)
      return
    }

    if (option.action === 'end_agent') {
      socketRef.current?.disconnect()
      socketRef.current = null
      setChatMode('bot')
      setConversationId(null)
      addMessage('system', '📌 Vous avez quitté la conversation avec l\'agent.')
      addBotMessage('Vous êtes de retour avec **GohitaflaBot**. Puis-je vous aider ?', WELCOME_OPTIONS)
      return
    }

    if (actionRoutes[option.action]) {
      addBotMessage('Je vous redirige... 🚀')
      setTimeout(() => { navigate(actionRoutes[option.action]); setIsOpen(false) }, 1000)
      return
    }

    switch (option.action) {
      case 'menu': addBotMessage('Comment puis-je vous aider ?', WELCOME_OPTIONS); break
      case 'documents': addBotMessage('Quel document souhaitez-vous demander ?', DOCUMENT_OPTIONS); break
      case 'doc_naissance': { const r = findResponse('naissance'); addBotMessage(r.text, r.options); break }
      case 'doc_mariage': { const r = findResponse('mariage'); addBotMessage(r.text, r.options); break }
      case 'doc_deces': { const r = findResponse('décès'); addBotMessage(r.text, r.options); break }
      case 'doc_residence': { const r = findResponse('résidence'); addBotMessage(r.text, r.options); break }
      case 'doc_legalisation': { const r = findResponse('légalisation'); addBotMessage(r.text, r.options); break }
      case 'doc_celibat': { const r = findResponse('célibat'); addBotMessage(r.text, r.options); break }
      case 'horaires': { const r = findResponse('horaire'); addBotMessage(r.text, r.options); break }
      case 'contact': { const r = findResponse('contact'); addBotMessage(r.text, r.options); break }
      case 'localisation': { const r = findResponse('localisation'); addBotMessage(r.text, r.options); break }
      case 'suivi': { const r = findResponse('suivi'); addBotMessage(r.text, r.options); break }
      case 'actualites': { const r = findResponse('actualité'); addBotMessage(r.text, r.options); break }
      default: addBotMessage('Comment puis-je vous aider ?', WELCOME_OPTIONS)
    }
  }

  const handleReset = () => {
    socketRef.current?.disconnect()
    socketRef.current = null
    setMessages([])
    setChatMode('bot')
    setShowAgentForm(false)
    setConversationId(null)
    setAgentFormData({ nom: '', telephone: '', sujet: '' })
    setTimeout(() => addBotMessage('Conversation réinitialisée ! 🔄\n\nComment puis-je vous aider ?', WELCOME_OPTIONS), 100)
  }

  const headerInfo = chatMode === 'agent'
    ? { name: agentName, subtitle: agentService, icon: <UserCheck size={22} className="text-white" />, gradient: 'from-success-500 to-success-700' }
    : { name: 'GohitaflaBot', subtitle: 'Assistant virtuel', icon: <Bot size={22} className="text-white" />, gradient: 'from-primary-500 to-primary-600' }

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 ${
          isOpen ? 'bg-gray-600 hover:bg-gray-700' : 'bg-accent-500 hover:bg-accent-600 hover:scale-110'
        }`}
      >
        {isOpen ? <X size={26} className="text-white" /> : (
          <>
            <MessageCircle size={28} className="text-white" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-success-500 rounded-full border-2 border-white flex items-center justify-center">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
            </span>
          </>
        )}
      </button>

      {!isOpen && (
        <div className="fixed bottom-24 right-6 z-50 animate-bounce hidden sm:block">
          <div className="bg-white rounded-xl shadow-lg px-4 py-2.5 text-sm font-medium text-gray-700 border relative">
            Besoin d'aide ? 💬
            <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white border-r border-b transform rotate-45" />
          </div>
        </div>
      )}

      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[400px] max-w-[calc(100vw-2rem)] h-[580px] max-h-[calc(100vh-8rem)] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-in">
          {/* Header */}
          <div className={`bg-gradient-to-r ${headerInfo.gradient} px-5 py-4 flex items-center justify-between flex-shrink-0`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">{headerInfo.icon}</div>
              <div>
                <h3 className="text-white font-heading font-bold text-sm">{headerInfo.name}</h3>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-white/70 text-xs">{headerInfo.subtitle}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {chatMode === 'agent' && (
                <button onClick={() => handleOption({ label: 'Quitter', action: 'end_agent' })}
                  className="p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white" title="Quitter l'agent">
                  <ArrowLeft size={16} />
                </button>
              )}
              <button onClick={handleReset} className="p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white" title="Réinitialiser">
                <RotateCcw size={16} />
              </button>
            </div>
          </div>

          {chatMode === 'agent' && (
            <div className="bg-success-50 border-b border-success-100 px-4 py-2 flex items-center gap-2">
              <UserCheck size={14} className="text-success-600" />
              <span className="text-xs font-medium text-success-700">En conversation avec {agentName} — {agentService}</span>
            </div>
          )}

          {/* Agent form */}
          {showAgentForm && (
            <div className="absolute inset-0 z-20 bg-white flex flex-col rounded-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-5 py-4 flex items-center gap-3 flex-shrink-0">
                <button onClick={() => setShowAgentForm(false)} className="p-1.5 rounded-lg hover:bg-white/10 text-white"><ArrowLeft size={18} /></button>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"><Headphones size={20} className="text-white" /></div>
                  <div>
                    <h3 className="text-white font-heading font-bold text-sm">Parler à un agent</h3>
                    <span className="text-primary-100 text-xs">Mise en relation en direct</span>
                  </div>
                </div>
              </div>
              <form onSubmit={submitAgentForm} className="flex-1 p-6 overflow-y-auto">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Headphones size={28} className="text-primary-500" />
                  </div>
                  <h3 className="font-heading font-bold text-gray-900">Contactez un agent</h3>
                  <p className="text-gray-500 text-sm mt-1">Remplissez ce formulaire pour être mis en relation.</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Votre nom complet *</label>
                    <input type="text" required value={agentFormData.nom} onChange={(e) => setAgentFormData(p => ({ ...p, nom: e.target.value }))}
                      placeholder="Nom et prénoms" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Téléphone *</label>
                    <input type="tel" required value={agentFormData.telephone} onChange={(e) => setAgentFormData(p => ({ ...p, telephone: e.target.value }))}
                      placeholder="+225 XX XX XX XX XX" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Sujet *</label>
                    <select required value={agentFormData.sujet} onChange={(e) => setAgentFormData(p => ({ ...p, sujet: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none">
                      <option value="">Choisir un sujet...</option>
                      <option>Acte de naissance</option><option>Acte de mariage</option><option>Acte de décès</option>
                      <option>Certificat de résidence</option><option>Légalisation</option><option>Certificat de célibat</option>
                      <option>Suivi de demande</option><option>Renseignement général</option><option>Réclamation</option><option>Autre</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="w-full mt-6 py-3 bg-accent-500 hover:bg-accent-600 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
                  <Headphones size={18} /> Démarrer la conversation
                </button>
                <p className="text-center text-[10px] text-gray-400 mt-4">Disponible aux heures d'ouverture de la mairie</p>
              </form>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-gray-50">
            {messages.map((msg) => (
              <div key={msg.id}>
                {msg.type === 'system' ? (
                  <div className="flex justify-center">
                    <div className="bg-gray-200/80 text-gray-600 text-xs px-4 py-2 rounded-full font-medium text-center max-w-[85%]">
                      {formatMessage(msg.text)}
                    </div>
                  </div>
                ) : (
                  <>
                    <div className={`flex items-end gap-2 ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}>
                      {msg.type === 'bot' && <div className="w-7 h-7 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0"><Bot size={14} className="text-white" /></div>}
                      {msg.type === 'agent' && <div className="w-7 h-7 bg-success-500 rounded-full flex items-center justify-center flex-shrink-0"><UserCheck size={14} className="text-white" /></div>}
                      <div className={`max-w-[80%] px-4 py-3 text-sm leading-relaxed ${
                        msg.type === 'user' ? 'bg-accent-500 text-white rounded-2xl rounded-br-md'
                        : msg.type === 'agent' ? 'bg-success-50 text-gray-700 rounded-2xl rounded-bl-md shadow-sm border border-success-200'
                        : 'bg-white text-gray-700 rounded-2xl rounded-bl-md shadow-sm border border-gray-100'
                      }`}>
                        {msg.type === 'agent' && <span className="block text-[10px] font-bold text-success-600 mb-1">{agentName}</span>}
                        {msg.type !== 'user' ? formatMessage(msg.text) : msg.text}
                      </div>
                    </div>
                    {msg.type === 'bot' && msg.options && (
                      <div className="ml-9 mt-2 flex flex-wrap gap-1.5">
                        {msg.options.map((opt) => (
                          <button key={opt.label} onClick={() => handleOption(opt)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border rounded-full text-xs font-medium transition-all shadow-sm ${
                              opt.action === 'agent' ? 'border-success-300 text-success-700 hover:bg-success-50' : 'border-gray-200 text-gray-700 hover:bg-primary-50 hover:border-primary-300 hover:text-primary-600'
                            }`}>
                            {opt.icon && <opt.icon size={12} />}{opt.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-end gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${chatMode === 'agent' ? 'bg-success-500' : 'bg-primary-500'}`}>
                  {chatMode === 'agent' ? <UserCheck size={14} className="text-white" /> : <Bot size={14} className="text-white" />}
                </div>
                <div className={`px-4 py-3 rounded-2xl rounded-bl-md shadow-sm border ${chatMode === 'agent' ? 'bg-success-50 border-success-200' : 'bg-white border-gray-100'}`}>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-gray-400 mr-1">{chatMode === 'agent' ? `${agentName} écrit` : 'écrit'}</span>
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            {chatMode === 'connecting' && !isTyping && (
              <div className="flex justify-center py-4">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 size={28} className="text-primary-500 animate-spin" />
                  <span className="text-xs text-gray-500 font-medium">En attente d'un agent...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="px-4 py-3 bg-white border-t border-gray-100 flex-shrink-0">
            <div className="flex items-center gap-2">
              <input ref={inputRef} type="text" value={input} onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                disabled={chatMode === 'connecting'}
                placeholder={chatMode === 'connecting' ? 'En attente d\'un agent...' : chatMode === 'agent' ? `Écrire à ${agentName}...` : 'Écrivez votre message...'}
                className="flex-1 px-4 py-2.5 bg-gray-100 rounded-xl text-sm outline-none focus:bg-gray-50 focus:ring-2 focus:ring-primary-500/20 transition-all disabled:opacity-50" />
              <button onClick={handleSend} disabled={!input.trim() || chatMode === 'connecting'}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors disabled:bg-gray-200 disabled:cursor-not-allowed ${chatMode === 'agent' ? 'bg-success-500 hover:bg-success-600' : 'bg-accent-500 hover:bg-accent-600'}`}>
                <Send size={16} className="text-white" />
              </button>
            </div>
            <p className="text-center text-[10px] text-gray-400 mt-2">
              {chatMode === 'agent' ? `En conversation avec ${agentName}` : 'Assistant virtuel — Mairie de Gohitafla'}
            </p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes animate-in { from { opacity:0; transform:translateY(10px) scale(.98) } to { opacity:1; transform:translateY(0) scale(1) } }
        .animate-in { animation: animate-in .25s ease-out }
      `}</style>
    </>
  )
}
