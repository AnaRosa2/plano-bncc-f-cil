export async function gerarUnidade(
  disciplina: string,
  tema: string
) {
  const response = await fetch("http://localhost:3333/unidades", {
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
