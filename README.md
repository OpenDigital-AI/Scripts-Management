# Logon Demo - Cloudbase

A cross-platform desktop application built with Electron, Vue 3, and Tencent Cloudbase for authentication.

## Features

- 🖥️ **Cross-platform Desktop App** - Built with Electron
- ⚡ **Modern Frontend** - Vue 3 with Composition API
- 🔐 **Cloudbase Authentication** - Tencent Cloudbase integration
- 🎨 **Beautiful UI** - Modern, responsive design
- 🔒 **Secure IPC** - Context isolation and preload scripts
- 🚀 **Fast Development** - Vite for instant hot reload
- ✅ **Input Validation** - Comprehensive security validation
- 🛡️ **XSS Protection** - Input sanitization and validation
- 🔑 **Password Strength** - Real-time password strength checking

## Technology Stack

- **Frontend**: Vue 3, Vue Router
- **Desktop Framework**: Electron
- **Backend Service**: Tencent Cloudbase (腾讯云开发)
- **Build Tool**: Vite
- **Package Manager**: npm

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A Tencent Cloudbase account and environment

## Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/OpenDigital-AI/logondemo-cloudbase.git
   cd logondemo-cloudbase
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Cloudbase**
   
   Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your Cloudbase environment ID:
   ```
   VITE_CLOUDBASE_ENV=your-env-id
   ```

   To get your Cloudbase environment ID:
   - Visit [Tencent Cloudbase Console](https://console.cloud.tencent.com/tcb)
   - Create a new environment or use an existing one
   - Copy the Environment ID

4. **Configure Cloudbase Authentication**
   
   In your Cloudbase console:
   - Enable the authentication methods you want to use (Anonymous, Email/Password, etc.)
   - Configure any necessary security rules

## Development

Run the application in development mode:

```bash
npm run electron:dev
```

This will:
1. Start the Vite development server
2. Launch the Electron app
3. Enable hot reload for Vue components
4. Open developer tools automatically

For Vue-only development (in browser):
```bash
npm run dev
```

## Build

Build the application for production:

```bash
npm run electron:build
```

This will create platform-specific installers in the `dist-electron` directory.

Build options:
- **macOS**: Creates a `.dmg` file
- **Windows**: Creates an NSIS installer
- **Linux**: Creates an AppImage

## Project Structure

```
logondemo-cloudbase/
├── electron/              # Electron main process files
│   ├── main.js           # Main process entry point
│   └── preload.js        # Preload script for IPC
├── src/                  # Vue application source
│   ├── components/       # Vue components
│   ├── views/           # Vue views/pages
│   │   ├── Login.vue    # Login page
│   │   └── Home.vue     # Home page
│   ├── services/        # Service layer
│   │   └── cloudbase.js # Cloudbase service
│   ├── router/          # Vue Router configuration
│   │   └── index.js     # Router setup
│   ├── App.vue          # Root component
│   ├── main.js          # Vue app entry point
│   └── style.css        # Global styles
├── index.html           # HTML template
├── vite.config.js       # Vite configuration
├── package.json         # Project dependencies
└── README.md           # This file
```

## Usage

### Login Methods

The application supports multiple authentication methods:

1. **Anonymous Login**
   - Click "Anonymous" tab
   - Click "Login Anonymously" button
   - No credentials required

2. **Credential-based Login**
   - Click "Credentials" tab
   - Enter username/email and password
   - Click "Login" button

### Features Available

- User authentication with Cloudbase
- Session management
- User information display
- Secure logout

## Configuration

### Electron Configuration

Edit `electron/main.js` to customize:
- Window size and properties
- Developer tools settings
- IPC handlers

### Vue Configuration

Edit `vite.config.js` to customize:
- Build settings
- Development server options
- Path aliases

### Cloudbase Configuration

Edit `src/services/cloudbase.js` to:
- Add more authentication methods
- Integrate database operations
- Add cloud function calls
- Implement file storage

## Troubleshooting

### Cloudbase Connection Issues

If you're having trouble connecting to Cloudbase:
1. Verify your environment ID in `.env`
2. Check that authentication is enabled in Cloudbase console
3. Ensure your network can access Tencent Cloud services

### Build Issues

If the build fails:
1. Clear node_modules and reinstall: `rm -rf node_modules && npm install`
2. Clear build cache: `rm -rf dist dist-electron`
3. Ensure you have the latest Electron builder

### Development Mode Issues

If hot reload isn't working:
1. Check that port 5173 is available
2. Restart the development server
3. Clear browser/Electron cache

## Security

This application implements comprehensive security measures:

- **Input Validation** - All user inputs are validated and sanitized
- **Password Requirements** - Enforced password strength policies
- **XSS Protection** - HTML/script tag removal from inputs
- **Generic Error Messages** - No sensitive information leakage
- **Environment Validation** - Cloudbase configuration validation

For detailed security documentation, see:
- [SECURITY_VALIDATION.md](SECURITY_VALIDATION.md) - Complete security guide
- [VALIDATION_GUIDE.md](VALIDATION_GUIDE.md) - Developer quick reference

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License

## Resources

- [Electron Documentation](https://www.electronjs.org/docs)
- [Vue 3 Documentation](https://vuejs.org/)
- [Tencent Cloudbase Documentation](https://cloud.tencent.com/document/product/876)
- [Vite Documentation](https://vitejs.dev/)
- [OWASP Input Validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)

## Support

For issues and questions:
- Open an issue on GitHub
- Check Tencent Cloudbase documentation
- Review Electron and Vue documentation