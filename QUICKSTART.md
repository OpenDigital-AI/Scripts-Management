# 脚本集成管理系统 v0.1 - Quick Start Guide

## 快速开始 / Quick Start

### Prerequisites
- Node.js 16+ installed
- Windows OS (tested)
- Tencent Cloudbase account

### Installation (3 Steps)

1. **Install dependencies:**
```bash
npm install
```

2. **Configure Cloudbase:**
```json
// Create or edit: config.json
{
  "cloudbaseEnv": "digital-connect-3g0d1vrha9ea1e5c",
  "cloudbaseRegion": "ap-shanghai"
}
```

3. **Run the application:**
```bash
npm run electron:dev
```

## Available Scripts

| Command | Purpose | Output |
|---------|---------|--------|
| `npm run dev` | Vue app in browser (UI testing) | http://localhost:5173 |
| `npm run build` | Build Vue for production | dist/ |
| `npm run electron:dev` | Run Electron in development | Dev window |
| `npm run electron:build` | Build Windows executable | dist-electron/win-unpacked/脚本集成管理系统.exe |
| `npm run verify` | Verify setup | Console diagnostics |

## First Time Setup

### 1. Get Cloudbase Credentials
- Go to [Tencent Cloudbase Console](https://console.cloud.tencent.com/tcb)
- Create a new environment or use existing
- Copy your Environment ID and Region

### 2. Configure the Application
**Option 1: External Config (Recommended for Production)**
```json
// config.json (create in project root)
{
  "cloudbaseEnv": "your-environment-id",
  "cloudbaseRegion": "ap-shanghai"
}
```

**Option 2: Environment Variable (Legacy Development)**
```bash
# .env file
VITE_CLOUDBASE_ENV=your-environment-id
```

### 3. Enable Authentication
- In Cloudbase console, go to **Authentication** (身份认证)
- Enable **Anonymous Login** (匿名登录) or **Username/Password** (用户名密码)
- Save the settings

### 4. Set Up Database
- Create collection: `resource259`
- Add sample documents:
```json
{
  "name": "示例脚本",
  "description": "这是一个示例脚本",
  "content": "print('Hello World')",
  "scriptFileUrls": ["cloud://your-file-id-1"],
  "dataFileUrls": ["cloud://your-file-id-2"],
  "isHidden": false
}
```

### 5. Run the Application
```bash
npm run electron:dev
```
- App launches with Chinese login screen (匿名登录 / 账号密码)
- After login, see script management interface

## Features Overview

### Login Page (登录页面)
- **匿名登录** - Anonymous login (one-click access)
- **账号密码** - Username/Password authentication
- Password strength indicator (弱/中/强)
- Input validation and XSS protection

### Home Page (主页)
- **Sidebar (侧边栏)**:
  - User avatar and info display
  - Search bar (real-time filtering)
  - Script list with 🐍 Python icons
  - Logout button

- **Main Content (主内容区)**:
  - App title: 脚本集成管理系统 v0.1
  - HK timezone analog clock
  - Selected script display (name, description, content)
  - Download button for file operations

- **Status Boxes (状态框)**:
  - 【文件夹】 - Folder creation status
  - 【脚本文件下载】 - Script file download status
  - 【数据文件下载】 - Data file download status

### File Operations
1. Click download button (下载)
2. System creates folder: `{script-name}-YYYY-MM-DD`
3. Downloads files from two sources:
   - Script files (scriptFileUrls)
   - Data files (dataFileUrls)
4. Handles duplicate URLs with auto-increment (file_1.py, file_2.py...)
5. Auto-opens downloaded folder

## Troubleshooting

### Dependencies not installing
```bash
Remove-Item -Recurse -Force node_modules, package-lock.json
npm install
```

### Build fails
```bash
Remove-Item -Recurse -Force dist, dist-electron
npm run build
```

### Electron app doesn't start
- Check that port 5173 is not in use
- Verify config.json exists and has correct format
- Try running `npm run dev` to test Vue app separately
- Check Node.js version: `node --version` (should be 16+)

### File locking during build
- Close any running instance of 脚本集成管理系统.exe
- Wait a few seconds, then retry `npm run electron:build`

### 403 errors on file downloads
- System uses getTempFileURL() for fresh signed URLs
- Ensure files exist in Cloudbase Storage
- Check file IDs in database are correct (cloud://...)

### Chinese characters not displaying
- Application uses UTF-8 encoding
- Windows should display Chinese characters correctly
- If issues persist, check Windows language settings

## Project Structure

```
logondemo-cloudbase/
├── electron/
│   ├── main.js                  # Main process (323 lines)
│   │   - Window management, Chinese menus
│   │   - Config loader, IPC handlers
│   │   - File operations, duplicate handling
│   └── preload.js               # IPC bridge
├── src/
│   ├── views/
│   │   ├── Login.vue            # Login page (421 lines, Chinese UI)
│   │   └── Home.vue             # Script management (1397 lines)
│   ├── components/
│   │   └── LoadingSpinner.vue
│   ├── services/
│   │   ├── cloudbase.js         # Cloudbase SDK (352 lines)
│   │   └── validation.js        # Input validation (200 lines)
│   ├── router/
│   │   └── index.js             # Vue Router (hash mode)
│   ├── App.vue
│   ├── main.js
│   └── style.css
├── config.json                  # External configuration (NEW)
├── dist/                        # Built Vue app (gitignored)
└── dist-electron/              # Built Electron app (gitignored)
    └── win-unpacked/
        └── 脚本集成管理系统.exe
```
