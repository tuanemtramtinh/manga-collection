import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
import config from '../config.js';
// Singleton S3 client
const s3 = new S3Client({
    endpoint: config.s3.endpoint,
    region: config.s3.region,
    credentials: {
        accessKeyId: config.s3.accessKeyId,
        secretAccessKey: config.s3.secretAccessKey,
    },
    forcePathStyle: false, // true nếu dùng MinIO
});
/**
 * Upload một file lên S3, trả về public URL.
 * Key: {folder}/{uuid}.{ext}
 */
export async function uploadImage(file, folder) {
    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
    const key = `${folder}/${randomUUID()}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    await s3.send(new PutObjectCommand({
        Bucket: config.s3.bucket,
        Key: key,
        Body: buffer,
        ContentType: file.type || 'image/jpeg',
        CacheControl: 'public, max-age=31536000', // cache 1 năm
        ACL: 'public-read',
    }));
    return `${config.s3.publicUrl}/${key}`;
}
/**
 * Xóa ảnh trên S3 theo public URL.
 * Bỏ qua nếu URL không thuộc S3 bucket này.
 */
export async function deleteImage(url) {
    const prefix = config.s3.publicUrl + '/';
    if (!url.startsWith(prefix))
        return; // URL ngoài (link thủ công) — không xóa
    const key = url.slice(prefix.length);
    await s3.send(new DeleteObjectCommand({ Bucket: config.s3.bucket, Key: key }));
}
