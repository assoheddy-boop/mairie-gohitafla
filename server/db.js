import Database from 'better-sqlite3'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const db = new Database(join(__dirname, 'mairie.db'))

db.pragma('journal_mode = WAL')

db.exec(`
  CREATE TABLE IF NOT EXISTS agents (
    id TEXT PRIMARY KEY,
    nom TEXT NOT NULL,
    service TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    is_online INTEGER DEFAULT 0,
    socket_id TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS conversations (
    id TEXT PRIMARY KEY,
    citizen_name TEXT NOT NULL,
    citizen_phone TEXT NOT NULL,
    subject TEXT NOT NULL,
    agent_id TEXT,
    status TEXT DEFAULT 'waiting',
    socket_id TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    closed_at TEXT,
    FOREIGN KEY (agent_id) REFERENCES agents(id)
  );

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    conversation_id TEXT NOT NULL,
    sender_type TEXT NOT NULL,
    sender_name TEXT,
    content TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (conversation_id) REFERENCES conversations(id)
  );

  CREATE TABLE IF NOT EXISTS demandes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    reference TEXT UNIQUE NOT NULL,
    document_type TEXT NOT NULL,
    nom_demandeur TEXT NOT NULL,
    prenoms_demandeur TEXT NOT NULL,
    telephone TEXT NOT NULL,
    email TEXT,
    statut TEXT DEFAULT 'traitement',
    form_data TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL,
    email TEXT NOT NULL,
    telephone TEXT,
    sujet TEXT NOT NULL,
    message TEXT NOT NULL,
    lu INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS newsletter (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    demande_ref TEXT,
    type TEXT NOT NULL,
    destinataire TEXT NOT NULL,
    message TEXT NOT NULL,
    envoyee INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS actualites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT,
    category TEXT NOT NULL,
    category_color TEXT DEFAULT 'bg-blue-100 text-blue-700',
    image TEXT,
    date TEXT NOT NULL,
    published INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS evenements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    lieu TEXT NOT NULL,
    category TEXT NOT NULL,
    image TEXT,
    featured INTEGER DEFAULT 0,
    published INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS alertes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL DEFAULT 'info',
    message TEXT NOT NULL,
    active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now'))
  );
`)

const defaultAgents = [
  { id: 'agent-1', nom: 'Kouamé Affoué', service: 'Accueil général', email: 'kouame@mairie-gohitafla.ci', password: 'agent123' },
  { id: 'agent-2', nom: 'Adjoua Koffi', service: 'État civil', email: 'adjoua@mairie-gohitafla.ci', password: 'agent123' },
  { id: 'agent-3', nom: 'Konan Yao', service: 'Service social', email: 'konan@mairie-gohitafla.ci', password: 'agent123' },
  { id: 'agent-4', nom: 'Bamba Siaka', service: 'Secrétariat', email: 'bamba@mairie-gohitafla.ci', password: 'agent123' },
]

const insertAgent = db.prepare(`
  INSERT OR IGNORE INTO agents (id, nom, service, email, password) VALUES (?, ?, ?, ?, ?)
`)

for (const agent of defaultAgents) {
  insertAgent.run(agent.id, agent.nom, agent.service, agent.email, agent.password)
}

export default db
