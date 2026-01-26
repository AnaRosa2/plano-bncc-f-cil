import fs from 'fs';
import path from 'path';

let cachedText: string | null = null;

export function getBnccText(): string {
  if (cachedText) return cachedText;

  try {
    const filePath = path.join(__dirname, 'BNCC_EI_EF_110518_versaofinal.txt');
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      // Reduzido para 30KB para garantir que a IA responda rápido no Vercel/Render
      cachedText = raw.slice(0, 30_000);
      return cachedText;
    } else {
      console.warn('⚠️ BNCC TXT não encontrado em', filePath);
    }
  } catch (err) {
    console.warn('⚠️ Erro ao ler BNCC TXT:', err);
  }

  // Fallback expandido com mais competências
  cachedText = `
BNCC - Base Nacional Comum Curricular

Competência Geral 5: Utilizar tecnologias digitais de comunicação e informação de forma crítica, significativa, reflexiva e ética nas diversas práticas do cotidiano (incluindo as escolares) ao se comunicar, acessar e disseminar informações, produzir conhecimentos e resolver problemas.

Cultura Digital: Compreender, utilizar e criar tecnologias digitais de informação e comunicação de forma crítica, significativa, reflexiva e ética nas diversas práticas sociais (incluindo as escolares) para se comunicar, acessar e disseminar informações, produzir conhecimentos, resolver problemas e exercer protagonismo e autoria na vida pessoal e coletiva.
  `.trim();
  return cachedText;
}