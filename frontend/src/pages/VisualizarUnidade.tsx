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
    isLoading,
  } = useApp();

  const [activeTab, setActiveTab] = useState('plano');
  const [editingPlano, setEditingPlano] = useState(false);
  const [editingAtividade, setEditingAtividade] = useState(false);
  const [tipoAtividade, setTipoAtividade] = useState<TipoAtividade>('discursiva');

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
    await gerarPlanoAula(unidade.id);
    toast({
      title: 'Plano de aula gerado!',
      description: 'A IA criou um plano de aula baseado no tema da unidade.',
    });
  };

  const handleGerarAtividade = async () => {
    await gerarAtividadeAvaliativa(unidade.id, tipoAtividade);
    toast({
      title: 'Atividade gerada!',
      description: 'A IA criou uma atividade avaliativa para esta unidade.',
    });
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
            <p className="text-muted-foreground mt-1">{unidade.objetivoGeral}</p>
            {unidade.habilidadesBNCC && (
              <p className="text-sm text-bncc mt-2">
                <BookOpen className="h-3.5 w-3.5 inline mr-1" />
                {unidade.habilidadesBNCC}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleImprimir}>
              <Printer className="h-4 w-4" />
              <span className="hidden sm:inline">Imprimir</span>
            </Button>
            <Button size="sm" onClick={() => generateUnitPDF(unidade, disciplina, planoAula, atividadeAvaliativa)}>
              <Download className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Baixar PDF</span>
            </Button>
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
          </TabsList>

          {/* Tab: Plano de Aula */}
          <TabsContent value="plano" className="space-y-4">
            {!planoAula ? (
              <Card className="edu-card">
                <CardContent className="pt-6">
                  <EmptyState
                    icon={FileText}
                    title="Nenhum plano de aula"
                    description="Gere um plano de aula completo utilizando nossa IA como assistente pedagógico. O plano será alinhado à BNCC e ao tema desta unidade."
                    action={{
                      label: 'Gerar Plano de Aula com IA',
                      onClick: handleGerarPlano,
                      icon: Sparkles,
                    }}
                  />
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
                  <SectionCard title="Objetivos" icon={Target}>
                    {planoAula.objetivos}
                  </SectionCard>
                  <SectionCard title="Conteúdos" icon={BookOpen}>
                    {planoAula.conteudos}
                  </SectionCard>
                  <SectionCard title="Metodologia" icon={Wrench}>
                    {planoAula.metodologia}
                  </SectionCard>
                  <SectionCard title="Recursos Didáticos" icon={Layers}>
                    {planoAula.recursosDidaticos}
                  </SectionCard>
                  <SectionCard title="Avaliação" icon={CheckCircle}>
                    {planoAula.avaliacao}
                  </SectionCard>
                  <SectionCard title="Tempo Estimado" icon={Clock}>
                    {planoAula.tempoEstimado}
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
                        Atividade Avaliativa
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
                    {planoAula.objetivos}
                  </SectionCard>
                  <SectionCard title="Conteúdos" icon={BookOpen}>
                    {planoAula.conteudos}
                  </SectionCard>
                  <SectionCard title="Metodologia" icon={Wrench}>
                    {planoAula.metodologia}
                  </SectionCard>
                  <SectionCard title="Recursos Didáticos" icon={Layers}>
                    {planoAula.recursosDidaticos}
                  </SectionCard>
                  <SectionCard title="Avaliação" icon={CheckCircle}>
                    {planoAula.avaliacao}
                  </SectionCard>
                  <SectionCard title="Tempo Estimado" icon={Clock}>
                    {planoAula.tempoEstimado}
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
                    Atividade Avaliativa
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
        </Tabs>
      )}
    </PageContainer>
  );
};

export default VisualizarUnidade;
