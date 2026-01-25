export async function gerarUnidade(
  disciplina: string,
  tema: string
) {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3333";
  const response = await fetch(`${API_URL}/unidades`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ disciplina, tema }),
  });

  if (!response.ok) {
    throw new Error("Erro ao gerar unidade");
  }

  return response.json();
}
