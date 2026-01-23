import React, { useState } from 'react';
import { CheckCircle2, Circle, Zap, Sparkles } from 'lucide-react';

export default function IntegrationPlan(): JSX.Element {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [activeStep, setActiveStep] = useState<string>('backend');

  const toggleItem = (id: string) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const steps = [
    {
      id: 'backend',
      title: '🔧 Backend - Novos Endpoints',
      color: 'from-blue-500 to-cyan-500',
      tasks: [
        {
          id: 'b1',
          title: 'Criar endpoint para gerar disciplina',
          code: `// POST /disciplinas/gerar
router.post('/gerar', async (req, res) => {
  const { anoSerie, tema } = req.body;
  
  const prompt = \`\${BNCC_CULTURA_DIGITAL}
  
Crie uma disciplina de Cultura Digital para \${anoSerie}.
Tema base: "\${tema}"

Retorne APENAS um JSON válido:
{
  "nome": "Nome da disciplina",
  "descricao": "Descrição completa",
  "sugestoesUnidades": [
    {"tema": "...", "objetivo": "..."},
    {"tema": "...", "objetivo": "..."}
  ]
}\`;

  const resposta = await gerarTextoComIA(prompt);
  const dados = JSON.parse(limparJSON(resposta));
  res.json(dados);
});`
        },
        {
          id: 'b2',
          title: 'Criar endpoint para gerar plano de aula completo',
          code: `// POST /unidades/plano-completo
router.post('/plano-completo', async (req, res) => {
  const { disciplina, tema, anoSerie } = req.body;
  
  const prompt = \`\${BNCC_CULTURA_DIGITAL}
  
Crie um plano de aula completo sobre "\${tema}" 
para \${anoSerie} na disciplina \${disciplina}.

Retorne APENAS JSON:
{
  "objetivos": "texto com bullets",
  "conteudos": "texto com bullets",
  "metodologia": "texto com bullets e tempo",
  "recursosDidaticos": "lista de recursos",
  "avaliacao": "critérios de avaliação",
  "tempoEstimado": "50 minutos"
}\`;

  const resposta = await gerarTextoComIA(prompt);
  res.json(JSON.parse(limparJSON(resposta)));
});`
        },
        {
          id: 'b3',
          title: 'Criar endpoint para gerar atividade por tipo',
          code: `// POST /atividades/gerar
router.post('/gerar', async (req, res) => {
  const { tema, tipo, anoSerie } = req.body;
  
  const prompt = \`\${BNCC_CULTURA_DIGITAL}
  
Crie uma atividade \${tipo} sobre "\${tema}" para \${anoSerie}.

Retorne APENAS JSON:
{
  "enunciado": "texto completo da atividade",
  "criteriosAvaliacao": "critérios detalhados"
}\`;

  const resposta = await gerarTextoComIA(prompt);
  res.json(JSON.parse(limparJSON(resposta)));
});`
        },
        {
          id: 'b4',
          title: 'Criar função auxiliar limparJSON',
          code: `// src/utils/json-parser.ts
export function limparJSON(texto: string): string {
  // Remove markdown
  let limpo = texto.replace(/\`\`\`json|\`\`\`/g, '').trim();
  
  // Extrai apenas o JSON
  const match = limpo.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('JSON não encontrado');
  
  return match[0];
}`
        }
      ]
    },
    {
      id: 'frontend',
      title: '⚛️ Frontend - Integração',
      color: 'from-purple-500 to-pink-500',
      tasks: [
        {
          id: 'f1',
          title: 'Atualizar api.ts com novos endpoints',
          code: `// src/services/api.ts
const API_URL = 'http://localhost:3333';

export async function gerarDisciplinaIA(anoSerie: string, tema: string) {
  const res = await fetch(\`\${API_URL}/disciplinas/gerar\`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ anoSerie, tema })
  });
  return res.json();
}

export async function gerarPlanoCompleto(
  disciplina: string, 
  tema: string, 
  anoSerie: string
) {
  const res = await fetch(\`\${API_URL}/unidades/plano-completo\`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ disciplina, tema, anoSerie })
  });
  return res.json();
}

export async function gerarAtividade(
  tema: string, 
  tipo: string, 
  anoSerie: string
) {
  const res = await fetch(\`\${API_URL}/atividades/gerar\`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tema, tipo, anoSerie })
  });
  return res.json();
}`
        },
        {
          id: 'f2',
          title: 'Adicionar botão IA em NovaDisciplina.tsx',
          code: `// Adicionar antes do formulário
const [gerandoIA, setGerandoIA] = useState(false);

const handleGerarComIA = async () => {
  if (!anoSerie) {
    toast({ 
      title: 'Selecione um ano/série',
      variant: 'destructive' 
    });
    return;
  }
  
  setGerandoIA(true);
  try {
    const dados = await gerarDisciplinaIA(
      anoSerie, 
      'Cultura Digital'
    );
    
    setNome(dados.nome);
    setDescricao(dados.descricao);
    
    toast({ 
      title: 'Disciplina gerada!',
      description: 'Revise e ajuste se necessário.' 
    });
  } catch (error) {
    toast({ 
      title: 'Erro', 
      variant: 'destructive' 
    });
  } finally {
    setGerandoIA(false);
  }
};

// No JSX, adicionar botão:
<Button 
  type="button" 
  variant="ai" 
  onClick={handleGerarComIA}
  disabled={gerandoIA || !anoSerie}
>
  <Sparkles className="h-4 w-4" />
  {gerandoIA ? 'Gerando...' : 'Gerar com IA'}
</Button>`
        },
        {
          id: 'f3',
          title: 'Atualizar NovaUnidade.tsx - gerar plano completo',
          code: `// Substituir handleGerarTemaIA por:
const handleGerarPlanoCompleto = async () => {
  if (!tema.trim()) {
    toast({ 
      title: 'Digite um tema',
      variant: 'destructive' 
    });
    return;
  }
  
  try {
    const plano = await gerarPlanoCompleto(
      disciplina.nome,
      tema,
      disciplina.anoSerie
    );
    
    // Preencher campos
    setObjetivoGeral(plano.objetivos.split('\n')[0]);
    setHabilidadesBNCC('EF08CI01, EF08CI02');
    
    toast({ 
      title: 'Conteúdo gerado!',
      description: 'Plano criado com IA' 
    });
  } catch (error) {
    toast({ 
      title: 'Erro ao gerar',
      variant: 'destructive' 
    });
  }
};`
        },
        {
          id: 'f4',
          title: 'Atualizar AppContext - integrar com backend real',
          code: `// Em AppContext.tsx, substituir gerarPlanoAula por:
const gerarPlanoAula = async (unidadeId: string) => {
  setIsLoading(true);
  try {
    const unidade = getUnidade(unidadeId);
    const disciplina = getDisciplina(unidade!.disciplinaId);
    
    const plano = await gerarPlanoCompleto(
      disciplina!.nome,
      unidade!.tema,
      disciplina!.anoSerie
    );
    
    const novoPlano: PlanoAula = {
      id: generateId(),
      unidadeId,
      ...plano,
      geradoPorIA: true
    };
    
    setPlanoAulas(prev => [...prev, novoPlano]);
  } finally {
    setIsLoading(false);
  }
};`
        }
      ]
    },
    {
      id: 'prompts',
      title: '🎯 Melhorar Prompts IA',
      color: 'from-green-500 to-emerald-500',
      tasks: [
        {
          id: 'p1',
          title: 'Prompt estruturado para disciplinas',
          code: `const promptDisciplina = \`\${BNCC_CULTURA_DIGITAL}

Você é um assistente pedagógico especializado em BNCC.

Crie uma disciplina de Cultura Digital para \${anoSerie}.
Foco em: \${tema}

IMPORTANTE:
- Use linguagem adequada à faixa etária
- Alinhe com competências da BNCC
- Sugira 4-5 unidades temáticas relevantes

Formato de resposta (APENAS JSON válido, sem markdown):
{
  "nome": "Nome atrativo e claro da disciplina",
  "descricao": "Descrição pedagógica de 2-3 linhas explicando objetivos e abordagem",
  "sugestoesUnidades": [
    {
      "tema": "Título da unidade",
      "objetivo": "Objetivo específico SMART"
    }
  ]
}\`;`
        },
        {
          id: 'p2',
          title: 'Prompt estruturado para planos de aula',
          code: `const promptPlano = \`\${BNCC_CULTURA_DIGITAL}

Crie um PLANO DE AULA COMPLETO sobre "\${tema}".
Disciplina: \${disciplina}
Ano/Série: \${anoSerie}

ESTRUTURA OBRIGATÓRIA:
1. Objetivos: 3-4 objetivos específicos com verbos da taxonomia de Bloom
2. Conteúdos: Tópicos principais em bullets
3. Metodologia: Sequência didática com tempos (total 50min)
4. Recursos: Materiais e tecnologias necessários
5. Avaliação: Critérios claros e mensuráveis
6. Tempo: Sempre "50 minutos (1 hora-aula)"

Retorne APENAS JSON válido:
{
  "objetivos": "• Objetivo 1\n• Objetivo 2...",
  "conteudos": "• Conteúdo 1\n• Conteúdo 2...",
  "metodologia": "• Momento 1 (15min)\n• Momento 2...",
  "recursosDidaticos": "• Recurso 1\n• Recurso 2...",
  "avaliacao": "• Critério 1\n• Critério 2...",
  "tempoEstimado": "50 minutos (1 hora-aula)"
}\`;`
        },
        {
          id: 'p3',
          title: 'Prompt para atividades por tipo',
          code: `const promptAtividade = (tipo: string) => {
  const instrucoes = {
    objetiva: 'Crie 5 questões de múltipla escolha com 4 alternativas',
    discursiva: 'Crie 4 questões abertas reflexivas',
    pratica: 'Crie um projeto prático em grupo'
  };
  
  return \`\${BNCC_CULTURA_DIGITAL}

Crie uma ATIVIDADE AVALIATIVA \${tipo.toUpperCase()}.
Tema: "\${tema}"
Ano/Série: \${anoSerie}

\${instrucoes[tipo]}

Critérios de avaliação claros e baseados na BNCC.

Retorne APENAS JSON:
{
  "enunciado": "Texto completo da atividade com instruções",
  "criteriosAvaliacao": "• Critério 1 (X pontos)\n• Critério 2..."
}\`;
};`
        }
      ]
    },
    {
      id: 'testing',
      title: '🧪 Teste e Validação',
      color: 'from-orange-500 to-red-500',
      tasks: [
        {
          id: 't1',
          title: 'Testar endpoint de disciplina',
          code: `// No Insomnia/Postman:
POST http://localhost:3333/disciplinas/gerar
Content-Type: application/json

{
  "anoSerie": "8º ano EF",
  "tema": "Cidadania Digital"
}

// Deve retornar:
{
  "nome": "Cultura Digital...",
  "descricao": "...",
  "sugestoesUnidades": [...]
}`
        },
        {
          id: 't2',
          title: 'Testar geração de plano de aula',
          code: `POST http://localhost:3333/unidades/plano-completo
Content-Type: application/json

{
  "disciplina": "Cultura Digital",
  "tema": "Segurança na Internet",
  "anoSerie": "8º ano EF"
}

// Validar se retorna todos os campos` 
        },
        {
          id: 't3',
          title: 'Testar no frontend - fluxo completo',
          code: `// Teste manual:
// 1. Criar nova disciplina com IA
// 2. Ver se preenche nome e descrição
// 3. Criar nova unidade
// 4. Gerar plano com IA
// 5. Gerar atividade com IA
// 6. Verificar se tudo aparece corretamente`
        }
      ]
    }
  ];

  const currentStepData = steps.find(s => s.id === activeStep)!;
  const allTasks = steps.flatMap(s => s.tasks);
  const completedTasks = allTasks.filter(t => checkedItems[t.id]).length;
  const progress = (completedTasks / allTasks.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-white/20">
          <div className="flex items-center gap-4 mb-4">
            <Sparkles className="text-yellow-400" size={40} />
            <div>
              <h1 className="text-4xl font-bold text-white">
                Plano de Integração Gemini AI
              </h1>
              <p className="text-gray-300 text-lg">
                Sistema completo de geração de conteúdo educacional
              </p>
            </div>
          </div>
          
          {/* Progress */}
          <div className="bg-white/10 rounded-full h-4 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-green-400 to-blue-500 h-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-white mt-3 text-sm">
            Progresso Total: {completedTasks}/{allTasks.length} tarefas ({Math.round(progress)}%)
          </p>
        </div>

        {/* Step Navigation */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {steps.map((step) => {
            const stepTasks = step.tasks.length;
            const stepCompleted = step.tasks.filter(t => checkedItems[t.id]).length;
            const isActive = activeStep === step.id;
            
            return (
              <button
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  isActive
                    ? 'border-white bg-white/10 scale-105'
                    : 'border-white/20 bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className="text-white text-lg font-bold mb-2">
                  {step.title}
                </div>
                <div className="text-gray-300 text-sm">
                  {stepCompleted}/{stepTasks} completo
                </div>
              </button>
            );
          })}
        </div>

        {/* Current Step Content */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 overflow-hidden">
          <div className={`bg-gradient-to-r ${currentStepData.color} p-6`}>
            <h2 className="text-2xl font-bold text-white">
              {currentStepData.title}
            </h2>
          </div>

          <div className="p-6 space-y-4">
            {currentStepData.tasks.map((task) => (
              <div
                key={task.id}
                className="bg-white/5 rounded-lg border border-white/10 overflow-hidden"
              >
                <div
                  onClick={() => toggleItem(task.id)}
                  className="flex items-center gap-3 p-4 cursor-pointer hover:bg-white/5 transition-colors"
                >
                  {checkedItems[task.id] ? (
                    <CheckCircle2 className="text-green-400 flex-shrink-0" size={24} />
                  ) : (
                    <Circle className="text-gray-400 flex-shrink-0" size={24} />
                  )}
                  <span className={`text-white font-medium ${checkedItems[task.id] ? 'line-through opacity-60' : ''}`}>
                    {task.title}
                  </span>
                </div>

                {task.code && (
                  <div className="border-t border-white/10">
                    <pre className="p-4 overflow-x-auto text-sm">
                      <code className="text-gray-200 font-mono">
                        {task.code}
                      </code>
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Quick Start Guide */}
        <div className="mt-8 bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-lg rounded-xl p-6 border border-green-500/30">
          <h3 className="text-white text-xl font-bold mb-4 flex items-center gap-2">
            <Zap size={24} />
            🚀 Quick Start
          </h3>
          <div className="space-y-2 text-gray-200">
            <p><strong>1.</strong> Comece pelo Backend - crie os novos endpoints</p>
            <p><strong>2.</strong> Atualize o api.ts do frontend com as novas funções</p>
            <p><strong>3.</strong> Integre os botões de IA nos componentes</p>
            <p><strong>4.</strong> Teste cada funcionalidade separadamente</p>
            <p><strong>5.</strong> Ajuste os prompts conforme necessário</p>
          </div>
        </div>
      </div>
    </div>
  );
}
