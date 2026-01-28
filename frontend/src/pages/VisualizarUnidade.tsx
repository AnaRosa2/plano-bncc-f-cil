import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FileText,
  BookOpen,
  ClipboardCheck,
  Sparkles,
  Edit,
  Copy,
  Printer,
  Target,
  Clock,
  Layers,
  Wrench,
  MessageSquare,
  CheckCircle,
  Save,
  X,
  Presentation,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import PageContainer from '@/components/layout/PageContainer';
import GuidanceMessage from '@/components/shared/GuidanceMessage';
import EmptyState from '@/components/shared/EmptyState';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import SectionCard from '@/components/shared/SectionCard';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';
import { TipoAtividade, TIPOS_ATIVIDADE } from '@/types';

import { generateUnitPDF } from '@/utils/pdfGenerator';
import { Download } from 'lucide-react';
import { gerarSlidesAPI, SlideAPI } from '@/services/apiService';

const METODOLOGIAS_ATIVAS = [
  { id: 'tradicional', nome: 'Tradicional / Padrão' },
  { id: 'pbl', nome: 'Aprendizagem Baseada em Problemas (PBL)' },
  { id: 'projetos', nome: 'Aprendizagem Baseada em Projetos' },
  { id: 'invertida', nome: 'Sala de Aula Invertida' },
  { id: 'gamificacao', nome: 'Gamificação' },
  { id: 'hibrido', nome: 'Ensino Híbrido' },
  { id: 'caso', nome: 'Estudo de Caso' },
  { id: 'seminario', nome: 'Seminários' },
  { id: 'cooperativa', nome: 'Aprendizagem Cooperativa' },
  { id: 'equipe', nome: 'Aprendizagem Baseada em Equipe' },
  { id: 'roda', nome: 'Roda de Conversa' },
  { id: 'dramatizacao', nome: 'Dramatizações e Interpretações' },
  { id: 'oficina', nome: 'Oficina (Cultura Maker)' },
  { id: 'one-minute', nome: 'One Minute Paper' },
];

