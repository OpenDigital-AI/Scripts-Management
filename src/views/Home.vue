<template>
  <div class="dashboard">
    <!-- Main Layout -->
    <div class="main-layout">
      <!-- Left Sidebar -->
      <aside class="sidebar">
        <!-- User Header -->
        <div class="sidebar-header">
          <div class="user-info">
            <div class="user-avatar">👤</div>
            <div class="user-details">
              <div class="user-name-display">{{ userName }}</div>
              <div class="user-status">在线</div>
            </div>
          </div>
          <button @click="handleLogout" class="logout-btn" title="Logout">
            🚪
          </button>
        </div>
        
        <!-- Search Box -->
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="搜索脚本..."
            class="search-input"
          />
          <button 
            v-if="searchQuery" 
            @click="searchQuery = ''"
            class="search-clear"
          >×</button>
        </div>
        
        <nav class="nav-menu">
          <div class="menu-section" v-if="loadingResources">
            <div class="section-title">Menu</div>
            <div class="loading-resources">Loading menu items...</div>
          </div>

          <div class="menu-section" v-if="!loadingResources && filteredMenuItems.length > 0">
            <div class="section-title">脚本列表 ({{ filteredMenuItems.length - 1 }})</div>
            <a 
              v-for="(item, index) in filteredMenuItems" 
              :key="item._id"
              href="#"
              @click.prevent="selectResource(item)"
              :class="['menu-item', { active: activeMenu === `resource-${item._id}` }]"
            >
              <div class="menu-icon-wrapper" :style="{ background: getIconColor(index) }">
                <span class="menu-icon">{{ getItemIcon(item, index) }}</span>
              </div>
              <div class="resource-info">
                <div class="resource-name">{{ item.name }}</div>
                <div class="resource-desc">{{ item.description || '' }}</div>
              </div>
            </a>
          </div>
          
          <div class="menu-section" v-if="!loadingResources && menuItems.length > 0 && filteredMenuItems.length === 0">
            <div class="empty-resources">
              <div class="empty-icon">🔍</div>
              <div class="empty-text">未找到匹配的脚本</div>
            </div>
          </div>

          <div class="menu-section" v-if="!loadingResources && menuItems.length === 0">
            <div class="section-title">Resources</div>
            <div class="empty-resources">
              <div class="empty-icon">📭</div>
              <div class="empty-text">No resources found</div>
              <div class="empty-hint">Add documents to the 'resource259' collection in Cloudbase console</div>
            </div>
          </div>
        </nav>
      </aside>

      <!-- Content Area -->
      <main class="content-area">
        <!-- Dashboard View -->
        <div v-if="activeMenu === 'dashboard'" class="view-container">
          <div class="welcome-container">
            <h1 class="welcome-title">欢迎{{ userName }} 使用脚本管理工具！</h1>
            
            <!-- Mechanical Watch Dial -->
            <div class="watch-container">
              <div class="watch-dial">
                <!-- Hour markers -->
                <div class="hour-marker" v-for="n in 12" :key="n" :style="{ transform: `rotate(${n * 30}deg)` }">
                  <div class="marker-line"></div>
                </div>
                
                <!-- Clock hands -->
                <div class="hand hour-hand" :style="{ transform: `rotate(${hourAngle}deg)` }"></div>
                <div class="hand minute-hand" :style="{ transform: `rotate(${minuteAngle}deg)` }"></div>
                <div class="hand second-hand" :style="{ transform: `rotate(${secondAngle}deg)` }"></div>
                
                <!-- Center dot -->
                <div class="center-dot"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Features View -->
        <div v-if="activeMenu === 'features'" class="view-container">
          <h2 class="view-title">Features</h2>
          
          <div class="content-card">
            <h3>🚀 Application Features</h3>
            <div class="features-list">
              <div class="feature-item">
                <span class="feature-icon">✅</span>
                <div class="feature-content">
                  <strong>Input Validation</strong>
                  <p>Comprehensive security validation for all inputs</p>
                </div>
              </div>
              <div class="feature-item">
                <span class="feature-icon">✅</span>
                <div class="feature-content">
                  <strong>Password Strength</strong>
                  <p>Real-time password strength checking</p>
                </div>
              </div>
              <div class="feature-item">
                <span class="feature-icon">✅</span>
                <div class="feature-content">
                  <strong>XSS Protection</strong>
                  <p>Input sanitization removes HTML/scripts</p>
                </div>
              </div>
              <div class="feature-item">
                <span class="feature-icon">✅</span>
                <div class="feature-content">
                  <strong>Cross-platform</strong>
                  <p>Desktop application with Electron</p>
                </div>
              </div>
              <div class="feature-item">
                <span class="feature-icon">✅</span>
                <div class="feature-content">
                  <strong>Modern UI</strong>
                  <p>Vue 3 with Composition API</p>
                </div>
              </div>
              <div class="feature-item">
                <span class="feature-icon">✅</span>
                <div class="feature-content">
                  <strong>Secure Authentication</strong>
                  <p>Cloudbase integration with multiple login methods</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Technology View -->
        <div v-if="activeMenu === 'technology'" class="view-container">
          <h2 class="view-title">Technology Stack</h2>
          
          <div class="tech-grid">
            <div class="tech-card">
              <div class="tech-icon">⚡</div>
              <h3>Vue 3</h3>
              <p>Progressive JavaScript framework with Composition API</p>
            </div>
            <div class="tech-card">
              <div class="tech-icon">🖥️</div>
              <h3>Electron</h3>
              <p>Cross-platform desktop application framework</p>
            </div>
            <div class="tech-card">
              <div class="tech-icon">☁️</div>
              <h3>Cloudbase</h3>
              <p>Tencent cloud backend services</p>
            </div>
            <div class="tech-card">
              <div class="tech-icon">⚙️</div>
              <h3>Vite</h3>
              <p>Next generation frontend build tool</p>
            </div>
            <div class="tech-card">
              <div class="tech-icon">🛣️</div>
              <h3>Vue Router</h3>
              <p>Official routing library for Vue.js</p>
            </div>
            <div class="tech-card">
              <div class="tech-icon">🛡️</div>
              <h3>Security</h3>
              <p>Input validation and XSS protection</p>
            </div>
          </div>
        </div>

        <!-- Settings View -->
        <div v-if="activeMenu === 'settings'" class="view-container">
          <h2 class="view-title">Settings</h2>
          
          <div class="content-card">
            <h3>Application Settings</h3>
            <div class="settings-list">
              <div class="setting-item">
                <div class="setting-info">
                  <strong>Environment ID</strong>
                  <p class="code">{{ envId }}</p>
                </div>
              </div>
              <div class="setting-item">
                <div class="setting-info">
                  <strong>SDK Version</strong>
                  <p>Cloudbase JS SDK v2.23.3</p>
                </div>
              </div>
              <div class="setting-item">
                <div class="setting-info">
                  <strong>Authentication</strong>
                  <p>Username + Password, Anonymous Login</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Resource Detail View -->
        <div v-if="activeMenu.startsWith('resource-')" class="view-container">
          <div class="content-card" v-if="selectedResource">
            <div class="content-display">
              {{ selectedResource.content || 'No content available' }}
            </div>
            <div class="button-container" v-if="selectedResource.buttonname">
              <button class="action-button" @click="handleButtonClick">
                {{ selectedResource.buttonname }}
              </button>
            </div>
            
            <!-- Folder Status -->
            <div v-if="folderMessage" class="status-message status-folder">
              <span class="status-label">【文件夹】</span>{{ folderMessage }}
            </div>
            
            <!-- Script Download Status -->
            <div v-if="scriptMessage" :class="['status-message', 'status-script', `status-${scriptStatus}`]">
              <div class="status-label">【脚本文件下载】</div>
              <div v-html="scriptMessage"></div>
            </div>
            
            <!-- Data Download Status -->
            <div v-if="dataMessage" :class="['status-message', 'status-data', `status-${dataStatus}`]">
              <div class="status-label">【数据文件下载】</div>
              <div v-html="dataMessage"></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import cloudbaseService from '../services/cloudbase';

