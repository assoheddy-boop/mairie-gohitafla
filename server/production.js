import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import db from './db.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE'] },
})

app.use(express.json())

const distPath = join(__dirname, '..', 'dist')
app.use(express.static(distPath))

// ═══ All API routes from index.js ═══

app.post('/api/agent/login', (req, res) => {
  const { email, password } = req.body
  const agent = db.prepare('SELECT id, nom, service, email FROM agents WHERE email = ? AND password = ?').get(email, password)
  if (!agent) return res.status(401).json({ error: 'Identifiants incorrects' })
  res.json(agent)
})

app.get('/api/conversations/waiting', (req, res) => {
  res.json(db.prepare("SELECT * FROM conversations WHERE status = 'waiting' ORDER BY created_at ASC").all())
})

app.get('/api/conversations/active/:agentId', (req, res) => {
  res.json(db.prepare("SELECT * FROM conversations WHERE agent_id = ? AND status = 'active' ORDER BY created_at DESC").all(req.params.agentId))
})

app.get('/api/conversations/closed/:agentId', (req, res) => {
  res.json(db.prepare("SELECT * FROM conversations WHERE agent_id = ? AND status = 'closed' ORDER BY closed_at DESC LIMIT 50").all(req.params.agentId))
})

app.get('/api/messages/:conversationId', (req, res) => {
  res.json(db.prepare('SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC').all(req.params.conversationId))
})

app.post('/api/demandes', (req, res) => {
  const { reference, document_type, nom_demandeur, prenoms_demandeur, telephone, email, form_data } = req.body
  try {
    db.prepare('INSERT INTO demandes (reference, document_type, nom_demandeur, prenoms_demandeur, telephone, email, form_data) VALUES (?, ?, ?, ?, ?, ?, ?)').run(reference, document_type, nom_demandeur, prenoms_demandeur, telephone, email || null, JSON.stringify(form_data || {}))
    db.prepare("INSERT INTO notifications (demande_ref, type, destinataire, message, envoyee) VALUES (?, 'confirmation', ?, ?, 1)").run(reference, telephone, `Demande ${reference} enregistrée.`)
    res.json({ success: true, reference })
  } catch { res.status(500).json({ error: 'Erreur' }) }
})

app.get('/api/demandes/suivi/:reference', (req, res) => {
  const d = db.prepare('SELECT * FROM demandes WHERE reference = ?').get(req.params.reference)
  if (!d) return res.status(404).json({ error: 'Introuvable' })
  res.json(d)
})

app.get('/api/demandes', (req, res) => {
  res.json(db.prepare('SELECT * FROM demandes ORDER BY created_at DESC LIMIT 100').all())
})

app.put('/api/demandes/:reference/statut', (req, res) => {
  const { statut } = req.body
  if (!['traitement', 'en_cours', 'pret', 'rejete'].includes(statut)) return res.status(400).json({ error: 'Statut invalide' })
  const d = db.prepare('SELECT * FROM demandes WHERE reference = ?').get(req.params.reference)
  if (!d) return res.status(404).json({ error: 'Introuvable' })
  db.prepare("UPDATE demandes SET statut = ?, updated_at = datetime('now') WHERE reference = ?").run(statut, req.params.reference)
  res.json({ success: true })
})

app.post('/api/contact', (req, res) => {
  const { nom, email, telephone, sujet, message } = req.body
  if (!nom || !email || !sujet || !message) return res.status(400).json({ error: 'Champs requis manquants' })
  db.prepare('INSERT INTO contacts (nom, email, telephone, sujet, message) VALUES (?, ?, ?, ?, ?)').run(nom, email, telephone || null, sujet, message)
  res.json({ success: true })
})

app.get('/api/contacts', (req, res) => {
  res.json(db.prepare('SELECT * FROM contacts ORDER BY created_at DESC LIMIT 100').all())
})

app.put('/api/contacts/:id/lu', (req, res) => {
  db.prepare('UPDATE contacts SET lu = 1 WHERE id = ?').run(req.params.id)
  res.json({ success: true })
})

app.post('/api/newsletter', (req, res) => {
  const { email } = req.body
  if (!email) return res.status(400).json({ error: 'Email requis' })
  db.prepare('INSERT OR IGNORE INTO newsletter (email) VALUES (?)').run(email)
  res.json({ success: true })
})

app.get('/api/newsletter', (req, res) => {
  res.json(db.prepare('SELECT * FROM newsletter WHERE active = 1 ORDER BY created_at DESC').all())
})

app.get('/api/notifications/:reference', (req, res) => {
  res.json(db.prepare('SELECT * FROM notifications WHERE demande_ref = ? ORDER BY created_at DESC').all(req.params.reference))
})

app.get('/api/admin/stats', (req, res) => {
  res.json({
    totalDemandes: db.prepare('SELECT COUNT(*) as c FROM demandes').get().c,
    demandesEnCours: db.prepare("SELECT COUNT(*) as c FROM demandes WHERE statut IN ('traitement', 'en_cours')").get().c,
    demandesPretes: db.prepare("SELECT COUNT(*) as c FROM demandes WHERE statut = 'pret'").get().c,
    totalContacts: db.prepare('SELECT COUNT(*) as c FROM contacts').get().c,
    contactsNonLus: db.prepare('SELECT COUNT(*) as c FROM contacts WHERE lu = 0').get().c,
    totalNewsletter: db.prepare('SELECT COUNT(*) as c FROM newsletter WHERE active = 1').get().c,
    totalConversations: db.prepare('SELECT COUNT(*) as c FROM conversations').get().c,
  })
})

