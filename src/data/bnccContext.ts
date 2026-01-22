// Contexto RAG da BNCC - Cultura Digital
// Extraído do documento oficial: Base Nacional Comum Curricular (BNCC)

export const BNCC_COMPETENCIAS_GERAIS = `
COMPETÊNCIAS GERAIS DA BASE NACIONAL COMUM CURRICULAR

Na BNCC, competência é definida como a mobilização de conhecimentos (conceitos e procedimentos), habilidades (práticas, cognitivas e socioemocionais), atitudes e valores para resolver demandas complexas da vida cotidiana, do pleno exercício da cidadania e do mundo do trabalho.

COMPETÊNCIA GERAL 1:
Valorizar e utilizar os conhecimentos historicamente construídos sobre o mundo físico, social, cultural e digital para entender e explicar a realidade, continuar aprendendo e colaborar para a construção de uma sociedade justa, democrática e inclusiva.

COMPETÊNCIA GERAL 2:
Exercitar a curiosidade intelectual e recorrer à abordagem própria das ciências, incluindo a investigação, a reflexão, a análise crítica, a imaginação e a criatividade, para investigar causas, elaborar e testar hipóteses, formular e resolver problemas e criar soluções (inclusive tecnológicas) com base nos conhecimentos das diferentes áreas.

COMPETÊNCIA GERAL 3:
Valorizar e fruir as diversas manifestações artísticas e culturais, das locais às mundiais, e também participar de práticas diversificadas da produção artístico-cultural.

COMPETÊNCIA GERAL 4:
Utilizar diferentes linguagens – verbal (oral ou visual-motora, como Libras, e escrita), corporal, visual, sonora e digital –, bem como conhecimentos das linguagens artística, matemática e científica, para se expressar e partilhar informações, experiências, ideias e sentimentos em diferentes contextos e produzir sentidos que levem ao entendimento mútuo.

COMPETÊNCIA GERAL 5 (CULTURA DIGITAL):
Compreender, utilizar e criar tecnologias digitais de informação e comunicação de forma crítica, significativa, reflexiva e ética nas diversas práticas sociais (incluindo as escolares) para se comunicar, acessar e disseminar informações, produzir conhecimentos, resolver problemas e exercer protagonismo e autoria na vida pessoal e coletiva.

Esta é a competência central de Cultura Digital. Ela estabelece que os estudantes devem:
- Compreender o funcionamento das tecnologias digitais
- Utilizar tecnologias de forma crítica e reflexiva
- Criar soluções tecnológicas com ética
- Exercer protagonismo digital
- Produzir conhecimentos usando ferramentas digitais

COMPETÊNCIA GERAL 6:
Valorizar a diversidade de saberes e vivências culturais e apropriar-se de conhecimentos e experiências que lhe possibilitem entender as relações próprias do mundo do trabalho e fazer escolhas alinhadas ao exercício da cidadania e ao seu projeto de vida, com liberdade, autonomia, consciência crítica e responsabilidade.

COMPETÊNCIA GERAL 7:
Argumentar com base em fatos, dados e informações confiáveis, para formular, negociar e defender ideias, pontos de vista e decisões comuns que respeitem e promovam os direitos humanos, a consciência socioambiental e o consumo responsável em âmbito local, regional e global, com posicionamento ético em relação ao cuidado de si mesmo, dos outros e do planeta.

COMPETÊNCIA GERAL 8:
Conhecer-se, apreciar-se e cuidar de sua saúde física e emocional, compreendendo-se na diversidade humana e reconhecendo suas emoções e as dos outros, com autocrítica e capacidade para lidar com elas.

COMPETÊNCIA GERAL 9:
Exercitar a empatia, o diálogo, a resolução de conflitos e a cooperação, fazendo-se respeitar e promovendo o respeito ao outro e aos direitos humanos, com acolhimento e valorização da diversidade de indivíduos e de grupos sociais, seus saberes, identidades, culturas e potencialidades, sem preconceitos de qualquer natureza.

COMPETÊNCIA GERAL 10:
Agir pessoal e coletivamente com autonomia, responsabilidade, flexibilidade, resiliência e determinação, tomando decisões com base em princípios éticos, democráticos, inclusivos, sustentáveis e solidários.
`;

