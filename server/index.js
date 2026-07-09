import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import db from './db.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const uploadsDir = path.join(__dirname, '..', 'public', 'uploads')
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e6) + path.extname(file.originalname)
    cb(null, uniqueName)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/
    const ext = allowed.test(path.extname(file.originalname).toLowerCase())
    const mime = allowed.test(file.mimetype)
    cb(null, ext && mime)
  },
})

const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => callback(null, true),
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
})

app.use(cors({ origin: true }))
app.use(express.json())
app.use('/uploads', express.static(uploadsDir))

// ═══════════════════════════════════════
//  REST API — Agent Auth
// ═══════════════════════════════════════

app.post('/api/agent/login', (req, res) => {
  const { email, password } = req.body
  const agent = db.prepare('SELECT id, nom, service, email FROM agents WHERE email = ? AND password = ?').get(email, password)
  if (!agent) return res.status(401).json({ error: 'Identifiants incorrects' })
  res.json(agent)
})

// ═══════════════════════════════════════
//  REST API — Conversations (Chat)
// ═══════════════════════════════════════

app.get('/api/conversations/waiting', (req, res) => {
  const convos = db.prepare("SELECT * FROM conversations WHERE status = 'waiting' ORDER BY created_at ASC").all()
  res.json(convos)
})

app.get('/api/conversations/active/:agentId', (req, res) => {
  const convos = db.prepare("SELECT * FROM conversations WHERE agent_id = ? AND status = 'active' ORDER BY created_at DESC").all(req.params.agentId)
  res.json(convos)
})

app.get('/api/conversations/closed/:agentId', (req, res) => {
  const convos = db.prepare("SELECT * FROM conversations WHERE agent_id = ? AND status = 'closed' ORDER BY closed_at DESC LIMIT 50").all(req.params.agentId)
  res.json(convos)
})

app.get('/api/messages/:conversationId', (req, res) => {
  const messages = db.prepare('SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC').all(req.params.conversationId)
  res.json(messages)
})

// ═══════════════════════════════════════
//  REST API — Demandes de documents
// ═══════════════════════════════════════

app.post('/api/demandes', (req, res) => {
  const { reference, document_type, nom_demandeur, prenoms_demandeur, telephone, email, form_data } = req.body

  try {
    db.prepare(`
      INSERT INTO demandes (reference, document_type, nom_demandeur, prenoms_demandeur, telephone, email, form_data)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(reference, document_type, nom_demandeur, prenoms_demandeur, telephone, email || null, JSON.stringify(form_data || {}))

    db.prepare(`
      INSERT INTO notifications (demande_ref, type, destinataire, message, envoyee)
      VALUES (?, 'confirmation', ?, ?, 1)
    `).run(reference, telephone, `Votre demande de ${document_type} a bien été enregistrée sous la référence ${reference}. Vous serez contacté(e) lorsque votre document sera prêt.`)

    res.json({ success: true, reference })
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de l\'enregistrement' })
  }
})

app.get('/api/demandes/suivi/:reference', (req, res) => {
  const demande = db.prepare('SELECT * FROM demandes WHERE reference = ?').get(req.params.reference)
  if (!demande) return res.status(404).json({ error: 'Demande introuvable' })
  res.json(demande)
})

app.get('/api/demandes', (req, res) => {
  const demandes = db.prepare('SELECT * FROM demandes ORDER BY created_at DESC LIMIT 100').all()
  res.json(demandes)
})

app.put('/api/demandes/:reference/statut', (req, res) => {
  const { statut } = req.body
  const valid = ['traitement', 'en_cours', 'pret', 'rejete']
  if (!valid.includes(statut)) return res.status(400).json({ error: 'Statut invalide' })

  const demande = db.prepare('SELECT * FROM demandes WHERE reference = ?').get(req.params.reference)
  if (!demande) return res.status(404).json({ error: 'Demande introuvable' })

  db.prepare("UPDATE demandes SET statut = ?, updated_at = datetime('now') WHERE reference = ?").run(statut, req.params.reference)

  const messages = {
    traitement: `Votre demande ${req.params.reference} est en cours de traitement.`,
    en_cours: `Votre demande ${req.params.reference} sera bientôt prête.`,
    pret: `Votre document (${req.params.reference}) est prêt ! Présentez-vous à la Mairie de Gohitafla avec votre pièce d'identité.`,
    rejete: `Votre demande ${req.params.reference} a été rejetée. Veuillez contacter la mairie pour plus d'informations.`,
  }

  db.prepare(`
    INSERT INTO notifications (demande_ref, type, destinataire, message, envoyee)
    VALUES (?, 'statut', ?, ?, 1)
  `).run(req.params.reference, demande.telephone, messages[statut])

  res.json({ success: true, statut })
})

// ═══════════════════════════════════════
//  REST API — Formulaire de contact
// ═══════════════════════════════════════

app.post('/api/contact', (req, res) => {
  const { nom, email, telephone, sujet, message } = req.body
  if (!nom || !email || !sujet || !message) return res.status(400).json({ error: 'Champs requis manquants' })

  try {
    db.prepare(`
      INSERT INTO contacts (nom, email, telephone, sujet, message)
      VALUES (?, ?, ?, ?, ?)
    `).run(nom, email, telephone || null, sujet, message)
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de l\'envoi' })
  }
})

