import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, BookOpen, GraduationCap, Calendar, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import PageContainer from '@/components/layout/PageContainer';
import GuidanceMessage from '@/components/shared/GuidanceMessage';
import EmptyState from '@/components/shared/EmptyState';
import { useApp } from '@/contexts/AppContext';

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
});

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { disciplinas, getUnidadesByDisciplina } = useApp();

  const formatDate = (date: Date) => {
    return dateFormatter.format(date);
  };

  return (
    <PageContainer>
      {/* Hero Section */}
      <div className="mb-8">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                Planejamento de Aulas
              </h1>
              <p className="text-muted-foreground">
                Gerencie suas disciplinas e crie materiais didáticos alinhados à BNCC
              </p>
            </div>
            {disciplinas.length > 0 && (
              <Button onClick={() => navigate('/disciplina/nova')} className="gap-2">
                <Plus className="h-4 w-4" />
                Nova Disciplina
              </Button>
            )}
          </div>
        </div>

        <GuidanceMessage variant="info">
          <strong>Bem-vindo ao Sistema de Planejamento de Cultura Digital!</strong>
          <br />
          Este sistema foi desenvolvido para apoiar professores na criação de materiais didáticos
          alinhados à Base Nacional Comum Curricular (BNCC). Utilize a Inteligência Artificial como
          assistente pedagógico para gerar planos de aula e atividades avaliativas.
        </GuidanceMessage>
      </div>

      {/* Lista de Disciplinas */}
      {disciplinas.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="Nenhuma disciplina cadastrada"
          description="Comece criando sua primeira disciplina para organizar suas aulas de Cultura Digital."
          action={{
            label: 'Criar Primeira Disciplina',
            onClick: () => navigate('/disciplina/nova'),
            icon: Plus,
          }}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {disciplinas.map((disciplina) => {
            const unidades = getUnidadesByDisciplina(disciplina.id);
            return (
              <Card
                key={disciplina.id}
                className="edu-card cursor-pointer group"
                onClick={() => navigate(`/disciplina/${disciplina.id}`)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <BookOpen className="h-5 w-5" />
                    </div>
                  </div>
                  <CardTitle className="mt-3 text-lg">{disciplina.nome}</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <GraduationCap className="h-3.5 w-3.5" />
                    {disciplina.anoSerie}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {disciplina.descricao && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {disciplina.descricao}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDate(disciplina.criadoEm)}
                    </span>
                    <span>
                      {unidades.length} {unidades.length === 1 ? 'unidade' : 'unidades'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Dica BNCC */}
      {disciplinas.length > 0 && (
        <div className="mt-8">
          <GuidanceMessage variant="bncc">
            <strong>Sobre a BNCC e Cultura Digital:</strong>
            <br />A Base Nacional Comum Curricular estabelece competências digitais como essenciais
            para a formação integral dos estudantes, incluindo pensamento computacional, mundo
            digital e cultura digital.
          </GuidanceMessage>
        </div>
      )}
    </PageContainer>
  );
};

export default Dashboard;
