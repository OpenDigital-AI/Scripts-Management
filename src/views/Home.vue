<template>
  <div class="home-container">
    <div class="header">
      <h1>Welcome to Logon Demo</h1>
      <button @click="handleLogout" class="logout-button">Logout</button>
    </div>

    <div class="content">
      <div class="card">
        <h2>🎉 Login Successful!</h2>
        <p>You have successfully logged in using Tencent Cloudbase.</p>
      </div>

      <div class="card">
        <h3>User Information</h3>
        <div v-if="loading" class="loading">Loading user data...</div>
        <div v-else-if="userInfo" class="user-info">
          <div class="info-row">
            <span class="label">Login Status:</span>
            <span class="value">{{ userInfo.isLoggedIn ? 'Logged In' : 'Not Logged In' }}</span>
          </div>
          <div v-if="userInfo.user" class="info-row">
            <span class="label">User ID:</span>
            <span class="value">{{ userInfo.user.uid || 'N/A' }}</span>
          </div>
          <div v-if="userInfo.user" class="info-row">
            <span class="label">Login Type:</span>
            <span class="value">{{ userInfo.user.loginType || 'N/A' }}</span>
          </div>
        </div>
      </div>

      <div class="card">
        <h3>Technology Stack</h3>
        <ul class="tech-list">
          <li><strong>Frontend Framework:</strong> Vue 3</li>
          <li><strong>Desktop Framework:</strong> Electron</li>
          <li><strong>Backend Service:</strong> Tencent Cloudbase</li>
          <li><strong>Build Tool:</strong> Vite</li>
          <li><strong>Routing:</strong> Vue Router</li>
        </ul>
      </div>

      <div class="card">
        <h3>Features</h3>
        <ul class="feature-list">
          <li>✅ Cross-platform desktop application</li>
          <li>✅ Vue 3 Composition API</li>
          <li>✅ Tencent Cloudbase authentication</li>
          <li>✅ Anonymous and credential-based login</li>
          <li>✅ Secure IPC communication</li>
          <li>✅ Modern UI with responsive design</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import cloudbaseService from '../services/cloudbase';

export default {
  name: 'Home',
  setup() {
    const router = useRouter();
    const userInfo = ref(null);
    const loading = ref(true);

    const loadUserInfo = async () => {
      loading.value = true;
      const result = await cloudbaseService.getLoginState();
      userInfo.value = result;
      loading.value = false;

      // If not logged in, redirect to login
      if (!result.isLoggedIn) {
        router.push('/login');
      }
    };

    const handleLogout = async () => {
      const result = await cloudbaseService.logout();
      if (result.success) {
        router.push('/login');
      }
    };

    onMounted(() => {
      loadUserInfo();
    });

    return {
      userInfo,
      loading,
      handleLogout,
    };
  },
};
</script>

<style scoped>
.home-container {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 20px 30px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.header h1 {
  margin: 0;
  color: #333;
  font-size: 28px;
}

.logout-button {
  padding: 10px 24px;
  background: #f44336;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  transition: transform 0.2s;
}

.logout-button:hover {
  transform: translateY(-2px);
  background: #d32f2f;
}

.content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card h2 {
  margin: 0 0 16px 0;
  color: #667eea;
  font-size: 24px;
}

.card h3 {
  margin: 0 0 16px 0;
  color: #333;
  font-size: 20px;
}

.card p {
  margin: 0;
  color: #666;
  line-height: 1.6;
}

.loading {
  color: #666;
  font-style: italic;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background: #f5f5f5;
  border-radius: 6px;
}

.label {
  font-weight: 600;
  color: #333;
}

.value {
  color: #666;
  word-break: break-all;
}

.tech-list,
.feature-list {
  margin: 0;
  padding-left: 20px;
}

.tech-list li,
.feature-list li {
  margin: 10px 0;
  color: #666;
  line-height: 1.6;
}

.feature-list {
  list-style: none;
  padding-left: 0;
}

.feature-list li {
  padding-left: 8px;
}
</style>
