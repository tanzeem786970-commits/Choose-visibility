export interface UploadedFile {
  key: string;
  url: string;
  bucket: string;
}

export const s3Service = {
  async uploadFile(file: File, userId: string): Promise<UploadedFile> {
    const filename = file.name;
    const resp = await fetch(`/api/s3/sign?filename=${encodeURIComponent(filename)}&contentType=${encodeURIComponent(file.type)}&userId=${encodeURIComponent(userId || '')}`);
    if (!resp.ok) throw new Error('Failed to get presigned URL');
    const { url, key, bucket } = await resp.json();

    const put = await fetch(url, { method: 'PUT', body: file, headers: { 'Content-Type': file.type } });
    if (!put.ok) throw new Error('Upload to S3 failed');

    return { key, url, bucket };
  },

  async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    const resp = await fetch(`/api/s3/url?key=${encodeURIComponent(key)}&expiresIn=${expiresIn}`);
    if (!resp.ok) throw new Error('Failed to get signed URL');
    const { url } = await resp.json();
    return url;
  },

  async deleteFile(key: string): Promise<void> {
    const resp = await fetch('/api/s3/delete', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key }) });
    if (!resp.ok) throw new Error('Failed to delete file');
  },

  async getFileMetadata(key: string) {
    const resp = await fetch(`/api/s3/metadata?key=${encodeURIComponent(key)}`);
    if (!resp.ok) throw new Error('Failed to get metadata');
    return resp.json();
  }
};