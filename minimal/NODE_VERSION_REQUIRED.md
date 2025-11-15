# Node.js Version Issue

## Current Problem
Your system is running Node.js v12.22.9, but this project requires Node.js 18+ to work properly.

## Solutions

### Option 1: Upgrade Node.js (Recommended)

#### Using nvm (Node Version Manager):
```bash
# Install nvm if you don't have it
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Restart your terminal, then:
nvm install 18
nvm use 18
nvm alias default 18

# Verify the installation
node --version  # Should show v18.x.x

# Then reinstall dependencies
cd /home/eraldomr/dev/novelWriter/minimal
rm -rf node_modules package-lock.json
npm install

# Now you can run:
npm run electron:dev
```

#### Using conda (since you're in base environment):
```bash
conda install -c conda-forge nodejs=18
node --version  # Should show v18.x.x

# Then reinstall dependencies
cd /home/eraldomr/dev/novelWriter/minimal
rm -rf node_modules package-lock.json
npm install

# Now you can run:
npm run electron:dev
```

### Option 2: Use System Package Manager

#### Ubuntu/Debian:
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### Fedora/RHEL:
```bash
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install nodejs
```

## After Upgrading Node.js

Once you have Node 18+ installed, run:

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Run in development mode
npm run electron:dev

# Or debug from VS Code
# Press F5 and select "Electron: All"
```

## What Each Script Does

- `npm run dev` - Run as web app (browser)
- `npm run electron:dev` - Run as Electron app (requires Node 18+)
- `npm run build` - Build production Electron app
- `npm run electron:preview` - Build and preview Electron app

## VS Code Debugging

After upgrading Node.js, you can use the VS Code debugger:
1. Press F5 or go to Run & Debug (Ctrl+Shift+D)
2. Select "Electron: All" from the dropdown
3. Click Start Debugging

The debugger will automatically build and launch your Electron app.
