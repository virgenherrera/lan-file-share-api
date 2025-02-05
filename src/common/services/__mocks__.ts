import { Provider } from '@nestjs/common';
import { MimeService } from './mime.service';

export const mockMimeService = {
  isCompresible: jest.fn(),
  getExtension: jest.fn(),
  getMime: jest.fn(),
};

export const MockMimeServiceProvider: Provider = {
  provide: MimeService,
  useValue: mockMimeService,
};
