export function gerarConteudo(disciplina: string, tema: string) {
  return {
    planoDeAula: `Plano de aula sobre ${tema} na disciplina ${disciplina}.
Objetivo: introduzir conceitos de cultura digital.
Metodologia: aula dialogada e atividade prática.
Meta: Desenvolver o pensamento crítico dos alunos sobre o uso da tecnologia.`,
    
    atividade: `Atividade avaliativa:
Explique com suas palavras o tema "${tema}" e dê um exemplo prático.`
  };
}
