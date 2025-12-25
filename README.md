# 脚本集成管理系统 v0.1

一个基于 Electron、Vue 3 和腾讯云开发构建的跨平台桌面应用程序，提供脚本管理、文件下载和云数据库集成功能。

## ✨ 主要特性

- 🖥️ **跨平台桌面应用** - 使用 Electron 构建，支持 Windows/macOS/Linux
- ⚡ **现代化前端** - Vue 3 Composition API + Vite 快速开发
- 🔐 **云开发认证** - 腾讯云开发（Cloudbase）集成，支持匿名登录和账号密码登录
- 📊 **动态脚本管理** - 从云数据库实时加载脚本列表
- 📁 **智能文件管理** - 自动创建日期标记文件夹，批量下载文件
- 🔄 **自动 URL 刷新** - 使用 Cloudbase SDK 自动生成新鲜的下载链接
- 🎨 **精美中文界面** - 完全汉化的用户界面，侧边栏导航 + 搜索功能
- ⏰ **实时时钟** - HK 时区机械表盘显示
- 🛡️ **安全验证** - 全面的输入验证和 XSS 防护
- ⚙️ **外部配置** - 通过 config.json 轻松更新环境设置，无需重新编译

## 🚀 技术栈

### 前端
- **Vue 3** (v3.4.0) - Composition API
- **Vue Router** (v4.2.5) - 路由管理
- **Vite** (v5.0.0) - 构建工具和开发服务器

### 桌面框架
- **Electron** (v28.0.0) - 跨平台桌面应用框架
- **Electron Builder** (v24.9.1) - 应用打包和分发

### 后端服务
- **Tencent Cloudbase** (@cloudbase/js-sdk v2.23.3)
  - 用户认证
  - NoSQL 数据库 (resource259 集合)
  - 云存储 (自动生成临时下载链接)
  - Region: ap-shanghai

### 安全性
- 自定义输入验证工具
- 密码强度检查
- XSS 防护和输入清理
- Context Isolation 和 Preload Scripts

## 📋 系统要求

## 📋 系统要求

- Node.js (v16 或更高版本)
- npm 或 yarn
- 腾讯云开发账号和环境

## 🔧 安装和配置

### 1. 克隆仓库
```bash
git clone https://github.com/OpenDigital-AI/logondemo-cloudbase.git
cd logondemo-cloudbase
```

### 2. 安装依赖
```bash
npm install
```

### 3. 配置云开发环境

#### 开发模式配置
创建 `.env` 文件：
```bash
cp .env.example .env
```

更新 `.env` 文件：
```
VITE_CLOUDBASE_ENV=your-env-id
```

#### 生产模式配置（.exe 文件）
编辑 `config.json` 文件：
```json
{
  "cloudbaseEnv": "digital-connect-3g0d1vrha9ea1e5c",
  "cloudbaseRegion": "ap-shanghai"
}
```

> **重要提示**: 使用 .exe 文件时，只需修改 config.json 文件即可更改云开发环境，无需重新编译应用！

### 4. 获取云开发环境 ID

