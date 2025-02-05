import { NestApplication } from '@nestjs/core';

import {
  dropSharedFiles,
  initSharedFiles,
  mockSharedFiles,
  TestContext,
} from '../../utils';

const API_PATH = '/download';

describe(`e2e:(GET)${API_PATH}`, () => {
  const enum should {
    initTestContext = 'Should test Context be properly initialized.',
    throw404 = 'Should GET 404 on non-existent file.',
    getFile = 'Should GET existent file properly.',
  }

  let testCtx: TestContext;

  beforeAll(async () => {
    testCtx = await TestContext.getInstance();

    await initSharedFiles(testCtx);
  });

  afterAll(async () => {
    await dropSharedFiles(testCtx);
  });

  it(should.initTestContext, () => {
    expect(testCtx).toBeDefined();
    expect(testCtx.request).toBeDefined();
    expect(testCtx.app).toBeInstanceOf(NestApplication);
  });

  it(should.throw404, async () => {
    const path = 'path/to/non/existent/file.ext';
    const apiPath = `${API_PATH}/${path}`;
    const { status, body } = await testCtx.request.get(apiPath);

    expect(status).toBe(404);
    expect(body).toMatchObject({
      message: `Cannot GET ${apiPath}`,
      error: 'Not Found',
      statusCode: 404,
    });
  });

  it(should.throw404 + 'Foo', async () => {
    const path = '../path/that/attemps/to/traverse/to/outer/file.ext';
    const apiPath = `${API_PATH}/${path}`;

    console.log(apiPath);
    const { status, body } = await testCtx.request.get(apiPath);

    expect(status).toBe(404);
    expect(body).toMatchObject({
      message: expect.stringMatching(/^Cannot GET/),
      error: 'Not Found',
      statusCode: 404,
    });
  });

  it(should.getFile, async () => {
    const [firstFile] = mockSharedFiles;
    const { filename } = firstFile;
    const apiPath = `${API_PATH}/${filename}`;
    const { status, headers } = await testCtx.request.get(apiPath);

    expect(status).toBe(200);
    expect(headers).toMatchObject({
      'x-powered-by': 'Express',
      'content-type': 'application/octet-stream',
      'content-disposition': `attachment; filename="${filename}"`,
    });
  });
});