app.get('/api/contacts', (req, res) => {
  const contacts = db.prepare('SELECT * FROM contacts ORDER BY created_at DESC LIMIT 100').all()
  res.json(contacts)
})

app.put('/api/contacts/:id/lu', (req, res) => {
  db.prepare('UPDATE contacts SET lu = 1 WHERE id = ?').run(req.params.id)
  res.json({ success: true })
})

// ═══════════════════════════════════════
//  REST API — Newsletter
// ═══════════════════════════════════════

app.post('/api/newsletter', (req, res) => {
  const { email } = req.body
  if (!email) return res.status(400).json({ error: 'Email requis' })

  try {
    db.prepare('INSERT OR IGNORE INTO newsletter (email) VALUES (?)').run(email)
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de l\'inscription' })
  }
})

app.get('/api/newsletter', (req, res) => {
  const subs = db.prepare('SELECT * FROM newsletter WHERE active = 1 ORDER BY created_at DESC').all()
  res.json(subs)
})

// ═══════════════════════════════════════
//  REST API — Notifications
// ═══════════════════════════════════════

app.get('/api/notifications/:reference', (req, res) => {
  const notifs = db.prepare('SELECT * FROM notifications WHERE demande_ref = ? ORDER BY created_at DESC').all(req.params.reference)
  res.json(notifs)
})

// ═══════════════════════════════════════
//  REST API — Upload d'images
// ═══════════════════════════════════════

app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Aucune image envoyée ou format non supporté (jpg, png, gif, webp)' })
  const imageUrl = `/uploads/${req.file.filename}`
  res.json({ success: true, url: imageUrl })
})

// ═══════════════════════════════════════
//  REST API — Actualités (CRUD)
// ═══════════════════════════════════════

app.get('/api/actualites', (req, res) => {
  const all = req.query.all === '1'
  const rows = all
    ? db.prepare('SELECT * FROM actualites ORDER BY date DESC').all()
    : db.prepare('SELECT * FROM actualites WHERE published = 1 ORDER BY date DESC').all()
  res.json(rows)
})

app.post('/api/actualites', (req, res) => {
  const { title, excerpt, content, category, category_color, image, date } = req.body
  if (!title || !excerpt || !category || !date) return res.status(400).json({ error: 'Champs requis manquants' })
  const result = db.prepare('INSERT INTO actualites (title, excerpt, content, category, category_color, image, date) VALUES (?, ?, ?, ?, ?, ?, ?)').run(title, excerpt, content || '', category, category_color || 'bg-blue-100 text-blue-700', image || '', date)
  res.json({ success: true, id: result.lastInsertRowid })
})

app.put('/api/actualites/:id', (req, res) => {
  const { title, excerpt, content, category, category_color, image, date, published } = req.body
  const existing = db.prepare('SELECT * FROM actualites WHERE id = ?').get(req.params.id)
  if (!existing) return res.status(404).json({ error: 'Introuvable' })
  db.prepare('UPDATE actualites SET title=?, excerpt=?, content=?, category=?, category_color=?, image=?, date=?, published=? WHERE id=?').run(
    title ?? existing.title, excerpt ?? existing.excerpt, content ?? existing.content, category ?? existing.category, category_color ?? existing.category_color, image ?? existing.image, date ?? existing.date, published ?? existing.published, req.params.id
  )
  res.json({ success: true })
})

app.delete('/api/actualites/:id', (req, res) => {
  db.prepare('DELETE FROM actualites WHERE id = ?').run(req.params.id)
  res.json({ success: true })
})

// ═══════════════════════════════════════
//  REST API — Événements (CRUD)
// ═══════════════════════════════════════

app.get('/api/evenements', (req, res) => {
  const all = req.query.all === '1'
  const rows = all
    ? db.prepare('SELECT * FROM evenements ORDER BY date ASC').all()
    : db.prepare('SELECT * FROM evenements WHERE published = 1 ORDER BY date ASC').all()
  res.json(rows)
})

