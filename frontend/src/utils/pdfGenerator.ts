import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Unidade, Disciplina, PlanoAula, AtividadeAvaliativa } from '../types';

// Registrar as fontes
pdfMake.vfs = pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : pdfFonts.vfs;

export const generateUnitPDF = (
  unidade: Unidade,
  disciplina: Disciplina,
  planoAula?: PlanoAula,
  atividadeAvaliativa?: AtividadeAvaliativa
) => {
  const docDefinition: any = {
    content: [
      { text: disciplina.nome.toUpperCase(), style: 'header', alignment: 'center' },
      { text: `Unidade: ${unidade.tema}`, style: 'subheader', alignment: 'center', margin: [0, 0, 0, 20] },
      
      { text: 'Detalhes da Unidade', style: 'sectionHeader' },
      {
        ul: [
          { text: [`Objetivo Geral: `, { text: unidade.objetivoGeral, style: 'normal' }] },
          { text: [`Habilidades BNCC: `, { text: unidade.habilidadesBNCC, style: 'normal' }] },
        ],
        margin: [0, 0, 0, 15]
      },
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 10]
      },
      subheader: {
        fontSize: 14,
        bold: true,
        margin: [0, 10, 0, 5]
      },
      sectionHeader: {
        fontSize: 14,
        bold: true,
        decoration: 'underline',
        margin: [0, 15, 0, 5]
      },
      normal: {
        fontSize: 12,
        bold: false
      },
      label: {
        bold: true
      }
    },
    defaultStyle: {
      fontSize: 12
    }
  };

  // Adicionar Plano de Aula se existir
  if (planoAula) {
    docDefinition.content.push(
      { text: 'Plano de Aula', style: 'sectionHeader', pageBreak: 'before' },
      { text: 'Objetivos', style: 'subheader' },
      { text: planoAula.objetivos, margin: [0, 0, 0, 10] },
      
      { text: 'Conteúdos', style: 'subheader' },
      { text: planoAula.conteudos, margin: [0, 0, 0, 10] },
      
      { text: 'Metodologia', style: 'subheader' },
      { text: planoAula.metodologia, margin: [0, 0, 0, 10] },
      
      { text: 'Recursos Didáticos', style: 'subheader' },
      { text: planoAula.recursosDidaticos, margin: [0, 0, 0, 10] },
      
      { text: 'Avaliação', style: 'subheader' },
      { text: planoAula.avaliacao, margin: [0, 0, 0, 10] },
      
      { text: 'Tempo Estimado', style: 'subheader' },
      { text: planoAula.tempoEstimado, margin: [0, 0, 0, 10] }
    );
  }

  // Adicionar Atividade Avaliativa se existir
  if (atividadeAvaliativa) {
    docDefinition.content.push(
      { text: 'Atividade Avaliativa', style: 'sectionHeader', pageBreak: 'before' },
      { text: `Tipo: ${atividadeAvaliativa.tipo.toUpperCase()}`, margin: [0, 0, 0, 10], bold: true },
      
      { text: 'Enunciado', style: 'subheader' },
      { text: atividadeAvaliativa.enunciado, margin: [0, 0, 0, 10] },
      
      { text: 'Critérios de Avaliação', style: 'subheader' },
      { text: atividadeAvaliativa.criteriosAvaliacao, margin: [0, 0, 0, 10] }
    );
  }

  pdfMake.createPdf(docDefinition).download(`plano-${unidade.tema.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`);
};