1. 访问 [腾讯云开发控制台](https://console.cloud.tencent.com/tcb)
2. 创建新环境或使用现有环境
3. 复制环境 ID (Environment ID)

### 5. 配置云开发认证

在云开发控制台中：
- 启用所需的认证方式（匿名登录、用户名密码等）
- 配置必要的安全规则
- 创建 `resource259` 数据库集合

## 💻 开发

### 启动开发模式
```bash
npm run electron:dev
```

这将：
1. 启动 Vite 开发服务器 (http://localhost:5173)
2. 启动 Electron 应用
3. 启用 Vue 组件热重载
4. 自动打开开发者工具

### 仅 Vue 开发（浏览器）
```bash
npm run dev
```

## 📦 构建生产版本

### 构建 Windows .exe
```bash
npm run electron:build
```

构建完成后：
- 输出目录: `dist-electron/win-unpacked/`
- 可执行文件: `脚本集成管理系统.exe`
- 配置文件: `config.json` (自动复制到输出目录)

### 分发应用

将以下文件打包分发：
```
win-unpacked/
├── 脚本集成管理系统.exe
├── config.json           # 云开发环境配置
├── resources/
└── *.dll
```

用户只需：
1. 运行 `脚本集成管理系统.exe`
2. 如需更改环境，编辑 `config.json` 后重启应用

## 📁 项目结构

```
logondemo-cloudbase/
├── electron/                  # Electron 主进程文件
│   ├── main.js               # 主进程入口（菜单、IPC、配置加载）
│   └── preload.js            # 预加载脚本（IPC 桥接）
├── src/                      # Vue 应用源码
│   ├── components/           # Vue 组件
│   │   └── LoadingSpinner.vue
│   ├── views/               # 视图/页面
│   │   ├── Login.vue        # 登录页面（中文界面）
│   │   └── Home.vue         # 主页面（脚本管理、文件下载）
│   ├── services/            # 服务层
│   │   └── cloudbase.js     # Cloudbase 服务（认证、数据库、存储）
│   ├── utils/               # 工具函数
│   │   └── validation.js    # 输入验证和安全工具
│   ├── router/              # Vue Router 配置
│   │   └── index.js         # 路由设置
│   ├── App.vue              # 根组件
│   ├── main.js              # Vue 应用入口
│   └── style.css            # 全局样式
├── config.json              # 生产环境配置（云开发环境 ID）
├── index.html               # HTML 模板
├── vite.config.js           # Vite 配置
├── package.json             # 项目依赖和构建配置
└── README.md               # 本文件
```

## 🎯 功能详解

### 1. 用户认证

支持两种登录方式：

**匿名登录**
- 点击"匿名登录"标签
- 无需凭证即可访问

**账号密码登录**
- 点击"账号密码"标签
- 输入用户名和密码
- 实时密码强度检查（弱/中/强）
- 输入验证和 XSS 防护

### 2. 脚本管理

**侧边栏功能**
- 显示用户头像和在线状态
- 退出登录按钮
- 实时搜索框（搜索脚本名称、描述、内容）
- 动态脚本列表（从 resource259 集合加载）
- 脚本计数器（排除非脚本项）

**Dashboard**
- 欢迎消息：欢迎 {Username} 使用脚本集成管理工具！
- HK 时区机械表盘（实时更新）

### 3. 文件操作

**创建文件夹**
- 按钮位于脚本内容下方
- 文件夹命名：`{脚本名称}-YYYY-MM-DD`
- 自动处理重名文件夹
- 创建后自动打开文件夹

**批量下载文件**
- 从两个字段下载：
  - `downloadlink` (脚本文件)
  - `rawdatalink` (数据文件)
- 自动生成新鲜的下载链接（使用 Cloudbase SDK）
- 智能处理重复 URL（分别下载，文件名追加序号）
- 重复文件命名格式：`filename.ext(1)`, `filename.ext(2)`
- 三个独立的状态消息框：
  - 【文件夹】- 蓝色背景
  - 【脚本文件下载】- 蓝色背景
  - 【数据文件下载】- 蓝色背景

### 4. 数据库集成

**集合结构** (`resource259`)
```javascript
{
  _id: "唯一标识",
  name: "脚本名称",
  description: "脚本描述",
  content: "脚本内容",
  buttonname: "按钮文本",
  downloadlink: ["cloud://file-id-1", "cloud://file-id-2"],  // 脚本文件
  rawdatalink: ["cloud://file-id-3"]                         // 数据文件
}
```

**云存储文件 ID 格式**
- 使用 `cloud://` 格式存储文件 ID
- SDK 自动转换为临时签名 URL（有效期 1 小时）
- 每次下载前自动刷新 URL

### 5. 应用菜单（中文）

- **文件** - 退出
- **编辑** - 撤销、重做、剪切、复制、粘贴、全选
- **查看** - 重新加载、开发者工具、缩放、全屏
- **窗口** - 最小化、关闭
- **帮助** - 关于对话框

## ⚙️ 配置说明

### config.json 配置文件

生产环境（.exe 文件）使用外部配置文件：

```json
{
  "cloudbaseEnv": "your-environment-id",
  "cloudbaseRegion": "ap-shanghai"
}
```

**优势**：
- ✅ 无需重新编译即可更换环境
- ✅ 便于多环境部署
- ✅ 配置文件与 .exe 在同一目录

### Electron 配置

编辑 `electron/main.js` 自定义：
- 窗口大小和属性
- 应用菜单（中文菜单项）
- IPC 处理器
- 配置文件加载逻辑

### Vue 配置

编辑 `vite.config.js` 自定义：
- 构建设置
- 开发服务器选项
- 路径别名

### Cloudbase 服务配置

编辑 `src/services/cloudbase.js` 添加：
- 更多认证方法
- 数据库操作
- 云函数调用
- 文件存储操作

## 🔧 故障排除

### 云开发连接问题

如果无法连接到云开发：
1. 验证 `config.json` 或 `.env` 中的环境 ID
2. 检查云开发控制台中是否启用了认证
3. 确保网络可以访问腾讯云服务
4. 查看控制台日志获取详细错误信息

### 构建问题

如果构建失败：
1. 确保关闭所有正在运行的应用实例
2. 清理并重新安装依赖：
   ```bash
   rm -rf node_modules dist dist-electron
   npm install
   ```
3. 确保使用最新版本的 Electron Builder
4. 检查 `package.json` 中的 build 配置

### 开发模式问题

如果热重载不工作：
1. 检查端口 5173 是否可用
2. 重启开发服务器
3. 清除浏览器/Electron 缓存
4. 检查防火墙设置

### 文件下载问题

如果文件下载失败（403 错误）：
1. 确保使用 `cloud://` 格式存储文件 ID
2. 检查云存储文件是否存在
3. SDK 会自动生成新鲜的临时 URL
4. 查看控制台日志确认 URL 生成过程

## 🔒 安全特性

应用实现了全面的安全措施：

- **输入验证** - 所有用户输入都经过验证和清理
- **密码要求** - 强制执行密码强度策略（最少 8 个字符）
- **XSS 防护** - 从输入中移除 HTML/脚本标签
- **通用错误消息** - 不泄露敏感信息
- **环境验证** - 云开发配置验证
- **Context Isolation** - Electron 进程隔离
- **Preload Scripts** - 安全的 IPC 通信

安全文档：
- `src/utils/validation.js` - 验证工具实现
- 输入清理和 XSS 防护
- 密码强度检查（弱/中/强）

## 🤝 贡献

欢迎贡献！请随时提交 Pull Request。

## 📄 许可证

MIT License

## 📚 资源链接

- [Electron 文档](https://www.electronjs.org/docs)
- [Vue 3 文档](https://cn.vuejs.org/)
- [腾讯云开发文档](https://cloud.tencent.com/document/product/876)
- [Vite 文档](https://cn.vitejs.dev/)
- [Cloudbase JS SDK](https://docs.cloudbase.net/api-reference/webv2/initialization)

## 💡 技术亮点

1. **外部配置文件** - 使用 `config.json` 实现生产环境配置分离
2. **自动 URL 刷新** - 使用 Cloudbase SDK `getTempFileURL()` API 自动生成新鲜签名 URL
3. **智能重复处理** - 相同 URL 分别下载，自动追加序号
4. **实时搜索** - Vue computed 属性实现的高性能过滤
5. **机械表盘** - CSS 动画实现的模拟时钟，显示 HK 时区
6. **独立状态框** - 三个独立的彩色状态消息框，实时反馈操作结果
7. **完全中文化** - 登录页、主页、菜单、消息全部汉化

## 📞 支持

遇到问题？
- 在 GitHub 上提交 Issue
- 查看腾讯云开发文档
- 查阅 Electron 和 Vue 文档
- 检查控制台日志获取详细错误信息

---

**开发团队**: OpenDigital-AI  
**最后更新**: 2025-12-25  
**版本**: v0.1