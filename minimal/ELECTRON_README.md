# Book Editing App - Electron Edition

This is an Electron-based desktop application built with React, TypeScript, and Vite.

## Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

## Installation

Install all dependencies:

```bash
npm install
```

## Development

To run the app in development mode with hot-reload:

```bash
npm run electron:dev
```

This will start the Vite dev server and launch the Electron app with DevTools enabled.

## Building

### Build for Distribution

To build the application for your current platform:

```bash
npm run build
```

This will:
1. Build the React app using Vite
2. Package the Electron app using electron-builder
3. Create distributable files in the `release/` directory

### Platform-Specific Builds

The build configuration in `package.json` supports:
- **macOS**: DMG installer
- **Windows**: NSIS installer
- **Linux**: AppImage

## Project Structure

```
.
├── electron/           # Electron main and preload scripts
│   ├── main.ts        # Main process (window management, app lifecycle)
│   ├── preload.ts     # Preload script (secure IPC bridge)
│   └── electron.d.ts  # TypeScript definitions for Electron API
├── src/               # React application source
├── dist/              # Built React app (web)
├── dist-electron/     # Built Electron scripts
└── release/           # Final packaged applications
```

## Scripts

- `npm run dev` - Run Vite dev server only (web version)
- `npm run electron:dev` - Run Electron app in development mode
- `npm run electron:preview` - Build and preview the Electron app
- `npm run build` - Build for production and package with electron-builder

## Electron Features

### IPC Communication

The app uses a secure IPC bridge through the preload script. To add new IPC handlers:

1. **Add handler in `electron/main.ts`**:
```typescript
ipcMain.handle('my-channel', (event, arg) => {
  // Handle the request
  return result;
});
```

2. **Expose in `electron/preload.ts`**:
```typescript
contextBridge.exposeInMainWorld('electronAPI', {
  myMethod: (arg) => ipcRenderer.invoke('my-channel', arg),
});
```

3. **Update types in `electron/electron.d.ts`**:
```typescript
interface Window {
  electronAPI: {
    myMethod: (arg: string) => Promise<any>;
  };
}
```

4. **Use in React components**:
```typescript
const result = await window.electronAPI.myMethod('argument');
```

## Configuration

### App Identity

Update the following in `package.json` for your app:
- `name`: App package name
- `version`: App version
- `build.appId`: Unique app identifier (reverse DNS notation)
- `build.productName`: Display name for the app

### Window Settings

Modify window properties in `electron/main.ts`:
```typescript
mainWindow = new BrowserWindow({
  width: 1200,    // Window width
  height: 800,    // Window height
  // Add more options...
});
```

## Troubleshooting

### Development Issues

If the app doesn't start in development mode:
1. Ensure all dependencies are installed: `npm install`
2. Clear any cached builds: `rm -rf dist dist-electron`
3. Restart the development server

### Build Issues

If builds fail:
1. Check that `electron-builder` is properly installed
2. Ensure you have the necessary build tools for your platform
3. Review the `build` configuration in `package.json`

## License

Private