app.post('/api/evenements', (req, res) => {
  const { title, description, date, time, lieu, category, image, featured } = req.body
  if (!title || !description || !date || !time || !lieu || !category) return res.status(400).json({ error: 'Champs requis manquants' })
  const result = db.prepare('INSERT INTO evenements (title, description, date, time, lieu, category, image, featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').run(title, description, date, time, lieu, category, image || '', featured ? 1 : 0)
  res.json({ success: true, id: result.lastInsertRowid })
})

app.put('/api/evenements/:id', (req, res) => {
  const { title, description, date, time, lieu, category, image, featured, published } = req.body
  const existing = db.prepare('SELECT * FROM evenements WHERE id = ?').get(req.params.id)
  if (!existing) return res.status(404).json({ error: 'Introuvable' })
  db.prepare('UPDATE evenements SET title=?, description=?, date=?, time=?, lieu=?, category=?, image=?, featured=?, published=? WHERE id=?').run(
    title ?? existing.title, description ?? existing.description, date ?? existing.date, time ?? existing.time, lieu ?? existing.lieu, category ?? existing.category, image ?? existing.image, featured ?? existing.featured, published ?? existing.published, req.params.id
  )
  res.json({ success: true })
})

app.delete('/api/evenements/:id', (req, res) => {
  db.prepare('DELETE FROM evenements WHERE id = ?').run(req.params.id)
  res.json({ success: true })
})

// ═══════════════════════════════════════
//  REST API — Alertes (CRUD)
// ═══════════════════════════════════════

app.get('/api/alertes', (req, res) => {
  const activeOnly = req.query.active === '1'
  const rows = activeOnly
    ? db.prepare('SELECT * FROM alertes WHERE active = 1 ORDER BY created_at DESC').all()
    : db.prepare('SELECT * FROM alertes ORDER BY created_at DESC').all()
  res.json(rows)
})

app.post('/api/alertes', (req, res) => {
  const { type, message } = req.body
  if (!message) return res.status(400).json({ error: 'Message requis' })
  const result = db.prepare("INSERT INTO alertes (type, message) VALUES (?, ?)").run(type || 'info', message)
  res.json({ success: true, id: result.lastInsertRowid })
})

app.put('/api/alertes/:id', (req, res) => {
  const { type, message, active } = req.body
  const existing = db.prepare('SELECT * FROM alertes WHERE id = ?').get(req.params.id)
  if (!existing) return res.status(404).json({ error: 'Introuvable' })
  db.prepare('UPDATE alertes SET type=?, message=?, active=? WHERE id=?').run(type ?? existing.type, message ?? existing.message, active ?? existing.active, req.params.id)
  res.json({ success: true })
})

app.delete('/api/alertes/:id', (req, res) => {
  db.prepare('DELETE FROM alertes WHERE id = ?').run(req.params.id)
  res.json({ success: true })
})

// ═══════════════════════════════════════
//  REST API — Admin Stats
// ═══════════════════════════════════════

app.get('/api/admin/stats', (req, res) => {
  const totalDemandes = db.prepare('SELECT COUNT(*) as count FROM demandes').get().count
  const demandesEnCours = db.prepare("SELECT COUNT(*) as count FROM demandes WHERE statut IN ('traitement', 'en_cours')").get().count
  const demandesPretes = db.prepare("SELECT COUNT(*) as count FROM demandes WHERE statut = 'pret'").get().count
  const totalContacts = db.prepare('SELECT COUNT(*) as count FROM contacts').get().count
  const contactsNonLus = db.prepare('SELECT COUNT(*) as count FROM contacts WHERE lu = 0').get().count
  const totalNewsletter = db.prepare('SELECT COUNT(*) as count FROM newsletter WHERE active = 1').get().count
  const totalConversations = db.prepare('SELECT COUNT(*) as count FROM conversations').get().count

  res.json({
    totalDemandes,
    demandesEnCours,
    demandesPretes,
    totalContacts,
    contactsNonLus,
    totalNewsletter,
    totalConversations,
  })
})

// Admin auth (simple)
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body
  if (password === 'admin-gohitafla-2026') {
    res.json({ success: true, token: 'admin-' + Date.now().toString(36) })
  } else {
    res.status(401).json({ error: 'Mot de passe incorrect' })
  }
})

// ═══════════════════════════════════════
//  SOCKET.IO — Temps réel
// ═══════════════════════════════════════

