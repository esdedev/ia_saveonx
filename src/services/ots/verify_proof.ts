#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';
import { read, verify, verifiers, validate } from '@lacrypta/typescript-opentimestamps';

async function main() {
  const arg = process.argv[2];
  if (!arg) {
    console.error('Usage: pnpm exec tsx scripts/verify-file.ts path/to/file.ots');
    process.exit(1);
  }
  const filePath = path.resolve(arg);
  const buf = await fs.readFile(filePath);
  const timestamp = read(new Uint8Array(buf));
  const result = await verify(timestamp, verifiers);
  console.log(validate(timestamp));
  console.log(JSON.stringify(result, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(2);
});
