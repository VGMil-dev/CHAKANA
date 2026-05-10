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

const defaultResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName.startsWith('@noble/') && moduleName.endsWith('.js')) {
    return context.resolveRequest(context, moduleName.replace(/\.js$/, ''), platform);
  }
  return defaultResolveRequest
    ? defaultResolveRequest(context, moduleName, platform)
    : context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
