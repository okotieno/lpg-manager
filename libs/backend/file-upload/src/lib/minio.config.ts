export const config = {
  MINIO_ENDPOINT: process.env['LPG_MINIO_ENDPOINT'] ?? '',
  MINIO_PORT: Number(process.env['LPG_MINIO_PORT']),
  MINIO_ACCESS_KEY: process.env['LPG_MINIO_ACCESS_KEY'] ?? '',
  MINIO_SECRET_KEY: process.env['LPG_MINIO_SECRET_KEY'] ?? '',
  MINIO_BUCKET: process.env['LPG_MINIO_BUCKET'] ?? '',
};
