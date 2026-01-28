import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Plus,
  Sparkles,
  BookOpen,
  GraduationCap,
  FileText,
  ChevronRight,
  Trash2,
  Edit,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import PageContainer from '@/components/layout/PageContainer';
import GuidanceMessage from '@/components/shared/GuidanceMessage';
import EmptyState from '@/components/shared/EmptyState';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';

const VisualizarDisciplina: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    getDisciplina,
    getUnidadesByDisciplina,
    sugerirUnidades,
    addUnidade,
    deleteUnidade,
    deleteDisciplina,
    isLoading,
  } = useApp();

  const [showSugestoes, setShowSugestoes] = useState(false);
  const [sugestoes, setSugestoes] = useState<{ tema: string; objetivo: string }[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [unidadeToDelete, setUnidadeToDelete] = useState<string | null>(null);

  const disciplina = getDisciplina(id || '');
  const unidades = getUnidadesByDisciplina(id || '');

  if (!disciplina) {
    return (
      <PageContainer>
        <EmptyState
          icon={BookOpen}
          title="Disciplina não encontrada"
          description="A disciplina que você procura não existe ou foi removida."
          action={{
            label: 'Voltar ao Início',
            onClick: () => navigate('/'),
          }}
        />
      </PageContainer>
    );
  }

  const handleSugerirUnidades = async () => {
    const resultado = await sugerirUnidades(disciplina.id);
    setSugestoes(resultado);
    setShowSugestoes(true);
  };

  const handleAdicionarSugestao = (sugestao: { tema: string; objetivo: string }) => {
    // Tenta extrair códigos BNCC como [EF05LP20]
    const bnccMatch = sugestao.objetivo.match(/\[([A-Z0-9, ]+)\]/);
    const habilidades = bnccMatch ? bnccMatch[1] : '';
    const objetivoLimpo = sugestao.objetivo.replace(/\[.*?\]/g, '').trim();

    addUnidade({
      disciplinaId: disciplina.id,
      tema: sugestao.tema,
      objetivoGeral: objetivoLimpo,
      habilidadesBNCC: habilidades,
    });
    toast({
      title: 'Unidade adicionada!',
      description: `A unidade "${sugestao.tema}" foi criada com recomendações BNCC.`,
    });
  };

  const handleDeleteUnidade = () => {
    if (unidadeToDelete) {
      deleteUnidade(unidadeToDelete);
      toast({
        title: 'Unidade removida',
        description: 'A unidade foi excluída com sucesso.',
      });
      setUnidadeToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  const handleDeleteDisciplina = () => {
    deleteDisciplina(disciplina.id);
    toast({
      title: 'Disciplina removida',
      description: 'A disciplina e suas unidades foram excluídas.',
    });
    navigate('/');
  };

  return (
    <PageContainer breadcrumbs={[{ label: disciplina.nome }]}>
      {/* Saudação */}
      <div className="mb-6">
        <p className="text-lg text-muted-foreground">
          Bem-vindo à disciplina de <span className="font-semibold text-foreground">{disciplina.nome}</span>!
        </p>
      </div>

      {/* Cabeçalho da Disciplina */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <BookOpen className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">{disciplina.nome}</h1>
              <p className="flex items-center gap-2 text-muted-foreground mt-1">
                <GraduationCap className="h-4 w-4" />
                {disciplina.anoSerie}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setDeleteDialogOpen(true)}>
              <Trash2 className="h-4 w-4" />
              <span className="hidden sm:inline">Excluir</span>
            </Button>
          </div>
        </div>

        {disciplina.descricao && (
          <p className="text-muted-foreground mb-4">{disciplina.descricao}</p>
        )}

        <GuidanceMessage variant="info">
          <strong>O que são Unidades de Ensino?</strong>
          <br />
          Cada unidade representa uma aula ou tema específico dentro da disciplina. Para cada
          unidade, você pode gerar um plano de aula completo e atividades avaliativas alinhadas à
          BNCC, utilizando nossa IA como assistente pedagógico.
        </GuidanceMessage>
      </div>

      {/* Ações */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <Button onClick={() => navigate(`/disciplina/${disciplina.id}/unidade/nova`)}>
          <Plus className="h-4 w-4" />
          Nova Unidade
        </Button>
        <Button variant="ai" onClick={handleSugerirUnidades} disabled={isLoading}>
          <Sparkles className="h-4 w-4" />
          Sugerir Unidades com IA
        </Button>
      </div>

      {/* Loading */}
      {isLoading && <LoadingSpinner message="Gerando sugestões de unidades..." />}

      {/* Sugestões da IA */}
      {showSugestoes && sugestoes.length > 0 && !isLoading && (
        <Card className="mb-6 border-bncc/30 bg-bncc/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="h-5 w-5 text-bncc" />
              Sugestões da IA
            </CardTitle>
            <CardDescription>
              Clique em uma sugestão para adicioná-la como unidade
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              {sugestoes.map((sugestao, index) => (
                <button
                  key={index}
                  onClick={() => handleAdicionarSugestao(sugestao)}
                  className="text-left p-4 rounded-lg border bg-card hover:border-primary hover:shadow-sm transition-all group"
                >
                  <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                    {sugestao.tema}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">{sugestao.objetivo}</p>
                </button>
              ))}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="mt-4"
              onClick={() => setShowSugestoes(false)}
            >
              Fechar sugestões
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Lista de Unidades */}
      {unidades.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="Nenhuma unidade cadastrada"
          description="Crie sua primeira unidade de ensino ou use a IA para sugerir temas relevantes para esta disciplina."
          action={{
            label: 'Criar Primeira Unidade',
            onClick: () => navigate(`/disciplina/${disciplina.id}/unidade/nova`),
            icon: Plus,
          }}
        />
      ) : (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Unidades de Ensino ({unidades.length})</h2>
          {unidades.map((unidade, index) => (
            <Card
              key={unidade.id}
              className="edu-card cursor-pointer group"
              onClick={() => navigate(`/disciplina/${disciplina.id}/unidade/${unidade.id}`)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground font-semibold">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
                      {unidade.tema}
                    </h3>
                    <p className="text-sm text-muted-foreground truncate">{unidade.objetivoGeral}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        setUnidadeToDelete(unidade.id);
                        setDeleteDialogOpen(true);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Dialog de Confirmação de Exclusão */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              {unidadeToDelete
                ? 'Tem certeza que deseja excluir esta unidade? O plano de aula e a atividade avaliativa também serão removidos.'
                : 'Tem certeza que deseja excluir esta disciplina? Todas as unidades, planos de aula e atividades serão permanentemente removidos.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={unidadeToDelete ? handleDeleteUnidade : handleDeleteDisciplina}
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
};

export default VisualizarDisciplina;
