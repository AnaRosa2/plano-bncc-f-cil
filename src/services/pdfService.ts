// Serviço de geração de PDF profissional
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import type { TDocumentDefinitions, Content, StyleDictionary } from 'pdfmake/interfaces';
import { PlanoAula, Unidade, Disciplina, AtividadeAvaliativa } from '@/types';

// Registrar fontes
pdfMake.vfs = pdfFonts.vfs;

// Cores do tema
const COLORS = {
  primary: '#2563eb',    // Azul principal
  secondary: '#059669',  // Verde
  bncc: '#7c3aed',       // Roxo BNCC
  accent: '#f59e0b',     // Amarelo
  text: '#1f2937',       // Texto escuro
  muted: '#6b7280',      // Texto secundário
  background: '#f3f4f6', // Fundo claro
};

// Estilos do documento
const styles: StyleDictionary = {
  header: {
    fontSize: 24,
    bold: true,
    color: COLORS.primary,
    marginBottom: 10,
  },
  subheader: {
    fontSize: 18,
    bold: true,
    color: COLORS.text,
    marginTop: 15,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    bold: true,
    color: COLORS.primary,
    marginTop: 12,
    marginBottom: 6,
  },
  normal: {
    fontSize: 11,
    color: COLORS.text,
    lineHeight: 1.4,
  },
  bnccBadge: {
    fontSize: 10,
    color: COLORS.bncc,
    italics: true,
    marginBottom: 4,
  },
  footer: {
    fontSize: 9,
    color: COLORS.muted,
    alignment: 'center' as const,
  },
  tableHeader: {
    fontSize: 11,
    bold: true,
    color: 'white',
    fillColor: COLORS.primary,
  },
};

export interface PlanoAulaCompleto {
  disciplina: Disciplina;
  unidade: Unidade;
  planoAula: PlanoAula;
  atividadeAvaliativa?: AtividadeAvaliativa;
}

