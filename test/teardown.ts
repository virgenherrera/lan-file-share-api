import { dropSharedFiles, TestContext } from './utils';

export default async function Teardown() {
  const isWatchMode = process.argv.some((arg) => arg.includes('--watch'));

  if (isWatchMode) return;

  const testContext = await TestContext.getInstance();

  await dropSharedFiles(testContext);
  // destroy test CTX
  await TestContext.destruct();
}
