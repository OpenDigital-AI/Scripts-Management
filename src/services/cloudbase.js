
import cloudbase from '@cloudbase/js-sdk';
import { validateEmail, validatePassword, sanitizeInput } from '../utils/validation';

class CloudbaseService {
  constructor() {
    this.app = null;
    this.auth = null;
    this.db = null;
    this.isInitialized = false;
    this.currentUsername = null;

    this.sessionTTLMinutes = 60 * 4; // default 4 hours for testing
    this.SESSION_EXPIRES_AT_KEY = 'app_session_expires_at';
    this.SESSION_TTL_KEY = 'app_session_ttl_minutes';
    this._expiryWatchId = null;
  }

  init(config = {}) {
    try {
      if (!config || !config.env || typeof config.env !== 'string') {
        throw new Error('Invalid environment configuration');
      }

      const envId = config.env.trim();
      if (envId === 'your-env-id' || envId.length === 0) {
        throw new Error('Environment ID not configured');
      }

      if (!/^[a-zA-Z0-9-]+$/.test(envId)) {
        throw new Error('Invalid environment ID format');
      }

      this.app = cloudbase.init({ env: envId, region: config.region || 'ap-shanghai' });
      this.auth = this.app.auth({ persistence: 'local' });
      this.db = this.app.database();

      if (typeof config.sessionTTLMinutes === 'number' && config.sessionTTLMinutes > 0) {
        this.sessionTTLMinutes = config.sessionTTLMinutes;
      }

      try { localStorage.setItem(this.SESSION_TTL_KEY, String(this.sessionTTLMinutes)); } catch (e) {}

      this.isInitialized = true;
      // start the expiry watcher so the app will auto-logout when TTL is reached
      try { this._startExpiryWatcher(); } catch (e) {}
      return { success: true };
    } catch (error) {
      console.error('Cloudbase initialization error:', error);
      this.isInitialized = false;
      return { success: false, error: 'Failed to initialize authentication service' };
    }
  }

  checkInitialized() {
    if (!this.isInitialized || !this.auth) return { success: false, error: 'Service not initialized' };
    return { success: true };
  }

  _setSessionExpiry(ttlMinutes) {
    try {
      const now = Date.now();
      const expiresAt = now + (Number(ttlMinutes) || 0) * 60 * 1000;
      localStorage.setItem(this.SESSION_EXPIRES_AT_KEY, String(expiresAt));
      // ensure watcher is running so expiry is detected
      try { this._startExpiryWatcher(); } catch (e) {}
    } catch (e) { console.warn('Could not persist session expiry:', e); }
  }

  // Start periodic watcher to auto-logout when session expires
  _startExpiryWatcher(intervalSeconds = 15) {
    try {
      if (this._expiryWatchId) return; // already running
      this._expiryWatchId = setInterval(async () => {
        try {
          // Only act if an expiry timestamp exists
          const expiresAt = this.getSessionExpiryTimestamp();
          if (!expiresAt) return; // no active session, skip
          if (Date.now() >= expiresAt) {
            await this.logout();
            try { window.dispatchEvent(new CustomEvent('session-expired')); } catch (e) {}
            this._stopExpiryWatcher();
          }
        } catch (e) {
          console.warn('Expiry watcher error:', e);
        }
      }, (Number(intervalSeconds) || 15) * 1000);
    } catch (e) {
      console.warn('Could not start expiry watcher:', e);
    }
  }

  _stopExpiryWatcher() {
    try {
      if (this._expiryWatchId) {
        clearInterval(this._expiryWatchId);
        this._expiryWatchId = null;
      }
    } catch (e) { /* ignore */ }
  }

  _clearSessionExpiry() { try { localStorage.removeItem(this.SESSION_EXPIRES_AT_KEY); } catch (e) {} }

  isSessionValid() {
    try {
      const v = localStorage.getItem(this.SESSION_EXPIRES_AT_KEY);
      if (!v) return false;
      const expiresAt = parseInt(v, 10);
      if (Number.isNaN(expiresAt)) return false;
      return Date.now() < expiresAt;
    } catch (e) { return false; }
  }

  setSessionTTL(minutes) {
    const m = Number(minutes);
    if (!Number.isNaN(m) && m > 0) {
      this.sessionTTLMinutes = m;
      try { localStorage.setItem(this.SESSION_TTL_KEY, String(m)); } catch (e) {}
      return true;
    }
    return false;
  }

  getSessionExpiryTimestamp() {
    try { const v = localStorage.getItem(this.SESSION_EXPIRES_AT_KEY); return v ? parseInt(v, 10) : null; } catch (e) { return null; }
  }

