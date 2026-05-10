const fs = require('fs');
const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '..');

const config = getDefaultConfig(projectRoot);

config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

config.resolver.unstable_conditionNames = [
  'react-native', 'browser', 'import', 'require', 'default',
];
config.resolver.unstable_conditionsByPlatform = {
  android: ['react-native', 'import', 'require', 'default'],
  ios: ['react-native', 'import', 'require', 'default'],
};

let nobleHashesDir = null;
try {
  nobleHashesDir = path.dirname(require.resolve('@noble/hashes/package.json'));
} catch {}

const MWA_PACKAGES = [
  '@solana-mobile/mobile-wallet-adapter-protocol',
  '@solana-mobile/mobile-wallet-adapter-protocol-web3js',
];

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (nobleHashesDir && moduleName.startsWith('@noble/hashes/')) {
    const subpath = moduleName.replace('@noble/hashes/', '').replace(/\.js$/, '');
    const filePath = path.join(nobleHashesDir, subpath + '.js');
    if (fs.existsSync(filePath)) {
      return { type: 'sourceFile', filePath };
    }
  }
  if (platform !== 'web' && MWA_PACKAGES.includes(moduleName)) {
    const pkgName = moduleName.replace('@solana-mobile/', '');
    const filePath = path.join(projectRoot, 'node_modules', '@solana-mobile', pkgName, 'lib/cjs/index.native.js');
    if (fs.existsSync(filePath)) return { type: 'sourceFile', filePath };
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
