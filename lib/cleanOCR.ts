export type Transaksi = {
  item: string;
  jumlah: number;
  harga: number;
};

export function cleanOCRText(ocrText: string): {
  transaksi: Transaksi[];
  prompt: string;
  cleanAIResponse: (raw: string) => string;
  getSummary: (text: string, maxSentences?: number) => string;
} {
  // 1. Bersihkan karakter aneh
  let cleanText = ocrText.replace(/[^\x20-\x7E\n\r]+/g, '');
  cleanText = cleanText.replace(/\s{2,}/g, ' ').replace(/\n{2,}/g, '\n').trim();

  // 2. Filter baris yang mengandung nominal
  const lines = cleanText.split('\n').filter(line => /Rp\d+/i.test(line));

  const transaksi: Transaksi[] = [];

  lines.forEach((line) => {
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

  const prompt = transaksi.length
    ? transaksi.map(t => `${t.jumlah}x ${t.item} = Rp${t.harga * t.jumlah}`).join('\n')
    : cleanText;

  // --- Fungsi tambahan untuk membersihkan output AI ---

  function cleanAIResponse(raw: string): string {
    return raw
      .replace(/#+\s?/g, '') // Hilangkan "###"
      .replace(/\*\*(.*?)\*\*/g, '$1') // Hilangkan bold
      .replace(/\n{2,}/g, '\n') // Gabungkan baris berlebihan
      .replace(/\n{2,}/g, '\n')
      .replace(/\n/g, '<br>')
      .trim();
  }

  function getSummary(text: string, maxSentences = 3): string {
    const sentences = text.split(/(?<=[.?!])\s+/);
    return sentences.slice(0, maxSentences).join(' ');
  }

  return { transaksi, prompt, cleanAIResponse, getSummary };
}
