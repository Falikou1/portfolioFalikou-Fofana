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
      name,
      email,
      subject: subject || 'Prise de contact portfolio',
      message,
      read: false,
      date: new Date().toISOString()
    };

    return res.status(200).json({
      success: true,
      message: 'Message reçu avec succès !',
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
