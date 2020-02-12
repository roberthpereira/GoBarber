import multer from 'multer';
import crypto from 'crypto';
import { extname, resolve } from 'path';

export default {
  // forma de como o multer guarda nossa imagem
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    // formatar o nome de nossa imagem
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, res) => {
        if (err) return cb(err);

        return cb(null, res.toString('hex') + extname(file.originalname));
      });
    },
  }),
};
