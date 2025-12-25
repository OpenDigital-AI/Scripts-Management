# Architecture Overview - 脚本集成管理系统 v0.1

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         Electron Desktop App                            │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │                    Main Process (main.js)                         │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │  │
│  │  │  Window Mgmt │  │  Menu (中文) │  │  IPC Handlers        │   │  │
│  │  │              │  │              │  │                      │   │  │
│  │  │  - Size      │  │  - 文件      │  │  - createFolder      │   │  │
│  │  │  - Lifecycle │  │  - 编辑      │  │  - downloadFiles     │   │  │
│  │  │  - DevTools  │  │  - 查看      │  │  - getConfig         │   │  │
│  │  │              │  │  - 窗口      │  │                      │   │  │
│  │  │              │  │  - 帮助      │  │                      │   │  │
│  │  └──────────────┘  └──────────────┘  └──────────────────────┘   │  │
│  │                                                                   │  │
│  │  ┌──────────────────────────────────────────────────────────┐   │  │
│  │  │  Config Loader (config.json)                             │   │  │
│  │  │  - cloudbaseEnv: environment-id                          │   │  │
│  │  │  - cloudbaseRegion: ap-shanghai                          │   │  │
│  │  │  - External config (no rebuild needed)                   │   │  │
│  │  └──────────────────────────────────────────────────────────┘   │  │
│  │                                                                   │  │
│  │  ┌──────────────────────────────────────────────────────────┐   │  │
│  │  │  preload.js (IPC Bridge)                                 │   │  │
│  │  │  - Context Isolation                                     │   │  │
│  │  │  - Secure API exposure                                   │   │  │
│  │  └──────────────────────────────────────────────────────────┘   │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                              ▼                                          │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │                  Renderer Process (Vue 3)                         │  │
│  │  ┌──────────────────────────────────────────────────────────────┐ │  │
│  │  │                    Vue Router                                │ │  │
│  │  │  ┌──────────────┐          ┌────────────────────────────┐   │ │  │
│  │  │  │  Login.vue   │          │  Home.vue                  │   │ │  │
│  │  │  │  (中文界面)  │          │                            │   │ │  │
│  │  │  │              │          │  ┌──────────────────────┐  │   │ │  │
│  │  │  │  - 匿名登录  │          │  │  Sidebar             │  │   │ │  │
│  │  │  │  - 账号密码  │          │  │  - User Info         │  │   │ │  │
│  │  │  │  - 验证      │          │  │  - Search Box        │  │   │ │  │
│  │  │  │  - 密码强度  │          │  │  - Script List (🐍)  │  │   │ │  │
│  │  │  └──────────────┘          │  └──────────────────────┘  │   │ │  │
│  │  │                            │                            │   │ │  │
│  │  │                            │  ┌──────────────────────┐  │   │ │  │
│  │  │                            │  │  Content Area        │  │   │ │  │
│  │  │                            │  │  - Dashboard         │  │   │ │  │
│  │  │                            │  │  - Clock (HK Time)   │  │   │ │  │
│  │  │                            │  │  - Script Content    │  │   │ │  │
│  │  │                            │  │  - File Operations   │  │   │ │  │
│  │  │                            │  └──────────────────────┘  │   │ │  │
│  │  │                            └────────────────────────────┘   │ │  │
│  │  └──────────────────────────────────────────────────────────────┘ │  │
│  │                              ▼                                    │  │
│  │  ┌──────────────────────────────────────────────────────────────┐ │  │
│  │  │                  Service Layer                               │ │  │
│  │  │  ┌────────────────────────────────────────────────────────┐ │ │  │
│  │  │  │         cloudbase.js                                   │ │ │  │
│  │  │  │  - init(config)                                        │ │ │  │
│  │  │  │  - loginAnonymously()                                  │ │ │  │
│  │  │  │  - loginWithUsernameAndPassword()                      │ │ │  │
│  │  │  │  - getLoginState()                                     │ │ │  │
│  │  │  │  - logout()                                            │ │ │  │
│  │  │  │  - getDatabase() -> resource259                        │ │ │  │
│  │  │  │  - getTempFileURLs(fileList) -> Fresh signed URLs     │ │ │  │
│  │  │  └────────────────────────────────────────────────────────┘ │ │  │
│  │  │                                                              │ │  │
│  │  │  ┌────────────────────────────────────────────────────────┐ │ │  │
│  │  │  │         validation.js                                  │ │ │  │
│  │  │  │  - validateEmail()                                     │ │ │  │
│  │  │  │  - validatePassword()                                  │ │ │  │
│  │  │  │  - sanitizeInput()                                     │ │ │  │
│  │  │  │  - checkPasswordPatterns()                             │ │ │  │
│  │  │  └────────────────────────────────────────────────────────┘ │ │  │
│  │  └──────────────────────────────────────────────────────────────┘ │  │
│  └───────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    Tencent Cloudbase (ap-shanghai)                      │
│  ┌──────────────┐  ┌──────────────────┐  ┌───────────────────────┐    │
│  │ Auth Service │  │  Database        │  │  Cloud Storage        │    │
│  │              │  │                  │  │                       │    │
│  │ - Anonymous  │  │ - resource259    │  │ - cloud:// files      │    │
│  │ - Username   │  │ - NoSQL DB       │  │ - getTempFileURL()    │    │
│  │ - Password   │  │ - Real-time      │  │ - Signed URLs (1hr)   │    │
│  └──────────────┘  └──────────────────┘  └───────────────────────┘    │
│                                                                         │
│  Database Schema (resource259):                                        │
│  {                                                                      │
│    _id: string,                                                         │
│    name: string,              // 脚本名称                              │
│    description: string,       // 脚本描述                              │
│    content: string,           // 脚本内容                              │
│    buttonname: string,        // 按钮文本                              │
│    downloadlink: string[],    // 脚本文件 (cloud://file-ids)           │
│    rawdatalink: string[]      // 数据文件 (cloud://file-ids)           │
│  }                                                                      │
└─────────────────────────────────────────────────────────────────────────┘
```

## Component Flow

### Authentication Flow

```
用户输入 (Login.vue - 中文界面)
    │
    ├─▶ 匿名登录
    │   └─▶ cloudbase.loginAnonymously()
    │
    └─▶ 账号密码登录
        ├─▶ validation.js (输入验证)
        │   ├─▶ sanitizeInput() (XSS 防护)
        │   ├─▶ validatePassword() (密码强度)
        │   └─▶ checkPasswordPatterns()
        │
        └─▶ cloudbase.loginWithUsernameAndPassword()
            │
            ▼
    Cloudbase SDK (@cloudbase/js-sdk v2.23.3)
            │
            ▼
    Tencent Cloudbase API (ap-shanghai)
            │
            ▼
    Authentication Response
            │
            ├─▶ Success: 保存登录状态
            │   └─▶ router.push('/home')
            │
            └─▶ Failure: 显示错误消息（中文）
