import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FileText, BookOpen, ClipboardCheck, Sparkles, Edit, Copy, Target, Clock, Layers, Wrench, MessageSquare, CheckCircle, Save, X, Presentation, ChevronLeft, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PageContainer from '@/components/layout/PageContainer';
import GuidanceMessage from '@/components/shared/GuidanceMessage';
import EmptyState from '@/components/shared/EmptyState';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import SectionCard from '@/components/shared/SectionCard';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';
import { TipoAtividade, TIPOS_ATIVIDADE } from '@/types';
import { gerarSlidesAPI } from '@/services/apiService';

const VisualizarUnidade: React.FC = () => {
  const { id: disciplinaId, unidadeId } = useParams<{ id: string; unidadeId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    getDisciplina, getUnidade, getPlanosByUnidade, getAtividadesByUnidade, getSlidesByUnidade,
    gerarPlanoAula, gerarAtividadeAvaliativa, addSlides, updatePlanoAula, updateAtividadeAvaliativa,
    deletePlanoAula, deleteAtividade, deleteSlides, isLoading
  } = useApp();

  const [activeTab, setActiveTab] = useState('plano');
  const [selectedPlanoId, setSelectedPlanoId] = useState<string | null>(null);
  const [selectedAtividadeId, setSelectedAtividadeId] = useState<string | null>(null);
  const [selectedSlidesId, setSelectedSlidesId] = useState<string | null>(null);

  const [editingPlano, setEditingPlano] = useState(false);
  const [editingAtividade, setEditingAtividade] = useState(false);
  const [tipoAtividade, setTipoAtividade] = useState<TipoAtividade>('discursiva');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loadingSlides, setLoadingSlides] = useState(false);

  const [planoEditado, setPlanoEditado] = useState({ objetivos: '', conteudos: '', metodologia: '', recursosDidaticos: '', avaliacao: '', tempoEstimado: '' });
  const [atividadeEditada, setAtividadeEditada] = useState({ enunciado: '', criteriosAvaliacao: '' });

  const disciplina = getDisciplina(disciplinaId || '');
  const unidade = getUnidade(unidadeId || '');
  const planos = getPlanosByUnidade(unidadeId || '');
  const atividades = getAtividadesByUnidade(unidadeId || '');
  const setsSlides = getSlidesByUnidade(unidadeId || '');

  const planoAula = planos.find(p => p.id === selectedPlanoId) || planos[0];
  const atividadeAvaliativa = atividades.find(a => a.id === selectedAtividadeId) || atividades[0];
  const slidesSet = setsSlides.find(s => s.id === selectedSlidesId) || setsSlides[0];
  const slides = slidesSet?.slides || [];

  if (!disciplina || !unidade) {
    return <PageContainer><EmptyState icon={FileText} title="Não encontrado" description="Unidade não existe." action={{ label: 'Voltar', onClick: () => navigate('/') }} /></PageContainer>;
  }

  const handleGerarPlano = async () => {
    try {
      const novo = await gerarPlanoAula(unidade.id);
      setSelectedPlanoId(novo.id);
      toast({ title: 'Plano gerado!' });
    } catch (e) { toast({ title: 'Erro', variant: 'destructive' }); }
  };

  const handleGerarAtividade = async () => {
    try {
      const nova = await gerarAtividadeAvaliativa(unidade.id, tipoAtividade);
      setSelectedAtividadeId(nova.id);
      toast({ title: 'Atividade gerada!' });
    } catch (e) { toast({ title: 'Erro', variant: 'destructive' }); }
  };

  const handleGerarSlides = async () => {
    setLoadingSlides(true);
    try {
      const gerados = await gerarSlidesAPI(unidade.tema, disciplina.nome, disciplina.anoSerie);
      addSlides(unidade.id, gerados);
      setSelectedSlidesId(null);
      setCurrentSlide(0);
      toast({ title: 'Slides salvos!' });
    } finally { setLoadingSlides(false); }
  };

  const handleEditarPlano = () => {
    if (planoAula) {
      setPlanoEditado({ ...planoAula });
      setEditingPlano(true);
    }
  };

  const handleSalvarPlano = () => {
    if (planoAula) {
      updatePlanoAula(planoAula.id, planoEditado);
      setEditingPlano(false);
      toast({ title: 'Salvo!' });
    }
  };

  const handleEditarAtividade = () => {
    if (atividadeAvaliativa) {
      setAtividadeEditada({ ...atividadeAvaliativa });
      setEditingAtividade(true);
    }
  };

  const handleSalvarAtividade = () => {
    if (atividadeAvaliativa) {
      updateAtividadeAvaliativa(atividadeAvaliativa.id, atividadeEditada);
      setEditingAtividade(false);
      toast({ title: 'Salvo!' });
    }
  };

  const handleCopiar = (txt: string) => {
    navigator.clipboard.writeText(txt);
    toast({ title: 'Copiado!' });
  };

  return (
    <PageContainer breadcrumbs={[{ label: disciplina.nome, href: `/disciplina/${disciplina.id}` }, { label: unidade.tema }]}>
      <div className="mb-6">
        <span className="bncc-badge mb-2"><Sparkles className="h-3 w-3" /> Cultura Digital</span>
        <h1 className="text-2xl font-bold">{unidade.tema}</h1>
        <p className="text-muted-foreground">{unidade.objetivoGeral}</p>
      </div>

      {isLoading && <LoadingSpinner message="IA trabalhando..." />}

      {!isLoading && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="plano"><FileText className="h-4 w-4 mr-2" /> Plano</TabsTrigger>
            <TabsTrigger value="atividade"><ClipboardCheck className="h-4 w-4 mr-2" /> Atividade</TabsTrigger>
            <TabsTrigger value="slides"><Presentation className="h-4 w-4 mr-2" /> Slides</TabsTrigger>
          </TabsList>

          <div className="flex flex-wrap gap-2 mb-2">
            {activeTab === 'plano' && planos.map((p, i) => <Button key={p.id} variant={p.id === (planoAula?.id) ? 'default' : 'outline'} size="sm" onClick={() => setSelectedPlanoId(p.id)}>V{planos.length - i}</Button>)}
            {activeTab === 'atividade' && atividades.map((a, i) => <Button key={a.id} variant={a.id === (atividadeAvaliativa?.id) ? 'default' : 'outline'} size="sm" onClick={() => setSelectedAtividadeId(a.id)}>V{atividades.length - i}</Button>)}
            {activeTab === 'slides' && setsSlides.map((s, i) => <Button key={s.id} variant={s.id === (slidesSet?.id) ? 'default' : 'outline'} size="sm" onClick={() => setSelectedSlidesId(s.id)}>V{setsSlides.length - i}</Button>)}
          </div>

          <TabsContent value="plano">
            {!planoAula ? (
              <EmptyState icon={FileText} title="Sem plano" description="Gere um agora." action={{ label: 'Gerar com IA', onClick: handleGerarPlano }} />
            ) : editingPlano ? (
              <Card className="edu-card">
                <CardHeader><CardTitle>Editar Plano</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {Object.keys(planoEditado).map(k => (
                    <div key={k} className="space-y-2">
                      <Label className="capitalize">{k}</Label>
                      <Textarea value={(planoEditado as any)[k]} onChange={e => setPlanoEditado(prev => ({ ...prev, [k]: e.target.value }))} />
                    </div>
                  ))}
                  <div className="flex gap-2"><Button variant="outline" onClick={() => setEditingPlano(false)}>Cancelar</Button><Button onClick={handleSalvarPlano}>Salvar</Button></div>
                </CardContent>
              </Card>
            ) : (
              <Card className="edu-card">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Plano de Aula {planoAula.geradoPorIA && <span className="text-xs text-bncc italic">(IA)</span>}</CardTitle>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => { if (confirm('Excluir?')) deletePlanoAula(planoAula.id); }}><X className="h-4 w-4 text-destructive" /></Button>
                      <Button variant="outline" size="sm" onClick={handleEditarPlano}><Edit className="h-4 w-4" /></Button>
                      <Button variant="ai" size="sm" onClick={handleGerarPlano}><Sparkles className="h-4 w-4 mr-1" /> Nova Versão</Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <SectionCard title="Objetivos" icon={Target}>{planoAula.objetivos}</SectionCard>
                  <SectionCard title="Metodologia" icon={Wrench}>{planoAula.metodologia}</SectionCard>
                  <SectionCard title="Atividade" icon={Layers}>{planoAula.recursosDidaticos}</SectionCard>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="atividade">
            {!atividadeAvaliativa ? (
              <div className="max-w-xs mx-auto space-y-4 py-8">
                <Select value={tipoAtividade} onValueChange={v => setTipoAtividade(v as TipoAtividade)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{TIPOS_ATIVIDADE.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
                </Select>
                <Button className="w-full" onClick={handleGerarAtividade}>Gerar Atividade</Button>
              </div>
            ) : editingAtividade ? (
              <Card className="edu-card">
                <CardContent className="space-y-4 pt-6">
                  <Label>Enunciado</Label><Textarea rows={10} value={atividadeEditada.enunciado} onChange={e => setAtividadeEditada(p => ({ ...p, enunciado: e.target.value }))} />
                  <Label>Critérios</Label><Textarea value={atividadeEditada.criteriosAvaliacao} onChange={e => setAtividadeEditada(p => ({ ...p, criteriosAvaliacao: e.target.value }))} />
                  <div className="flex gap-2"><Button variant="outline" onClick={() => setEditingAtividade(false)}>Voltar</Button><Button onClick={handleSalvarAtividade}>Salvar</Button></div>
                </CardContent>
              </Card>
            ) : (
              <Card className="edu-card">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="capitalize">{atividadeAvaliativa.tipo}</CardTitle>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => { if (confirm('Remover?')) deleteAtividade(atividadeAvaliativa.id); }}><X className="h-4 w-4 text-destructive" /></Button>
                      <Button variant="outline" size="sm" onClick={handleEditarAtividade}><Edit className="h-4 w-4" /></Button>
                      <Button variant="outline" size="sm" onClick={() => setSelectedAtividadeId(null)}>Outra Variação</Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <SectionCard title="Enunciado" icon={MessageSquare}>{atividadeAvaliativa.enunciado}</SectionCard>
                  <SectionCard title="Critérios" icon={CheckCircle}>{atividadeAvaliativa.criteriosAvaliacao}</SectionCard>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="slides">
            {loadingSlides ? <LoadingSpinner message="Criando..." /> : slides.length === 0 ? (
              <EmptyState icon={Presentation} title="Sem slides" description="Gere sua aula visual aqui." action={{ label: 'Gerar Slides agora', onClick: handleGerarSlides }} />
            ) : (
              <div className="space-y-6 text-center">
                <div className="relative aspect-video rounded-xl bg-slate-800 flex items-center justify-center p-8 text-white overflow-hidden shadow-xl">
                  <div className="absolute top-4 left-4 text-xs opacity-50">{currentSlide + 1} / {slides.length}</div>
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold">{slides[currentSlide]?.titulo}</h2>
                    <div className="text-lg opacity-90 max-w-2xl mx-auto whitespace-pre-wrap">{slides[currentSlide]?.conteudo}</div>
                  </div>
                </div>
                <div className="flex justify-center gap-4">
                  <Button variant="outline" disabled={currentSlide === 0} onClick={() => setCurrentSlide(p => p - 1)}>Anterior</Button>
                  <Button variant="outline" disabled={currentSlide === slides.length - 1} onClick={() => setCurrentSlide(p => p + 1)}>Próximo</Button>
                </div>
                <div className="flex justify-center gap-2">
                  <Button variant="ghost" className="text-destructive" onClick={() => { if (confirm('Apagar?')) deleteSlides(slidesSet.id); }}>Excluir Apresentação</Button>
                  <Button variant="outline" onClick={handleGerarSlides}>Gerar Novas Alternativa</Button>
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