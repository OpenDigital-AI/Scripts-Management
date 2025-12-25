import cloudbase from '@cloudbase/js-sdk';
import { validateEmail, validatePassword, sanitizeInput } from '../utils/validation';

class CloudbaseService {
  constructor() {
    this.app = null;
    this.auth = null;
    this.db = null;
    this.isInitialized = false;
    this.currentUsername = null; // Store the logged-in username
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
        region: 'ap-shanghai', // Specify region explicitly
      });
      this.auth = this.app.auth({
        persistence: 'local',
      });
      
      // Initialize database instance
      this.db = this.app.database();
      
      // Debug: Log available auth methods
      console.log('Available auth methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(this.auth)).filter(name => name.includes('sign')));
      console.log('Database initialized with env:', envId, 'region: ap-shanghai');
      
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
      
      // Store the username for later use
      this.currentUsername = sanitizedUsername;
      
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
      console.log('Full login state:', loginState);
      
      // Add the stored username to the user object
      if (loginState && this.currentUsername) {
        return { 
          success: true, 
          isLoggedIn: !!loginState, 
          user: {
            ...loginState,
            username: this.currentUsername,
            nickname: loginState.nickName || loginState.nickname || this.currentUsername
          }
        };
      }
      
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
      this.currentUsername = null; // Clear stored username
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

  // Get database instance
  getDatabase() {
    if (!this.db) {
      console.warn('Database instance not initialized');
      return null;
    }
    return this.db;
  }

  // Get resources from collection
  async getResources() {
    console.log('getResources called');
    const initCheck = this.checkInitialized();
    console.log('Init check:', initCheck);
    if (!initCheck.success) {
      return initCheck;
    }

    try {
      console.log('Getting database instance...');
      const db = this.getDatabase();
      console.log('Database instance:', db);
      if (!db) {
        return { success: false, error: 'Database not initialized' };
      }

      // Verify user is authenticated before querying
      const loginState = await this.auth.getLoginState();
      console.log('Login state before query:', loginState);
      
      if (!loginState) {
        console.warn('User not authenticated for database query');
        return { success: false, error: 'Not authenticated', data: [] };
      }

      console.log('Querying NoSQL collection: resource259');
      const collection = db.collection('resource259');
      console.log('Collection reference:', collection);
      
      // Use Cloudbase database command for advanced queries
      const _ = db.command;
      
      console.log('Executing NoSQL query with limit...');
      // Query NoSQL collection - add limit to prevent large data fetch
      const res = await collection
        .limit(100) // Limit results to prevent overwhelming the client
        .get();
        
      console.log('Query result:', res);
      console.log('Data count:', res.data ? res.data.length : 0);
      
      if (res.data && res.data.length > 0) {
        console.log('Sample document:', res.data[0]);
      }
      
      return { 
        success: true, 
        data: res.data || []
      };
    } catch (error) {
      console.error('Get resources error:', error);
      console.error('Error details:', error.message, error.code);
      
      // Handle collection not exist error
      if (error.code === 'DATABASE_COLLECTION_NOT_EXIST') {
        return { 
          success: false, 
          error: 'Collection "resource259" does not exist. Please create it in Cloudbase console.', 
          errorCode: 'COLLECTION_NOT_EXIST',
          data: [] 
        };
      }
      
      // Handle specific NoSQL database errors
      if (error.code === 'PERMISSION_DENIED' || error.message?.includes('permission')) {
        return { 
          success: false, 
          error: 'Database permission denied. Check security rules in Cloudbase console.', 
          data: [] 
        };
      }
      
      return { 
        success: false, 
        error: `Failed to fetch resources: ${error.message || 'Unknown error'}`, 
        data: [] 
      };
    }
  }

  // Get fresh temporary download URLs for cloud files
  async getTempFileURLs(fileList) {
    try {
      if (!this.isInitialized || !this.app) {
        throw new Error('Cloudbase not initialized');
      }

      if (!fileList || !Array.isArray(fileList) || fileList.length === 0) {
        return { success: true, fileList: [] };
      }

      // Use Cloudbase SDK to get temporary download URLs
      const result = await this.app.getTempFileURL({
        fileList: fileList
      });

      console.log('getTempFileURL result:', result);

      return {
        success: true,
        fileList: result.fileList || []
      };
    } catch (error) {
      console.error('Get temp file URL error:', error);
      return {
        success: false,
        error: error.message || 'Failed to get download URLs',
        fileList: []
      };
    }
  }
}

export default new CloudbaseService();
