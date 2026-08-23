/**
 * Vercel Serverless API Route: /api/upload
 * Handles Media Library image upload and storage.
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
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace(/^Bearer\s+/i, '');
  const session = verifySessionToken(token);

  if (!session) {
    return res.status(401).json({ success: false, message: 'Non autorisé.' });
  }

  if (req.method === 'POST') {
    const { name = 'image', dataUri, size = 'N/A' } = req.body || {};
    if (!dataUri) {
      return res.status(400).json({ success: false, message: 'Image base64 requise.' });
    }

    const id = 'media-' + Date.now();
    const mediaItem = {
      id,
      name,
      url: dataUri,
      type: 'image',
      size: size,
      uploadedAt: new Date().toISOString()
    };

    return res.status(200).json({
      success: true,
      message: 'Image importée avec succès !',
      mediaItem
    });
  }

  return res.status(405).json({ success: false, message: 'Méthode non supportée.' });
};
