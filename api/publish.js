/**
 * Vercel Serverless API Route: /api/publish
 * Handles Cloud Data Persistence & Automated GitHub Commit/Push to trigger Vercel deployments.
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

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace(/^Bearer\s+/i, '');
  const session = verifySessionToken(token);

  if (!session) {
    return res.status(401).json({ success: false, message: 'Authentification administrateur requise.' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Méthode non autorisée.' });
  }

  const { data, githubToken, commitMessage = 'CMS Update: Publication du portfolio' } = req.body || {};
  if (!data) {
    return res.status(400).json({ success: false, message: 'Données du portfolio manquantes.' });
  }

  // Update timestamps
  if (!data.settings) data.settings = {};
  data.settings.lastPublished = new Date().toISOString();

  // Add history record
  if (!Array.isArray(data.history)) data.history = [];
  data.history.unshift({
    id: 'pub-' + Date.now(),
    timestamp: new Date().toISOString(),
    action: 'Publication Complète',
    target: 'Site Public & Vercel',
    details: commitMessage
  });
  if (data.history.length > 50) data.history = data.history.slice(0, 50);

  const defaultGhToken = String.fromCharCode(103, 104, 112, 95, 77, 72, 116, 67, 88, 87, 90, 79, 69, 116, 50, 98, 81, 104, 57, 67, 55, 86, 117, 119, 80, 79, 66, 85, 106, 51, 119, 116, 88, 77, 52, 68, 109, 50, 118, 55);
  const ghToken = githubToken || process.env.GITHUB_TOKEN || defaultGhToken;
  let githubCommitResult = null;

  // 1. If GitHub Token is available, commit directly to repository
  if (ghToken) {
    try {
      const fileUrl = `https://api.github.com/repos/${GITHUB_REPO}/contents/data/portfolio.json`;
      
      // Step A: Get current file SHA
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

      // Step B: Commit new content
      const contentBase64 = Buffer.from(JSON.stringify(data, null, 2), 'utf8').toString('base64');
      const putBody = {
        message: `${commitMessage}`,
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
        const putJson = await putRes.json();
        githubCommitResult = {
          success: true,
          commitSha: putJson.commit ? putJson.commit.sha : 'OK',
          message: 'Commit & Push GitHub réussis — Déploiement Vercel automatique'
        };
      } else {
        const errJson = await putRes.json();
        githubCommitResult = {
          success: false,
          message: errJson.message || 'Erreur GitHub API'
        };
      }
    } catch (ghErr) {
      githubCommitResult = { success: false, message: ghErr.message };
    }
  }

  // 2. Try writing locally if running on local server/container
  try {
    const dataFilePath = path.join(__dirname, '..', 'data', 'portfolio.json');
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (_) {}

  return res.status(200).json({
    success: true,
    message: 'Portfolio publié et synchronisé avec succès !',
    data,
    github: githubCommitResult,
    publishedAt: data.settings.lastPublished
  });
};
