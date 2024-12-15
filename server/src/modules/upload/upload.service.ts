import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import * as crypto from 'crypto';
import * as sharp from 'sharp';

@Injectable()
export class UploadService {
  constructor() {}

  async upload(file: Express.Multer.File) {
    const hash = crypto
      .createHash('sha256')
      .update(file.originalname)
      .digest('hex');

    let resizedImage = await sharp(file.buffer).resize(800).toBuffer();

    const uploadPath = path.join(__dirname, '../../../uploads', `${hash}.jpg`);
    await fs.promises.writeFile(uploadPath, resizedImage);

    const relativePath = path.join('uploads', `${hash}.jpg`);
    return { path: relativePath };
  }
}