```

### Script Management Flow

```
Home.vue 加载
    │
    ├─▶ 从 config.json 或 .env 获取环境配置
    │   └─▶ window.electron.getConfig() (生产模式)
    │   └─▶ import.meta.env.VITE_CLOUDBASE_ENV (开发模式)
    │
    ├─▶ 初始化 Cloudbase
    │   └─▶ cloudbase.init({ env, region })
    │
    ├─▶ 加载脚本列表
    │   └─▶ cloudbase.getDatabase()
    │       └─▶ collection('resource259').get()
    │           └─▶ 返回脚本数据
    │
    ├─▶ 显示在侧边栏
    │   ├─▶ 用户信息 (头像、用户名、在线状态)
    │   ├─▶ 搜索框 (实时过滤)
    │   └─▶ 脚本列表 (🐍 图标 + 蓝色渐变背景)
    │
    └─▶ 用户选择脚本
        └─▶ 显示内容区域
            ├─▶ 脚本名称、描述、内容
            └─▶ 文件操作按钮
```

### File Download Flow

```
用户点击 "创建文件夹并下载"
    │
    ├─▶ 创建文件夹
    │   └─▶ window.electron.createFolder(name)
    │       └─▶ IPC → Main Process
    │           └─▶ fs.mkdirSync(name-YYYY-MM-DD)
    │               └─▶ shell.openPath(folderPath)
    │
    └─▶ 下载文件
        │
        ├─▶ 提取 downloadlink[] 和 rawdatalink[]
        │
        ├─▶ 检测重复 URL
        │
        ├─▶ 生成新鲜的下载链接
        │   └─▶ cloudbase.getTempFileURLs(uniqueURLs)
        │       └─▶ app.getTempFileURL({ fileList })
        │           └─▶ 返回临时签名 URL (有效期 1 小时)
        │
        ├─▶ 映射回原始数组 (保留重复项)
        │
        └─▶ window.electron.downloadFiles({ folder, links })
            └─▶ IPC → Main Process
                │
                ├─▶ 处理所有链接 (包括重复项)
                │
                ├─▶ 下载文件
                │   └─▶ https.get(url) → fs.createWriteStream()
                │
                ├─▶ 处理重复文件名
                │   └─▶ filename.ext(1), filename.ext(2)...
                │
                └─▶ 返回状态
                    ├─▶ 【文件夹】状态 (蓝色背景)
                    ├─▶ 【脚本文件下载】状态 (蓝色背景)
                    └─▶ 【数据文件下载】状态 (蓝色背景)
