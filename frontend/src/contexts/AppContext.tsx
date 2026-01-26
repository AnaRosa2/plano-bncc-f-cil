import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { Disciplina, Unidade, PlanoAula, AtividadeAvaliativa, TipoAtividade } from '@/types';
import {
  disciplinasIniciais,
  unidadesIniciais,
  planosAulaIniciais,
  atividadesAvaliativasIniciais,
} from '@/data/mockData';
import { gerarPlanoAulaAPI, gerarAtividadeAPI, sugerirUnidadesAPI } from '@/services/apiService';

const STORAGE_KEY = 'plano-bncc-data';

interface AppContextType {
  disciplinas: Disciplina[];
  unidades: Unidade[];
  planosAula: PlanoAula[];
  atividadesAvaliativas: AtividadeAvaliativa[];
  isLoading: boolean;

  addDisciplina: (disciplina: Omit<Disciplina, 'id' | 'criadoEm'>) => void;
  updateDisciplina: (id: string, data: Partial<Disciplina>) => void;
  deleteDisciplina: (id: string) => void;
  getDisciplina: (id: string) => Disciplina | undefined;

  addUnidade: (unidade: Omit<Unidade, 'id' | 'criadoEm'>) => void;
  updateUnidade: (id: string, data: Partial<Unidade>) => void;
  deleteUnidade: (id: string) => void;
  getUnidade: (id: string) => Unidade | undefined;
  getUnidadesByDisciplina: (disciplinaId: string) => Unidade[];
  sugerirUnidades: (disciplinaId: string) => Promise<{ tema: string; objetivo: string }[]>;

  gerarPlanoAula: (unidadeId: string) => Promise<PlanoAula>;
  updatePlanoAula: (id: string, data: Partial<PlanoAula>) => void;
  getPlanoAula: (unidadeId: string) => PlanoAula | undefined;

  gerarAtividadeAvaliativa: (unidadeId: string, tipo: TipoAtividade) => Promise<AtividadeAvaliativa>;
  updateAtividadeAvaliativa: (id: string, data: Partial<AtividadeAvaliativa>) => void;
  getAtividadeAvaliativa: (unidadeId: string) => AtividadeAvaliativa | undefined;

