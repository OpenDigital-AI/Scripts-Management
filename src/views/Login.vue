<template>
  <div class="login-container">
    <div class="login-box">
      <h1>Logon Demo</h1>
      <p class="subtitle">Powered by Tencent Cloudbase</p>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <div class="tabs">
        <button
          :class="{ active: loginMode === 'anonymous' }"
          @click="loginMode = 'anonymous'"
        >
          Anonymous
        </button>
        <button
          :class="{ active: loginMode === 'credentials' }"
          @click="loginMode = 'credentials'"
        >
          Credentials
        </button>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div v-if="loginMode === 'credentials'" class="form-group">
          <label for="username">Username/Email</label>
          <input
            id="username"
            v-model="username"
            type="text"
            placeholder="Enter username or email"
            required
          />
        </div>

        <div v-if="loginMode === 'credentials'" class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="Enter password"
            required
          />
        </div>

        <button type="submit" class="login-button" :disabled="loading">
          {{ loading ? 'Logging in...' : loginMode === 'anonymous' ? 'Login Anonymously' : 'Login' }}
        </button>
      </form>

      <div class="info-section">
        <p class="info-text">
          <strong>Note:</strong> This is a demo application integrating Electron + Vue + Tencent Cloudbase.
        </p>
        <p class="info-text">
          Configure your Cloudbase environment in <code>.env</code> file.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import cloudbaseService from '../services/cloudbase';

export default {
  name: 'Login',
  setup() {
    const router = useRouter();
    const loginMode = ref('anonymous');
    const username = ref('');
    const password = ref('');
    const loading = ref(false);
    const error = ref('');

    // Initialize Cloudbase
    cloudbaseService.init({
      env: import.meta.env.VITE_CLOUDBASE_ENV || 'your-env-id',
    });

    const handleLogin = async () => {
      loading.value = true;
      error.value = '';

      let result;
      if (loginMode.value === 'anonymous') {
        result = await cloudbaseService.loginAnonymously();
      } else {
        // Try email login first, fallback to username
        result = await cloudbaseService.loginWithEmail(
          username.value,
          password.value
        );
        
        if (!result.success) {
          result = await cloudbaseService.loginWithUsernameAndPassword(
            username.value,
            password.value
          );
        }
      }

      loading.value = false;

      if (result.success) {
        router.push('/home');
      } else {
        error.value = result.error || 'Login failed. Please check your credentials.';
      }
    };

    return {
      loginMode,
      username,
      password,
      loading,
      error,
      handleLogin,
    };
  },
};
</script>

<style scoped>
.login-container {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-box {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 450px;
}

h1 {
  margin: 0 0 10px 0;
  color: #333;
  text-align: center;
  font-size: 32px;
}

.subtitle {
  margin: 0 0 30px 0;
  color: #666;
  text-align: center;
  font-size: 14px;
}

.error-message {
  background: #fee;
  color: #c33;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 20px;
  font-size: 14px;
}

.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.tabs button {
  flex: 1;
  padding: 10px;
  border: 2px solid #667eea;
  background: white;
  color: #667eea;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s;
}

.tabs button.active {
  background: #667eea;
  color: white;
}

.tabs button:hover {
  background: #667eea;
  color: white;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.form-group input {
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
}

.login-button {
  padding: 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  transition: transform 0.2s;
}

.login-button:hover:not(:disabled) {
  transform: translateY(-2px);
}

.login-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.info-section {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #e0e0e0;
}

.info-text {
  font-size: 12px;
  color: #666;
  margin: 8px 0;
  line-height: 1.5;
}

.info-text code {
  background: #f5f5f5;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 11px;
}
</style>
