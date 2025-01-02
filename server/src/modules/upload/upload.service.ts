import { BadRequestException, Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import * as sharp from 'sharp';
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

    let resizedImage = await sharp(file.buffer).resize(800).toBuffer();

    const dirPath = path.resolve(__dirname, '../../../uploads', type);

    await fs.promises.mkdir(dirPath, { recursive: true });

    const uploadPath = path.join(dirPath, `${hash}.jpg`);

    await fs.promises.writeFile(uploadPath, resizedImage);

    const relativePath = path.join('uploads', type, `${hash}.jpg`);
    return { path: relativePath };
  }

  async delete(name: string) {
    const filePath = path.join(__dirname, '../../../uploads', name);
    await fs.promises.unlink(filePath);
    return filePath;
  }
}
