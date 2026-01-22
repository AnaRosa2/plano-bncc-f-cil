import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Disciplina, Unidade, PlanoAula, AtividadeAvaliativa, TipoAtividade } from '@/types';
import {
  disciplinasIniciais,
  unidadesIniciais,
  planosAulaIniciais,
  atividadesAvaliativasIniciais,
  templatesPlanoAula,
  templatesAtividade,
  sugestoesUnidades,
} from '@/data/mockData';

interface AppContextType {
  // Estados
  disciplinas: Disciplina[];
  unidades: Unidade[];
  planosAula: PlanoAula[];
  atividadesAvaliativas: AtividadeAvaliativa[];
  isLoading: boolean;

  // Ações para Disciplinas
  addDisciplina: (disciplina: Omit<Disciplina, 'id' | 'criadoEm'>) => void;
  updateDisciplina: (id: string, data: Partial<Disciplina>) => void;
  deleteDisciplina: (id: string) => void;
  getDisciplina: (id: string) => Disciplina | undefined;

  // Ações para Unidades
  addUnidade: (unidade: Omit<Unidade, 'id' | 'criadoEm'>) => void;
  updateUnidade: (id: string, data: Partial<Unidade>) => void;
  deleteUnidade: (id: string) => void;
  getUnidade: (id: string) => Unidade | undefined;
  getUnidadesByDisciplina: (disciplinaId: string) => Unidade[];
  sugerirUnidades: (disciplinaId: string) => Promise<{ tema: string; objetivo: string }[]>;

  // Ações para Planos de Aula
  gerarPlanoAula: (unidadeId: string) => Promise<PlanoAula>;
  updatePlanoAula: (id: string, data: Partial<PlanoAula>) => void;
  getPlanoAula: (unidadeId: string) => PlanoAula | undefined;

  // Ações para Atividades Avaliativas
  gerarAtividadeAvaliativa: (unidadeId: string, tipo: TipoAtividade) => Promise<AtividadeAvaliativa>;
  updateAtividadeAvaliativa: (id: string, data: Partial<AtividadeAvaliativa>) => void;
  getAtividadeAvaliativa: (unidadeId: string) => AtividadeAvaliativa | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp deve ser usado dentro de um AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>(disciplinasIniciais);
  const [unidades, setUnidades] = useState<Unidade[]>(unidadesIniciais);
  const [planosAula, setPlanosAula] = useState<PlanoAula[]>(planosAulaIniciais);
  const [atividadesAvaliativas, setAtividadesAvaliativas] = useState<AtividadeAvaliativa[]>(atividadesAvaliativasIniciais);
  const [isLoading, setIsLoading] = useState(false);

  // Gerar ID único simples
  const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

  // Simular delay de IA
  const simulateAIDelay = () => new Promise(resolve => setTimeout(resolve, 1500));

  // === DISCIPLINAS ===
  const addDisciplina = useCallback((data: Omit<Disciplina, 'id' | 'criadoEm'>) => {
    const novaDisciplina: Disciplina = {
      ...data,
      id: generateId(),
      criadoEm: new Date(),
    };
    setDisciplinas(prev => [...prev, novaDisciplina]);
  }, []);

  const updateDisciplina = useCallback((id: string, data: Partial<Disciplina>) => {
    setDisciplinas(prev => prev.map(d => (d.id === id ? { ...d, ...data } : d)));
  }, []);

  const deleteDisciplina = useCallback((id: string) => {
    setDisciplinas(prev => prev.filter(d => d.id !== id));
    // Também remove unidades relacionadas
    setUnidades(prev => prev.filter(u => u.disciplinaId !== id));
  }, []);

  const getDisciplina = useCallback((id: string) => {
    return disciplinas.find(d => d.id === id);
  }, [disciplinas]);

  // === UNIDADES ===
  const addUnidade = useCallback((data: Omit<Unidade, 'id' | 'criadoEm'>) => {
    const novaUnidade: Unidade = {
      ...data,
      id: generateId(),
      criadoEm: new Date(),
    };
    setUnidades(prev => [...prev, novaUnidade]);
  }, []);

  const updateUnidade = useCallback((id: string, data: Partial<Unidade>) => {
    setUnidades(prev => prev.map(u => (u.id === id ? { ...u, ...data } : u)));
  }, []);

