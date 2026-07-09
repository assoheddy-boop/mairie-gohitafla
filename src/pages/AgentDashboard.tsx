import { useState, useEffect, useRef } from 'react'
import {
  LogIn, LogOut, MessageCircle, Users, Clock, Send, CheckCircle,
  XCircle, Phone, User, Headphones, Inbox, ChevronRight,
  AlertCircle, Wifi, WifiOff, X, FileText, Building2
} from 'lucide-react'
import { io, Socket } from 'socket.io-client'

const SERVER_URL = `http://${window.location.hostname}:3001`

interface Agent {
  id: string
  nom: string
  service: string
  email: string
}

interface Conversation {
  id: string
  citizen_name: string
  citizen_phone: string
  subject: string
  status: string
  agent_id?: string
  created_at: string
}

interface ChatMessage {
  conversationId: string
  sender_type: 'citizen' | 'agent' | 'system'
  sender_name: string
  content: string
  created_at: string
}

export default function AgentDashboard() {
  const [agent, setAgent] = useState<Agent | null>(null)
  const [socket, setSocket] = useState<Socket | null>(null)
  const [connected, setConnected] = useState(false)
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [loginError, setLoginError] = useState('')

  const [waitingConvos, setWaitingConvos] = useState<Conversation[]>([])
  const [activeConvos, setActiveConvos] = useState<Conversation[]>([])
  const [selectedConvo, setSelectedConvo] = useState<string | null>(null)
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({})
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [onlineAgents, setOnlineAgents] = useState<Agent[]>([])
  const [tab, setTab] = useState<'waiting' | 'active'>('waiting')

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const typingTimeout = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, selectedConvo])

  useEffect(() => {
    if (selectedConvo) inputRef.current?.focus()
  }, [selectedConvo])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    try {
      const res = await fetch(`${SERVER_URL}/api/agent/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm),
      })
      if (!res.ok) {
        setLoginError('Email ou mot de passe incorrect')
        return
      }
      const data = await res.json()
      setAgent(data)
      connectSocket(data)
    } catch {
      setLoginError('Impossible de se connecter au serveur')
    }
  }

  const connectSocket = (agentData: Agent) => {
    const s = io(SERVER_URL)

    s.on('connect', () => {
      setConnected(true)
      s.emit('agent:join', { agentId: agentData.id })
      loadConversations(agentData.id)
    })

    s.on('disconnect', () => setConnected(false))

    s.on('agent:new_conversation', (convo: Conversation) => {
      setWaitingConvos(prev => [...prev, convo])
      playNotification()
    })

    s.on('agent:conversation_taken', ({ conversationId, agentId }: { conversationId: string; agentId: string }) => {
      setWaitingConvos(prev => prev.filter(c => c.id !== conversationId))
      if (agentId === agentData.id) {
        loadConversations(agentData.id)
      }
    })

    s.on('agent:conversation_closed', ({ conversationId }: { conversationId: string }) => {
      setActiveConvos(prev => prev.filter(c => c.id !== conversationId))
      if (selectedConvo === conversationId) setSelectedConvo(null)
    })

    s.on('chat:message', (msg: ChatMessage) => {
      setMessages(prev => ({
        ...prev,
        [msg.conversationId]: [...(prev[msg.conversationId] || []), msg],
      }))
      if (msg.sender_type === 'citizen') playNotification()
    })

    s.on('chat:typing', ({ sender }: { sender: string }) => {
      if (sender === 'citizen') {
        setIsTyping(true)
        clearTimeout(typingTimeout.current)
        typingTimeout.current = setTimeout(() => setIsTyping(false), 2000)
      }
    })

    s.on('chat:closed', ({ conversationId }: { conversationId: string }) => {
      setActiveConvos(prev => prev.filter(c => c.id !== conversationId))
    })

    s.on('agent:online_update', (agents: Agent[]) => {
      setOnlineAgents(agents)
    })

    setSocket(s)
  }

  const loadConversations = async (agentId: string) => {
    try {
      const [waitingRes, activeRes] = await Promise.all([
        fetch(`${SERVER_URL}/api/conversations/waiting`),
        fetch(`${SERVER_URL}/api/conversations/active/${agentId}`),
      ])
      setWaitingConvos(await waitingRes.json())
      setActiveConvos(await activeRes.json())
    } catch { /* ignore */ }
  }

  const loadMessages = async (conversationId: string) => {
    try {
      const res = await fetch(`${SERVER_URL}/api/messages/${conversationId}`)
      const msgs = await res.json()
      setMessages(prev => ({ ...prev, [conversationId]: msgs }))
    } catch { /* ignore */ }
  }

  const acceptConversation = (conversationId: string) => {
    if (!socket || !agent) return
    socket.emit('agent:accept', { conversationId, agentId: agent.id })
    setSelectedConvo(conversationId)
    setTab('active')
    loadMessages(conversationId)
  }

  const selectConversation = (conversationId: string) => {
    setSelectedConvo(conversationId)
    if (!messages[conversationId]?.length) loadMessages(conversationId)
  }

  const sendMessage = () => {
    if (!input.trim() || !socket || !agent || !selectedConvo) return
    socket.emit('agent:message', {
      conversationId: selectedConvo,
      agentId: agent.id,
      content: input.trim(),
    })
    setInput('')
  }

  const closeConversation = (conversationId: string) => {
    if (!socket) return
    socket.emit('agent:close', { conversationId })
    setSelectedConvo(null)
  }

  const handleLogout = () => {
    socket?.disconnect()
    setAgent(null)
    setSocket(null)
    setConnected(false)
    setSelectedConvo(null)
    setMessages({})
    setWaitingConvos([])
    setActiveConvos([])
  }

  const playNotification = () => {
    try {
      const ctx = new AudioContext()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.value = 800
      gain.gain.value = 0.1
      osc.start()
      osc.stop(ctx.currentTime + 0.15)
    } catch { /* ignore */ }
  }

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  }

  const currentConvo = [...waitingConvos, ...activeConvos].find(c => c.id === selectedConvo)
  const currentMessages = selectedConvo ? (messages[selectedConvo] || []) : []

  // ─── LOGIN SCREEN ───
  if (!agent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Headphones size={36} className="text-white" />
            </div>
            <h1 className="text-3xl font-heading font-bold text-white">Espace Agent</h1>
            <p className="text-primary-200 mt-2">Mairie de Gohitafla — Dashboard de messagerie</p>
          </div>

          <form onSubmit={handleLogin} className="bg-white rounded-2xl shadow-2xl p-8">
            <h2 className="font-heading font-bold text-xl text-gray-900 mb-6 text-center">Connexion</h2>

            {loginError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700 text-sm">
                <AlertCircle size={16} />
                {loginError}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email professionnel</label>
                <input
                  type="email"
                  required
                  value={loginForm.email}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="prenom@mairie-gohitafla.ci"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Mot de passe</label>
                <input
                  type="password"
                  required
                  value={loginForm.password}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                />
              </div>
            </div>

            <button type="submit" className="w-full mt-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
              <LogIn size={18} />
              Se connecter
            </button>

            <div className="mt-6 p-4 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-500 font-semibold mb-2">Comptes de test :</p>
              <p className="text-xs text-gray-400">kouame@mairie-gohitafla.ci / agent123</p>
              <p className="text-xs text-gray-400">adjoua@mairie-gohitafla.ci / agent123</p>
            </div>
          </form>
        </div>
      </div>
    )
  }

  // ─── DASHBOARD ───
  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Top bar */}
      <div className="bg-primary-500 text-white px-6 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Building2 size={20} />
            <span className="font-heading font-bold">Mairie de Gohitafla</span>
          </div>
          <span className="text-primary-200">|</span>
          <span className="text-primary-100 text-sm">Dashboard Agent</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {connected ? (
              <Wifi size={16} className="text-green-400" />
            ) : (
              <WifiOff size={16} className="text-red-400" />
            )}
            <span className="text-sm">{agent.nom}</span>
            <span className="text-primary-200 text-xs">({agent.service})</span>
          </div>
          <button onClick={handleLogout} className="p-2 rounded-lg hover:bg-white/10 transition-colors" title="Déconnexion">
            <LogOut size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r flex flex-col flex-shrink-0">
          {/* Tabs */}
          <div className="flex border-b">
            <button
              onClick={() => setTab('waiting')}
              className={`flex-1 py-3 text-sm font-semibold text-center transition-colors relative ${
                tab === 'waiting' ? 'text-accent-600 border-b-2 border-accent-500' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              En attente
              {waitingConvos.length > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center w-5 h-5 bg-accent-500 text-white text-xs font-bold rounded-full">
                  {waitingConvos.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setTab('active')}
              className={`flex-1 py-3 text-sm font-semibold text-center transition-colors ${
                tab === 'active' ? 'text-primary-600 border-b-2 border-primary-500' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Actives
              {activeConvos.length > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center w-5 h-5 bg-primary-500 text-white text-xs font-bold rounded-full">
                  {activeConvos.length}
                </span>
              )}
            </button>
          </div>

          {/* Conversations list */}
          <div className="flex-1 overflow-y-auto">
            {tab === 'waiting' && waitingConvos.length === 0 && (
              <div className="p-8 text-center">
                <Inbox size={40} className="text-gray-200 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">Aucune conversation en attente</p>
              </div>
            )}
            {tab === 'active' && activeConvos.length === 0 && (
              <div className="p-8 text-center">
                <MessageCircle size={40} className="text-gray-200 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">Aucune conversation active</p>
              </div>
            )}

            {(tab === 'waiting' ? waitingConvos : activeConvos).map((convo) => (
              <div
                key={convo.id}
                onClick={() => tab === 'active' ? selectConversation(convo.id) : undefined}
                className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                  tab === 'active' ? 'cursor-pointer' : ''
                } ${selectedConvo === convo.id ? 'bg-primary-50 border-l-4 border-l-primary-500' : ''}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                      tab === 'waiting' ? 'bg-accent-500' : 'bg-primary-500'
                    }`}>
                      {convo.citizen_name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-gray-900">{convo.citizen_name}</p>
                      <p className="text-xs text-gray-400">{convo.citizen_phone}</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-gray-400">{formatTime(convo.created_at)}</span>
                </div>
                <div className="flex items-center gap-1.5 ml-10">
                  <FileText size={12} className="text-gray-400" />
                  <span className="text-xs text-gray-500">{convo.subject}</span>
                </div>
                {tab === 'waiting' && (
                  <button
                    onClick={(e) => { e.stopPropagation(); acceptConversation(convo.id) }}
                    className="mt-3 ml-10 px-4 py-1.5 bg-success-500 hover:bg-success-600 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <CheckCircle size={14} />
                    Prendre en charge
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Online agents */}
          <div className="border-t p-4 bg-gray-50">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Agents en ligne ({onlineAgents.length})
            </p>
            <div className="space-y-1.5">
              {onlineAgents.map((a) => (
                <div key={a.id} className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-xs text-gray-600">{a.nom}</span>
                  <span className="text-[10px] text-gray-400">— {a.service}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col">
          {!selectedConvo ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle size={64} className="text-gray-200 mx-auto mb-4" />
                <h3 className="font-heading font-bold text-xl text-gray-400">Sélectionnez une conversation</h3>
                <p className="text-gray-300 text-sm mt-2">
                  Choisissez une conversation dans la liste ou acceptez une demande en attente
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Chat header */}
              <div className="bg-white border-b px-6 py-3 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold">
                    {currentConvo?.citizen_name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{currentConvo?.citizen_name}</h3>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><Phone size={10} /> {currentConvo?.citizen_phone}</span>
                      <span className="flex items-center gap-1"><FileText size={10} /> {currentConvo?.subject}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => selectedConvo && closeConversation(selectedConvo)}
                  className="px-4 py-2 bg-red-50 text-red-600 text-sm font-semibold rounded-lg hover:bg-red-100 transition-colors flex items-center gap-1.5"
                >
                  <XCircle size={16} />
                  Clôturer
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-gray-50">
                {currentMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.sender_type === 'agent' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                      msg.sender_type === 'agent'
                        ? 'bg-primary-500 text-white rounded-br-md'
                        : 'bg-white text-gray-700 border border-gray-200 rounded-bl-md shadow-sm'
                    }`}>
                      <span className={`block text-[10px] font-bold mb-1 ${
                        msg.sender_type === 'agent' ? 'text-primary-100' : 'text-accent-500'
                      }`}>
                        {msg.sender_name}
                      </span>
                      {msg.content}
                      <span className={`block text-[10px] mt-1 text-right ${
                        msg.sender_type === 'agent' ? 'text-primary-200' : 'text-gray-400'
                      }`}>
                        {formatTime(msg.created_at)}
                      </span>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </span>
                    Le citoyen écrit...
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="bg-white border-t px-6 py-4 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => {
                      setInput(e.target.value)
                      socket?.emit('agent:typing', { conversationId: selectedConvo })
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Écrivez votre réponse..."
                    className="flex-1 px-4 py-3 bg-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500/20"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!input.trim()}
                    className="px-6 py-3 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-200 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors flex items-center gap-2"
                  >
                    <Send size={16} />
                    Envoyer
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
