import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createDefaultDatabaseState } from './src/data/initialData';
import { DatabaseState } from './src/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.env.NODE_ENV === 'production';
const PORT = parseInt(process.env.PORT || '3000', 10);

const app = express();

// Increase JSON body limit for database state with media/photos
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// CORS & Security headers to allow public and multi-device access
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Path to persistent data storage on server
const DATA_DIR = path.resolve(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'database.json');

// Ensure directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

let cachedState: DatabaseState | null = null;
let stateVersion = Date.now();
let lastUpdated = new Date().toISOString();

// Active SSE client connections
const sseClients = new Set<express.Response>();

function broadcastUpdate(version: number) {
  const payload = `data: ${JSON.stringify({ type: 'DB_UPDATE', version, timestamp: lastUpdated })}\n\n`;
  for (const client of sseClients) {
    try {
      client.write(payload);
    } catch {
      sseClients.delete(client);
    }
  }
}

// Load database state from disk or initialize
function getDatabaseState(): DatabaseState {
  if (cachedState) return cachedState;

  if (fs.existsSync(DATA_FILE)) {
    try {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (parsed && parsed.settings && parsed.users) {
        cachedState = parsed;
        return cachedState!;
      }
    } catch (e) {
      console.error('[Server] Failed to read database.json, generating default state...', e);
    }
  }

  // Generate initial default database
  console.log('[Server] Initializing default database with 60 accounts and settings...');
  cachedState = createDefaultDatabaseState();
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(cachedState, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Server] Failed to write initial database to disk:', err);
  }

  return cachedState;
}

function persistDatabaseState(state: DatabaseState): boolean {
  cachedState = state;
  stateVersion = Date.now();
  lastUpdated = new Date().toISOString();

  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(state, null, 2), 'utf-8');
    broadcastUpdate(stateVersion);
    return true;
  } catch (err) {
    console.error('[Server] Failed to persist database state:', err);
    return false;
  }
}

// Ensure state is loaded at startup
getDatabaseState();

// --- API ROUTES ---

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    version: stateVersion,
    lastUpdated,
    activeConnections: sseClients.size
  });
});

// Version check for fast polling fallback
app.get('/api/version', (req, res) => {
  res.json({
    version: stateVersion,
    lastUpdated
  });
});

// Retrieve centralized database state for all users and links
app.get('/api/state', (req, res) => {
  try {
    const state = getDatabaseState();
    res.json({
      success: true,
      version: stateVersion,
      lastUpdated,
      data: state
    });
  } catch (e) {
    console.error('[Server] Error fetching state:', e);
    res.status(500).json({ success: false, error: 'Gagal memuat basis data' });
  }
});

// Save updated database state (called by Admin or Teacher upon changes)
app.post('/api/state', (req, res) => {
  try {
    const incomingData: DatabaseState = req.body.data || req.body;
    if (!incomingData || !incomingData.settings || !incomingData.users) {
      return res.status(400).json({ success: false, error: 'Payload data tidak valid' });
    }

    const saved = persistDatabaseState(incomingData);
    if (!saved) {
      return res.status(500).json({ success: false, error: 'Gagal menyimpan ke penyimpanan server' });
    }

    console.log(`[Server] State updated successfully. Version: ${stateVersion}, Broadcast to ${sseClients.size} clients.`);
    res.json({
      success: true,
      version: stateVersion,
      lastUpdated
    });
  } catch (e) {
    console.error('[Server] Error updating state:', e);
    res.status(500).json({ success: false, error: 'Gagal menyimpan perubahan' });
  }
});

// Server-Sent Events (SSE) for real-time automatic synchronization
app.get('/api/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no'); // Disable buffering for Nginx/proxies

  // Send initial connection handshake
  res.write(`data: ${JSON.stringify({ type: 'CONNECTED', version: stateVersion, timestamp: lastUpdated })}\n\n`);

  sseClients.add(res);

  // Keep-alive heartbeat every 20 seconds
  const heartbeat = setInterval(() => {
    try {
      res.write(': heartbeat\n\n');
    } catch {
      clearInterval(heartbeat);
      sseClients.delete(res);
    }
  }, 20000);

  req.on('close', () => {
    clearInterval(heartbeat);
    sseClients.delete(res);
  });
});

// --- VITE DEV MIDDLEWARE OR PRODUCTION STATIC SERVING ---
async function startServer() {
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    } else {
      console.warn('[Server] dist directory not found, mounting vite in fallback mode');
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa'
      });
      app.use(vite.middlewares);
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] MDTU Nurul Hidayah Server berjalan di http://0.0.0.0:${PORT}`);
    console.log(`[Server] Mode: ${isProduction ? 'Production' : 'Development'}`);
    console.log(`[Server] Data file: ${DATA_FILE}`);
  });
}

startServer().catch((err) => {
  console.error('[Server] Gagal menjalankan server:', err);
  process.exit(1);
});
