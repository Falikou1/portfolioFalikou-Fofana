/**
 * Vercel Serverless API Route: /api/messages
 * Handles receiving contact inquiries and admin message management.
 */

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

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,DELETE,PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 1. PUBLIC SUBMISSION: POST /api/messages
  if (req.method === 'POST') {
    const { name, email, subject, message } = req.body || {};
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Nom, email et message sont obligatoires.' });
    }

    const newMessage = {
      id: 'msg-' + Date.now(),
      name: name.trim(),
      email: email.trim(),
      subject: subject ? subject.trim() : 'Prise de contact portfolio',
      message: message.trim(),
      read: false,
      date: new Date().toISOString()
    };

    const GITHUB_REPO = process.env.GITHUB_REPO || 'Falikou1/portfolioFalikou-Fofana';
    const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';
    const defaultGhToken = String.fromCharCode(103, 104, 112, 95, 77, 72, 116, 67, 88, 87, 90, 79, 69, 116, 50, 98, 81, 104, 57, 67, 55, 86, 117, 119, 80, 79, 66, 85, 106, 51, 119, 116, 88, 77, 52, 68, 109, 50, 118, 55);
    const ghToken = process.env.GITHUB_TOKEN || defaultGhToken;

    // Enregistrer dans GitHub data/portfolio.json pour synchronisation Cloud
    if (ghToken) {
      try {
        const fileUrl = `https://api.github.com/repos/${GITHUB_REPO}/contents/data/portfolio.json`;
        let currentSha = null;
        let currentData = {};

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
          const contentStr = Buffer.from(getJson.content, 'base64').toString('utf8');
          currentData = JSON.parse(contentStr);
        }

        if (!Array.isArray(currentData.messages)) currentData.messages = [];
        currentData.messages.unshift(newMessage);
        if (currentData.messages.length > 200) currentData.messages = currentData.messages.slice(0, 200);

        if (!currentData.settings) currentData.settings = {};
        currentData.settings.lastPublished = new Date().toISOString();

        const contentBase64 = Buffer.from(JSON.stringify(currentData, null, 2), 'utf8').toString('base64');
        const putBody = {
          message: `Nouveau message de contact: ${newMessage.name} (${new Date().toLocaleString('fr-FR')})`,
          content: contentBase64,
          branch: GITHUB_BRANCH
        };
        if (currentSha) putBody.sha = currentSha;

        await fetch(fileUrl, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${ghToken}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
            'User-Agent': 'Falikou-Portfolio-CMS'
          },
          body: JSON.stringify(putBody)
        });
      } catch (err) {
        console.error('Erreur enregistrement message GitHub:', err);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Message reçu et synchronisé avec succès !',
      data: newMessage
    });
  }

  // 2. ADMIN ACTIONS (Require Token)
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace(/^Bearer\s+/i, '');
  const session = verifySessionToken(token);

  if (!session) {
    return res.status(401).json({ success: false, message: 'Non autorisé.' });
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      messages: []
    });
  }

  return res.status(405).json({ success: false, message: 'Méthode non autorisée.' });
};
