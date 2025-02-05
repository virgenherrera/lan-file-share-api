import { Global, Logger, Module } from '@nestjs/common';

import { MimeService } from './services';

@Global()
@Module({
  providers: [Logger, MimeService],
  exports: [Logger, MimeService],
})
export class CommonModule {}
