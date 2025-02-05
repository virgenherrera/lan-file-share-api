export type IncomingFile = Express.Multer.File;

export interface SoftBatchCreated<T> {
  successes: Record<number, T>;
  errors: Record<number, string>;
}
