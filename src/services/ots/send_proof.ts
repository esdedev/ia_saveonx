#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { submit, write } from '@lacrypta/typescript-opentimestamps';

async function main() {
  const arg = process.argv[2];
  if (!arg) {
    console.error('Usage: pnpm exec tsx scripts/create-ots.ts path/to/file');
    process.exit(1);
  }

  const filePath = path.resolve(arg);
  const data = await fs.readFile(filePath);

  // Compute SHA-1 of the file (OpenTimestamps classic file-hash)
  const hash = crypto.createHash('sha1').update(data).digest();
  const algorithm = 'sha1';

  console.log(`Computed ${algorithm} digest: ${hash.toString('hex')}`);

  // Submit to default calendars. `submit` returns { timestamp, errors }
  const { timestamp, errors } = await submit(algorithm as any, new Uint8Array(hash));

  if (errors && errors.length > 0) {
    console.warn('Some errors occurred during submission:', errors);
  }

  // Serialize timestamp to .ots
  const bytes = write(timestamp);
  const outPath = `${filePath}.ots`;
  await fs.writeFile(outPath, Buffer.from(bytes));
  console.log(`Wrote .ots file: ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(2);
});