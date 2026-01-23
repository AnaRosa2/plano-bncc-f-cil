import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, X, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import PageContainer from '@/components/layout/PageContainer';
import GuidanceMessage from '@/components/shared/GuidanceMessage';
import { useApp } from '@/contexts/AppContext';
import { ANOS_SERIES } from '@/types';
import { useToast } from '@/hooks/use-toast';

const NovaDisciplina: React.FC = () => {
  const navigate = useNavigate();
  const { addDisciplina } = useApp();
  const { toast } = useToast();

  const [nome, setNome] = useState('');
  const [anoSerie, setAnoSerie] = useState('');
  const [descricao, setDescricao] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nome.trim() || !anoSerie) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Preencha o nome da disciplina e selecione o ano/série.',
        variant: 'destructive',
      });
      return;
    }

    addDisciplina({
      nome: nome.trim(),
      anoSerie,
      descricao: descricao.trim() || undefined,
    });

    toast({
      title: 'Disciplina criada!',
      description: `A disciplina "${nome}" foi criada com sucesso.`,
    });

    navigate('/');
  };



  return (
    <PageContainer breadcrumbs={[{ label: 'Nova Disciplina' }]}>
      <div className="max-w-2xl mx-auto">
        <Card className="edu-card">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>Nova Disciplina</CardTitle>
                <CardDescription>Cadastre uma nova disciplina para organizar suas aulas</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nome da Disciplina */}
              <div className="space-y-2">
                <Label htmlFor="nome">Nome da Disciplina *</Label>
                <Input
                  id="nome"
                  placeholder="Ex: Cultura Digital, Tecnologia e Sociedade..."
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="bg-background"
                />
              </div>

              {/* Ano/Série */}
              <div className="space-y-2">
                <Label htmlFor="anoSerie">Ano/Série *</Label>
                <Select value={anoSerie} onValueChange={setAnoSerie}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Selecione o ano ou série" />
                  </SelectTrigger>
                  <SelectContent>
                    {ANOS_SERIES.map((ano) => (
                      <SelectItem key={ano} value={ano}>
                        {ano}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Descrição */}
              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição (opcional)</Label>
                <Textarea
                  id="descricao"
                  placeholder="Descreva brevemente os objetivos e temas principais desta disciplina..."
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  rows={3}
                  className="bg-background resize-none"
                />
              </div>

              {/* Mensagem Orientadora */}
              <GuidanceMessage variant="tip">
                <strong>Dica pedagógica:</strong> Uma boa organização por disciplinas facilita o
                planejamento sequencial e garante que todas as competências da BNCC sejam
                contempladas ao longo do ano letivo.
              </GuidanceMessage>

              {/* Botões */}
              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/')}
                  className="w-full sm:w-auto"
                >
                  <X className="h-4 w-4" />
                  Cancelar
                </Button>
                <Button type="submit" className="w-full sm:w-auto">
                  <Save className="h-4 w-4" />
                  Salvar Disciplina
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

export default NovaDisciplina;
