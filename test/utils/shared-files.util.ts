import { existsSync } from 'fs';
import { mkdir, rm, writeFile } from 'fs/promises';
import { join } from 'path';

import { AppMulterOptions } from '../../src/upload/imports';
import { TestContext } from './test-context.util';

const mockSharedNestedFolders = ['nested-01', 'nested-02', 'nested-03'];

export const mockSharedFiles: Record<'filename' | 'content', string>[] = [
  {
    filename: 'file-01.txt',
    content: 'file-01 content',
  },
  {
    filename: 'file-02.txt',
    content: 'file-02 content',
  },
  {
    filename: 'file-03.txt',
    content: 'file-03 content',
  },
  { filename: 'file-04.txt', content: 'file-4 content' },
];

async function createFiles(path: string) {
  await mkdir(path, { recursive: true });

  for (const { filename, content } of mockSharedFiles) {
    const filePath = join(path, filename);

    if (!existsSync(filePath)) {
      await writeFile(filePath, content, {
        encoding: 'utf8',
      });
    }
  }
}

export async function initSharedFiles(testCtx: TestContext) {
  const { sharedFolderPath } = testCtx.app.get(AppMulterOptions);
  const paths = [
    sharedFolderPath,
    ...mockSharedNestedFolders.map((p) => join(sharedFolderPath, p)),
  ];

  for (const path of paths) {
    await createFiles(path);
  }
}

export function dropSharedFiles(testCtx: TestContext) {
  const { sharedFolderPath } = testCtx.app.get(AppMulterOptions);

  return rm(sharedFolderPath, { recursive: true, maxRetries: 10 });
}
