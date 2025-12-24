import cloudbase from '@cloudbase/js-sdk';
import { validateEmail, validatePassword, sanitizeInput } from '../utils/validation';

class CloudbaseService {
  constructor() {
    this.app = null;
    this.auth = null;
    this.isInitialized = false;
  }

  // Initialize Cloudbase
  init(config) {
    try {
      // Validate environment ID
      if (!config || !config.env || typeof config.env !== 'string') {
        throw new Error('Invalid environment configuration');
      }

      const envId = config.env.trim();
      
      if (envId === 'your-env-id' || envId.length === 0) {
        throw new Error('Environment ID not configured');
      }

      // Basic format validation for environment ID
      if (!/^[a-zA-Z0-9-]+$/.test(envId)) {
        throw new Error('Invalid environment ID format');
      }

      this.app = cloudbase.init({
        env: envId,
      });
      this.auth = this.app.auth({
        persistence: 'local',
      });
      
      // Debug: Log available auth methods
      console.log('Available auth methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(this.auth)).filter(name => name.includes('sign')));
      
      this.isInitialized = true;
      return { success: true };
    } catch (error) {
      console.error('Cloudbase initialization error:', error);
      this.isInitialized = false;
      return { success: false, error: 'Failed to initialize authentication service' };
    }
  }

  // Check if service is initialized
  checkInitialized() {
    if (!this.isInitialized || !this.auth) {
      return { success: false, error: 'Service not initialized' };
    }
    return { success: true };
  }

  // Anonymous login
  async loginAnonymously() {
    const initCheck = this.checkInitialized();
    if (!initCheck.success) {
      return initCheck;
    }

    try {
      // SDK v2+ uses signInAnonymously instead of anonymousAuthProvider
      await this.auth.signInAnonymously();
      const loginState = await this.auth.getLoginState();
      return { success: true, user: loginState };
    } catch (error) {
      console.error('Anonymous login error:', error);
      return { success: false, error: 'Anonymous login failed' };
    }
  }

  // Email login
  async loginWithEmail(email, password) {
    const initCheck = this.checkInitialized();
    if (!initCheck.success) {
      return initCheck;
    }

    // Validate inputs
    const sanitizedEmail = sanitizeInput(email);
    const emailValidation = validateEmail(sanitizedEmail);
    
    if (!emailValidation.valid) {
      return { success: false, error: 'Invalid email format' };
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return { success: false, error: 'Invalid password' };
    }

    try {
      // SDK v2+ uses signInWithEmail directly
      await this.auth.signInWithEmail(sanitizedEmail, password);
      const loginState = await this.auth.getLoginState();
      return { success: true, user: loginState };
    } catch (error) {
      console.error('Email login error:', error);
      return { success: false, error: 'Authentication failed' };
    }
  }

  // Username and password login
  async loginWithUsernameAndPassword(username, password) {
    const initCheck = this.checkInitialized();
    if (!initCheck.success) {
      return initCheck;
    }

    // Validate inputs
    const sanitizedUsername = sanitizeInput(username);
    
    if (!sanitizedUsername || sanitizedUsername.length < 3) {
      return { success: false, error: 'Invalid username' };
    }

    if (sanitizedUsername.length > 50) {
      return { success: false, error: 'Username too long' };
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return { success: false, error: 'Invalid password' };
    }

    try {
      // SDK v2+ uses generic signIn for username+password
      await this.auth.signIn({
        username: sanitizedUsername,
        password: password
      });
      const loginState = await this.auth.getLoginState();
      return { success: true, user: loginState };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Authentication failed' };
    }
  }

  // Get current login state
  async getLoginState() {
    const initCheck = this.checkInitialized();
    if (!initCheck.success) {
      return initCheck;
    }

    try {
      const loginState = await this.auth.getLoginState();
      return { success: true, isLoggedIn: !!loginState, user: loginState };
    } catch (error) {
      console.error('Get login state error:', error);
      return { success: false, error: 'Failed to get login state' };
    }
  }

  // Logout
  async logout() {
    const initCheck = this.checkInitialized();
    if (!initCheck.success) {
      return initCheck;
    }

    try {
      await this.auth.signOut();
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: 'Logout failed' };
    }
  }

  // Register user (if using email/password)
  async register(email, password) {
    const initCheck = this.checkInitialized();
    if (!initCheck.success) {
      return initCheck;
    }

    // Validate inputs
    const sanitizedEmail = sanitizeInput(email);
    const emailValidation = validateEmail(sanitizedEmail);
    
    if (!emailValidation.valid) {
      return { success: false, error: emailValidation.error };
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return { success: false, error: passwordValidation.error };
    }

    try {
      // SDK v2+ uses signUp
      await this.auth.signUp(sanitizedEmail, password);
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Registration failed' };
    }
  }
}

export default new CloudbaseService();
