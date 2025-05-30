import Tesseract from 'tesseract.js';
import axios from 'axios';
import path from 'path';

export async function runOCR(imageUrl: string): Promise<string> {
  try {
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const imageBuffer = Buffer.from(response.data, 'binary');

    // Configure Tesseract for Docker environment
    const tesseractOptions = {
      logger: (m: any) => console.log(m),
      langPath:
        process.env.NODE_ENV === 'production'
          ? '/app/tessdata'
          : './public/tessdata',
      corePath:
        process.env.NODE_ENV === 'production'
          ? '/app/node_modules/tesseract.js-core'
          : './node_modules/tesseract.js-core',
    };

    const { data } = await Tesseract.recognize(
      imageBuffer,
      'eng+ind',
      tesseractOptions
    );

    return data.text.trim();
  } catch (error) {
    console.error('OCR Error : ', error);
    throw new Error('Gagal Memproses Gambar dengan OCR');
  }
}
