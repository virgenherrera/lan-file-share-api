import { NestApplication } from '@nestjs/core';
import { UploadRoute } from '../../../src/upload/enums';
import { UploadManyResponse } from '../../../src/upload/models';
import {
  TestContext,
  dropSharedFiles,
  mockSharedFiles as existentFiles,
  initSharedFiles,
} from '../../utils';

const enum should {
  initTestContext = 'Should test Context be properly initialized.',
  throwPostFile = `Should respond with 400 when calling the endpoint without a file.`,
  postFiles = `Should POST many files and get proper info about success and failures preserving post order.`,
}

describe(`e2e: POST${UploadRoute.files}`, () => {
  const nonExistentFiles = [
    { filename: `fake_file_1_${Date.now()}.txt`, content: 'mock file content' },
    { filename: `fake_file_2_${Date.now()}.txt`, content: 'mock file content' },
  ];

  let testCtx: TestContext = null;

  beforeAll(async () => {
    testCtx = await TestContext.getInstance();

    await initSharedFiles(testCtx);
  });

  afterAll(async () => {
    await dropSharedFiles(testCtx);
  });

  it(should.initTestContext, async () => {
    expect(testCtx).not.toBeNull();
    expect(testCtx.request).not.toBeNull();
    expect(testCtx.app).toBeInstanceOf(NestApplication);
  });

  it(should.throwPostFile, async () => {
    const { status, body } = await testCtx.request.post(UploadRoute.files);

    expect(status).toBe(400);
    expect(body).toMatchObject({
      code: 'bad-request-error',
      message: 'Bad Request',
      details: ['No files uploaded.'],
    });
  });

  it(should.postFiles, async () => {
    const matcher: Record<keyof UploadManyResponse, any> = {
      successes: {
        0: {
          message: `successfully uploaded file: '${nonExistentFiles[0].filename}'`,
          path: nonExistentFiles[0].filename,
        },
        2: {
          message: `successfully uploaded file: '${nonExistentFiles[1].filename}'`,
          path: nonExistentFiles[1].filename,
        },
      },
      errors: {
        1: `File: '${existentFiles[0].filename}' already exists.`,
        3: `File: '${existentFiles[1].filename}' already exists.`,
      },
    };
    const { status, body } = await testCtx.request
      .post(UploadRoute.files)
      .attach(
        'file[]',
        Buffer.from(nonExistentFiles[0].content),
        nonExistentFiles[0].filename,
      )
      .attach(
        'file[]',
        Buffer.from(existentFiles[0].content),
        existentFiles[0].filename,
      )
      .attach(
        'file[]',
        Buffer.from(nonExistentFiles[1].content),
        nonExistentFiles[1].filename,
      )
      .attach(
        'file[]',
        Buffer.from(existentFiles[1].content),
        existentFiles[1].filename,
      );

    expect(status).toBe(201);
    expect(body).toMatchObject(matcher);
  });
});
