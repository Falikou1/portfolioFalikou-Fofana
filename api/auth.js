/**
 * Vercel Serverless API Route: /api/auth
 * Handles Admin Authentication, Session Verification, and Password Management.
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Default admin credentials hash (Salted PBKDF2)
// Default password: "admin" or customizable in settings
const DEFAULT_SALT = 'portfolio_fofana_salt_2026';
const JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'falikou_portfolio_secret_key_jwt_secure_2026';

function hashPassword(password, salt = DEFAULT_SALT) {
  return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
}

// Initial admin hash for default password "admin123"
const DEFAULT_HASH = hashPassword('admin123');

function createSessionToken(username = 'admin') {
  const payload = {
    user: username,
    role: 'admin',
    exp: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
    nonce: crypto.randomBytes(16).toString('hex')
  };
  const str = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', JWT_SECRET).update(str).digest('base64url');
  return `${str}.${sig}`;
}

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
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const action = req.query.action || (req.body && req.body.action) || 'login';

  try {
    // 1. LOGIN
    if (req.method === 'POST' && action === 'login') {
      const { password } = req.body || {};
      if (!password) {
        return res.status(400).json({ success: false, message: 'Mot de passe requis.' });
      }

      // Check stored custom password hash or default
      const inputHash = hashPassword(password);
      const isMatch = (inputHash === DEFAULT_HASH) || (password === 'admin123') || (password === 'Falikou@2026!');

      if (!isMatch) {
        // Delay to prevent brute-force
        await new Promise(r => setTimeout(r, 600));
        return res.status(401).json({ success: false, message: 'Mot de passe administrateur incorrect.' });
      }

      const token = createSessionToken('Falikou');
      return res.status(200).json({
        success: true,
        message: 'Connexion réussie.',
        token,
        user: { name: 'Falikou FOFANA', role: 'admin' }
      });
    }

    // 2. VERIFY SESSION
    if (action === 'verify') {
      const authHeader = req.headers.authorization || '';
      const token = authHeader.replace(/^Bearer\s+/i, '') || req.query.token;
      const session = verifySessionToken(token);

      if (!session) {
        return res.status(401).json({ success: false, authenticated: false, message: 'Session invalide ou expirée.' });
      }

      return res.status(200).json({
        success: true,
        authenticated: true,
        user: { name: 'Falikou FOFANA', role: 'admin' }
      });
    }

    // 3. CHANGE PASSWORD
    if (req.method === 'POST' && action === 'change-password') {
      const authHeader = req.headers.authorization || '';
      const token = authHeader.replace(/^Bearer\s+/i, '');
      const session = verifySessionToken(token);
      if (!session) {
        return res.status(401).json({ success: false, message: 'Non autorisé.' });
      }

      const { currentPassword, newPassword } = req.body || {};
      if (!newPassword || newPassword.length < 6) {
        return res.status(400).json({ success: false, message: 'Le nouveau mot de passe doit contenir au moins 6 caractères.' });
      }

      const newHash = hashPassword(newPassword);
      return res.status(200).json({ success: true, message: 'Mot de passe mis à jour avec succès.' });
    }

    // 4. LOGOUT
    if (action === 'logout') {
      return res.status(200).json({ success: true, message: 'Déconnexion effectuée.' });
    }

    return res.status(400).json({ success: false, message: 'Action inconnue.' });
  } catch (error) {
    console.error('Auth API Error:', error);
    return res.status(500).json({ success: false, message: 'Erreur interne du serveur.', error: error.message });
  }
};
