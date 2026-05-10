const { withAndroidManifest } = require('@expo/config-plugins');

module.exports = withAndroidManifest(config => {
  const manifest = config.modResults;
  const queries = manifest.manifest.queries ?? [];

  const alreadyAdded = queries.some(q =>
    q.intent?.some(i => i.$?.['android:scheme'] === 'solana-wallet')
  );

  if (!alreadyAdded) {
    queries.push({
      intent: [
        {
          action: [{ $: { 'android:name': 'android.intent.action.VIEW' } }],
          category: [{ $: { 'android:name': 'android.intent.category.BROWSABLE' } }],
          data: [{ $: { 'android:scheme': 'solana-wallet' } }],
        },
      ],
    });
    manifest.manifest.queries = queries;
  }

  return config;
});