```

### Configuration Loading Flow

```
Application Startup
    │
    ├─▶ Development Mode (npm run electron:dev)
    │   └─▶ Load .env file
    │       └─▶ import.meta.env.VITE_CLOUDBASE_ENV
    │
    └─▶ Production Mode (.exe)
        └─▶ Load config.json (next to .exe)
            └─▶ fs.readFileSync('config.json')
                └─▶ Return { cloudbaseEnv, cloudbaseRegion }
                    └─▶ ipcMain.handle('get-config')
                        └─▶ Renderer: window.electron.getConfig()
```

### Data Flow

```
Vue Component (Home.vue)
    │
    ├─▶ Composition API (refs, computed, watch)
    │   ├─▶ menuItems (脚本列表)
    │   ├─▶ filteredMenuItems (搜索过滤)
    │   ├─▶ selectedScript (当前脚本)
    │   ├─▶ currentTime (HK 时间)
    │   └─▶ Status Messages (文件夹/脚本/数据)
    │
    ├─▶ Service Layer
    │   ├─▶ cloudbase.js
    │   │   ├─▶ Database queries
    │   │   ├─▶ File URL generation
    │   │   └─▶ Authentication
    │   │
    │   └─▶ validation.js
    │       └─▶ Input sanitization
    │
    └─▶ IPC Communication
        └─▶ window.electron.*
            ├─▶ getConfig()
            ├─▶ createFolder()
            └─▶ downloadFiles()
