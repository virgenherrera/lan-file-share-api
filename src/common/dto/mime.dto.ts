import { MimeEntry, MimeSource } from 'mime-db';

export class MimeDto implements MimeEntry {
  /** MIME type (e.g., 'text/html'). */
  public readonly type: string;
  /** Character set associated with the MIME type (e.g., 'UTF-8'). */
  public readonly charset?: string | undefined;
  /** Indicates if the MIME type is compressible. */
  public readonly compressible?: boolean | undefined;
  /** List of file extensions associated with the MIME type (e.g., ['html']). */
  public readonly extensions?: readonly string[] | undefined;
  /** Source of the MIME type data (e.g., 'iana'). */
  public readonly source?: MimeSource | undefined;
}