  const deleteUnidade = useCallback((id: string) => {
    setUnidades(prev => prev.filter(u => u.id !== id));
    // Também remove planos e atividades relacionados
    setPlanosAula(prev => prev.filter(p => p.unidadeId !== id));
    setAtividadesAvaliativas(prev => prev.filter(a => a.unidadeId !== id));
  }, []);

  const getUnidade = useCallback((id: string) => {
    return unidades.find(u => u.id === id);
  }, [unidades]);

  const getUnidadesByDisciplina = useCallback((disciplinaId: string) => {
    return unidades.filter(u => u.disciplinaId === disciplinaId);
  }, [unidades]);

  const sugerirUnidades = useCallback(async (disciplinaId: string) => {
    setIsLoading(true);
    await simulateAIDelay();
    
    const disciplina = disciplinas.find(d => d.id === disciplinaId);
    const sugestoes = sugestoesUnidades[disciplina?.nome as keyof typeof sugestoesUnidades] || sugestoesUnidades.default;
    
    setIsLoading(false);
    return sugestoes;
  }, [disciplinas]);

  // === PLANOS DE AULA ===
  const gerarPlanoAula = useCallback(async (unidadeId: string): Promise<PlanoAula> => {
    setIsLoading(true);
    await simulateAIDelay();
    
    const unidade = unidades.find(u => u.id === unidadeId);
    const tema = unidade?.tema || 'Cultura Digital';
    
    const novoPlano: PlanoAula = {
      id: generateId(),
      unidadeId,
      objetivos: templatesPlanoAula.objetivos(tema),
      conteudos: templatesPlanoAula.conteudos(tema),
      metodologia: templatesPlanoAula.metodologia(),
      recursosDidaticos: templatesPlanoAula.recursosDidaticos(),
      avaliacao: templatesPlanoAula.avaliacao(),
      tempoEstimado: templatesPlanoAula.tempoEstimado(),
      geradoPorIA: true,
    };
    
    setPlanosAula(prev => {
      const filtered = prev.filter(p => p.unidadeId !== unidadeId);
      return [...filtered, novoPlano];
    });
    
    setIsLoading(false);
    return novoPlano;
  }, [unidades]);

  const updatePlanoAula = useCallback((id: string, data: Partial<PlanoAula>) => {
    setPlanosAula(prev => prev.map(p => (p.id === id ? { ...p, ...data, geradoPorIA: false } : p)));
  }, []);

  const getPlanoAula = useCallback((unidadeId: string) => {
    return planosAula.find(p => p.unidadeId === unidadeId);
  }, [planosAula]);

  // === ATIVIDADES AVALIATIVAS ===
  const gerarAtividadeAvaliativa = useCallback(async (unidadeId: string, tipo: TipoAtividade): Promise<AtividadeAvaliativa> => {
    setIsLoading(true);
    await simulateAIDelay();
    
    const unidade = unidades.find(u => u.id === unidadeId);
    const tema = unidade?.tema || 'Cultura Digital';
    
    const template = templatesAtividade[tipo](tema);
    
    const novaAtividade: AtividadeAvaliativa = {
      id: generateId(),
      unidadeId,
      enunciado: template.enunciado,
      tipo,
      criteriosAvaliacao: template.criteriosAvaliacao,
      geradoPorIA: true,
    };
    
    setAtividadesAvaliativas(prev => {
      const filtered = prev.filter(a => a.unidadeId !== unidadeId);
      return [...filtered, novaAtividade];
    });
    
    setIsLoading(false);
    return novaAtividade;
  }, [unidades]);

  const updateAtividadeAvaliativa = useCallback((id: string, data: Partial<AtividadeAvaliativa>) => {
    setAtividadesAvaliativas(prev => prev.map(a => (a.id === id ? { ...a, ...data, geradoPorIA: false } : a)));
  }, []);

  const getAtividadeAvaliativa = useCallback((unidadeId: string) => {
    return atividadesAvaliativas.find(a => a.unidadeId === unidadeId);
  }, [atividadesAvaliativas]);

  const value: AppContextType = {
    disciplinas,
    unidades,
    planosAula,
    atividadesAvaliativas,
    isLoading,
    addDisciplina,
    updateDisciplina,
    deleteDisciplina,
    getDisciplina,
    addUnidade,
    updateUnidade,
    deleteUnidade,
    getUnidade,
    getUnidadesByDisciplina,
    sugerirUnidades,
    gerarPlanoAula,
    updatePlanoAula,
    getPlanoAula,
    gerarAtividadeAvaliativa,
    updateAtividadeAvaliativa,
    getAtividadeAvaliativa,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
