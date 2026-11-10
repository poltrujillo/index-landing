import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import deployment from '../cloudflare-pages.config.mjs';

export function buildCommands(env) {
  if (env.CF_PAGES !== '1' || !env.CF_PAGES_BRANCH?.trim()) {
    throw new Error('Pages build requires CF_PAGES=1 and CF_PAGES_BRANCH. For local drafts use npm run build.');
  }
  const production = env.CF_PAGES_BRANCH === deployment.productionBranch;
  const expectedContext = production ? 'production' : 'preview';
  if (env.INDEX_DEPLOYMENT_CONTEXT !== expectedContext) {
    throw new Error(`Branch/context mismatch: configure INDEX_DEPLOYMENT_CONTEXT=${expectedContext} in the matching Pages environment. A production environment must use the declared ${deployment.productionBranch} branch.`);
  }
  // No branch text is executed as shell code. A production branch can never
  // fall back to a draft when its legal publication checks fail.
  return [['npm', 'run', 'check'], ['npm', 'run', production ? 'build:production' : 'build']];
}

export function runPagesBuild(env = process.env, run = spawnSync) {
  const commands = buildCommands(env);
  for (const [command, ...args] of commands) {
    const result = run(command, args, { env, stdio: 'inherit', shell: false });
    if (result.error) throw result.error;
    if (result.status !== 0) return result.status || 1;
  }
  return 0;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  try { process.exitCode = runPagesBuild(); }
  catch (error) { console.error(error.message); process.exitCode = 1; }
}
