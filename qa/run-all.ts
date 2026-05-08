/**
 * Ejecuta todos los QA smoke tests en secuencia.
 * Detiene si un test crítico falla (conexión o schema).
 */
import { spawnSync } from 'child_process';
import * as path from 'path';

const tests = [
  { file: '01-project-connection.ts',              name: 'Conexión al Proyecto', critical: true  },
  { file: '02-schema-and-rls.ts',                  name: 'Schema y RLS',         critical: true  },
  { file: '03-auth-service.ts',                    name: 'Auth Service',         critical: false },
  { file: '04-reviews-service.ts',                 name: 'Reviews Service',      critical: false },
  { file: '05-businesses-service.ts',              name: 'Businesses Service',   critical: false },
  { file: '06-oracle-edge-function.ts',            name: 'Oracle Edge Function', critical: false },
  { file: '07-generate-report-edge-function.ts',   name: 'Generate Report',      critical: false },
];

console.log('\n🚀 CHAKANA — QA Smoke Tests\n');
console.log('='.repeat(50));

let totalPass = 0;
let totalFail = 0;

for (const test of tests) {
  console.log(`\n▶ Running: ${test.name}`);

  const result = spawnSync(
    'npx',
    ['ts-node', '--exit', path.join(__dirname, test.file)],
    {
      stdio: 'inherit',
      env: { ...process.env },
      shell: true,
    }
  );

  // exit code 0 = pass. Ignorar señales de cierre de UV en Windows (status null con signal)
  const passed = result.status === 0;

  if (passed) {
    totalPass++;
  } else {
    totalFail++;
    if (test.critical) {
      console.log(`\n💥 Test crítico falló: ${test.name}. Abortando el resto.\n`);
      break;
    }
  }
}

console.log('\n' + '='.repeat(50));
console.log(`\n📊 RESULTADO FINAL: ${totalPass} passed, ${totalFail} failed\n`);
process.exit(totalFail > 0 ? 1 : 0);
