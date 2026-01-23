import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Layout } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { loadPdfMake } from '@/utils/pdf';

export interface PlanoExport {
  planoDeAula: string;
  objetivo: string;
  metodologia: string;
  meta: string;
  atividade: string;
  disciplina?: string;
  tema?: string;
}

interface Props {
  plano: PlanoExport;
}

export default function ExportActions({ plano }: Props) {
  const { toast } = useToast();

  const handleDownloadPdf = async () => {
    const docDefinition: any = {
      pageSize: 'A4',
      pageMargins: [40, 80, 40, 60],
      header: {
        columns: [
          { text: plano.planoDeAula || 'Plano de Aula', style: 'header' }
        ],
        margin: [40, 20, 40, 0]
      },
      footer: (currentPage: number, pageCount: number) => ({
        columns: [
          { text: `Alinhado à Competência Geral 5 da BNCC: Cultura Digital`, style: 'footerLeft' },
          { text: `Página ${currentPage} de ${pageCount}`, alignment: 'right', style: 'footerRight' }
        ],
        margin: [40, 0, 40, 20]
      }),
      content: [
        { text: 'Disciplina: ' + (plano.disciplina || '—'), style: 'subheader' },
        { text: '\n' },
        { text: 'Objetivo', style: 'sectionTitle' },
        { text: plano.objetivo || '—', margin: [0, 6, 0, 12] },
        { text: 'Metodologia', style: 'sectionTitle' },
        { text: plano.metodologia || '—', margin: [0, 6, 0, 12] },
        { text: 'Meta', style: 'sectionTitle' },
        { text: plano.meta || '—', margin: [0, 6, 0, 12] },
        { text: 'Atividade', style: 'sectionTitle' },
        { text: plano.atividade || '—', margin: [0, 6, 0, 12] },
      ],
      styles: {
        header: { fontSize: 18, bold: true, color: '#1f2937' },
        subheader: { fontSize: 12, color: '#374151', margin: [0, 6, 0, 6] },
        sectionTitle: { fontSize: 12, bold: true, color: '#111827', margin: [0, 8, 0, 4] },
        footerLeft: { fontSize: 9, italics: true, color: '#374151' },
        footerRight: { fontSize: 9, color: '#374151' },
        defaultStyle: { fontSize: 11 }
      },
      defaultStyle: { font: 'Helvetica' }
    };

    try {
      const pdfMake = await loadPdfMake();
      pdfMake.createPdf(docDefinition).download(`${(plano.planoDeAula || 'plano').replace(/\s+/g, '_')}.pdf`);
      toast({ title: 'PDF gerado', description: 'Download iniciado.', variant: 'default' });
    } catch (err: any) {
      console.error('Erro ao gerar PDF:', err);
      toast({ title: 'Erro ao gerar PDF', description: err?.message || 'Falha ao gerar PDF. Instale pdfmake com `npm i pdfmake`', variant: 'destructive' });
    }
  };

  const handleOpenCanva = () => {
    // Construímos uma URL com parâmetros simples para abrir o editor de apresentações do Canva.
    // Observação: o Canva não garante que parâmetros arbitrários preencham automaticamente um template,
    // mas fornecemos os dados em query params para facilitar cópia/colar no editor.
    const base = 'https://www.canva.com/create/presentations';
    const payload = {
      title: plano.planoDeAula || '',
      slide1: `${plano.planoDeAula || ''} • ${plano.disciplina || ''}`,
      slide2: `${plano.objetivo || ''}\n\nAlinhado à Competência Geral 5 da BNCC: Cultura Digital`,
      slide3: `${plano.atividade || ''}`
    };

    const params = new URLSearchParams();
    Object.entries(payload).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });

    const url = `${base}?${params.toString()}`;
    window.open(url, '_blank');
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <Button
        variant="default"
        onClick={handleDownloadPdf}
        className="w-full sm:w-auto flex items-center gap-2 justify-center"
        aria-label="Baixar PDF do plano de aula"
      >
        <Download className="h-4 w-4" />
        Baixar PDF
      </Button>

      <Button
        variant="secondary"
        onClick={handleOpenCanva}
        className="w-full sm:w-auto flex items-center gap-2 justify-center"
        aria-label="Gerar slides no Canva"
      >
        <Layout className="h-4 w-4" />
        Gerar Slides no Canva
      </Button>
    </div>
  );
}