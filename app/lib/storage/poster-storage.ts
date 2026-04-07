import { createHash, randomUUID } from 'node:crypto';
import { mkdir, readFile, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';

export interface PosterAssetRecord {
  id: string;
  storageKey: string;
  publicPath: string;
  mimeType: string;
  sizeBytes: number;
  checksumSha256: string;
}

export interface UploadPosterInput {
  bytes: Uint8Array;
  mimeType: string;
  fileName: string;
  storageDir: string;
}

function getExtension(fileName: string): string {
  const extension = path.extname(fileName).toLowerCase();
  return extension || '.bin';
}

export async function savePosterAsset(input: UploadPosterInput): Promise<PosterAssetRecord> {
  await mkdir(input.storageDir, { recursive: true });

  const id = randomUUID();
  const extension = getExtension(input.fileName);
  const storageKey = `${id}${extension}`;
  const filePath = path.join(input.storageDir, storageKey);
  const checksumSha256 = createHash('sha256').update(input.bytes).digest('hex');

  await writeFile(filePath, input.bytes);

  return {
    id,
    storageKey,
    publicPath: `/uploads/posters/${storageKey}`,
    mimeType: input.mimeType,
    sizeBytes: input.bytes.byteLength,
    checksumSha256,
  };
}

export async function readPosterAsset(storageDir: string, storageKey: string): Promise<Uint8Array> {
  const filePath = path.join(storageDir, storageKey);
  return readFile(filePath);
}

export async function deletePosterAsset(storageDir: string, storageKey: string): Promise<void> {
  const filePath = path.join(storageDir, storageKey);
  await unlink(filePath);
}
