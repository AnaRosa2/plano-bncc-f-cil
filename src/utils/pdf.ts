export async function loadPdfMake() {
  try {
    const pdfMakeModule = (await import('pdfmake/build/pdfmake')).default;
    const pdfFonts = (await import('pdfmake/build/vfs_fonts')).default;
    if (pdfMakeModule && pdfFonts) {
      pdfMakeModule.vfs = pdfFonts.pdfMake?.vfs || pdfFonts;
      return pdfMakeModule;
    }
    throw new Error('pdfmake modules inválidos');
  } catch (err) {
    throw new Error('pdfmake não encontrado. Instale com `npm i pdfmake` no frontend.');
  }
}