```

## Technology Stack Details

### Frontend Layer
- **Vue 3** (v3.4.0): Progressive JavaScript framework
  - Composition API for better code organization
  - Reactive state management (ref, computed, watch)
  - Component-based architecture
  - 完全中文化界面

- **Vue Router** (v4.2.5): Client-side routing
  - Hash-based routing (Electron compatible)
  - Navigation guards for auth checks
  - Two main routes: /login and /home

- **Vite** (v5.0.0): Build tool and dev server
  - Lightning-fast HMR
  - Optimized production builds
  - ES modules support
  - Environment variable support (.env)

### Desktop Layer
- **Electron** (v28.0.0): Cross-platform desktop framework
  - Main process: 
    - Window management (1200x800)
    - Chinese menu system (文件/编辑/查看/窗口/帮助)
    - IPC handlers (createFolder, downloadFiles, getConfig)
    - External config loader (config.json)
  - Renderer process: Vue application
  - IPC: Secure communication via preload.js
  - Context isolation for security
  - File system operations (fs, https, http modules)

- **Electron Builder** (v24.9.1): Application packaging
  - Windows NSIS installer
  - Unpacked executable distribution
  - Automatic config.json inclusion

### Backend Layer
- **Tencent Cloudbase**: Serverless backend platform
  - **@cloudbase/js-sdk** (v2.23.3)
  - Region: ap-shanghai
  - Services:
    - Authentication (Anonymous, Username/Password)
    - Cloud Database (NoSQL - resource259 collection)
    - Cloud Storage (getTempFileURL for signed URLs)
  
### Security & Validation
- **Custom Validation Module** (`src/utils/validation.js`)
  - Email validation (RFC 5322 compliant)
  - Password strength checking (weak/medium/strong)
  - XSS protection (HTML/script tag removal)
  - Input sanitization
  - Pattern-based password validation

## Security Architecture

### Security Measures

1. **Context Isolation**
   - Renderer process isolated from Node.js
   - Preload script as secure bridge (contextBridge)
   - No direct Node.js access from web content
   - Whitelisted IPC channels only

2. **IPC Security**
   - Secure IPC handlers in preload.js:
     - `window.electron.getConfig()` - Read config
     - `window.electron.createFolder(name)` - File operations
     - `window.electron.downloadFiles(params)` - Download operations
   - All data validated in main process
   - Errors handled securely without exposing internals

3. **Authentication Security**
   - Secure token storage (Cloudbase SDK managed)
   - Session management via Cloudbase
   - Generic error messages (no credential leakage)
   - Password strength enforcement (min 8 chars)

4. **Input Validation & Sanitization**
   - `validation.js` module:
     - Email validation (RFC 5322)
     - Password validation (length, patterns, strength)
     - XSS protection (remove HTML/script tags)
     - Username sanitization
   - Real-time validation feedback
   - Client-side and service-side validation

5. **Data Protection**
   - HTTPS for all Cloudbase API calls
   - Encrypted storage on Cloudbase
   - Temporary signed URLs (1-hour expiry)
   - No sensitive data in logs

6. **Configuration Security**
   - External config.json (not hardcoded)
   - Environment-specific settings
   - No credentials in config files
   - Config loaded securely from main process

### Security Best Practices Implemented

- ✅ No `eval()` or dynamic code execution
- ✅ Content Security Policy via Electron defaults
- ✅ Secure IPC communication patterns
- ✅ Input validation before database queries
- ✅ Password not stored in component state after login
- ✅ Generic error messages to users
- ✅ XSS prevention in user inputs
- ✅ Safe file download with path validation

## File Structure

```
logondemo-cloudbase/
├── electron/                  # Electron main process
│   ├── main.js               # Main entry (323 lines)
│   │                         # - Window management
│   │                         # - Chinese menu (文件/编辑/查看/窗口/帮助)
│   │                         # - Config loader (config.json)
│   │                         # - IPC handlers (folder, download, config)
│   │                         # - File download with duplicate handling
│   └── preload.js            # Secure IPC bridge (contextBridge)
│                             # - getConfig()
│                             # - createFolder()
│                             # - downloadFiles()
│
├── src/                      # Vue application
│   ├── components/           # Reusable components
│   │   └── LoadingSpinner.vue
│   │
│   ├── views/               # Page components
│   │   ├── Login.vue        # Login page (421 lines)
│   │   │                    # - 中文界面 (脚本集成管理系统)
│   │   │                    # - 匿名登录 / 账号密码
│   │   │                    # - Input validation
│   │   │                    # - Password strength indicator
│   │   │                    # - Config-based Cloudbase init
│   │   │
│   │   └── Home.vue         # Main app (1397 lines)
│   │                        # - Sidebar (user, search, script list)
│   │                        # - Dashboard (welcome + HK clock)
│   │                        # - Script content display
│   │                        # - File operations (folder + download)
│   │                        # - Three status message boxes
│   │                        # - Fresh URL generation via SDK
│   │
│   ├── services/            # Service layer
│   │   └── cloudbase.js     # Cloudbase integration (352 lines)
│   │                        # - init({ env, region })
│   │                        # - loginAnonymously()
│   │                        # - loginWithUsernameAndPassword()
│   │                        # - getLoginState()
│   │                        # - logout()
│   │                        # - getDatabase() -> resource259
│   │                        # - getTempFileURLs() -> Fresh signed URLs
│   │
│   ├── utils/               # Utility functions
│   │   └── validation.js    # Security validation (200 lines)
│   │                        # - validateEmail()
│   │                        # - validatePassword()
│   │                        # - sanitizeInput()
│   │                        # - checkPasswordPatterns()
│   │
│   ├── router/              # Routing configuration
│   │   └── index.js         # Routes: /login, /home
│   │
│   ├── App.vue              # Root component
│   ├── main.js              # Vue app entry point
│   └── style.css            # Global styles
│
├── config.json              # Production config (external)
│                            # - cloudbaseEnv: environment-id
│                            # - cloudbaseRegion: ap-shanghai
│
├── .env                     # Development config
│                            # - VITE_CLOUDBASE_ENV=your-env-id
│
├── index.html               # HTML template (title: 脚本集成管理系统 v0.1)
├── vite.config.js           # Vite configuration
├── package.json             # Dependencies & build scripts
│                            # - electron:dev
│                            # - electron:build
│                            # - build config (appId, productName)
│
└── dist-electron/           # Build output
    └── win-unpacked/        # Windows executable
        ├── 脚本集成管理系统.exe
        ├── config.json      # External config (user-editable)
        └── resources/