export function gerarPDFPlanoAula(dados: PlanoAulaCompleto): void {
  const { disciplina, unidade, planoAula, atividadeAvaliativa } = dados;
  
  const dataAtual = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const docDefinition: TDocumentDefinitions = {
    pageSize: 'A4',
    pageMargins: [40, 60, 40, 60],
    
    header: {
      columns: [
        {
          text: 'PLANO DE AULA',
          style: 'bnccBadge',
          margin: [40, 20, 0, 0],
        },
        {
          text: `Alinhado à BNCC - CG5: Cultura Digital`,
          style: 'bnccBadge',
          alignment: 'right',
          margin: [0, 20, 40, 0],
        },
      ],
    },
    
    footer: function(currentPage, pageCount) {
      return {
        columns: [
          {
            text: `Gerado em ${dataAtual}`,
            style: 'footer',
            margin: [40, 0, 0, 0],
          },
          {
            text: `Página ${currentPage} de ${pageCount}`,
            style: 'footer',
            alignment: 'right',
            margin: [0, 0, 40, 0],
          },
        ],
      };
    },
    
    content: [
      // Cabeçalho principal
      {
        text: unidade.tema,
        style: 'header',
      },
      {
        canvas: [
          {
            type: 'line',
            x1: 0, y1: 0,
            x2: 515, y2: 0,
            lineWidth: 2,
            lineColor: COLORS.primary,
          },
        ],
        marginBottom: 15,
      },
      
      // Informações básicas
      {
        columns: [
          {
            width: '50%',
            stack: [
              { text: 'Disciplina:', bold: true, fontSize: 10, color: COLORS.muted },
              { text: disciplina.nome, fontSize: 12, marginBottom: 8 },
            ],
          },
          {
            width: '50%',
            stack: [
              { text: 'Ano/Série:', bold: true, fontSize: 10, color: COLORS.muted },
              { text: disciplina.anoSerie, fontSize: 12, marginBottom: 8 },
            ],
          },
        ],
        marginBottom: 10,
      },
      
      // Objetivo Geral
      {
        text: 'Objetivo Geral',
        style: 'sectionTitle',
      },
      {
        text: unidade.objetivoGeral,
        style: 'normal',
        marginBottom: 5,
      },
      
      // Habilidades BNCC
      unidade.habilidadesBNCC ? {
        table: {
          widths: ['*'],
          body: [
            [
              {
                text: [
                  { text: '📚 Alinhamento BNCC: ', bold: true },
                  unidade.habilidadesBNCC,
                ],
                fillColor: '#f3e8ff',
                color: COLORS.bncc,
                fontSize: 10,
                margin: [8, 6, 8, 6],
              },
            ],
          ],
        },
        layout: 'noBorders',
        marginBottom: 15,
      } as Content : { text: '' },
      
      // Objetivos Específicos
      {
        text: '🎯 Objetivos Específicos',
        style: 'sectionTitle',
      },
      {
        text: planoAula.objetivos,
        style: 'normal',
        marginBottom: 10,
      },
      
      // Conteúdos
      {
        text: '📖 Conteúdos',
        style: 'sectionTitle',
      },
      {
        text: planoAula.conteudos,
        style: 'normal',
        marginBottom: 10,
      },
      
      // Metodologia
      {
        text: '⚙️ Metodologia',
        style: 'sectionTitle',
      },
      {
        text: planoAula.metodologia,
        style: 'normal',
        marginBottom: 10,
      },
      
      // Recursos Didáticos
      {
        text: '🛠️ Recursos Didáticos',
        style: 'sectionTitle',
      },
      {
        text: planoAula.recursosDidaticos,
        style: 'normal',
        marginBottom: 10,
      },
      
      // Avaliação
      {
        text: '✅ Avaliação',
        style: 'sectionTitle',
      },
      {
        text: planoAula.avaliacao,
        style: 'normal',
        marginBottom: 10,
      },
      
      // Tempo Estimado
      {
        text: '⏱️ Tempo Estimado',
        style: 'sectionTitle',
      },
      {
        text: planoAula.tempoEstimado,
        style: 'normal',
        marginBottom: 15,
      },
      
      // Atividade Avaliativa (se existir)
      ...(atividadeAvaliativa ? [
        {
          text: '',
          pageBreak: 'before' as const,
        } as Content,
        {
          text: 'ATIVIDADE AVALIATIVA',
          style: 'subheader',
        } as Content,
        {
          canvas: [
            {
              type: 'line',
              x1: 0, y1: 0,
              x2: 515, y2: 0,
              lineWidth: 1,
              lineColor: COLORS.secondary,
            },
          ],
          marginBottom: 15,
        } as Content,
        {
          table: {
            widths: ['auto', '*'],
            body: [
              [
                { text: 'Tipo:', bold: true, fillColor: COLORS.background },
                { 
                  text: atividadeAvaliativa.tipo === 'objetiva' ? 'Questões Objetivas' :
                        atividadeAvaliativa.tipo === 'discursiva' ? 'Questões Discursivas' :
                        'Atividade Prática',
                  fillColor: COLORS.background,
                },
              ],
            ],
          },
          layout: 'lightHorizontalLines',
          marginBottom: 15,
        } as Content,
        {
          text: '📝 Enunciado',
          style: 'sectionTitle',
        } as Content,
        {
          text: atividadeAvaliativa.enunciado,
          style: 'normal',
          marginBottom: 15,
        } as Content,
        {
          text: '📋 Critérios de Avaliação',
          style: 'sectionTitle',
        } as Content,
        {
          text: atividadeAvaliativa.criteriosAvaliacao,
          style: 'normal',
        } as Content,
      ] : []),
      
      // Rodapé com informação BNCC
      {
        text: '',
        marginTop: 30,
      },
      {
        table: {
          widths: ['*'],
          body: [
            [
              {
                text: [
                  { text: 'ℹ️ ', fontSize: 12 },
                  { text: 'Este plano está alinhado à ', fontSize: 9 },
                  { text: 'Competência Geral 5 da BNCC', bold: true, fontSize: 9 },
                  { text: ': "Compreender, utilizar e criar tecnologias digitais de informação e comunicação de forma crítica, significativa, reflexiva e ética nas diversas práticas sociais."', fontSize: 9 },
                ],
                fillColor: '#eff6ff',
                color: COLORS.primary,
                margin: [10, 8, 10, 8],
              },
            ],
          ],
        },
        layout: 'noBorders',
      },
    ],
    
    styles,
    
    defaultStyle: {
      font: 'Roboto',
    },
  };

  // Gerar e baixar o PDF
  const fileName = `plano-aula-${unidade.tema.toLowerCase().replace(/\s+/g, '-').substring(0, 30)}.pdf`;
  pdfMake.createPdf(docDefinition).download(fileName);
}

