// src/constants/metodologias.ts

export interface Metodologia {
    id: string;
    nome: string;
    descricao: string;
    fases?: string[];
}

export const METODOLOGIAS_ATIVAS: Metodologia[] = [
    {
        id: "pbl",
        nome: "Aprendizagem Baseada em Problemas (PBL)",
        descricao: "Metodologia transdisciplinar na qual os estudantes são confrontados com problemas abertos, mal estruturados e relacionados ao mundo real.",
        fases: ["Descrição do problema", "Investigação da solução", "Discussão para conclusão", "Debate final"]
    },
    {
        id: "projetos",
        nome: "Aprendizagem Baseada em Projetos",
        descricao: "Envolve o planejamento, desenvolvimento e avaliação de um projeto educacional estruturado para criar um produto, serviço ou resultado exclusivo.",
    },
    {
        id: "invertida",
        nome: "Sala de Aula Invertida",
        descricao: "Preparação prévia dos estudantes para aquisição de conceitos básicos, reservando a aula para discussões e aplicação prática.",
    },
    {
        id: "gamificacao",
        nome: "Gamificação",
        descricao: "Uso de ferramentas e pensamentos de games para envolver os alunos e motivá-los a aprender em equipe.",
    },
    {
        id: "hibrido",
        nome: "Ensino Híbrido",
        descricao: "Integração de momentos presenciais e a distância (online), proporcionando uma experiência flexível e personalizada.",
    },
    {
        id: "caso",
        nome: "Estudo de Caso",
        descricao: "Análise de um caso real ou situação fictícia para investigação, reflexão e tomada de decisão sobre o problema proposto.",
    },
    {
        id: "seminario",
        nome: "Seminários",
        descricao: "Fomento à autonomia e oratória através de pesquisa profunda e compartilhamento de pontos de vista.",
        fases: ["Preparação e planejamento", "Realização das pesquisas", "Apresentação em sala", "Avaliação"]
    },
    {
        id: "cooperativa",
        nome: "Aprendizagem Cooperativa",
        descricao: "Trabalho em pequenos grupos onde o sucesso individual depende do sucesso do grupo (Interdependência positiva).",
    },
    {
        id: "equipe",
        nome: "Aprendizagem Baseada em Equipe",
        descricao: "Preparação prévia seguida de testes de garantia de preparo (individual e grupo) e resolução de problemas reais em equipe.",
    },
    {
        id: "roda",
        nome: "Roda de Conversa",
        descricao: "Diálogo mediado em ambiente descontraído para compartilhamento de opiniões e experiências sobre um tema.",
    },
    {
        id: "dramatizacao",
        nome: "Dramatizações e Interpretações",
        descricao: "Uso de performance artística (teatro ou música) para tornar o processo de aprendizagem lúdico e engajador.",
    },
    {
        id: "oficina",
        nome: "Oficina (Cultura Maker)",
        descricao: "Construção do conhecimento através do 'mão na massa', com foco na aplicação prática e laboratorial.",
    },
    {
        id: "one-minute",
        nome: "One Minute Paper",
        descricao: "Estratégia de avaliação formativa onde o aluno escreve rapidamente sobre o que aprendeu ao final da aula.",
    }
];
