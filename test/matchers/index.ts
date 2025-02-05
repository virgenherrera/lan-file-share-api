export const FileDtoMatcher = expect.objectContaining({
  type: 'file',
  fileName: expect.any(String),
  path: expect.any(String),
  size: expect.any(String),
  createdAt: expect.any(String),
  updatedAt: expect.any(String),
});

export const FolderDtoMatcher = expect.objectContaining({
  type: 'folder',
  name: expect.any(String),
});