export default {
  name: 'Home',
  setup() {
    const router = useRouter();
    const userInfo = ref(null);
    const loading = ref(true);
    const activeMenu = ref('dashboard');
    const envId = import.meta.env.VITE_CLOUDBASE_ENV || 'Not configured';
    const resources = ref([]);
    const loadingResources = ref(false);
    const selectedResource = ref(null);
    const menuItems = ref([]);
    const statusMessage = ref('');
    const statusType = ref(''); // 'success', 'error', 'info'
    const folderMessage = ref('');
    const scriptMessage = ref('');
    const dataMessage = ref('');
    const scriptStatus = ref(''); // 'success', 'error', 'warning', 'info'
    const dataStatus = ref(''); // 'success', 'error', 'warning', 'info'
    const searchQuery = ref('');
    const currentTime = ref('');
    const hourAngle = ref(0);
    const minuteAngle = ref(0);
    const secondAngle = ref(0);

    const userName = computed(() => {
      // Try to get nickname from user object
      if (userInfo.value?.user?.nickname) {
        return userInfo.value.user.nickname;
      }
      // Try to get username from user object
      if (userInfo.value?.user?.username) {
        return userInfo.value.user.username;
      }
      // Fallback to email if available
      if (userInfo.value?.user?.email) {
        return userInfo.value.user.email;
      }
      // Last resort: show truncated UID
      if (userInfo.value?.user?.uid) {
        const uid = userInfo.value.user.uid;
        return uid.length > 8 ? uid.substring(0, 8) + '...' : uid;
      }
      return 'User';
    });

    const namedItemsCount = computed(() => {
      if (!menuItems.value || menuItems.value.length === 0) {
        return 0;
      }
      return menuItems.value.filter(item => item.name && item.name.trim() !== '').length;
    });
    
    const filteredMenuItems = computed(() => {
      if (!searchQuery.value.trim()) {
        return menuItems.value;
      }
      const query = searchQuery.value.toLowerCase();
      return menuItems.value.filter(item => {
        const name = (item.name || '').toLowerCase();
        const description = (item.description || '').toLowerCase();
        const content = (item.content || '').toLowerCase();
        return name.includes(query) || description.includes(query) || content.includes(query);
      });
    });

    const getItemIcon = (item, index) => {
      // Use Python icon for all items
      return '📝';
    };

    const getIconColor = (index) => {
      // Use deep blue gradient for all icons
      return 'linear-gradient(135deg, #a8c0ff 0%, #3f2b96 100%)';
    };

 

    const loadUserInfo = async () => {
      loading.value = true;
      const result = await cloudbaseService.getLoginState();
      userInfo.value = result;
      loading.value = false;

      // If not logged in or error occurred, redirect to login
      if (!result.success || !result.isLoggedIn) {
        router.push('/login');
      }
    };

    const loadResources = async () => {
      console.log('Loading resources...');
      loadingResources.value = true;
      const result = await cloudbaseService.getResources();
      console.log('Resources result:', result);
      if (result.success) {
        resources.value = result.data;
        menuItems.value = result.data; // Use the same data for menu items
        console.log('Resources loaded:', resources.value.length, 'items');
      } else {
        console.error('Failed to load resources:', result.error);
        // Show error in UI
        if (result.errorCode === 'COLLECTION_NOT_EXIST') {
          alert('Collection "resource" does not exist.\n\nPlease go to Cloudbase Console:\n1. Select environment: digital-connect-3g0d1vrha9ea1e5c\n2. Go to Database section\n3. Create a new collection named "resource259"\n4. Add documents with fields: Name, description, icon (optional)');
        }
      }
      loadingResources.value = false;
    };

    const selectResource = (resource) => {
      selectedResource.value = resource;
      activeMenu.value = `resource-${resource._id}`;
      // Clear status message when switching resources
      statusMessage.value = '';
      statusType.value = '';
      folderMessage.value = '';
      scriptMessage.value = '';
      dataMessage.value = '';
      scriptStatus.value = '';
      dataStatus.value = '';
    };

    const truncateText = (text, maxLength) => {
      if (!text) return '';
      return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    const otherFields = (resource) => {
      const excluded = ['_id', 'Name', 'description'];
      const other = {};
      for (const key in resource) {
        if (!excluded.includes(key) && key !== '_openid') {
          other[key] = resource[key];
        }
      }
      return other;
    };

    const formatValue = (value) => {
      if (typeof value === 'object') {
        return JSON.stringify(value);
      }
      return String(value);
    };

    const handleButtonClick = async () => {
      statusMessage.value = '';
      statusType.value = '';
      folderMessage.value = '';
      scriptMessage.value = '';
      dataMessage.value = '';
      scriptStatus.value = '';
      dataStatus.value = '';
      
      if (!selectedResource.value || !selectedResource.value.name) {
        statusMessage.value = '没有资源名称';
        statusType.value = 'error';
        return;
      }

      // Check if Electron API is available
      if (!window.electron || !window.electron.createFolder) {
        statusMessage.value = '此功能仅在桌面应用中可用';
        statusType.value = 'error';
        return;
      }

      try {
        statusMessage.value = '正在创建文件夹...';
        statusType.value = 'info';
        
        // Create the folder
        const result = await window.electron.createFolder(selectedResource.value.name);
        
        if (result.success) {
          console.log('Folder created:', result.path);
          
          // Check if there are download links - convert to plain arrays
          const downloadLinks = selectedResource.value.downloadlink;
          const rawDataLinks = selectedResource.value.rawdatalink;
          
          // Convert Vue reactive objects to plain arrays
          const plainDownloadLinks = Array.isArray(downloadLinks) ? [...downloadLinks] : [];
          const plainRawDataLinks = Array.isArray(rawDataLinks) ? [...rawDataLinks] : [];
          
          const hasLinks = plainDownloadLinks.length > 0 || plainRawDataLinks.length > 0;
          
          if (hasLinks) {
            // Extract folder name from path for early display
            const folderName = selectedResource.value.name + '_' + new Date().toISOString().split('T')[0];
            
            // Show initial status with folder name
            statusMessage.value = `文件夹：${folderName}\n正在获取下载链接...`;
            statusType.value = 'info';
            
            // Get fresh temporary URLs from Cloudbase
            let freshDownloadLinks = [];
            let freshRawDataLinks = [];
            
            try {
              // Get fresh URLs for download links (handle duplicates)
              if (plainDownloadLinks.length > 0) {
                // Create a map to track unique URLs and their fresh versions
                const uniqueUrlMap = new Map();
                const uniqueUrls = [];
                
                plainDownloadLinks.forEach(url => {
                  if (!uniqueUrlMap.has(url)) {
                    uniqueUrlMap.set(url, null);
                    uniqueUrls.push(url);
                  }
                });
                
                // Get fresh URLs for unique links
                const dlResult = await cloudbaseService.getTempFileURLs(uniqueUrls);
                if (dlResult.success && dlResult.fileList) {
                  // Map fresh URLs back to the unique URL map
                  dlResult.fileList.forEach((item, index) => {
                    uniqueUrlMap.set(uniqueUrls[index], item.tempFileURL || item.download_url);
                  });
                  
                  // Rebuild array with duplicates preserved
                  freshDownloadLinks = plainDownloadLinks.map(url => uniqueUrlMap.get(url));
                  console.log(`Download links: ${plainDownloadLinks.length} original, ${uniqueUrls.length} unique, ${freshDownloadLinks.length} fresh`);
                  console.log('Fresh download links:', freshDownloadLinks);
                } else {
                  console.error('Failed to get download links:', dlResult.error);
                }
              }
              
              // Get fresh URLs for raw data links (handle duplicates)
              if (plainRawDataLinks.length > 0) {
                // Create a map to track unique URLs and their fresh versions
                const uniqueUrlMap = new Map();
                const uniqueUrls = [];
                
                plainRawDataLinks.forEach(url => {
                  if (!uniqueUrlMap.has(url)) {
                    uniqueUrlMap.set(url, null);
                    uniqueUrls.push(url);
                  }
                });
                
                // Get fresh URLs for unique links
                const rdResult = await cloudbaseService.getTempFileURLs(uniqueUrls);
                if (rdResult.success && rdResult.fileList) {
                  // Map fresh URLs back to the unique URL map
                  rdResult.fileList.forEach((item, index) => {
                    uniqueUrlMap.set(uniqueUrls[index], item.tempFileURL || item.download_url);
                  });
                  
                  // Rebuild array with duplicates preserved
                  freshRawDataLinks = plainRawDataLinks.map(url => uniqueUrlMap.get(url));
                  console.log(`Raw data links: ${plainRawDataLinks.length} original, ${uniqueUrls.length} unique, ${freshRawDataLinks.length} fresh`);
                  console.log('Fresh raw data links:', freshRawDataLinks);
                } else {
                  console.error('Failed to get raw data links:', rdResult.error);
                }
              }
            } catch (error) {
              console.error('Error getting fresh URLs:', error);
              statusMessage.value = `错误：无法获取下载链接 - ${error.message}`;
              statusType.value = 'error';
              return;
            }
            
            statusMessage.value = `文件夹：${folderName}\n正在下载文件...`;
            
            // Download files to the folder using fresh URLs
            const downloadResult = await window.electron.downloadFiles({
              folderPath: result.path,
              downloadLinks: freshDownloadLinks,
              rawDataLinks: freshRawDataLinks
            });
            
            if (downloadResult.success) {
              console.log('Download result:', downloadResult);
              console.log('downloadLinkResults:', downloadResult.downloadLinkResults);
              console.log('rawDataLinkResults:', downloadResult.rawDataLinkResults);
              
              // Extract actual folder name from path
              const actualFolderName = result.path.split('\\').pop();
              
              // Set folder message
              folderMessage.value = actualFolderName;
              
              // Downloadlink section
              const dlSuccess = downloadResult.downloadLinkResults?.downloaded?.length || 0;
              const dlFailed = downloadResult.downloadLinkResults?.failed?.length || 0;
              const dlTotal = dlSuccess + dlFailed;
              
              console.log(`Download links - Success: ${dlSuccess}, Failed: ${dlFailed}, Total: ${dlTotal}`);
              
              // Rawdatalink section
              const rdSuccess = downloadResult.rawDataLinkResults?.downloaded?.length || 0;
              const rdFailed = downloadResult.rawDataLinkResults?.failed?.length || 0;
              const rdTotal = rdSuccess + rdFailed;
              
              console.log(`Raw data links - Success: ${rdSuccess}, Failed: ${rdFailed}, Total: ${rdTotal}`);
              
              const hasDownloadLinks = dlTotal > 0 || plainDownloadLinks.length > 0;
              const hasRawDataLinks = rdTotal > 0 || plainRawDataLinks.length > 0;
              
              // Build script download message
              if (hasDownloadLinks) {
                scriptMessage.value = `成功：${dlSuccess} 个<br>失败：${dlFailed} 个<br>总计：${dlTotal} 个`;
                scriptStatus.value = dlFailed > 0 ? 'warning' : 'success';
              }
              
              // Build data download message
              if (hasRawDataLinks) {
                dataMessage.value = `成功：${rdSuccess} 个<br>失败：${rdFailed} 个<br>总计：${rdTotal} 个`;
                dataStatus.value = rdFailed > 0 ? 'warning' : 'success';
              }
            } else {
              statusMessage.value = `文件夹已创建但下载失败：${downloadResult.error}`;
              statusType.value = 'error';
            }
          } else {
            statusMessage.value = '文件夹已创建并打开！\n未找到下载链接。';
            statusType.value = 'success';
          }
        } else {
          statusMessage.value = `创建文件夹失败：${result.error}`;
          statusType.value = 'error';
        }
      } catch (error) {
        console.error('Error creating folder:', error);
        statusMessage.value = `错误：${error.message}`;
        statusType.value = 'error';
      }
    };

    const handleLogout = async () => {
      const result = await cloudbaseService.logout();
      if (result.success) {
        router.push('/login');
      }
    };
    
    const updateCurrentTime = () => {
      const now = new Date();
      
      // Get HK time
      const hkTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Hong_Kong' }));
      const hours = hkTime.getHours();
      const minutes = hkTime.getMinutes();
      const seconds = hkTime.getSeconds();
      
      // Calculate angles for clock hands
      secondAngle.value = seconds * 6; // 360/60 = 6 degrees per second
      minuteAngle.value = minutes * 6 + seconds * 0.1; // 6 degrees per minute + smooth transition
      hourAngle.value = (hours % 12) * 30 + minutes * 0.5; // 30 degrees per hour + smooth transition
      
      // Keep digital time for reference if needed
      const options = {
        timeZone: 'Asia/Hong_Kong',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      };
      const formatter = new Intl.DateTimeFormat('zh-CN', options);
      currentTime.value = formatter.format(now).replace(/\//g, '-');
    };

    onMounted(() => {
      loadUserInfo();
      loadResources();
      updateCurrentTime();
      setInterval(updateCurrentTime, 1000);
    });

    return {
      userInfo,
      loading,
      activeMenu,
      menuItems,
      userName,
      namedItemsCount,
      envId,
      resources,
      loadingResources,
      selectedResource,
      handleLogout,
      selectResource,
      truncateText,
      otherFields,
      formatValue,
      handleButtonClick,
      statusMessage,
      statusType,
      folderMessage,
      scriptMessage,
      dataMessage,
      scriptStatus,
      dataStatus,
      getItemIcon,
      getIconColor,
      searchQuery,
      filteredMenuItems,
      currentTime,
      hourAngle,
      minuteAngle,
      secondAngle,
      searchQuery,
      filteredMenuItems,
    };
  },
};
</script>

<style scoped>
.dashboard {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f7fa;
}

/* Main Layout */
.main-layout {
  display: flex;
  flex: 1;
  overflow: hidden;
  height: 100vh;
}

/* Sidebar */
.sidebar {
  width: 280px;
  background: white;
  border-right: 1px solid #e5e7eb;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

/* Sidebar Header */
.sidebar-header {
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  flex-shrink: 0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.user-details {
  flex: 1;
  min-width: 0;
}

.user-name-display {
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-status {
  font-size: 11px;
  opacity: 0.8;
}

.logout-btn {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

/* Search Box */
.search-box {
  padding: 12px 16px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  gap: 8px;
  background: white;
  flex-shrink: 0;
}

.search-icon {
  font-size: 16px;
  color: #9ca3af;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 14px;
  color: #1f2937;
  background: transparent;
}

.search-input::placeholder {
  color: #9ca3af;
}

.search-clear {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #e5e7eb;
  border: none;
  color: #6b7280;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  line-height: 1;
  padding: 0;
}

.search-clear:hover {
  background: #d1d5db;
}

.nav-menu {
  padding: 16px 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  overflow-y: auto;
}

.menu-section {
  margin-bottom: 8px;
}

.section-title {
  padding: 8px 16px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  color: #9ca3af;
  letter-spacing: 0.5px;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  color: #6b7280;
  text-decoration: none;
}

.menu-item:hover {
  background: #f3f4f6;
  color: #667eea;
}

.menu-item.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: 600;
}

.menu-item.active .menu-icon-wrapper {
  background: rgba(255, 255, 255, 0.3) !important;
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.5);
}

.menu-icon-wrapper {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.3s;
}

.menu-icon {
  font-size: 20px;
  flex-shrink: 0;
}

.menu-label {
  font-size: 14px;
}

.resource-item {
  flex-direction: row;
  align-items: flex-start;
  padding: 10px 16px;
}

.resource-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
}

.resource-name {
  font-size: 14px;
  font-weight: 600;
  color: inherit;
  line-height: 1.3;
}

.resource-desc {
  font-size: 11px;
  opacity: 0.7;
  color: inherit;
  line-height: 1.4;
}

.loading-resources {
  padding: 12px 16px;
  font-size: 12px;
  color: #9ca3af;
  font-style: italic;
  text-align: center;
}

/* Content Area */
.content-area {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.view-container {
  max-width: 1200px;
  margin: 0 auto;
}

.view-title {
  margin: 0 0 24px 0;
  color: #1f2937;
  font-size: 28px;
  font-weight: 700;
}

/* Welcome Container */
.welcome-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
}

.welcome-title {
  font-size: 42px;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 32px;
  line-height: 1.3;
}

.datetime-display {
  font-size: 28px;
  color: #6b7280;
  font-weight: 500;
  padding: 16px 32px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

/* Cards Grid */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.stats-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  gap: 16px;
  transition: transform 0.2s;
}

.stats-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.stats-icon {
  font-size: 40px;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
}

.stats-content h3 {
  margin: 0 0 4px 0;
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
}

.stats-content p {
  margin: 0;
  font-size: 18px;
  color: #1f2937;
  font-weight: 600;
}

.stats-content .small-text {
  font-size: 12px;
  word-break: break-all;
}

/* Content Card */
.content-card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  margin-bottom: 24px;
}

.content-card h3 {
  margin: 0 0 20px 0;
  color: #1f2937;
  font-size: 20px;
  font-weight: 600;
}

/* Info Grid */
.info-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

.info-label {
  font-weight: 600;
  color: #374151;
  font-size: 14px;
}

.info-value {
  color: #6b7280;
  font-size: 14px;
}

.info-value.code {
  font-family: 'Courier New', monospace;
  font-size: 12px;
  background: white;
  padding: 4px 8px;
  border-radius: 4px;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.status-active {
  background: #d1fae5;
  color: #065f46;
}

.status-inactive {
  background: #fee2e2;
  color: #991b1b;
}

/* Features List */
.features-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.feature-item {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
  transition: all 0.2s;
}

.feature-item:hover {
  background: #f3f4f6;
  transform: translateX(4px);
}

.feature-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.feature-content strong {
  display: block;
  color: #1f2937;
  margin-bottom: 4px;
  font-size: 16px;
}

.feature-content p {
  margin: 0;
  color: #6b7280;
  font-size: 14px;
}

/* Tech Grid */
.tech-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.tech-card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  text-align: center;
  transition: all 0.2s;
}

.tech-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
}

.tech-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.tech-card h3 {
  margin: 0 0 12px 0;
  color: #1f2937;
  font-size: 20px;
  font-weight: 600;
}

.tech-card p {
  margin: 0;
  color: #6b7280;
  font-size: 14px;
  line-height: 1.6;
}

/* Settings */
.settings-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.setting-item {
  padding: 20px;
  background: #f9fafb;
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

.setting-info strong {
  display: block;
  color: #1f2937;
  margin-bottom: 8px;
  font-size: 16px;
}

.setting-info p {
  margin: 0;
  color: #6b7280;
  font-size: 14px;
}

.setting-info .code {
  font-family: 'Courier New', monospace;
  background: white;
  padding: 8px 12px;
  border-radius: 4px;
  display: inline-block;
  margin-top: 4px;
}

.loading {
  text-align: center;
  color: #6b7280;
  font-style: italic;
  padding: 40px;
}

/* Resource Details */
.resource-header {
  display: flex;
  align-items: center;
  gap: 20px;
  padding-bottom: 24px;
  border-bottom: 2px solid #f3f4f6;
  margin-bottom: 24px;
}

.resource-icon-large {
  font-size: 64px;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  flex-shrink: 0;
}

.resource-header h3 {
  margin: 0;
  font-size: 24px;
  color: #1f2937;
}

.resource-id {
  margin: 4px 0 0 0;
  font-size: 12px;
  color: #9ca3af;
  font-family: 'Courier New', monospace;
}

.resource-details {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.detail-section h4 {
  margin: 0 0 16px 0;
  font-size: 16px;
  color: #374151;
  font-weight: 600;
  padding-bottom: 8px;
  border-bottom: 1px solid #e5e7eb;
}

.description-text {
  margin: 0;
  color: #6b7280;
  font-size: 14px;
  line-height: 1.8;
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

.content-display {
  color: #1f2937;
  font-size: 15px;
  line-height: 1.8;
  white-space: pre-wrap;
  word-wrap: break-word;
  margin-bottom: 24px;
}

.button-container {
  display: flex;
  justify-content: flex-start;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
}

.action-button {
  padding: 12px 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.action-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.action-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(102, 126, 234, 0.3);
}

.status-message {
  margin-top: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  line-height: 1.6;
  white-space: pre-line;
}

.status-label {
  font-weight: bold;
  display: block;
  margin-bottom: 8px;
}

.status-folder {
  background: #e3f2fd;
  color: #000000;
  border-left: 4px solid #2196F3;
}

.status-folder .status-label {
  color: #000000;
}

.status-script {
  background: #e3f2fd;
  color: #000000;
  border-left: 4px solid #2196F3;
}

.status-script .status-label {
  color: #000000;
}

.status-data {
  background: #e3f2fd;
  color: #000000;
  border-left: 4px solid #2196F3;
}

.status-data .status-label {
  color: #000000;
}

.status-success {
  background: #e3f2fd;
  color: #000000;
  border-left: 4px solid #2196F3;
}

.status-error {
  background: #e3f2fd;
  color: #000000;
  border-left: 4px solid #2196F3;
}

.status-warning {
  background: #e3f2fd;
  color: #000000;
  border-left: 4px solid #2196F3;
}

.status-info {
  background: #dbeafe;
  color: #1e40af;
  border-left: 4px solid #3b82f6;
}
</style>
