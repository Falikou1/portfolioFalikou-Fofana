/**
 * Vercel Serverless API Route: /api/portfolio
 * Handles Portfolio Data CRUD, Multi-Device Synchronization & Persistent Storage.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'falikou_portfolio_secret_key_jwt_secure_2026';
const GITHUB_REPO = process.env.GITHUB_REPO || 'Falikou1/portfolioFalikou-Fofana';
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';

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

// Helper to load portfolio data from file or GitHub raw fallback
function getPortfolioData() {
  try {
    const customPath = path.join(__dirname, '..', 'data', 'portfolio.json');
    if (fs.existsSync(customPath)) {
      return JSON.parse(fs.readFileSync(customPath, 'utf8'));
    }
  } catch (e) {}

  try {
    const defaultPath = path.join(__dirname, '..', 'data', 'default-portfolio.json');
    if (fs.existsSync(defaultPath)) {
      return JSON.parse(fs.readFileSync(defaultPath, 'utf8'));
    }
  } catch (e) {}

  return null;
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 1. GET PORTFOLIO DATA (Public access from any mobile phone or browser)
  if (req.method === 'GET') {
    let data = getPortfolioData();

    // If running in Vercel and local file is default, try fetching latest raw GitHub JSON
    if (!data || !data.settings || !data.settings.lastPublished) {
      try {
        const rawUrl = `https://raw.githubusercontent.com/${GITHUB_REPO}/${GITHUB_BRANCH}/data/portfolio.json?t=${Date.now()}`;
        const rawRes = await fetch(rawUrl, { cache: 'no-cache' });
        if (rawRes.ok) {
          const rawJson = await rawRes.json();
          if (rawJson && (rawJson.profile || rawJson.sections)) {
            data = rawJson;
          }
        }
      } catch (_) {}
    }

    return res.status(200).json({
      success: true,
      data: data || {},
      source: 'serverless'
    });
  }

  // 2. POST / PUT — SAVE OR PUBLISH (Admin Only)
  if (req.method === 'POST' || req.method === 'PUT') {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.replace(/^Bearer\s+/i, '');
    const session = verifySessionToken(token);

    const isLocal = (req.headers.host && (req.headers.host.includes('localhost') || req.headers.host.includes('127.0.0.1')));
    if (!session && !isLocal) {
      return res.status(401).json({ success: false, message: 'Accès refusé. Authentification requise.' });
    }

    const { data, action = 'publish', changeLog = 'Mise à jour du portfolio', githubToken } = req.body || {};
    if (!data) {
      return res.status(400).json({ success: false, message: 'Données manquantes.' });
    }

    // Add history entry
    if (!Array.isArray(data.history)) data.history = [];
    data.history.unshift({
      id: 'hist-' + Date.now(),
      timestamp: new Date().toISOString(),
      action: action === 'publish' ? 'Publication' : 'Sauvegarde brouillon',
      target: 'Portfolio',
      details: changeLog
    });
    if (data.history.length > 50) data.history = data.history.slice(0, 50);

    if (action === 'publish') {
      if (!data.settings) data.settings = {};
      data.settings.lastPublished = new Date().toISOString();
    }

    // Try writing to local data/portfolio.json
    try {
      const dataFilePath = path.join(__dirname, '..', 'data', 'portfolio.json');
      fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (_) {}

    // Optional direct GitHub commit
    const ghToken = githubToken || process.env.GITHUB_TOKEN;
    let githubResult = null;
    if (ghToken && action === 'publish') {
      try {
        const fileUrl = `https://api.github.com/repos/${GITHUB_REPO}/contents/data/portfolio.json`;
        let currentSha = null;
        const getRes = await fetch(fileUrl, {
          headers: {
            'Authorization': `Bearer ${ghToken}`,
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'Falikou-Portfolio-CMS'
          }
        });
        if (getRes.ok) {
          const getJson = await getRes.json();
          currentSha = getJson.sha;
        }

        const contentBase64 = Buffer.from(JSON.stringify(data, null, 2), 'utf8').toString('base64');
        const putBody = {
          message: `CMS: ${changeLog}`,
          content: contentBase64,
          branch: GITHUB_BRANCH
        };
        if (currentSha) putBody.sha = currentSha;

        const putRes = await fetch(fileUrl, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${ghToken}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
            'User-Agent': 'Falikou-Portfolio-CMS'
          },
          body: JSON.stringify(putBody)
        });

        if (putRes.ok) {
          githubResult = { success: true, message: 'Commit GitHub réussi !' };
        }
      } catch (e) {
        githubResult = { success: false, message: e.message };
      }
    }

    return res.status(200).json({
      success: true,
      message: action === 'publish' ? 'Portfolio publié et synchronisé avec succès !' : 'Brouillon enregistré.',
      data,
      github: githubResult,
      lastPublished: data.settings ? data.settings.lastPublished : new Date().toISOString()
    });
  }

  return res.status(405).json({ success: false, message: 'Méthode non autorisée.' });
};
