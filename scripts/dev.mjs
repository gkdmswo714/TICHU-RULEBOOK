import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
// Polling avoids macOS file-watcher limits in shared desktop workspaces.
const child = spawn(process.execPath, [require.resolve('next/dist/bin/next'), 'dev', '--turbopack', '--hostname', '0.0.0.0', ...process.argv.slice(2)], { stdio: 'inherit', env: { ...process.env, WATCHPACK_POLLING: '1000' } });
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => child.kill(signal));
child.on('exit', code => process.exit(code ?? 0));
