import { diskStorage } from "multer";
import { extname, join } from "path";
import { BadRequestException } from "@nestjs/common";
import fs from "fs";

export const MulterOptions = {
  storage: diskStorage({
    destination: (req, file, callback) => {
      const targetFolder = req.body.target_folder || 'others';
      const uploadPath = process.env.UPLOAD_DEST?.trim() || "./storage/public";
      const allowedFolders = ['products', 'categories'];

      if (!targetFolder) {
        return callback(new BadRequestException('Invalid target folder specified (categories, products)'), '');
      }

      if (!allowedFolders.includes(targetFolder)) {
        return callback(new BadRequestException('Invalid target folder specified (categories, products)'), '');
      }

      const finalPath = join(uploadPath, targetFolder);

      if (!fs.existsSync(finalPath)) {
        fs.mkdirSync(finalPath, { recursive: true });
      }
      callback(null, finalPath);
    },
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);
      const cleanFieldName = file.fieldname.replace(/[^a-zA-Z0-9]/g, '');
      callback(null, `${cleanFieldName}-${uniqueSuffix}${ext}`);
    },
  }),
  limits: {
    fileSize: Number(process.env.MAX_FILE_SIZE) || 10485760, // 10MB default
  },
  fileFilter: (req, file, callback) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(new Error('Only image files (jpeg, png, gif, webp) are allowed!'), false);
    }
  },
};