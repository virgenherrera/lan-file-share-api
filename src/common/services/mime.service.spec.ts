import { Test, TestingModule } from '@nestjs/testing';

import { MockLoggerProvider } from '../../application/__mocks__';
import { MimeService } from './mime.service';

describe(`UT: ${MimeService.name}`, () => {
  let service: MimeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MockLoggerProvider, MimeService],
    }).compile();

    service = module.get(MimeService);

    // Arrange: execute onModuleInit Life-cycle hook
    service.onModuleInit();
  });

  it('should create instance properly', () => {
    // Assert: The service instance should be defined.
    expect(service).toBeDefined();
  });

  describe('isCompresible', () => {
    it('should return true for a compressible MIME type', () => {
      // Arrange: Use a known compressible MIME type, e.g., 'text/html'.
      const mimeType = 'text/html';

      // Act: Call isCompresible.
      const result = service.isCompresible(mimeType);

      // Assert: Expect the result to be true.
      expect(result).toBe(true);
    });

    it('should return false for a non-existent MIME type', () => {
      // Arrange: Use a MIME type that does not exist in MimeDb.
      const mimeType = 'non/existent';

      // Act: Call isCompresible.
      const result = service.isCompresible(mimeType);

      // Assert: Expect the result to be false.
      expect(result).toBe(false);
    });
  });

  describe('getExtension', () => {
    it('should return the correct extension for a known MIME type', () => {
      // Arrange: Use a known MIME type with extensions, e.g., 'application/json'.
      const mimeType = 'application/json';

      // Act: Retrieve the extension.
      const extension = service.getExtension(mimeType);

      // Assert: Expect the extension to be 'json'.
      expect(extension).toBe('json');
    });

    it('should return null for a MIME type without an extension', () => {
      // Arrange: Use a MIME type that does not exist.
      const mimeType = 'non/existent';

      // Act: Retrieve the extension.
      const extension = service.getExtension(mimeType);

      // Assert: Expect the result to be null.
      expect(extension).toBeNull();
    });
  });

  describe('getMime', () => {
    it('should return the correct MIME type for a given extension without a dot', () => {
      // Arrange: Use a known extension without a dot, e.g., 'html'.
      const extension = 'html';

      // Act: Retrieve the MIME type.
      const mimeType = service.getMime(extension);

      // Assert: Expect the MIME type to be 'text/html'.
      expect(mimeType).toBe('text/html');
    });

    it('should return the correct MIME type for a given extension with a dot', () => {
      // Arrange: Use a known extension with a leading dot, e.g., '.html'.
      const extension = '.html';

      // Act: Retrieve the MIME type.
      const mimeType = service.getMime(extension);

      // Assert: Expect the MIME type to be 'text/html'.
      expect(mimeType).toBe('text/html');
    });

    it('should return null for a non-existent extension', () => {
      // Arrange: Use a non-existent extension, e.g., '.nonexistent'.
      const extension = '.nonexistent';

      // Act: Retrieve the MIME type.
      const mimeType = service.getMime(extension);

      // Assert: Expect the MIME type to be null.
      expect(mimeType).toBeNull();
    });
  });
});
