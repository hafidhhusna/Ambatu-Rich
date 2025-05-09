import Tesseract from 'tesseract.js';
import axios from 'axios';

export async function runOCR(imageUrl: string): Promise<string>{
    try{

        const response = await axios.get(imageUrl, {responseType : 'arraybuffer'});
        const imageBuffer = Buffer.from(response.data, 'binary');
        const {data} = await Tesseract.recognize(imageBuffer, 'eng+ind', {
            logger: m=> console.log(m),
        });

        return data.text.trim();
    } catch(error){
        console.error('OCR Error : ', error);
        throw new Error('Gagal Memproses Gambar dengan OCR');
    }
}