export type QAResult = { pass: boolean; message: string };

export async function check(
  label: string,
  fn: () => Promise<void>
): Promise<QAResult> {
  try {
    await fn();
    console.log(`  ✅ ${label}`);
    return { pass: true, message: label };
  } catch (err: any) {
    console.log(`  ❌ ${label} — ${err.message}`);
    return { pass: false, message: `${label}: ${err.message}` };
  }
}

export function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

export function printSummary(suite: string, results: QAResult[]): void {
  const passed = results.filter(r => r.pass).length;
  const total = results.length;
  const status = passed === total ? '✅ ALL PASS' : `❌ ${total - passed} FAILED`;
  console.log(`\n${suite}: ${status} (${passed}/${total})\n`);
  if (passed < total) {
    results.filter(r => !r.pass).forEach(r => console.log(`   FAIL: ${r.message}`));
  }
}
