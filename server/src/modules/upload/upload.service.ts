import { BadRequestException, Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class UploadService {
  constructor() {}

  async upload(file: Express.Multer.File, type: string) {
    const allowedTypes = ['post', 'organization', 'user'];
    if (!allowedTypes.includes(type)) {
      throw new BadRequestException(
        `Invalid type "${type}". Allowed types are: ${allowedTypes.join(', ')}`,
      );
    }

    const hash = crypto
      .createHash('sha256')
      .update(file.originalname)
      .digest('hex');

    // const dirPath = path.resolve(__dirname, '../../../uploads', type);
    const dirPath = path.join(process.cwd(), 'uploads', type);

    await fs.promises.mkdir(dirPath, { recursive: true });

    const uploadPath = path.join(dirPath, `${hash}.jpg`);

    await fs.promises.writeFile(uploadPath, file.buffer);

    const relativePath = path.join('uploads', type, `${hash}.jpg`);
    return { path: relativePath };
  }

  async delete(name: string) {
    // const filePath = path.join(__dirname, '../../../uploads', name);
    const filePath = path.join(process.cwd(), 'uploads', name);
    await fs.promises.unlink(filePath);
    return filePath;
  }
}