  async loginWithEmail(email, password) {
    const initCheck = this.checkInitialized(); if (!initCheck.success) return initCheck;
    const sanitizedEmail = sanitizeInput(email);
    const emailValidation = validateEmail(sanitizedEmail);
    if (!emailValidation.valid) return { success: false, error: 'Invalid email format' };
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) return { success: false, error: 'Invalid password' };
    try {
      await this.auth.signInWithEmail(sanitizedEmail, password);
      this.currentUsername = sanitizedEmail;
      this._setSessionExpiry(this.sessionTTLMinutes);
      try { this._startExpiryWatcher(); } catch (e) {}
      const loginState = await this.auth.getLoginState();
      return { success: true, user: loginState };
    } catch (error) { console.error('Email login error:', error); return { success: false, error: 'Authentication failed' }; }
  }

  async loginWithUsernameAndPassword(username, password) {
    const initCheck = this.checkInitialized(); if (!initCheck.success) return initCheck;
    const sanitizedUsername = sanitizeInput(username);
    if (!sanitizedUsername || sanitizedUsername.length < 3) return { success: false, error: 'Invalid username' };
    if (sanitizedUsername.length > 50) return { success: false, error: 'Username too long' };
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) return { success: false, error: 'Invalid password' };
    try {
      await this.auth.signIn({ username: sanitizedUsername, password });
      this.currentUsername = sanitizedUsername;
      this._setSessionExpiry(this.sessionTTLMinutes);
      try { this._startExpiryWatcher(); } catch (e) {}
      const loginState = await this.auth.getLoginState();
      return { success: true, user: loginState };
    } catch (error) { console.error('Login error:', error); return { success: false, error: 'Authentication failed' }; }
  }

  async getLoginState() {
    const initCheck = this.checkInitialized(); if (!initCheck.success) return initCheck;
    try {
      if (!this.isSessionValid()) { try { await this.logout(); } catch (e) {} return { success: true, isLoggedIn: false, user: null }; }
      const loginState = await this.auth.getLoginState();
      if (loginState && this.currentUsername) {
        return { success: true, isLoggedIn: !!loginState, user: { ...loginState, username: this.currentUsername, nickname: loginState.nickName || loginState.nickname || this.currentUsername } };
      }
      return { success: true, isLoggedIn: !!loginState, user: loginState };
    } catch (error) { console.error('Get login state error:', error); return { success: false, error: 'Failed to get login state' }; }
  }

  async logout() { const initCheck = this.checkInitialized(); if (!initCheck.success) return initCheck; try { await this.auth.signOut(); this.currentUsername = null; this._clearSessionExpiry(); try { this._stopExpiryWatcher(); } catch (e) {} return { success: true }; } catch (error) { console.error('Logout error:', error); return { success: false, error: 'Logout failed' }; } }

  async register(email, password) {
    const initCheck = this.checkInitialized(); if (!initCheck.success) return initCheck;
    const sanitizedEmail = sanitizeInput(email);
    const emailValidation = validateEmail(sanitizedEmail);
    if (!emailValidation.valid) return { success: false, error: emailValidation.error };
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) return { success: false, error: passwordValidation.error };
    try { await this.auth.signUp(sanitizedEmail, password); return { success: true }; } catch (error) { console.error('Registration error:', error); return { success: false, error: 'Registration failed' }; }
  }

  getDatabase() { if (!this.db) { console.warn('Database instance not initialized'); return null; } return this.db; }

  async getResources() {
    const initCheck = this.checkInitialized(); if (!initCheck.success) return initCheck;
    try {
      const db = this.getDatabase(); if (!db) return { success: false, error: 'Database not initialized' };
      const loginState = await this.auth.getLoginState(); if (!loginState) return { success: false, error: 'Not authenticated', data: [] };
      const collection = db.collection('resource259');
      const res = await collection.limit(100).get();
      return { success: true, data: res.data || [] };
    } catch (error) {
      console.error('Get resources error:', error);
      if (error && error.code === 'DATABASE_COLLECTION_NOT_EXIST') return { success: false, error: 'Collection "resource259" does not exist. Please create it in Cloudbase console.', errorCode: 'COLLECTION_NOT_EXIST', data: [] };
      if (error && (error.code === 'PERMISSION_DENIED' || (error.message && error.message.includes('permission')))) return { success: false, error: 'Database permission denied. Check security rules in Cloudbase console.', data: [] };
      return { success: false, error: `Failed to fetch resources: ${error && error.message ? error.message : 'Unknown error'}`, data: [] };
    }
  }

  async getTempFileURLs(fileList) {
    try {
      if (!this.isInitialized || !this.app) throw new Error('Cloudbase not initialized');
      if (!fileList || !Array.isArray(fileList) || fileList.length === 0) return { success: true, fileList: [] };
      const result = await this.app.getTempFileURL({ fileList });
      return { success: true, fileList: result.fileList || [] };
    } catch (error) { console.error('Get temp file URL error:', error); return { success: false, error: error && error.message ? error.message : 'Failed to get download URLs', fileList: [] }; }
  }
}

export default new CloudbaseService();
