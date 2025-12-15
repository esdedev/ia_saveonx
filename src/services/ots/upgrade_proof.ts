import fs from 'fs/promises';
import path from 'path';
import { read, upgrade, write } from '@lacrypta/typescript-opentimestamps';

async function main() {
  const arg = process.argv[2];
  if (!arg) {
    console.error('Usage: pnpm exec tsx scripts/upgrade-file.ts path/to/file.ots');
    process.exit(1);
  }

  const filePath = path.resolve(arg);
  const buf = await fs.readFile(filePath);
  const timestamp = read(new Uint8Array(buf));

  const { timestamp: upgraded, errors } = await upgrade(timestamp as any);

  if (errors && errors.length > 0) {
    console.warn('Some errors occurred during upgrade:');
    for (const e of errors) console.warn(String(e));
  }

  const bytes = write(upgraded);
  const outPath = filePath.endsWith('.ots') ? filePath.replace(/\.ots$/, '.upgraded.ots') : `${filePath}.upgraded.ots`;
  await fs.writeFile(outPath, Buffer.from(bytes));
  console.log(`Wrote upgraded .ots: ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(2);
});