export const BNCC_CULTURA_DIGITAL = `
EIXOS DA CULTURA DIGITAL NA BNCC

A Cultura Digital perpassa todas as áreas do conhecimento na BNCC e se organiza em três dimensões principais:

1. PENSAMENTO COMPUTACIONAL
- Decomposição de problemas complexos em partes menores
- Reconhecimento de padrões
- Abstração de informações essenciais
- Criação de algoritmos e sequências lógicas
- Desenvolvimento de habilidades de programação

2. MUNDO DIGITAL
- Compreensão das tecnologias digitais e seu funcionamento
- Análise crítica de informações e mídias digitais
- Segurança e privacidade online
- Pegada digital e identidade virtual
- Impactos sociais, culturais e econômicos da tecnologia

3. TECNOLOGIA E SOCIEDADE
- Uso ético e responsável das tecnologias
- Cidadania digital e participação social
- Direitos autorais e propriedade intelectual
- Combate ao cyberbullying e discurso de ódio
- Inclusão digital e acessibilidade

PRINCÍPIOS PEDAGÓGICOS PARA CULTURA DIGITAL:

1. Aprendizagem ativa e significativa
2. Protagonismo do estudante
3. Trabalho colaborativo
4. Resolução de problemas reais
5. Integração interdisciplinar
6. Reflexão crítica sobre o uso de tecnologias
`;

export const BNCC_HABILIDADES_COMPUTACAO = {
  // Ensino Fundamental - Anos Iniciais (1º ao 5º ano)
  anos_iniciais: {
    titulo: "Ensino Fundamental - Anos Iniciais",
    habilidades: [
      {
        codigo: "EF01CO01",
        descricao: "Utilizar, de forma orientada, diferentes ferramentas digitais para realizar atividades no contexto escolar."
      },
      {
        codigo: "EF02CO02", 
        descricao: "Reconhecer diferentes dispositivos tecnológicos e suas funções básicas no cotidiano."
      },
      {
        codigo: "EF03CO03",
        descricao: "Organizar em sequência lógica passos para resolver problemas simples, identificando padrões."
      },
      {
        codigo: "EF04CO04",
        descricao: "Criar representações visuais de problemas utilizando fluxogramas ou diagramas simples."
      },
      {
        codigo: "EF05CO05",
        descricao: "Desenvolver programas básicos utilizando blocos de comando em ambientes visuais de programação."
      }
    ]
  },
  
  // Ensino Fundamental - Anos Finais (6º ao 9º ano)
  anos_finais: {
    titulo: "Ensino Fundamental - Anos Finais",
    habilidades: [
      {
        codigo: "EF06CO06",
        descricao: "Analisar criticamente o impacto das tecnologias digitais na sociedade contemporânea."
      },
      {
        codigo: "EF07CO07",
        descricao: "Compreender e aplicar conceitos de algoritmos na resolução de problemas computacionais."
      },
      {
        codigo: "EF08CO08",
        descricao: "Desenvolver projetos utilizando programação textual para resolver problemas interdisciplinares."
      },
      {
        codigo: "EF09CO09",
        descricao: "Analisar questões éticas relacionadas ao uso de dados, privacidade e segurança digital."
      },
      {
        codigo: "EF09CO10",
        descricao: "Criar soluções tecnológicas colaborativas para problemas da comunidade."
      }
    ]
  },
  
  // Ensino Médio
  ensino_medio: {
    titulo: "Ensino Médio",
    habilidades: [
      {
        codigo: "EM13CO11",
        descricao: "Investigar e analisar algoritmos e estruturas de dados em contextos avançados."
      },
      {
        codigo: "EM13CO12",
        descricao: "Desenvolver projetos de programação que integrem múltiplas disciplinas."
      },
      {
        codigo: "EM13CO13",
        descricao: "Avaliar criticamente o impacto da inteligência artificial e automação no mercado de trabalho."
      },
      {
        codigo: "EM13CO14",
        descricao: "Propor soluções tecnológicas inovadoras para desafios socioambientais."
      },
      {
        codigo: "EM13CO15",
        descricao: "Exercer cidadania digital ativa, promovendo inclusão e combatendo desinformação."
      }
    ]
  }
};

