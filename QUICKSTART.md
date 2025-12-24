# Logon Demo - Cloudbase

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Set up environment:
```bash
cp .env.example .env
# Edit .env and add your Cloudbase environment ID
```

3. Run in development mode:
```bash
npm run electron:dev
```

## Available Scripts

- `npm run dev` - Run Vue app in browser (for testing UI)
- `npm run build` - Build Vue app for production
- `npm run electron:dev` - Run Electron app in development mode
- `npm run electron:build` - Build Electron app for distribution

## First Time Setup

If this is your first time running the application:

1. **Get Cloudbase Credentials**
   - Go to [Tencent Cloudbase Console](https://console.cloud.tencent.com/tcb)
   - Create a new environment or use existing
   - Copy your Environment ID

2. **Configure the App**
   - Copy `.env.example` to `.env`
   - Replace `your-env-id` with your actual Environment ID
   - Save the file

3. **Enable Authentication**
   - In Cloudbase console, go to Authentication
   - Enable "Anonymous Login" or "Email/Password" authentication
   - Save the settings

4. **Run the App**
   - Execute `npm run electron:dev`
   - The app should launch with the login screen

## Troubleshooting

### Dependencies not installing
```bash
rm -rf node_modules package-lock.json
npm install
```

### Build fails
```bash
rm -rf dist dist-electron
npm run build
```

### Electron app doesn't start
- Check that port 5173 is not in use
- Try running `npm run dev` first to see if Vue builds correctly
- Check Node.js version (should be 16+)

## Project Structure

```
├── electron/           # Electron main process
├── src/               # Vue application
│   ├── views/        # Pages (Login, Home)
│   ├── services/     # Cloudbase service
│   └── router/       # Vue Router config
├── dist/             # Built Vue app (gitignored)
└── dist-electron/    # Built Electron app (gitignored)
```
