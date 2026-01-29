
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, X, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import PageContainer from '@/components/layout/PageContainer';
import GuidanceMessage from '@/components/shared/GuidanceMessage';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';

const NovaUnidade: React.FC = () => {
  const { id: disciplinaId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getDisciplina, addUnidade } = useApp();
  const { toast } = useToast();

  const disciplina = getDisciplina(disciplinaId || '');

  const [tema, setTema] = useState('');
  const [objetivoGeral, setObjetivoGeral] = useState('');
  const [habilidadesBNCC, setHabilidadesBNCC] = useState('');



  if (!disciplina) {
    navigate('/');
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!tema.trim() || !objetivoGeral.trim()) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Preencha o tema e o objetivo geral da unidade.',
        variant: 'destructive',
      });
      return;
    }

    addUnidade({
      disciplinaId: disciplina.id,
      tema: tema.trim(),
      objetivoGeral: objetivoGeral.trim(),
      habilidadesBNCC: habilidadesBNCC.trim(),
    });

    toast({
      title: 'Unidade criada!',
      description: `A unidade "${tema}" foi criada com sucesso.`,
    });

    navigate(`/disciplina/${disciplina.id}`);
  };



  return (
    <PageContainer
      breadcrumbs={[
        { label: disciplina.nome, href: `/disciplina/${disciplina.id}` },
        { label: 'Nova Unidade' },
      ]}
    >
      <div className="max-w-2xl mx-auto">
        <Card className="edu-card">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>Nova Unidade de Ensino</CardTitle>
                <CardDescription>
                  Crie uma aula para a disciplina {disciplina.nome}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Tema */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="tema">Tema da Aula *</Label>

                </div>
                <Input
                  id="tema"
                  placeholder="Ex: Cidadania Digital, Segurança na Internet..."
                  value={tema}
                  onChange={(e) => setTema(e.target.value)}
                  className="bg-background"
                />
              </div>

              {/* Objetivo Geral */}
              <div className="space-y-2">
                <Label htmlFor="objetivoGeral">Objetivo Geral *</Label>
                <Textarea
                  id="objetivoGeral"
                  placeholder="Descreva o objetivo principal que os alunos devem alcançar ao final desta aula..."
                  value={objetivoGeral}
                  onChange={(e) => setObjetivoGeral(e.target.value)}
                  rows={3}
                  className="bg-background resize-none"
                />
              </div>

              {/* Habilidades BNCC */}
              <div className="space-y-2">
                <Label htmlFor="habilidadesBNCC">Habilidades da BNCC</Label>
                <Textarea
                  id="habilidadesBNCC"
                  placeholder="Ex: EF08CI01 - Identificar e classificar diferentes fontes de informação digital..."
                  value={habilidadesBNCC}
                  onChange={(e) => setHabilidadesBNCC(e.target.value)}
                  rows={2}
                  className="bg-background resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  Informe os códigos e descrições das habilidades da BNCC relacionadas a esta aula.
                </p>
              </div>

              {/* Mensagem Orientadora */}
              <GuidanceMessage variant="bncc">
                <strong>Alinhamento à BNCC:</strong> A Base Nacional Comum Curricular define
                habilidades específicas para cada etapa de ensino. Ao criar suas unidades, procure
                identificar quais habilidades serão desenvolvidas, garantindo uma educação integral
                e alinhada às diretrizes nacionais.
              </GuidanceMessage>



              {/* Botões */}
              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(`/disciplina/${disciplina.id}`)}
                  className="w-full sm:w-auto"
                >
                  <X className="h-4 w-4" />
                  Cancelar
                </Button>
                <Button type="submit" className="w-full sm:w-auto">
                  <Save className="h-4 w-4" />
                  Criar Unidade
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

export default NovaUnidade;