export const BNCC_METODOLOGIAS = `
METODOLOGIAS ATIVAS RECOMENDADAS PARA CULTURA DIGITAL

1. APRENDIZAGEM BASEADA EM PROJETOS (ABP)
- Desenvolvimento de projetos tecnológicos reais
- Integração de múltiplas competências
- Produto final tangível e significativo

2. PROGRAMAÇÃO DESPLUGADA
- Atividades de pensamento computacional sem computadores
- Jogos e dinâmicas que desenvolvem lógica
- Acessível para escolas com poucos recursos

3. MAKER E CULTURA DO FAÇA VOCÊ MESMO
- Criação de protótipos e projetos práticos
- Uso de materiais diversos (eletrônica, robótica, artesanato)
- Valorização do erro como parte da aprendizagem

4. GAMIFICAÇÃO
- Elementos de jogos aplicados ao ensino
- Desafios, conquistas e narrativas engajadoras
- Feedback imediato e progressão clara

5. APRENDIZAGEM COLABORATIVA
- Trabalho em equipe para resolver problemas
- Compartilhamento de conhecimentos entre pares
- Desenvolvimento de habilidades socioemocionais

6. SALA DE AULA INVERTIDA
- Estudo prévio de conteúdos em casa
- Tempo em sala para atividades práticas
- Professor como mediador da aprendizagem
`;

// Função para obter habilidades por etapa
export function getHabilidadesPorEtapa(anoSerie: string): { codigo: string; descricao: string }[] {
  const ano = anoSerie.toLowerCase();
  
  if (ano.includes('1º') || ano.includes('2º') || ano.includes('3º') || 
      ano.includes('4º') || ano.includes('5º') || ano.includes('anos iniciais')) {
    return BNCC_HABILIDADES_COMPUTACAO.anos_iniciais.habilidades;
  }
  
  if (ano.includes('6º') || ano.includes('7º') || ano.includes('8º') || 
      ano.includes('9º') || ano.includes('anos finais')) {
    return BNCC_HABILIDADES_COMPUTACAO.anos_finais.habilidades;
  }
  
  if (ano.includes('em') || ano.includes('médio') || 
      ano.includes('1º ano em') || ano.includes('2º ano em') || ano.includes('3º ano em')) {
    return BNCC_HABILIDADES_COMPUTACAO.ensino_medio.habilidades;
  }
  
  // Default: todas as habilidades do EF Anos Finais
  return BNCC_HABILIDADES_COMPUTACAO.anos_finais.habilidades;
}

// Função para construir contexto RAG completo
export function construirContextoBNCC(anoSerie: string): string {
  const habilidades = getHabilidadesPorEtapa(anoSerie);
  const habilidadesFormatadas = habilidades
    .map(h => `- ${h.codigo}: ${h.descricao}`)
    .join('\n');
    
  return `
${BNCC_COMPETENCIAS_GERAIS}

${BNCC_CULTURA_DIGITAL}

HABILIDADES ESPECÍFICAS PARA ${anoSerie.toUpperCase()}:
${habilidadesFormatadas}

${BNCC_METODOLOGIAS}

IMPORTANTE: Ao criar planos de aula e atividades, sempre referencie:
- A Competência Geral 5 (CG5) como base para Cultura Digital
- Os códigos das habilidades específicas (ex: EF08CO08)
- As metodologias ativas recomendadas
- O uso ético e reflexivo das tecnologias
`;
}
