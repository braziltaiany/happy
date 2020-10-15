import multer from 'multer';
import path from 'path';
import { request, response } from 'express';

export default {
  storage: multer.diskStorage({
    destination: path.join(__dirname, '..', '..', 'uploads'),
    filename: (request, file, cd) => {
      const fileName = `${Date.now()}-${file.originalname}`;

      cd(null, fileName);
    },
  }),
};