const VisualizarUnidade: React.FC = () => {
  const { id: disciplinaId, unidadeId } = useParams<{ id: string; unidadeId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    getDisciplina,
    getUnidade,
    getPlanoAula,
    getAtividadeAvaliativa,
    gerarPlanoAula,
    gerarAtividadeAvaliativa,
    updatePlanoAula,
    updateAtividadeAvaliativa,
    getSlides,
    saveSlides,
    isLoading,
  } = useApp();

  const [activeTab, setActiveTab] = useState('plano');
  const [editingPlano, setEditingPlano] = useState(false);
  const [editingAtividade, setEditingAtividade] = useState(false);
  const [tipoAtividade, setTipoAtividade] = useState<TipoAtividade>('discursiva');
  const [metodologiaSelecionada, setMetodologiaSelecionada] = useState('tradicional');

  // Estados para slides
  const [slides, setSlides] = useState<SlideAPI[]>(getSlides(unidadeId || '') || []);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loadingSlides, setLoadingSlides] = useState(false);

  // Estados de edição
  const [planoEditado, setPlanoEditado] = useState({
    objetivos: '',
    conteudos: '',
    metodologia: '',
    recursosDidaticos: '',
    avaliacao: '',
    tempoEstimado: '',
  });

  const [atividadeEditada, setAtividadeEditada] = useState({
    enunciado: '',
    criteriosAvaliacao: '',
  });

  const disciplina = getDisciplina(disciplinaId || '');
  const unidade = getUnidade(unidadeId || '');
  const planoAula = getPlanoAula(unidadeId || '');
  const atividadeAvaliativa = getAtividadeAvaliativa(unidadeId || '');

  if (!disciplina || !unidade) {
    return (
      <PageContainer>
        <EmptyState
          icon={FileText}
          title="Unidade não encontrada"
          description="A unidade que você procura não existe ou foi removida."
          action={{
            label: 'Voltar',
            onClick: () => navigate(disciplinaId ? `/disciplina/${disciplinaId}` : '/'),
          }}
        />
      </PageContainer>
    );
  }

  const handleGerarPlano = async () => {
    try {
      const metId = metodologiaSelecionada === 'tradicional' ? undefined : metodologiaSelecionada;
      await gerarPlanoAula(unidade.id, metId);
      toast({
        title: 'Plano de aula gerado!',
        description: 'A IA criou um plano de aula baseado no tema da unidade.',
      });
    } catch (error: any) {
      console.error('[VisualizarUnidade] Erro handleGerarPlano:', error);
      toast({
        title: 'Erro ao gerar plano',
        description: error.message || 'Verifique sua conexão com o servidor.',
        variant: 'destructive',
      });
    }
  };

  const handleGerarAtividade = async () => {
    try {
      await gerarAtividadeAvaliativa(unidade.id, tipoAtividade);
      toast({
        title: 'Atividade gerada!',
        description: 'A IA criou uma atividade avaliativa para esta unidade.',
      });
    } catch (error: any) {
      console.error('[VisualizarUnidade] Erro handleGerarAtividade:', error);
      toast({
        title: 'Erro ao gerar atividade',
        description: error.message || 'Verifique sua conexão com o servidor.',
        variant: 'destructive',
      });
    }
  };

  // Handler para gerar slides
  const handleGerarSlides = async () => {
    setLoadingSlides(true);
    try {
      const slidesGerados = await gerarSlidesAPI(unidade.tema, disciplina.nome, disciplina.anoSerie);
      setSlides(slidesGerados);
      saveSlides(unidade.id, slidesGerados);
      setCurrentSlide(0);
      toast({
        title: 'Slides gerados!',
        description: `${slidesGerados.length} slides criados com IA.`,
      });
    } catch (error) {
      toast({
        title: 'Erro ao gerar slides',
        description: 'Tente novamente em alguns instantes.',
        variant: 'destructive',
      });
    } finally {
      setLoadingSlides(false);
    }
  };

  const handleEditarPlano = () => {
    if (planoAula) {
      setPlanoEditado({
        objetivos: planoAula.objetivos,
        conteudos: planoAula.conteudos,
        metodologia: planoAula.metodologia,
        recursosDidaticos: planoAula.recursosDidaticos,
        avaliacao: planoAula.avaliacao,
        tempoEstimado: planoAula.tempoEstimado,
      });
      setEditingPlano(true);
    }
  };

  const handleSalvarPlano = () => {
    if (planoAula) {
      updatePlanoAula(planoAula.id, planoEditado);
      setEditingPlano(false);
      toast({
        title: 'Plano atualizado!',
        description: 'Suas alterações foram salvas.',
      });
    }
  };

  const handleEditarAtividade = () => {
    if (atividadeAvaliativa) {
      setAtividadeEditada({
        enunciado: atividadeAvaliativa.enunciado,
        criteriosAvaliacao: atividadeAvaliativa.criteriosAvaliacao,
      });
      setEditingAtividade(true);
    }
  };

  const handleSalvarAtividade = () => {
    if (atividadeAvaliativa) {
      updateAtividadeAvaliativa(atividadeAvaliativa.id, atividadeEditada);
      setEditingAtividade(false);
      toast({
        title: 'Atividade atualizada!',
        description: 'Suas alterações foram salvas.',
      });
    }
  };

  const handleCopiar = (texto: string) => {
    navigator.clipboard.writeText(texto);
    toast({
      title: 'Copiado!',
      description: 'O conteúdo foi copiado para a área de transferência.',
    });
  };

  const handleImprimir = () => {
    window.print();
  };

  return (
    <PageContainer
      breadcrumbs={[
        { label: disciplina.nome, href: `/disciplina/${disciplina.id}` },
        { label: unidade.tema },
      ]}
    >
      {/* Cabeçalho da Unidade */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <span className="bncc-badge mb-2">
              <Sparkles className="h-3 w-3" />
              Cultura Digital
            </span>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">{unidade.tema}</h1>
            <p className="text-muted-foreground mt-1 text-justify">{unidade.objetivoGeral}</p>
            {unidade.habilidadesBNCC && (
              <p className="text-sm text-bncc mt-2">
                <BookOpen className="h-3.5 w-3.5 inline mr-1" />
                {unidade.habilidadesBNCC}
              </p>
            )}
          </div>

          <div className="flex shrink-0 gap-2">
            {/* Botão PDF movido para a aba de Slides por solicitação do usuário */}
          </div>
        </div>
      </div>

      {/* Loading */}
      {isLoading && <LoadingSpinner message="Gerando conteúdo com IA..." />}

      {/* Tabs */}
      {!isLoading && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="plano" className="flex-1 sm:flex-none">
              <FileText className="h-4 w-4 mr-2" />
              Plano de Aula
            </TabsTrigger>
            <TabsTrigger value="atividade" className="flex-1 sm:flex-none">
              <ClipboardCheck className="h-4 w-4 mr-2" />
              Atividade
            </TabsTrigger>
            <TabsTrigger value="completo" className="flex-1 sm:flex-none">
              <Layers className="h-4 w-4 mr-2" />
              Visão Completa
            </TabsTrigger>
            <TabsTrigger value="slides" className="flex-1 sm:flex-none">
              <Presentation className="h-4 w-4 mr-2" />
              Slides
            </TabsTrigger>
          </TabsList>

          {/* Tab: Plano de Aula */}
          <TabsContent value="plano" className="space-y-4">
            {planoAula && (
              <div className="bg-bncc/5 border border-bncc/20 rounded-2xl overflow-hidden mb-6 shadow-sm">
                <div className="bg-bncc/10 px-4 py-2 border-b border-bncc/20 flex items-center gap-2 text-bncc font-bold text-[10px] uppercase tracking-widest">
                  <Target className="h-3.5 w-3.5" />
                  Diretrizes Pedagógicas (BNCC & MEC)
                </div>
                <div className="p-4 bg-white/40 dark:bg-slate-900/40">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                    {(() => {
                      const metaText = typeof planoAula.conteudos === 'string' ? planoAula.conteudos : (planoAula.conteudos ? JSON.stringify(planoAula.conteudos) : unidade.habilidadesBNCC);
                      const parts = metaText.includes('|') ? metaText.split('|') : [metaText];
                      const labels = ['BNCC', 'Cultura Digital', 'Inclusão'];

                      return parts.map((part, i) => (
                        <div key={i} className="space-y-1">
                          <span className="text-[10px] font-bold text-bncc/60 uppercase">{labels[i] || 'Info'}</span>
                          <p className="text-muted-foreground leading-tight text-justify">{part.trim()}</p>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              </div>
            )}
            {!planoAula ? (
              <Card className="edu-card">
                <CardContent className="pt-6">
                  <EmptyState
                    icon={FileText}
                    title="Nenhum plano de aula"
                    description="Gere um plano de aula completo utilizando nossa IA como assistente pedagógico. O plano será alinhado à BNCC e à metodologia escolhida."
                  />

                  <div className="max-w-md mx-auto p-5 border shadow-sm rounded-2xl bg-slate-50/50 dark:bg-slate-900/50 space-y-5 -mt-2 mb-8 border-primary/20">
                    <div className="space-y-3">
                      <Label className="text-xs font-bold flex items-center gap-2 text-primary uppercase tracking-wider">
                        <Wrench className="h-3.5 w-3.5" />
                        Estratégia Pedagógica
                      </Label>
                      <Select
                        value={metodologiaSelecionada || 'tradicional'}
                        onValueChange={setMetodologiaSelecionada}
                      >
                        <SelectTrigger className="bg-white dark:bg-slate-950 h-10 text-sm">
                          <SelectValue placeholder="Selecione uma metodologia" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                          {METODOLOGIAS_ATIVAS.map((m) => (
                            <SelectItem key={m.id} value={m.id} className="text-base py-3">
                              {m.nome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground italic">
                        A IA irá reestruturar todo o plano de aula para seguir a metodologia escolhida acima.
                      </p>
                    </div>

                    <Button
                      variant="ai"
                      className="w-full h-14 text-lg shadow-lg hover:shadow-xl transition-all"
                      onClick={handleGerarPlano}
                    >
                      <Sparkles className="h-5 w-5 mr-3" />
                      Gerar Plano de Aula com IA
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : editingPlano ? (
              <Card className="edu-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Edit className="h-5 w-5" />
                    Editar Plano de Aula
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries({
                    objetivos: 'Objetivos',
                    conteudos: 'Conteúdos',
                    metodologia: 'Metodologia',
                    recursosDidaticos: 'Recursos Didáticos',
                    avaliacao: 'Avaliação',
                    tempoEstimado: 'Tempo Estimado',
                  }).map(([key, label]) => (
                    <div key={key} className="space-y-2">
                      <Label>{label}</Label>
                      <Textarea
                        value={planoEditado[key as keyof typeof planoEditado]}
                        onChange={(e) =>
                          setPlanoEditado((prev) => ({ ...prev, [key]: e.target.value }))
                        }
                        rows={key === 'tempoEstimado' ? 1 : 3}
                        className="bg-background"
                      />
                    </div>
                  ))}
                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" onClick={() => setEditingPlano(false)}>
                      <X className="h-4 w-4" />
                      Cancelar
                    </Button>
                    <Button onClick={handleSalvarPlano}>
                      <Save className="h-4 w-4" />
                      Salvar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="edu-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        Plano de Aula
                      </CardTitle>
                      <CardDescription>
                        {planoAula.geradoPorIA ? (
                          <span className="flex items-center gap-1">
                            <Sparkles className="h-3 w-3" />
                            Gerado por IA
                          </span>
                        ) : (
                          'Editado manualmente'
                        )}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={handleEditarPlano}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleCopiar(
                            `PLANO DE AULA: ${unidade.tema}\n\nOBJETIVOS:\n${planoAula.objetivos}\n\nCONTEÚDOS:\n${planoAula.conteudos}\n\nMETODOLOGIA:\n${planoAula.metodologia}\n\nRECURSOS:\n${planoAula.recursosDidaticos}\n\nAVALIAÇÃO:\n${planoAula.avaliacao}\n\nTEMPO: ${planoAula.tempoEstimado}`
                          )
                        }
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <SectionCard title="Objetivos e Competências" icon={Target}>
                    {typeof planoAula.objetivos === 'string' ? planoAula.objetivos : JSON.stringify(planoAula.objetivos)}
                  </SectionCard>

                  <SectionCard title="Caminho Pedagógico (Metodologia)" icon={Wrench}>
                    <div className="space-y-4">
                      {(typeof planoAula.metodologia === 'string' ? planoAula.metodologia : JSON.stringify(planoAula.metodologia))
                        .split('\n\n')
                        .map((phase, i) => {
                          const [title, content] = phase.includes(':\n') ? phase.split(':\n') : [null, phase];
                          return (
                            <div key={i} className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
                              {title && (
                                <div className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1.5 opacity-70">
                                  {title}
                                </div>
                              )}
                              <p className="text-muted-foreground text-sm leading-relaxed">{content}</p>
                            </div>
                          );
                        })}
                    </div>
                  </SectionCard>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SectionCard title="Recursos Didáticos" icon={Layers}>
                      {typeof planoAula.recursosDidaticos === 'string' ? planoAula.recursosDidaticos : JSON.stringify(planoAula.recursosDidaticos)}
                    </SectionCard>
                    <SectionCard title="Avaliação" icon={CheckCircle}>
                      {typeof planoAula.avaliacao === 'string' ? planoAula.avaliacao : JSON.stringify(planoAula.avaliacao)}
                    </SectionCard>
                  </div>

                  <SectionCard title="Gestão do Tempo" icon={Clock}>
                    {typeof planoAula.tempoEstimado === 'string' ? planoAula.tempoEstimado : JSON.stringify(planoAula.tempoEstimado)}
                  </SectionCard>

                  <GuidanceMessage variant="tip">
                    <strong>Você pode editar!</strong> O conteúdo gerado pela IA é uma sugestão.
                    Sinta-se à vontade para adaptar o plano à sua realidade escolar e às
                    necessidades dos seus alunos.
                  </GuidanceMessage>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Tab: Atividade Avaliativa */}
          <TabsContent value="atividade" className="space-y-4">
            {!atividadeAvaliativa ? (
              <Card className="edu-card">
                <CardContent className="pt-6">
                  <div className="text-center mb-6">
                    <ClipboardCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Nenhuma atividade avaliativa</h3>
                    <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
                      Escolha o tipo de atividade e gere uma avaliação coerente com o tema da
                      unidade.
                    </p>
                  </div>

                  <div className="max-w-xs mx-auto space-y-4">
                    <div className="space-y-2">
                      <Label>Tipo de Atividade</Label>
                      <Select
                        value={tipoAtividade}
                        onValueChange={(v) => setTipoAtividade(v as TipoAtividade)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {TIPOS_ATIVIDADE.map((tipo) => (
                            <SelectItem key={tipo.value} value={tipo.value}>
                              {tipo.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button variant="ai" className="w-full" onClick={handleGerarAtividade}>
                      <Sparkles className="h-4 w-4" />
                      Gerar Atividade com IA
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : editingAtividade ? (
              <Card className="edu-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Edit className="h-5 w-5" />
                    Editar Atividade Avaliativa
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Enunciado</Label>
                    <Textarea
                      value={atividadeEditada.enunciado}
                      onChange={(e) =>
                        setAtividadeEditada((prev) => ({ ...prev, enunciado: e.target.value }))
                      }
                      rows={10}
                      className="bg-background font-mono text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Critérios de Avaliação</Label>
                    <Textarea
                      value={atividadeEditada.criteriosAvaliacao}
                      onChange={(e) =>
                        setAtividadeEditada((prev) => ({
                          ...prev,
                          criteriosAvaliacao: e.target.value,
                        }))
                      }
                      rows={4}
                      className="bg-background"
                    />
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" onClick={() => setEditingAtividade(false)}>
                      <X className="h-4 w-4" />
                      Cancelar
                    </Button>
                    <Button onClick={handleSalvarAtividade}>
                      <Save className="h-4 w-4" />
                      Salvar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="edu-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <ClipboardCheck className="h-5 w-5 text-primary" />
                        {atividadeAvaliativa.titulo || 'Atividade Avaliativa'}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <span className="capitalize">
                          {TIPOS_ATIVIDADE.find((t) => t.value === atividadeAvaliativa.tipo)?.label}
                        </span>
                        {atividadeAvaliativa.geradoPorIA && (
                          <span className="flex items-center gap-1 text-bncc">
                            <Sparkles className="h-3 w-3" />
                            IA
                          </span>
                        )}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={handleEditarAtividade}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleCopiar(
                            `ATIVIDADE AVALIATIVA: ${unidade.tema}\n\n${atividadeAvaliativa.enunciado}\n\nCRITÉRIOS DE AVALIAÇÃO:\n${atividadeAvaliativa.criteriosAvaliacao}`
                          )
                        }
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <SectionCard title="Enunciado" icon={MessageSquare}>
                    {atividadeAvaliativa.enunciado}
                  </SectionCard>
                  <SectionCard title="Critérios de Avaliação" icon={CheckCircle}>
                    {atividadeAvaliativa.criteriosAvaliacao}
                  </SectionCard>

                  <GuidanceMessage variant="tip">
                    <strong>Personalize!</strong> Adapte a atividade ao nível da sua turma e aos
                    recursos disponíveis na sua escola.
                  </GuidanceMessage>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Tab: Visão Completa */}
          <TabsContent value="completo" className="space-y-6">
            <GuidanceMessage variant="info">
              Esta é a visualização completa de todo o material da unidade, pronta para impressão ou
              uso em sala de aula.
            </GuidanceMessage>

            {/* Resumo da Unidade */}
            <Card className="edu-card">
              <CardHeader>
                <CardTitle>📚 {unidade.tema}</CardTitle>
                <CardDescription>{disciplina.nome} • {disciplina.anoSerie}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{unidade.objetivoGeral}</p>
                {unidade.habilidadesBNCC && (
                  <p className="text-sm text-bncc mt-2">
                    <strong>BNCC:</strong> {unidade.habilidadesBNCC}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Plano de Aula Completo */}
            {planoAula && (
              <Card className="edu-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Plano de Aula
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <SectionCard title="Objetivos" icon={Target}>
                    {typeof planoAula.objetivos === 'string' ? planoAula.objetivos : JSON.stringify(planoAula.objetivos)}
                  </SectionCard>
                  <div className="bg-bncc/5 border border-bncc/20 rounded-2xl overflow-hidden mb-8">
                    <div className="bg-bncc/10 px-4 py-2 border-b border-bncc/20 flex items-center gap-2 text-bncc font-bold text-[10px] uppercase tracking-widest">
                      <BookOpen className="h-3.5 w-3.5" />
                      Referencial Curricular (BNCC & MEC)
                    </div>
                    <div className="p-5 bg-white/40 dark:bg-slate-900/40">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
                        {(() => {
                          const metaText = typeof planoAula.conteudos === 'string' ? planoAula.conteudos : JSON.stringify(planoAula.conteudos);
                          const parts = metaText.includes('|') ? metaText.split('|') : [metaText];
                          const labels = ['Habilidades BNCC', 'Cultura Digital', 'Inclusão'];

                          return parts.map((part, i) => (
                            <div key={i} className="space-y-1.5 border-l-2 border-bncc/10 pl-4 first:border-0 first:pl-0">
                              <span className="text-[10px] font-bold text-bncc/60 uppercase">{labels[i] || 'Informações'}</span>
                              <p className="text-muted-foreground leading-relaxed italic text-justify">{part.trim()}</p>
                            </div>
                          ));
                        })()}
                      </div>
                    </div>
                  </div>
                  <SectionCard title="Caminho Pedagógico (Metodologia)" icon={Wrench}>
                    <div className="space-y-4">
                      {(typeof planoAula.metodologia === 'string' ? planoAula.metodologia : JSON.stringify(planoAula.metodologia))
                        .split('\n\n')
                        .map((phase, i) => {
                          const [title, content] = phase.includes(':\n') ? phase.split(':\n') : [null, phase];
                          return (
                            <div key={i} className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
                              {title && (
                                <div className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1.5 opacity-70">
                                  {title}
                                </div>
                              )}
                              <p className="text-muted-foreground text-sm leading-relaxed">{content}</p>
                            </div>
                          );
                        })}
                    </div>
                  </SectionCard>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SectionCard title="Recursos Didáticos" icon={Layers}>
                      {typeof planoAula.recursosDidaticos === 'string' ? planoAula.recursosDidaticos : JSON.stringify(planoAula.recursosDidaticos)}
                    </SectionCard>
                    <SectionCard title="Metodologia ID" icon={Target}>
                      {planoAula.metodologiaId || 'Padrão'}
                    </SectionCard>
                  </div>
                  <SectionCard title="Avaliação" icon={CheckCircle}>
                    {typeof planoAula.avaliacao === 'string' ? planoAula.avaliacao : JSON.stringify(planoAula.avaliacao)}
                  </SectionCard>
                  <SectionCard title="Tempo Estimado" icon={Clock}>
                    {typeof planoAula.tempoEstimado === 'string' ? planoAula.tempoEstimado : JSON.stringify(planoAula.tempoEstimado)}
                  </SectionCard>
                </CardContent>
              </Card>
            )}

            {/* Atividade Avaliativa Completa */}
            {atividadeAvaliativa && (
              <Card className="edu-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ClipboardCheck className="h-5 w-5 text-primary" />
                    {atividadeAvaliativa.titulo || 'Atividade Avaliativa'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <SectionCard title="Enunciado" icon={MessageSquare}>
                    {atividadeAvaliativa.enunciado}
                  </SectionCard>
                  <SectionCard title="Critérios de Avaliação" icon={CheckCircle}>
                    {atividadeAvaliativa.criteriosAvaliacao}
                  </SectionCard>
                </CardContent>
              </Card>
            )}

            {!planoAula && !atividadeAvaliativa && (
              <EmptyState
                icon={Layers}
                title="Material incompleto"
                description="Gere o plano de aula e a atividade avaliativa nas abas correspondentes para visualizar o material completo."
              />
            )}
          </TabsContent>

          {/* Tab: Slides */}
          <TabsContent value="slides" className="space-y-4">
            {loadingSlides ? (
              <LoadingSpinner message="Gerando slides com IA..." />
            ) : slides.length === 0 ? (
              <Card className="edu-card">
                <CardContent className="pt-6">
                  <EmptyState
                    icon={Presentation}
                    title="Nenhum slide gerado"
                    description="Gere uma apresentação de slides educacionais com IA. Perfeito para usar em sala de aula ou projetor."
                    action={{
                      label: 'Gerar Slides com IA',
                      onClick: handleGerarSlides,
                      icon: Sparkles,
                    }}
                  />
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    className="gap-2 border-primary/20 hover:bg-primary/5"
                    onClick={() => generateUnitPDF(unidade, disciplina, planoAula, atividadeAvaliativa)}
                  >
                    <Download className="h-4 w-4" />
                    Baixar PDF do Material
                  </Button>
                </div>
                {/* Slide Atual - Design Profissional */}
                <div className="relative max-w-4xl mx-auto">
                  {/* Container do Slide com aspecto 16:9 */}
                  <div
                    className="relative w-full overflow-hidden rounded-2xl shadow-2xl border"
                    style={{ aspectRatio: '16/9' }}
                  >
                    {/* Background Gradiente baseado no tipo do slide */}
                    <div className={`absolute inset-0 ${slides[currentSlide]?.tipo === 'titulo'
                      ? 'bg-gradient-to-br from-primary via-primary/90 to-primary/70'
                      : slides[currentSlide]?.tipo === 'questao'
                        ? 'bg-gradient-to-br from-amber-500 via-orange-500 to-red-500'
                        : slides[currentSlide]?.tipo === 'conclusao'
                          ? 'bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500'
                          : 'bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900'
                      }`} />

                    {/* Padrão decorativo */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
                      <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
                    </div>

                    {/* Conteúdo do Slide */}
                    <div className="relative h-full flex flex-col justify-center p-8 md:p-12 lg:p-16 text-white">

                      {/* Número do slide */}
                      <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6">
                        <span className="text-white/60 text-sm font-medium">
                          {currentSlide + 1} / {slides.length}
                        </span>
                      </div>

                      {/* Logo/Marca */}
                      <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6">
                        <span className="text-white/40 text-xs font-medium">
                          Slides de {unidade.tema} • Plano BNCC
                        </span>
                      </div>

                      {/* Título do Slide */}
                      <h2 className={`font-bold mb-6 leading-tight ${slides[currentSlide]?.tipo === 'titulo'
                        ? 'text-3xl md:text-5xl lg:text-6xl text-center'
                        : 'text-2xl md:text-3xl lg:text-4xl'
                        }`}>
                        {slides[currentSlide]?.titulo}
                      </h2>

                      {/* Conteúdo do Slide */}
                      <div className={`text-white/90 ${slides[currentSlide]?.tipo === 'titulo' ? 'text-center' : ''
                        }`}>
                        {slides[currentSlide]?.conteudo.split('\\n').map((line, idx) => {
                          const cleanLine = line.trim();
                          if (!cleanLine) return <div key={idx} className="h-3" />;

                          // Formatar bullet points
                          if (cleanLine.startsWith('-') || cleanLine.startsWith('•')) {
                            return (
                              <div key={idx} className="flex items-start gap-3 mb-3">
                                <span className="w-2 h-2 mt-2 rounded-full bg-white/80 flex-shrink-0" />
                                <span className="text-lg md:text-xl lg:text-2xl">
                                  {cleanLine.replace(/^[-•]\s*/, '')}
                                </span>
                              </div>
                            );
                          }

                          return (
                            <p key={idx} className="text-lg md:text-xl lg:text-2xl mb-2">
                              {cleanLine}
                            </p>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Controles de Navegação */}
                <div className="flex items-center justify-center gap-6">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))}
                    disabled={currentSlide === 0}
                    className="gap-2"
                  >
                    <ChevronLeft className="h-5 w-5" />
                    Anterior
                  </Button>

                  {/* Indicadores de Slide */}
                  <div className="flex gap-2">
                    {slides.map((slide, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-10 h-2 rounded-full transition-all duration-300 ${index === currentSlide
                          ? 'bg-primary scale-110'
                          : 'bg-muted hover:bg-muted-foreground/50'
                          }`}
                        title={`Slide ${index + 1}: ${slide.titulo}`}
                      />
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setCurrentSlide(prev => Math.min(slides.length - 1, prev + 1))}
                    disabled={currentSlide === slides.length - 1}
                    className="gap-2"
                  >
                    Próximo
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>

                {/* Ações */}
                <div className="flex flex-wrap justify-center gap-3">
                  <Button variant="outline" onClick={handleGerarSlides}>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Gerar Novos Slides
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </PageContainer>
  );
};

export default VisualizarUnidade;
