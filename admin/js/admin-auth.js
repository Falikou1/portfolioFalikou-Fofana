/**
 * FALIKOU FOFANA — ADMIN AUTHENTICATION CONTROLLER
 * Manages JWT session tokens, login verification, logout, and protected route redirection.
 */

(function () {
  'use strict';

  const TOKEN_KEY = 'falikou_admin_token';
  const USER_KEY = 'falikou_admin_user';

  window.AdminAuth = {
    getToken() {
      return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
    },

    getUser() {
      const u = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
      return u ? JSON.parse(u) : { name: 'Falikou FOFANA', role: 'admin' };
    },

    setSession(token, user, remember = true) {
      if (remember) {
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
      } else {
        sessionStorage.setItem(TOKEN_KEY, token);
        sessionStorage.setItem(USER_KEY, JSON.stringify(user));
      }
    },

    clearSession() {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      sessionStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(USER_KEY);
    },

    async checkAuth(redirectToLogin = true) {
      const token = this.getToken();
      if (!token) {
        if (redirectToLogin && !window.location.pathname.includes('login.html')) {
          window.location.href = 'login.html';
        }
        return false;
      }

      try {
        const endpoint = window.location.pathname.includes('/portfolio/')
          ? '../api/index.php?route=auth&action=verify'
          : '/api/auth?action=verify';

        const res = await fetch(endpoint, {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.ok) {
          const json = await res.json();
          return json.authenticated === true;
        } else {
          // If server rejects token, clear session
          this.clearSession();
          if (redirectToLogin && !window.location.pathname.includes('login.html')) {
            window.location.href = 'login.html';
          }
          return false;
        }
      } catch (err) {
        // In offline/mock mode, verify token structure locally
        if (token && token.includes('.')) {
          return true;
        }
        return false;
      }
    },

    async login(password, remember = true) {
      try {
        const endpoint = window.location.pathname.includes('/portfolio/')
          ? '../api/index.php?route=auth&action=login'
          : '/api/auth?action=login';

        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'login', password })
        });

        const data = await res.json();
        if (res.ok && data.success) {
          this.setSession(data.token, data.user, remember);
          return { success: true, message: data.message };
        } else {
          return { success: false, message: data.message || 'Mot de passe incorrect.' };
        }
      } catch (err) {
        // Fallback for local static testing with master password
        if (password === 'admin123' || password === 'Falikou@2026!' || password === 'admin') {
          const mockToken = btoa(JSON.stringify({ user: 'Falikou', role: 'admin', exp: Date.now() + 86400000 })) + '.mock_sig';
          this.setSession(mockToken, { name: 'Falikou FOFANA', role: 'admin' }, remember);
          return { success: true, message: 'Connexion réussie.' };
        }
        return { success: false, message: 'Erreur réseau ou mot de passe invalide.' };
      }
    },

    logout() {
      this.clearSession();
      window.location.href = 'login.html';
    }
  };
})();
