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

      <form @submit.prevent="handleLogin" class="login-form" novalidate>
        <div v-if="loginMode === 'credentials'" class="form-group">
          <label for="username">Username</label>
          <input
            id="username"
            v-model="username"
            type="text"
            placeholder="Enter username"
            :class="{ 'input-error': validationErrors.username }"
            @blur="validateUsernameField"
            @input="clearValidationError('username')"
            required
          />
          <div v-if="validationErrors.username" class="field-error">
            {{ validationErrors.username }}
          </div>
        </div>

        <div v-if="loginMode === 'credentials'" class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="Enter password (min 8 characters)"
            :class="{ 'input-error': validationErrors.password }"
            @blur="validatePasswordField"
            @input="clearValidationError('password')"
            required
          />
          <div v-if="validationErrors.password" class="field-error">
            {{ validationErrors.password }}
          </div>
          <div v-if="password && !validationErrors.password && passwordStrength" class="password-strength">
            <span :class="`strength-${passwordStrength}`">
              Password strength: {{ passwordStrength }}
            </span>
          </div>
        </div>

        <button type="submit" class="login-button" :disabled="loading || !canSubmit">
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
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import cloudbaseService from '../services/cloudbase';
import {
  validateUsername,
  validatePassword,
  checkPasswordPatterns,
  sanitizeInput
} from '../utils/validation';

export default {
  name: 'Login',
  setup() {
    const router = useRouter();
    const loginMode = ref('anonymous');
    const username = ref('');
    const password = ref('');
    const loading = ref(false);
    const error = ref('');
    const validationErrors = ref({
      username: '',
      password: ''
    });
    const passwordStrength = ref('');

    // Initialize Cloudbase
    const envId = import.meta.env.VITE_CLOUDBASE_ENV;
    if (!envId || envId === 'your-env-id') {
      console.error('Cloudbase environment ID not configured. Please set VITE_CLOUDBASE_ENV in .env file');
      error.value = 'Application not configured. Please contact administrator.';
    } else {
      cloudbaseService.init({ env: envId });
    }

    // Watch login mode changes to clear validation
    watch(loginMode, () => {
      validationErrors.value = { username: '', password: '' };
      error.value = '';
      passwordStrength.value = '';
    });

    // Validate username field
    const validateUsernameField = () => {
      const sanitized = sanitizeInput(username.value);
      username.value = sanitized;

      const validation = validateUsername(sanitized);
      validationErrors.value.username = validation.valid ? '' : validation.error;
      return validation.valid;
    };

    // Validate password field
    const validatePasswordField = () => {
      const passwordValidation = validatePassword(password.value);
      const patternCheck = checkPasswordPatterns(password.value, username.value);

      if (!passwordValidation.valid) {
        validationErrors.value.password = passwordValidation.error;
        passwordStrength.value = '';
        return false;
      }

      if (!patternCheck.valid) {
        validationErrors.value.password = patternCheck.error;
        passwordStrength.value = '';
        return false;
      }

      validationErrors.value.password = '';
      passwordStrength.value = passwordValidation.strength;
      return true;
    };

    // Clear specific validation error
    const clearValidationError = (field) => {
      validationErrors.value[field] = '';
      if (field === 'password') {
        passwordStrength.value = '';
      }
    };

    // Check if form can be submitted
    const canSubmit = computed(() => {
      if (loginMode.value === 'anonymous') {
        return true;
      }
      return username.value.trim().length > 0 && 
             password.value.length > 0 &&
             !validationErrors.value.username &&
             !validationErrors.value.password;
    });

    // Validate all fields before submission
    const validateForm = () => {
      if (loginMode.value === 'anonymous') {
        return true;
      }

      const isUsernameValid = validateUsernameField();
      const isPasswordValid = validatePasswordField();

      return isUsernameValid && isPasswordValid;
    };

    const handleLogin = async () => {
      error.value = '';

      // Validate form
      if (!validateForm()) {
        error.value = 'Please fix the validation errors before submitting.';
        return;
      }

      loading.value = true;

      try {
        let result;
        if (loginMode.value === 'anonymous') {
          result = await cloudbaseService.loginAnonymously();
        } else {
          // Sanitize inputs before sending
          const sanitizedUsername = sanitizeInput(username.value);
          
          // Use username + password login only
          result = await cloudbaseService.loginWithUsernameAndPassword(
            sanitizedUsername,
            password.value
          );
        }

        loading.value = false;

        if (result.success) {
          // Clear sensitive data
          password.value = '';
          username.value = '';
          router.push('/home');
        } else {
          // Generic error message for security - don't reveal specific details
          error.value = 'Login failed. Please check your credentials and try again.';
          // Clear password on failed login
          password.value = '';
        }
      } catch (err) {
        loading.value = false;
        console.error('Login error:', err);
        error.value = 'An error occurred during login. Please try again.';
        password.value = '';
      }
    };

    return {
      loginMode,
      username,
      password,
      loading,
      error,
      validationErrors,
      passwordStrength,
      canSubmit,
      handleLogin,
      validateUsernameField,
      validatePasswordField,
      clearValidationError,
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

.form-group input.input-error {
  border-color: #e74c3c;
}

.field-error {
  color: #e74c3c;
  font-size: 12px;
  margin-top: -4px;
}

.password-strength {
  font-size: 12px;
  margin-top: -4px;
}

.strength-weak {
  color: #e74c3c;
}

.strength-medium {
  color: #f39c12;
}

.strength-strong {
  color: #27ae60;
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
