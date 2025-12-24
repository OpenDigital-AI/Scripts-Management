import cloudbase from '@cloudbase/js-sdk';

class CloudbaseService {
  constructor() {
    this.app = null;
    this.auth = null;
  }

  // Initialize Cloudbase
  init(config) {
    try {
      this.app = cloudbase.init({
        env: config.env,
      });
      this.auth = this.app.auth({
        persistence: 'local',
      });
      return { success: true };
    } catch (error) {
      console.error('Cloudbase initialization error:', error);
      return { success: false, error: error.message };
    }
  }

  // Anonymous login
  async loginAnonymously() {
    try {
      await this.auth.anonymousAuthProvider().signIn();
      const loginState = await this.auth.getLoginState();
      return { success: true, user: loginState };
    } catch (error) {
      console.error('Anonymous login error:', error);
      return { success: false, error: error.message };
    }
  }

  // Email login
  async loginWithEmail(email, password) {
    try {
      await this.auth.signInWithEmailAndPassword(email, password);
      const loginState = await this.auth.getLoginState();
      return { success: true, user: loginState };
    } catch (error) {
      console.error('Email login error:', error);
      return { success: false, error: error.message };
    }
  }

  // Username and password login
  async loginWithUsernameAndPassword(username, password) {
    try {
      await this.auth.signInWithUsernameAndPassword(username, password);
      const loginState = await this.auth.getLoginState();
      return { success: true, user: loginState };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  }

  // Get current login state
  async getLoginState() {
    try {
      const loginState = await this.auth.getLoginState();
      return { success: true, isLoggedIn: !!loginState, user: loginState };
    } catch (error) {
      console.error('Get login state error:', error);
      return { success: false, error: error.message };
    }
  }

  // Logout
  async logout() {
    try {
      await this.auth.signOut();
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: error.message };
    }
  }

  // Register user (if using email/password)
  async register(email, password) {
    try {
      await this.auth.signUpWithEmailAndPassword(email, password);
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error.message };
    }
  }
}

export default new CloudbaseService();
