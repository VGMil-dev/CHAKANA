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

let babelRuntimeDir = null;
try {
  babelRuntimeDir = path.dirname(require.resolve('@babel/runtime/package.json'));
} catch {}

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (
    babelRuntimeDir &&
    moduleName.startsWith('@babel/runtime/helpers/') &&
    !moduleName.startsWith('@babel/runtime/helpers/esm/')
  ) {
    const subpath = moduleName.replace('@babel/runtime/helpers/', '').replace(/\.js$/, '');
    const filePath = path.join(babelRuntimeDir, 'helpers', subpath + '.js');
    if (fs.existsSync(filePath)) {
      return { type: 'sourceFile', filePath };
    }
  }

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