io.on('connection', (socket) => {
  console.log(`[Socket] Connexion: ${socket.id}`)

  socket.on('citizen:request_agent', (data) => {
    const { nom, telephone, sujet } = data
    const convId = 'conv-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6)

    db.prepare(`
      INSERT INTO conversations (id, citizen_name, citizen_phone, subject, status, socket_id)
      VALUES (?, ?, ?, ?, 'waiting', ?)
    `).run(convId, nom, telephone, sujet, socket.id)

    socket.join(convId)
    socket.convId = convId

    socket.emit('citizen:waiting', { conversationId: convId, position: getWaitingCount() })

    io.to('agents-room').emit('agent:new_conversation', {
      id: convId,
      citizen_name: nom,
      citizen_phone: telephone,
      subject: sujet,
      status: 'waiting',
      created_at: new Date().toISOString(),
    })
  })

  socket.on('citizen:message', (data) => {
    const { conversationId, content } = data
    const conv = db.prepare('SELECT * FROM conversations WHERE id = ?').get(conversationId)
    if (!conv) return

    db.prepare(`
      INSERT INTO messages (conversation_id, sender_type, sender_name, content)
      VALUES (?, 'citizen', ?, ?)
    `).run(conversationId, conv.citizen_name, content)

    io.to(conversationId).emit('chat:message', {
      conversationId,
      sender_type: 'citizen',
      sender_name: conv.citizen_name,
      content,
      created_at: new Date().toISOString(),
    })
  })

  socket.on('agent:join', (data) => {
    const { agentId } = data
    socket.join('agents-room')
    socket.agentId = agentId

    db.prepare('UPDATE agents SET is_online = 1, socket_id = ? WHERE id = ?').run(socket.id, agentId)
    io.to('agents-room').emit('agent:online_update', getOnlineAgents())
  })

  socket.on('agent:accept', (data) => {
    const { conversationId, agentId } = data
    const agent = db.prepare('SELECT * FROM agents WHERE id = ?').get(agentId)
    if (!agent) return

    db.prepare("UPDATE conversations SET status = 'active', agent_id = ? WHERE id = ?").run(agentId, conversationId)
    socket.join(conversationId)

    const welcomeMsg = `Bonjour ! Je suis ${agent.nom} du service ${agent.service}. Je prends en charge votre demande.`

    db.prepare(`
      INSERT INTO messages (conversation_id, sender_type, sender_name, content)
      VALUES (?, 'agent', ?, ?)
    `).run(conversationId, agent.nom, welcomeMsg)

    io.to(conversationId).emit('chat:agent_connected', {
      conversationId,
      agent: { id: agent.id, nom: agent.nom, service: agent.service },
    })

    io.to(conversationId).emit('chat:message', {
      conversationId,
      sender_type: 'agent',
      sender_name: agent.nom,
      content: welcomeMsg,
      created_at: new Date().toISOString(),
    })

    io.to('agents-room').emit('agent:conversation_taken', { conversationId, agentId })
  })

  socket.on('agent:message', (data) => {
    const { conversationId, agentId, content } = data
    const agent = db.prepare('SELECT * FROM agents WHERE id = ?').get(agentId)
    if (!agent) return

    db.prepare(`
      INSERT INTO messages (conversation_id, sender_type, sender_name, content)
      VALUES (?, 'agent', ?, ?)
    `).run(conversationId, agent.nom, content)

    io.to(conversationId).emit('chat:message', {
      conversationId,
      sender_type: 'agent',
      sender_name: agent.nom,
      content,
      created_at: new Date().toISOString(),
    })
  })

  socket.on('agent:close', (data) => {
    const { conversationId } = data
    db.prepare("UPDATE conversations SET status = 'closed', closed_at = datetime('now') WHERE id = ?").run(conversationId)
    io.to(conversationId).emit('chat:closed', { conversationId })
    io.to('agents-room').emit('agent:conversation_closed', { conversationId })
  })

  socket.on('agent:typing', (data) => {
    socket.to(data.conversationId).emit('chat:typing', { sender: 'agent' })
  })

  socket.on('citizen:typing', (data) => {
    socket.to(data.conversationId).emit('chat:typing', { sender: 'citizen' })
  })

  socket.on('disconnect', () => {
    if (socket.agentId) {
      db.prepare('UPDATE agents SET is_online = 0, socket_id = NULL WHERE id = ?').run(socket.agentId)
      io.to('agents-room').emit('agent:online_update', getOnlineAgents())
    }
  })
})

function getWaitingCount() {
  return db.prepare("SELECT COUNT(*) as count FROM conversations WHERE status = 'waiting'").get().count
}

function getOnlineAgents() {
  return db.prepare('SELECT id, nom, service FROM agents WHERE is_online = 1').all()
}

const PORT = process.env.PORT || 3001
server.listen(PORT, () => {
  console.log(`\n  Serveur Mairie de Gohitafla`)
  console.log(`  API:    http://localhost:${PORT}`)
  console.log(`  Socket: ws://localhost:${PORT}`)
  console.log(`\n  Admin:  mot de passe "admin-gohitafla-2026"`)
  console.log(`\n  Agents par defaut:`)
  console.log(`  - kouame@mairie-gohitafla.ci / agent123`)
  console.log(`  - adjoua@mairie-gohitafla.ci / agent123\n`)
})
