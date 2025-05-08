export type Transaksi = {
    item: string;
    jumlah: number;
    harga: number;
  };
  
  export function cleanOCRText(ocrText: string): {
    transaksi: Transaksi[];
    prompt: string;
  } {
    // 1. Bersihkan karakter aneh
    let cleanText = ocrText.replace(/[^\x20-\x7E\n\r]+/g, '');
    cleanText = cleanText.replace(/\s{2,}/g, ' ').replace(/\n{2,}/g, '\n').trim();
  
    // 2. Filter hanya baris yang mengandung nominal (Rp)
    const lines = cleanText.split('\n').filter(line => /Rp\d+/i.test(line));
  
    // 3. Ekstrak transaksi
    const transaksi: Transaksi[] = [];
  
    lines.forEach((line) => {
      // Tangkap pola seperti "2x Air Mineral Rp10000"
      const match = line.match(/(\d+)x\s+(.+?)\s+Rp?(\d+[.,]?\d*)/i);
      if (match) {
        const [, jumlahStr, itemRaw, hargaStr] = match;
        transaksi.push({
          item: itemRaw.trim(),
          jumlah: parseInt(jumlahStr),
          harga: parseInt(hargaStr.replace(/[^\d]/g, '')),
        });
      }
    });
  
    // 4. Siapkan format untuk prompt OpenAI
    const prompt = transaksi.length
      ? transaksi.map(t => `${t.jumlah}x ${t.item} = Rp${t.harga * t.jumlah}`).join('\n')
      : cleanText; // fallback kalau parsing gagal
  
    return { transaksi, prompt };
  }
  