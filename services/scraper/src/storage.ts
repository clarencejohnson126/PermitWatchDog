import fs from 'fs';
import path from 'path';

const STORAGE_DIR = path.join(__dirname, '../../.storage/pdfs');

export class LocalStorageMock {
  constructor() {
    if (!fs.existsSync(STORAGE_DIR)) {
      fs.mkdirSync(STORAGE_DIR, { recursive: true });
    }
  }

  async uploadPdf(filename: string, buffer: Buffer): Promise<string> {
    const filePath = path.join(STORAGE_DIR, filename);
    fs.writeFileSync(filePath, buffer);
    return filePath; // Returns local path as mock
  }
}
