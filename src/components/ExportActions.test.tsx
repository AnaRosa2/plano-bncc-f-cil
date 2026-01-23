import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { fireEvent } from '@testing-library/react';
import ExportActions from './ExportActions';
import * as pdfUtils from '@/utils/pdf';
import * as toastModule from '@/hooks/use-toast';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('ExportActions', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('shows error toast when pdfmake is missing', async () => {
    vi.spyOn(pdfUtils, 'loadPdfMake').mockRejectedValue(new Error('pdfmake not available'));
    const toastMock = vi.fn();
    vi.spyOn(toastModule, 'useToast').mockReturnValue({ toast: toastMock } as any);

    render(<ExportActions plano={{ planoDeAula: 'Teste', objetivo: 'O', metodologia: 'M', meta: 'Meta', atividade: 'Atividade' }} />);

    const btn = screen.getByRole('button', { name: /Baixar PDF/i });
    fireEvent.click(btn);

    await waitFor(() => {
      expect(toastMock).toHaveBeenCalled();
      const firstArg = (toastMock as any).mock.calls[0][0];
      expect(firstArg.title).toBe('Erro ao gerar PDF');
    });
  });

  it('calls pdfMake.createPdf.download when pdfmake is available', async () => {
    const downloadMock = vi.fn();
    const createPdfMock = vi.fn(() => ({ download: downloadMock }));
    vi.spyOn(pdfUtils, 'loadPdfMake').mockResolvedValue({ createPdf: createPdfMock } as any);
    const toastMock = vi.fn();
    vi.spyOn(toastModule, 'useToast').mockReturnValue({ toast: toastMock } as any);

    render(<ExportActions plano={{ planoDeAula: 'Teste 2', objetivo: 'O', metodologia: 'M', meta: 'Meta', atividade: 'Atividade', disciplina: 'Disc' }} />);

    const btn = screen.getByRole('button', { name: /Baixar PDF/i });
    fireEvent.click(btn);

    await waitFor(() => {
      expect(createPdfMock).toHaveBeenCalled();
      expect(downloadMock).toHaveBeenCalled();
      const firstArg = (toastMock as any).mock.calls[0][0];
      expect(firstArg.title).toBe('PDF gerado');
    });
  });
});