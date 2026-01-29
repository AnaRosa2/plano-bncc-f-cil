// src/services/geracao.service.slides.ts
/**
 * Serviço para gerar slides educacionais usando IA (Google Gemini)
 */

import { gerarTextoComIA } from './ai-gemini.service';
import { gerarComRetry } from './geracao.service';
import { getBnccText } from '../utils/bncc';

async function getBnccSnippet() {
  return await getBnccText();
}

/**
 * Framework pedagógico por etapa escolar
 */
const FRAMEWORK_SLIDES = {
  FUND_I: {
    estilo: 'Lúdico, visual atrativo, linguagem simples, personagens fofos, cores vivas.',
    elementos: 'Ícones reais (tesoura ✂️, cola 🧴), mascotes, setas com "rastro de formiga".',
    linguagem: 'Frases curtas, verbos de ação ("vamos descobrir", "vamos construir").',
    tempo: 'Máximo 15 minutos por atividade.',
    exemplos_habilidades: ['EI02CG05', 'EF03LP01']
  },
  FUND_II: {
    estilo: 'Interativo, contextualizado, inspirado em redes sociais (TikTok educativo), infográficos.',
    elementos: 'QR Codes, vídeos curtos, gráficos simples, botões de interação.',
    linguagem: 'Termos do cotidiano, desafios práticos, storytelling digital.',
    tempo: '20-30 minutos por atividade.',
    exemplos_habilidades: ['EF08CI01', 'EF09LP20']
  },
  MEDIO: {
    estilo: 'Profissional, acadêmico, foco em ENEM e mercado de trabalho, dados reais.',
    elementos: 'Gráficos com dados IBGE, estudos de caso, conexões com vestibulares.',
    linguagem: 'Terminologia técnica, dilemas éticos, debates estruturados.',
    tempo: '45-50 minutos por aula.',
    exemplos_habilidades: ['EM13CO14', 'EM13LP09']
  }
};

function getSlideFramework(anoSerie: string = '') {
  const s = anoSerie.toLowerCase();
  if (s.includes('médio') || s.includes('3º') || s.includes('ensino médio') || s.includes('2º') || s.includes('1º')) {
    return FRAMEWORK_SLIDES.MEDIO;
  }
  if (s.includes('6') || s.includes('7') || s.includes('8') || s.includes('9')) {
    return FRAMEWORK_SLIDES.FUND_II;
  }
  return FRAMEWORK_SLIDES.FUND_I;
}

export async function gerarSlides(tema: string, disciplina: string, anoSerie: string = '') {
  console.log(`[geracao.service.slides] gerarSlides: tema=${tema} disciplina=${disciplina} anoSerie=${anoSerie}`);

  const bncc = await getBnccSnippet();
  const fw = getSlideFramework(anoSerie);

  const prompt = `
# DESIGNER INSTRUCIONAL IA (SLIDES EDUCACIONAIS + BNCC)

## 📌 OBJETIVO
Você é um designer instrucional especializado em **Cultura Digital** e **BNCC**. Gere uma apresentação de slides **pedagogicamente sólida**, **diferenciada por etapa** e **com habilidades reais da BNCC**.

## 🎯 DADOS DO SLIDE
- Tema: "${tema}"
- Disciplina: "${disciplina}"
- Etapa: "${anoSerie}"
- Estilo: ${fw.estilo}

## 📚 BASE BNCC (trecho relevante)
${bncc.substring(0, 2000)}

## 🎨 REQUISITOS POR ETAPA
### Ensino Fundamental I:
- Linguagem: ${fw.linguagem}
- Elementos: ${fw.elementos}
- Tempo: ${fw.tempo}
- Habilidades: Ex: ${fw.exemplos_habilidades.join(', ')}

### Ensino Fundamental II:
- Linguagem: ${fw.linguagem}
- Elementos: ${fw.elementos}
- Tempo: ${fw.tempo}
- Habilidades: Ex: ${fw.exemplos_habilidades.join(', ')}

### Ensino Médio:
- Linguagem: ${fw.linguagem}
- Elementos: ${fw.elementos}
- Tempo: ${fw.tempo}
- Habilidades: Ex: ${fw.exemplos_habilidades.join(', ')}

## 📦 FORMATO DE RESPOSTA (APENAS JSON)
[
  {
    "numero": 1,
    "titulo": "Título envolvente para o tema",
    "conteudo": "Texto adequado ao nível de ensino. \\n\\n[ROTEIRO PROFESSOR]: Dicas de fala e dinâmica.",
    "tipo": "titulo|conteudo|atividade|reflexao|conclusao",
    "habilidadesBNCC": ["EF08CI01", "EM13CO14"], // Apenas se relevante
    "icone": "ícone lucide relacionado (ex: lightbulb, users, globe)"
  }
]

## ⚠️ REGRAS
- Proibido conteúdo genérico
- Use linguagem adequada à etapa
- Cite habilidades reais da BNCC no slide final
- Evite markdown (#, **, etc)

RESPOSTA (APENAS O ARRAY JSON):
`;

  try {
    const respostaBruta = await gerarComRetry(prompt);
    const firstBracket = respostaBruta.indexOf('[');
    const lastBracket = respostaBruta.lastIndexOf(']');
    if (firstBracket === -1 || lastBracket === -1) throw new Error('JSON não encontrado');

    const jsonStr = respostaBruta.substring(firstBracket, lastBracket + 1);
    const slides = JSON.parse(jsonStr);

    const clean = (val: string) => val.replace(/\*\*/g, '').replace(/[#{}]/g, '').trim();

    return slides.map((s: any) => ({
      ...s,
      titulo: clean(s.titulo || ''),
      conteudo: clean(s.conteudo || '')
    }));
  } catch (error) {
    console.error('❌ Erro ao gerar slides:', error);

    // Fallback com slides diferenciados por etapa
    const fw = getSlideFramework(anoSerie);
    return [
      {
        numero: 1,
        titulo: `Introdução: ${tema}`,
        conteudo: `Vamos aprender sobre ${tema}!\n\n[ROTEIRO PROFESSOR]: Inicie com uma pergunta provocadora.`,
        tipo: 'titulo',
        icone: 'book-open'
      },
      {
        numero: 2,
        titulo: 'O que é?',
        conteudo: fw.linguagem.includes('Frases curtas')
          ? `Descubra o que é ${tema} de forma divertida!`
          : `Entenda o conceito de ${tema} e sua importância.`,
        tipo: 'conteudo',
        icone: 'info'
      },
      {
        numero: 3,
        titulo: 'Aplicação Prática',
        conteudo: fw.linguagem.includes('Frases curtas')
          ? `Vamos praticar juntos!`
          : `Como aplicar ${tema} no dia a dia?`,
        tipo: 'atividade',
        icone: 'clipboard-list'
      },
      {
        numero: 4,
        titulo: 'Reflexão Final',
        conteudo: `O que aprendemos hoje?\n\n[ROTEIRO PROFESSOR]: Promova uma roda de conversa.`,
        tipo: 'reflexao',
        icone: 'refresh-cw'
      },
      {
        numero: 5,
        titulo: 'Habilidades Trabalhadas',
        conteudo: `BNCC: ${fw.exemplos_habilidades.join(', ')}\n\nConexão com a Cultura Digital.`,
        tipo: 'conclusao',
        icone: 'award'
      }
    ];
  }
}