// Função auxiliar para gerar apenas a atividade
export function gerarPDFAtividade(
  disciplina: Disciplina,
  unidade: Unidade,
  atividade: AtividadeAvaliativa
): void {
  const dataAtual = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const tipoLabel = atividade.tipo === 'objetiva' ? 'Questões Objetivas' :
                    atividade.tipo === 'discursiva' ? 'Questões Discursivas' :
                    'Atividade Prática';

  const docDefinition: TDocumentDefinitions = {
    pageSize: 'A4',
    pageMargins: [40, 60, 40, 60],
    
    header: {
      text: 'ATIVIDADE AVALIATIVA - BNCC',
      style: 'bnccBadge',
      margin: [40, 20, 40, 0],
    },
    
    footer: {
      text: `Gerado em ${dataAtual} | Alinhado à Competência Geral 5 - Cultura Digital`,
      style: 'footer',
      margin: [40, 0, 40, 0],
    },
    
    content: [
      // Cabeçalho
      {
        columns: [
          {
            width: '*',
            stack: [
              { text: disciplina.nome, style: 'header' },
              { text: disciplina.anoSerie, fontSize: 12, color: COLORS.muted },
            ],
          },
          {
            width: 'auto',
            stack: [
              {
                text: tipoLabel,
                fontSize: 12,
                bold: true,
                color: COLORS.secondary,
                alignment: 'right',
              },
            ],
          },
        ],
        marginBottom: 20,
      },
      
      // Tema da unidade
      {
        table: {
          widths: ['*'],
          body: [
            [
              {
                text: [
                  { text: 'Tema: ', bold: true },
                  unidade.tema,
                ],
                fillColor: COLORS.background,
                margin: [10, 8, 10, 8],
              },
            ],
          ],
        },
        layout: 'noBorders',
        marginBottom: 20,
      },
      
      // Enunciado
      {
        text: 'ENUNCIADO',
        style: 'sectionTitle',
      },
      {
        text: atividade.enunciado,
        style: 'normal',
        marginBottom: 30,
      },
      
      // Espaço para resposta (se discursiva)
      ...(atividade.tipo === 'discursiva' ? [
        {
          text: 'ESPAÇO PARA RESPOSTA:',
          fontSize: 10,
          bold: true,
          color: COLORS.muted,
          marginBottom: 5,
        } as Content,
        {
          canvas: [
            ...Array(10).fill(null).map((_, i) => ({
              type: 'line' as const,
              x1: 0, y1: i * 25,
              x2: 515, y2: i * 25,
              lineWidth: 0.5,
              lineColor: '#d1d5db',
            })),
          ],
          marginBottom: 30,
        } as Content,
      ] : []),
      
      // Critérios de avaliação (para o professor)
      {
        text: 'CRITÉRIOS DE AVALIAÇÃO (uso do professor)',
        style: 'sectionTitle',
        pageBreak: atividade.tipo === 'discursiva' ? 'before' as const : undefined,
      },
      {
        text: atividade.criteriosAvaliacao,
        style: 'normal',
        fillColor: '#fef3c7',
        margin: [10, 10, 10, 10],
      },
    ],
    
    styles,
    
    defaultStyle: {
      font: 'Roboto',
    },
  };

  const fileName = `atividade-${unidade.tema.toLowerCase().replace(/\s+/g, '-').substring(0, 30)}.pdf`;
  pdfMake.createPdf(docDefinition).download(fileName);
}
