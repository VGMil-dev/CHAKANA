const { withAndroidManifest } = require('@expo/config-plugins');

function addSolanaWalletQuery(androidManifest) {
  const manifest = androidManifest.manifest;

  if (!manifest.queries) manifest.queries = [{}];
  const queriesBlock = manifest.queries[0];
  if (!queriesBlock.intent) queriesBlock.intent = [];

  const alreadyAdded = queriesBlock.intent.some(
    i => i.data?.[0]?.['$']?.['android:scheme'] === 'solana-wallet'
  );

  if (!alreadyAdded) {
    queriesBlock.intent.push({
      action: [{ $: { 'android:name': 'android.intent.action.VIEW' } }],
      category: [{ $: { 'android:name': 'android.intent.category.BROWSABLE' } }],
      data: [{ $: { 'android:scheme': 'solana-wallet' } }],
    });
  }

  return androidManifest;
}

function withSolanaWalletQuery(config) {
  return withAndroidManifest(config, config => {
    config.modResults = addSolanaWalletQuery(config.modResults);
    return config;
  });
}

module.exports = withSolanaWalletQuery;
