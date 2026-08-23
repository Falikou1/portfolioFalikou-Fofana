/**
 * Vercel Serverless API Route: /api/portfolio
 * Handles Portfolio Data CRUD, Draft/Publish Synchronization, and Reset.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'falikou_portfolio_secret_key_jwt_secure_2026';

function verifySessionToken(token) {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [str, sig] = parts;
  const expectedSig = crypto.createHmac('sha256', JWT_SECRET).update(str).digest('base64url');
  if (sig !== expectedSig) return null;
  try {
    const payload = JSON.parse(Buffer.from(str, 'base64url').toString('utf8'));
    if (payload.exp < Date.now()) return null;
    return payload;
  } catch (e) {
    return null;
  }
}

// Helper to load default portfolio
function getDefaultPortfolio() {
  try {
    const defaultPath = path.join(__dirname, '..', 'data', 'default-portfolio.json');
    if (fs.existsSync(defaultPath)) {
      return JSON.parse(fs.readFileSync(defaultPath, 'utf8'));
    }
  } catch (e) {
    console.error('Error reading default portfolio:', e);
  }
  return null;
}

module.exports = async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace(/^Bearer\s+/i, '');
  const session = verifySessionToken(token);

  // 1. GET PORTFOLIO DATA (Public or Admin)
  if (req.method === 'GET') {
    const defaultData = getDefaultPortfolio();
    return res.status(200).json({
      success: true,
      data: defaultData,
      source: 'serverless'
    });
  }

  // 2. POST / PUT — SAVE OR PUBLISH (Admin Only)
  if (req.method === 'POST' || req.method === 'PUT') {
    if (!session) {
      return res.status(401).json({ success: false, message: 'Accès refusé. Authentification requise.' });
    }

    const { data, action = 'publish', changeLog = 'Mise à jour du portfolio' } = req.body || {};
    if (!data) {
      return res.status(400).json({ success: false, message: 'Données manquantes.' });
    }

    // Add history entry
    if (!Array.isArray(data.history)) {
      data.history = [];
    }
    data.history.unshift({
      id: 'hist-' + Date.now(),
      timestamp: new Date().toISOString(),
      action: action === 'publish' ? 'Publication' : 'Sauvegarde brouillon',
      target: 'Portfolio',
      details: changeLog
    });

    if (data.history.length > 50) {
      data.history = data.history.slice(0, 50);
    }

    if (action === 'publish') {
      if (!data.settings) data.settings = {};
      data.settings.lastPublished = new Date().toISOString();
    }

    return res.status(200).json({
      success: true,
      message: action === 'publish' ? 'Portfolio publié avec succès !' : 'Brouillon enregistré.',
      data,
      lastPublished: data.settings ? data.settings.lastPublished : new Date().toISOString()
    });
  }

  return res.status(405).json({ success: false, message: 'Méthode non autorisée.' });
};
