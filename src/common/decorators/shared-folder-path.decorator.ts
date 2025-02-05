import { Inject } from '@nestjs/common';

import { SharedFolderPathProvider } from '../providers';

export function SharedFolderPath(): ParameterDecorator {
  return Inject(SharedFolderPathProvider.provide);
}