app.post('/api/admin/login', (req, res) => {
  if (req.body.password === 'admin-gohitafla-2026') res.json({ success: true })
  else res.status(401).json({ error: 'Incorrect' })
})

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(join(distPath, 'index.html'))
})

// Socket.IO
io.on('connection', (socket) => {
  socket.on('citizen:request_agent', (data) => {
    const { nom, telephone, sujet } = data
    const convId = 'conv-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6)
    db.prepare("INSERT INTO conversations (id, citizen_name, citizen_phone, subject, status, socket_id) VALUES (?, ?, ?, ?, 'waiting', ?)").run(convId, nom, telephone, sujet, socket.id)
    socket.join(convId)
    socket.emit('citizen:waiting', { conversationId: convId, position: db.prepare("SELECT COUNT(*) as c FROM conversations WHERE status = 'waiting'").get().c })
    io.to('agents-room').emit('agent:new_conversation', { id: convId, citizen_name: nom, citizen_phone: telephone, subject: sujet, status: 'waiting', created_at: new Date().toISOString() })
  })

  socket.on('citizen:message', (data) => {
    const conv = db.prepare('SELECT * FROM conversations WHERE id = ?').get(data.conversationId)
    if (!conv) return
    db.prepare("INSERT INTO messages (conversation_id, sender_type, sender_name, content) VALUES (?, 'citizen', ?, ?)").run(data.conversationId, conv.citizen_name, data.content)
    io.to(data.conversationId).emit('chat:message', { conversationId: data.conversationId, sender_type: 'citizen', sender_name: conv.citizen_name, content: data.content, created_at: new Date().toISOString() })
  })

  socket.on('agent:join', (data) => {
    socket.join('agents-room')
    socket.agentId = data.agentId
    db.prepare('UPDATE agents SET is_online = 1, socket_id = ? WHERE id = ?').run(socket.id, data.agentId)
    io.to('agents-room').emit('agent:online_update', db.prepare('SELECT id, nom, service FROM agents WHERE is_online = 1').all())
  })

  socket.on('agent:accept', (data) => {
    const agent = db.prepare('SELECT * FROM agents WHERE id = ?').get(data.agentId)
    if (!agent) return
    db.prepare("UPDATE conversations SET status = 'active', agent_id = ? WHERE id = ?").run(data.agentId, data.conversationId)
    socket.join(data.conversationId)
    const msg = `Bonjour ! Je suis ${agent.nom} du service ${agent.service}. Je prends en charge votre demande.`
    db.prepare("INSERT INTO messages (conversation_id, sender_type, sender_name, content) VALUES (?, 'agent', ?, ?)").run(data.conversationId, agent.nom, msg)
    io.to(data.conversationId).emit('chat:agent_connected', { conversationId: data.conversationId, agent: { id: agent.id, nom: agent.nom, service: agent.service } })
    io.to(data.conversationId).emit('chat:message', { conversationId: data.conversationId, sender_type: 'agent', sender_name: agent.nom, content: msg, created_at: new Date().toISOString() })
    io.to('agents-room').emit('agent:conversation_taken', { conversationId: data.conversationId, agentId: data.agentId })
  })

  socket.on('agent:message', (data) => {
    const agent = db.prepare('SELECT * FROM agents WHERE id = ?').get(data.agentId)
    if (!agent) return
    db.prepare("INSERT INTO messages (conversation_id, sender_type, sender_name, content) VALUES (?, 'agent', ?, ?)").run(data.conversationId, agent.nom, data.content)
    io.to(data.conversationId).emit('chat:message', { conversationId: data.conversationId, sender_type: 'agent', sender_name: agent.nom, content: data.content, created_at: new Date().toISOString() })
  })

  socket.on('agent:close', (data) => {
    db.prepare("UPDATE conversations SET status = 'closed', closed_at = datetime('now') WHERE id = ?").run(data.conversationId)
    io.to(data.conversationId).emit('chat:closed', { conversationId: data.conversationId })
    io.to('agents-room').emit('agent:conversation_closed', { conversationId: data.conversationId })
  })

  socket.on('agent:typing', (data) => socket.to(data.conversationId).emit('chat:typing', { sender: 'agent' }))
  socket.on('citizen:typing', (data) => socket.to(data.conversationId).emit('chat:typing', { sender: 'citizen' }))

  socket.on('disconnect', () => {
    if (socket.agentId) {
      db.prepare('UPDATE agents SET is_online = 0, socket_id = NULL WHERE id = ?').run(socket.agentId)
      io.to('agents-room').emit('agent:online_update', db.prepare('SELECT id, nom, service FROM agents WHERE is_online = 1').all())
    }
  })
})

const PORT = process.env.PORT || 3001
server.listen(PORT, () => {
  console.log(`\n  Mairie de Gohitafla — Production`)
  console.log(`  Serveur: http://localhost:${PORT}\n`)
})
