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
  android: ['react-native', 'browser', 'import', 'require', 'default'],
  ios: ['react-native', 'browser', 'import', 'require', 'default'],
};

let nobleHashesDir = null;
try {
  nobleHashesDir = path.dirname(require.resolve('@noble/hashes/package.json'));
} catch {}

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (nobleHashesDir && moduleName.startsWith('@noble/hashes/')) {
    const subpath = moduleName.replace('@noble/hashes/', '').replace(/\.js$/, '');
    const filePath = path.join(nobleHashesDir, subpath + '.js');
    if (fs.existsSync(filePath)) {
      return { type: 'sourceFile', filePath };
    }
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
