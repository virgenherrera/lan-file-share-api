import { Global, Logger, Module, Provider } from '@nestjs/common';

import { SharedFolderPathProvider } from './providers';
import { MimeService } from './services';

@Global()
@Module({
  providers: CommonModule.providers,
  exports: CommonModule.providers,
})
export class CommonModule {
  static providers: Provider[] = [
    Logger,
    SharedFolderPathProvider,
    MimeService,
  ];
}
