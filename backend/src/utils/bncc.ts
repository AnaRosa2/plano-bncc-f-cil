import fs from 'fs';
import path from 'path';

let cachedText: string | null = null;

export function getBnccText(): string {
  if (cachedText) return cachedText;

  try {
    const filePath = path.join(__dirname, 'BNCC_EI_EF_110518_versaofinal.txt');
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      // Limitar tamanho para evitar prompts excessivos (ajustável)
      cachedText = raw.slice(0, 30_000); // 30KB
      return cachedText;
    } else {
      console.warn('BNCC TXT não encontrado em', filePath);
    }
  } catch (err) {
    console.warn('Erro ao ler BNCC TXT:', err);
  }

  // Fallback curto
  cachedText = `Competência Geral 5 da BNCC: "Utilizar tecnologias digitais de forma crítica, ética e responsável."`;
  return cachedText;
}