```

## Build Process

### Development Build

```
npm run electron:dev
    │
    ├─▶ Start Vite dev server (port 5173)
    │   ├─▶ HMR enabled
    │   ├─▶ Fast refresh
    │   └─▶ Load .env file
    │
    └─▶ Launch Electron
        ├─▶ NODE_ENV=development
        ├─▶ Load from localhost:5173
        ├─▶ Dev tools enabled
        ├─▶ Load config from ./config.json
        └─▶ Chinese menu initialized
```

### Production Build

```
npm run electron:build
    │
    ├─▶ Build Vue app (Vite)
    │   ├─▶ Optimize assets
    │   ├─▶ Minification
    │   ├─▶ Output to dist/
    │   └─▶ Bundle size: ~686 KB
    │
    └─▶ Package Electron (electron-builder)
        ├─▶ Platform: Windows (win32-x64)
        ├─▶ Bundle Vue dist + Electron
        ├─▶ Output: dist-electron/win-unpacked/
        ├─▶ Executable: 脚本集成管理系统.exe
        └─▶ Copy config.json to output folder
            (Manual step: Copy-Item config.json dist-electron\win-unpacked\)
```

### Build Configuration

**package.json**:
```json
{
  "build": {
    "appId": "com.opendigital.scriptmanager",
    "productName": "脚本集成管理系统",
    "files": [
      "dist/**/*",
      "electron/**/*",
      "config.json"
    ],
    "win": {
      "target": "nsis"
    }
  }
}
```

## Deployment Options

### Desktop Distribution
- **Windows**: 
  - Unpacked executable: `dist-electron/win-unpacked/脚本集成管理系统.exe`
  - Config file: `config.json` (must be in same folder as .exe)
  - Distribution package includes:
    - .exe file
    - config.json
    - resources/ folder
    - DLL dependencies

### Configuration Management
- **Development**: Edit `.env` file, restart dev server
- **Production**: Edit `config.json` next to .exe, restart app
- **No rebuild required** for environment changes

### User Distribution Checklist
1. ✅ Build application: `npm run electron:build`
2. ✅ Copy config.json to output folder
3. ✅ Verify config.json has correct cloudbaseEnv
4. ✅ Package entire win-unpacked/ folder
5. ✅ Provide instructions to edit config.json if needed

## Performance Optimizations

1. **Vue Optimizations**
   - Computed properties for filtered data (filteredMenuItems)
   - Efficient v-for with :key bindings
   - Minimal re-renders via reactive refs
   - Debounced search input (user typing)

2. **Asset Optimization**
   - CSS minification (13.13 KB → 2.81 KB gzip)
   - JS bundling (686 KB → 189 KB gzip)
   - Vite tree shaking
   - Icon sprites (🐍 emoji, no image assets)

3. **Database Optimization**
   - Single database query on load (resource259)
   - Client-side filtering via computed
   - Cached script list in component state
   - No real-time sync (read-only on load)

4. **Download Optimization**
   - Fresh URL generation before download (prevents 403 errors)
   - Batch URL processing (unique URLs only)
   - Parallel downloads via Promise.all
   - Stream-based file writing (low memory)
   - Duplicate detection and handling

5. **Caching**
   - Cloudbase SDK caching
   - Local component state
   - No service workers (desktop app)

## Key Features Implementation

### 1. External Configuration System
- **Problem**: Hardcoded environment ID requires rebuild
- **Solution**: config.json loaded at runtime
- **Implementation**:
  ```javascript
  // electron/main.js
  function loadConfig() {
    const configPath = app.isPackaged 
      ? path.join(path.dirname(app.getPath('exe')), 'config.json')
      : path.join(__dirname, '../config.json');
    return JSON.parse(fs.readFileSync(configPath));
  }
  ```

### 2. Fresh Download URL Generation
- **Problem**: Signed URLs expire after 1 hour (403 errors)
- **Solution**: Use Cloudbase SDK to generate fresh URLs
- **Implementation**:
  ```javascript
  // src/services/cloudbase.js
  async getTempFileURLs(fileList) {
    const result = await this.app.getTempFileURL({ fileList });
    return { success: true, fileList: result.fileList };
  }
  ```

### 3. Duplicate File Handling
- **Problem**: Same URL appears multiple times in array
- **Solution**: Download all instances with numbered filenames
- **Implementation**:
  ```javascript
  // electron/main.js
  const filenameMap = new Map();
  if (filenameMap.has(filename)) {
    const count = filenameMap.get(filename);
    filename = filename.replace(/(\.[^.]+)$/, `(${count})$1`);
    filenameMap.set(originalFilename, count + 1);
  }
  ```

### 4. Real-time HK Clock
- **Problem**: Display current time in Hong Kong timezone
- **Solution**: Mechanical analog clock with CSS animations
- **Implementation**:
  ```javascript
  // Home.vue
  const updateCurrentTime = () => {
    const hkTime = new Date().toLocaleString('en-US', { 
      timeZone: 'Asia/Hong_Kong' 
    });
    // Calculate angles for hour/minute/second hands
    hourAngle.value = (hours % 12) * 30 + minutes * 0.5;
    minuteAngle.value = minutes * 6;
    secondAngle.value = seconds * 6;
  };
  setInterval(updateCurrentTime, 1000);
  ```

### 5. Dynamic Chinese Menu System
- **Problem**: Default Electron menu is in English
- **Solution**: Custom menu template with Chinese labels
- **Implementation**:
  ```javascript
  // electron/main.js
  const template = [
    { label: '文件', submenu: [...] },
    { label: '编辑', submenu: [...] },
    { label: '查看', submenu: [...] },
    { label: '窗口', submenu: [...] },
    { label: '帮助', submenu: [...] }
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
  ```

## Data Models

### Database Schema (resource259)

```javascript
{
  _id: string,                    // Auto-generated by Cloudbase
  name: string,                   // 脚本名称 (e.g., "用户管理脚本")
  description: string,            // 脚本描述
  content: string,                // 脚本详细内容/说明
  buttonname: string,             // 按钮显示文本
  downloadlink: string[],         // 脚本文件云存储 IDs
                                  // Format: ["cloud://file-id-1", "cloud://file-id-2"]
  rawdatalink: string[]           // 数据文件云存储 IDs
                                  // Format: ["cloud://file-id-3"]
}
```

### Cloud Storage File Format

- **Storage Format**: `cloud://file-id-xxx`
- **Temporary URL Format**: `https://xxx.tcb.qcloud.la/xxx?sign=xxx&t=xxx`
- **URL Expiry**: 1 hour from generation
- **Generation Method**: `app.getTempFileURL({ fileList: [...] })`

### Component State Models

**Login.vue**:
```javascript
{
  loginMode: 'anonymous' | 'credentials',
  username: string,
  password: string,
  loading: boolean,
  error: string,
  validationErrors: {
    username: string,
    password: string
  },
  passwordStrength: 'weak' | 'medium' | 'strong' | ''
}
```

**Home.vue**:
```javascript
{
  // User state
  username: string,
  
  // Script management
  menuItems: Array<ScriptItem>,
  filteredMenuItems: Array<ScriptItem>,  // computed
  selectedScript: ScriptItem | null,
  loadingResources: boolean,
  searchQuery: string,
  
  // File operations
  folderMessage: string,
  scriptMessage: string,
  dataMessage: string,
  scriptStatus: 'success' | 'error' | 'warning',
  dataStatus: 'success' | 'error' | 'warning',
  
  // Clock
  currentTime: Date,
  hourAngle: number,
  minuteAngle: number,
  secondAngle: number
}
```

## Future Enhancements

### Completed Features ✅
- ✅ Database operations UI (resource259 collection)
- ✅ File download (batch, with duplicate handling)
- ✅ Real-time data display (scripts from database)
- ✅ User profile display (username, avatar)
- ✅ Settings (external config.json)
- ✅ Chinese localization (complete)
- ✅ Search functionality (real-time filtering)

### Potential Future Features
- [ ] File upload to cloud storage
- [ ] Cloud function execution from UI
- [ ] Real-time database sync (websocket)
- [ ] Push notifications (download completion)
- [ ] Batch operations (multiple scripts at once)
- [ ] Script favorites/bookmarks
- [ ] Download history tracking
- [ ] Dark mode theme
- [ ] Export/Import configurations
- [ ] Multi-environment switching UI
- [ ] Script versioning
- [ ] User permissions/roles

### Scalability Considerations
- **State Management**: Currently using Composition API refs
  - Could migrate to Pinia for complex state
- **Error Handling**: Basic error messages
  - Could add error boundary components
  - Centralized error logging service
- **Analytics**: No tracking currently
  - Could add usage analytics
  - Download statistics
- **Testing**: No automated tests
  - Could add Vitest for unit tests
  - Playwright for E2E tests
- **Monitoring**: Console logging only
  - Could integrate with monitoring service
  - Performance metrics tracking

## Technical Decisions

### Why External config.json?
- ✅ No rebuild needed for environment changes
- ✅ Easy deployment to multiple environments
- ✅ User-configurable without technical knowledge
- ✅ Keeps sensitive data out of compiled code

### Why Cloudbase SDK in Renderer?
- ✅ Direct database access without IPC overhead
- ✅ Better performance for queries
- ✅ Simpler code (no main/renderer split)
- ✅ SDK handles authentication state

### Why Duplicate Download Instead of Dedup?
- ✅ Preserves user intent (if listed twice, download twice)
- ✅ Transparent behavior (count matches data)
- ✅ Intelligent naming prevents conflicts
- ✅ Clear status reporting per source

### Why No Framework for State Management?
- ✅ App complexity doesn't warrant Pinia/Vuex
- ✅ Composition API sufficient for current needs
- ✅ Fewer dependencies, smaller bundle
- ✅ Easy to migrate later if needed

---

**Last Updated**: 2025-12-25  
**Version**: 0.1  
**Architecture Status**: Production-ready
