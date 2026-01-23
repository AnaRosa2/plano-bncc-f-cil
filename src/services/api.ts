// src/services/api.ts
const API_BASE_URL = 'http://localhost:3333';

export async function gerarPlanoDeAula(disciplina: string, tema: string) {
  const response = await fetch(`${API_BASE_URL}/unidades`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ disciplina, tema })
  });
  if (!response.ok) throw new Error('Erro ao gerar plano de aula');
  return response.json();
}

export async function sugerirTema(disciplina: string) {
  const response = await fetch(`${API_BASE_URL}/unidades/sugerir-tema`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ disciplina })
  });
  if (!response.ok) throw new Error('Erro ao sugerir tema');
  return response.json();
}

export async function gerarAtividade(tema: string, tipo: string, anoSerie?: string, quantidade = 1) {
  // Tenta rota integrada em /unidades primeiro (mais robusta em ambientes diferentes)
  let res = await fetch(`${API_BASE_URL}/unidades/atividade`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tema, tipo, anoSerie, quantidade })
  });

  if (!res.ok) {
    // Fallback para rota dedicada se existir
    res = await fetch(`${API_BASE_URL}/atividades/gerar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tema, tipo, anoSerie, quantidade })
    });
  }

  if (!res.ok) throw new Error('Erro ao gerar atividade');
  return res.json();
}

export async function gerarDisciplina(anoSerie: string, tema = 'Cultura Digital') {
  const res = await fetch(`${API_BASE_URL}/disciplinas/gerar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ anoSerie, tema })
  });

  if (!res.ok) throw new Error('Erro ao gerar disciplina');
  return res.json();
}