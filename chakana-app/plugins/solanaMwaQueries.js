const { withAndroidManifest } = require('expo/config-plugins');

const MWA_INTENT_ACTIONS = [
  'com.solana.mobilewalletadapter.v1.action.SCENARIO',
  'com.solana.mobilewalletadapter.action.SCENARIO',
];

function addMwaQueries(androidManifest) {
  const manifest = androidManifest.manifest;

  let queries = manifest.queries;
  if (!queries) {
    manifest.queries = queries = [{}];
  }
  const queriesBlock = queries[0];

  if (!queriesBlock.intent) {
    queriesBlock.intent = [];
  }

  for (const action of MWA_INTENT_ACTIONS) {
    const alreadyExists = queriesBlock.intent.some(
      (i) => i.action?.[0]?.$?.['android:name'] === action,
    );
    if (!alreadyExists) {
      queriesBlock.intent.push({
        action: [{ $: { 'android:name': action } }],
      });
    }
  }

  return androidManifest;
}

function withSolanaMwaQueries(config) {
  return withAndroidManifest(config, (config) => {
    config.modResults = addMwaQueries(config.modResults);
    return config;
  });
}

module.exports = withSolanaMwaQueries;
