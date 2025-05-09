/**
 * Formats a file size in bytes to a human-readable string
 * @param bytes File size in bytes
 * @returns Formatted string (e.g. "2.5 MB")
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Checks if a file type is an image
 * @param fileType MIME type of the file
 * @returns Boolean indicating if the file is an image
 */
export const isImageFile = (fileType: string): boolean => {
  return fileType.startsWith('image/');
};

/**
 * Gets a public URL for a file in Supabase Storage
 * @param bucket Bucket name
 * @param path Path to the file within the bucket
 * @returns Public URL for the file
 */
export const getFilePublicUrl = (
  bucket: string,
  path: string,
  projectId = 'grpzctxumndpwdwzgzqt',
): string => {
  return `https://${projectId}.supabase.co/storage/v1/object/public/${bucket}/${path}`;
};

/**
 * Extracts the file extension from a filename
 * @param filename Name of the file
 * @returns File extension (without the dot)
 */
export const getFileExtension = (filename: string): string => {
  return filename.split('.').pop() || '';
};

/**
 * Truncates a file name if it exceeds the specified length
 * @param fileName Name of the file
 * @param maxLength Maximum length before truncation (default: 50)
 * @returns Truncated file name with ellipsis
 */
export const truncateFileName = (
  fileName: string,
  maxLength: number = 50,
): string => {
  return fileName.length > maxLength
    ? `${fileName.substring(0, maxLength - 3)}...`
    : fileName;
};

/**
 * Checks if a file name needs truncation
 * @param fileName Name of the file
 * @param maxLength Maximum length before truncation (default: 50)
 * @returns Boolean indicating if truncation is needed
 */
export const needsTruncation = (
  fileName: string,
  maxLength: number = 50,
): boolean => {
  return fileName.length > maxLength;
};