  resetData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp deve ser usado dentro de um AppProvider');
  return context;
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Inicialização do estado a partir do LocalStorage ou mocks
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}-disciplinas`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((d: any) => ({ ...d, criadoEm: new Date(d.criadoEm) }));
      } catch (e) { return disciplinasIniciais; }
    }
    return disciplinasIniciais;
  });

  const [unidades, setUnidades] = useState<Unidade[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}-unidades`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((u: any) => ({ ...u, criadoEm: new Date(u.criadoEm) }));
      } catch (e) { return unidadesIniciais; }
    }
    return unidadesIniciais;
  });

  const [planosAula, setPlanosAula] = useState<PlanoAula[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}-planos`);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return planosAulaIniciais; }
    }
    return planosAulaIniciais;
  });

  const [atividadesAvaliativas, setAtividadesAvaliativas] = useState<AtividadeAvaliativa[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}-atividades`);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return atividadesAvaliativasIniciais; }
    }
    return atividadesAvaliativasIniciais;
  });

  const [isLoading, setIsLoading] = useState(false);

  // Hook para salvar no LocalStorage sempre que os estados mudarem
  useEffect(() => { localStorage.setItem(`${STORAGE_KEY}-disciplinas`, JSON.stringify(disciplinas)); }, [disciplinas]);
  useEffect(() => { localStorage.setItem(`${STORAGE_KEY}-unidades`, JSON.stringify(unidades)); }, [unidades]);
  useEffect(() => { localStorage.setItem(`${STORAGE_KEY}-planos`, JSON.stringify(planosAula)); }, [planosAula]);
  useEffect(() => { localStorage.setItem(`${STORAGE_KEY}-atividades`, JSON.stringify(atividadesAvaliativas)); }, [atividadesAvaliativas]);

  const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

  const addDisciplina = useCallback((data: any) => setDisciplinas(prev => [...prev, { ...data, id: generateId(), criadoEm: new Date() }]), []);
  const updateDisciplina = useCallback((id: string, data: any) => setDisciplinas(prev => prev.map(d => d.id === id ? { ...d, ...data } : d)), []);
  const deleteDisciplina = useCallback((id: string) => {
    setDisciplinas(prev => prev.filter(d => d.id !== id));
    setUnidades(prev => prev.filter(u => u.disciplinaId !== id));
  }, []);
  const getDisciplina = useCallback((id: string) => disciplinas.find(d => d.id === id), [disciplinas]);

  const addUnidade = useCallback((data: any) => setUnidades(prev => [...prev, { ...data, id: generateId(), criadoEm: new Date() }]), []);
  const updateUnidade = useCallback((id: string, data: any) => setUnidades(prev => prev.map(u => u.id === id ? { ...u, ...data } : u)), []);
  const deleteUnidade = useCallback((id: string) => {
    setUnidades(prev => prev.filter(u => u.id !== id));
    setPlanosAula(prev => prev.filter(p => p.unidadeId !== id));
    setAtividadesAvaliativas(prev => prev.filter(a => a.unidadeId !== id));
  }, []);
  const getUnidade = useCallback((id: string) => unidades.find(u => u.id === id), [unidades]);
  const getUnidadesByDisciplina = useCallback((disciplinaId: string) => unidades.filter(u => u.disciplinaId === disciplinaId), [unidades]);

  const sugerirUnidades = useCallback(async (disciplinaId: string) => {
    setIsLoading(true);
    try {
      const d = disciplinas.find(x => x.id === disciplinaId);
      if (!d) return [];
      return await sugerirUnidadesAPI(d.nome, d.anoSerie, 3);
    } catch (e) { return []; } finally { setIsLoading(false); }
  }, [disciplinas]);

  const gerarPlanoAula = useCallback(async (unidadeId: string): Promise<PlanoAula> => {
    setIsLoading(true);
    try {
      const u = unidades.find(x => x.id === unidadeId);
      const d = disciplinas.find(x => x.id === u?.disciplinaId);
      const res = await gerarPlanoAulaAPI(d?.nome || '', u?.tema || '', d?.anoSerie);
      const novo: PlanoAula = {
        id: generateId(),
        unidadeId,
        objetivos: res.objetivo,
        conteudos: res.meta,
        metodologia: res.metodologia,
        recursosDidaticos: res.atividade,
        avaliacao: 'Contínua',
        tempoEstimado: '50 min',
        geradoPorIA: true
      };
      setPlanosAula(prev => {
        const filtered = prev.filter(p => p.unidadeId !== unidadeId);
        return [...filtered, novo];
      });
      return novo;
    } finally { setIsLoading(false); }
  }, [unidades, disciplinas]);

  const updatePlanoAula = useCallback((id: string, data: Partial<PlanoAula>) => {
    setPlanosAula(prev => prev.map(p => (p.id === id ? { ...p, ...data, geradoPorIA: false } : p)));
  }, []);

  const getPlanoAula = useCallback((unidadeId: string) => planosAula.find(p => p.unidadeId === unidadeId), [planosAula]);

  const gerarAtividadeAvaliativa = useCallback(async (unidadeId: string, tipo: TipoAtividade): Promise<AtividadeAvaliativa> => {
    setIsLoading(true);
    try {
      const u = unidades.find(x => x.id === unidadeId);
      const d = disciplinas.find(x => x.id === u?.disciplinaId);
      const res = await gerarAtividadeAPI(u?.tema || '', tipo, d?.anoSerie);
      const nova: AtividadeAvaliativa = {
        id: generateId(),
        unidadeId,
        enunciado: res.enunciado,
        tipo,
        criteriosAvaliacao: res.criteriosAvaliacao,
        geradoPorIA: true
      };
      setAtividadesAvaliativas(prev => {
        const filtered = prev.filter(a => a.unidadeId !== unidadeId);
        return [...filtered, nova];
      });
      return nova;
    } finally { setIsLoading(false); }
  }, [unidades, disciplinas]);

  const updateAtividadeAvaliativa = useCallback((id: string, data: Partial<AtividadeAvaliativa>) => {
    setAtividadesAvaliativas(prev => prev.map(a => (a.id === id ? { ...a, ...data, geradoPorIA: false } : a)));
  }, []);

  const getAtividadeAvaliativa = useCallback((unidadeId: string) => atividadesAvaliativas.find(a => a.unidadeId === unidadeId), [atividadesAvaliativas]);

  const resetData = useCallback(() => {
    if (window.confirm('Resetar todos os dados?')) {
      localStorage.clear();
      window.location.reload();
    }
  }, []);

  const value: AppContextType = {
    disciplinas, unidades, planosAula, atividadesAvaliativas, isLoading,
    addDisciplina, updateDisciplina, deleteDisciplina, getDisciplina,
    addUnidade, updateUnidade, deleteUnidade, getUnidade, getUnidadesByDisciplina, sugerirUnidades,
    gerarPlanoAula, updatePlanoAula, getPlanoAula,
    gerarAtividadeAvaliativa, updateAtividadeAvaliativa, getAtividadeAvaliativa, resetData
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
