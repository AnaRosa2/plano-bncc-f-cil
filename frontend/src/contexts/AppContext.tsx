import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { Disciplina, Unidade, PlanoAula, AtividadeAvaliativa, TipoAtividade, SlidePersistido } from '@/types';
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
  slidesPersistidos: SlidePersistido[];
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
  deletePlanoAula: (id: string) => void;
  getPlanosByUnidade: (unidadeId: string) => PlanoAula[];

  gerarAtividadeAvaliativa: (unidadeId: string, tipo: TipoAtividade) => Promise<AtividadeAvaliativa>;
  updateAtividadeAvaliativa: (id: string, data: Partial<AtividadeAvaliativa>) => void;
  deleteAtividade: (id: string) => void;
  getAtividadesByUnidade: (unidadeId: string) => AtividadeAvaliativa[];

  addSlides: (unidadeId: string, slides: any[]) => void;
  deleteSlides: (id: string) => void;
  getSlidesByUnidade: (unidadeId: string) => SlidePersistido[];

  resetData: () => void;
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
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((p: any) => ({ ...p, criadoEm: new Date(p.criadoEm) }));
      } catch (e) { return planosAulaIniciais; }
    }
    return planosAulaIniciais;
  });

  const [atividadesAvaliativas, setAtividadesAvaliativas] = useState<AtividadeAvaliativa[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}-atividades`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((a: any) => ({ ...a, criadoEm: new Date(a.criadoEm) }));
      } catch (e) { return atividadesAvaliativasIniciais; }
    }
    return atividadesAvaliativasIniciais;
  });

  const [slidesPersistidos, setSlidesPersistidos] = useState<SlidePersistido[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}-slides`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((s: any) => ({ ...s, criadoEm: new Date(s.criadoEm) }));
      } catch (e) { return []; }
    }
    return [];
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => { localStorage.setItem(`${STORAGE_KEY}-disciplinas`, JSON.stringify(disciplinas)); }, [disciplinas]);
  useEffect(() => { localStorage.setItem(`${STORAGE_KEY}-unidades`, JSON.stringify(unidades)); }, [unidades]);
  useEffect(() => { localStorage.setItem(`${STORAGE_KEY}-planos`, JSON.stringify(planosAula)); }, [planosAula]);
  useEffect(() => { localStorage.setItem(`${STORAGE_KEY}-atividades`, JSON.stringify(atividadesAvaliativas)); }, [atividadesAvaliativas]);
  useEffect(() => { localStorage.setItem(`${STORAGE_KEY}-slides`, JSON.stringify(slidesPersistidos)); }, [slidesPersistidos]);

  const resetData = useCallback(() => {
    if (window.confirm('Tem certeza? Isso apagará tudo.')) {
      setDisciplinas(disciplinasIniciais);
      setUnidades(unidadesIniciais);
      setPlanosAula(planosAulaIniciais);
      setAtividadesAvaliativas(atividadesAvaliativasIniciais);
      setSlidesPersistidos([]);
      localStorage.clear();
      window.location.reload();
    }
  }, []);

  const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

  const addDisciplina = useCallback((data: Omit<Disciplina, 'id' | 'criadoEm'>) => {
    setDisciplinas(prev => [...prev, { ...data, id: generateId(), criadoEm: new Date() }]);
  }, []);

  const updateDisciplina = useCallback((id: string, data: Partial<Disciplina>) => {
    setDisciplinas(prev => prev.map(d => (d.id === id ? { ...d, ...data } : d)));
  }, []);

  const deleteDisciplina = useCallback((id: string) => {
    setDisciplinas(prev => prev.filter(d => d.id !== id));
    setUnidades(prev => prev.filter(u => u.disciplinaId !== id));
  }, []);

  const getDisciplina = useCallback((id: string) => disciplinas.find(d => d.id === id), [disciplinas]);

  const addUnidade = useCallback((data: Omit<Unidade, 'id' | 'criadoEm'>) => {
    setUnidades(prev => [...prev, { ...data, id: generateId(), criadoEm: new Date() }]);
  }, []);

  const updateUnidade = useCallback((id: string, data: Partial<Unidade>) => {
    setUnidades(prev => prev.map(u => (u.id === id ? { ...u, ...data } : u)));
  }, []);

  const deleteUnidade = useCallback((id: string) => {
    setUnidades(prev => prev.filter(u => u.id !== id));
    setPlanosAula(prev => prev.filter(p => p.unidadeId !== id));
    setAtividadesAvaliativas(prev => prev.filter(a => a.unidadeId !== id));
    setSlidesPersistidos(prev => prev.filter(s => s.unidadeId !== id));
  }, []);

  const getUnidade = useCallback((id: string) => unidades.find(u => u.id === id), [unidades]);
  const getUnidadesByDisciplina = useCallback((disciplinaId: string) => unidades.filter(u => u.disciplinaId === disciplinaId), [unidades]);

  const sugerirUnidades = useCallback(async (disciplinaId: string) => {
    setIsLoading(true);
    try {
      const disciplina = disciplinas.find(d => d.id === disciplinaId);
      if (!disciplina) return [];
      return await sugerirUnidadesAPI(disciplina.nome, disciplina.anoSerie, 3);
    } catch (error) { return []; } finally { setIsLoading(false); }
  }, [disciplinas]);

  const gerarPlanoAula = useCallback(async (unidadeId: string): Promise<PlanoAula> => {
    setIsLoading(true);
    try {
      const unidade = unidades.find(u => u.id === unidadeId);
      if (!unidade) throw new Error('Unidade não encontrada');
      const disciplina = disciplinas.find(d => d.id === unidade.disciplinaId);
      const planoAPI = await gerarPlanoAulaAPI(disciplina?.nome || 'Disciplina', unidade.tema);
      const novoPlano: PlanoAula = {
        id: generateId(),
        unidadeId,
        objetivos: planoAPI.objetivo,
        conteudos: planoAPI.meta,
        metodologia: planoAPI.metodologia,
        recursosDidaticos: planoAPI.atividade,
        avaliacao: 'Avaliação contínua',
        tempoEstimado: '50 min',
        criadoEm: new Date(),
        geradoPorIA: true
      };
      setPlanosAula(prev => [...prev, novoPlano]);
      return novoPlano;
    } finally { setIsLoading(false); }
  }, [unidades, disciplinas]);

  const updatePlanoAula = useCallback((id: string, data: Partial<PlanoAula>) => {
    setPlanosAula(prev => prev.map(p => (p.id === id ? { ...p, ...data, geradoPorIA: false } : p)));
  }, []);

  const deletePlanoAula = useCallback((id: string) => { setPlanosAula(prev => prev.filter(p => p.id !== id)); }, []);
  const getPlanosByUnidade = useCallback((unidadeId: string) => planosAula.filter(p => p.unidadeId === unidadeId).sort((a, b) => b.criadoEm.getTime() - a.criadoEm.getTime()), [planosAula]);

  const gerarAtividadeAvaliativa = useCallback(async (unidadeId: string, tipo: TipoAtividade): Promise<AtividadeAvaliativa> => {
    setIsLoading(true);
    try {
      const unidade = unidades.find(u => u.id === unidadeId);
      const disciplina = disciplinas.find(d => d.id === unidade?.disciplinaId);
      const atividadeAPI = await gerarAtividadeAPI(unidade?.tema || '', tipo, disciplina?.anoSerie);
      const novaAtividade: AtividadeAvaliativa = {
        id: generateId(),
        unidadeId,
        enunciado: atividadeAPI.enunciado,
        tipo,
        criteriosAvaliacao: atividadeAPI.criteriosAvaliacao,
        criadoEm: new Date(),
        geradoPorIA: true
      };
      setAtividadesAvaliativas(prev => [...prev, novaAtividade]);
      return novaAtividade;
    } finally { setIsLoading(false); }
  }, [unidades, disciplinas]);

  const updateAtividadeAvaliativa = useCallback((id: string, data: Partial<AtividadeAvaliativa>) => {
    setAtividadesAvaliativas(prev => prev.map(a => (a.id === id ? { ...a, ...data, geradoPorIA: false } : a)));
  }, []);

  const deleteAtividade = useCallback((id: string) => { setAtividadesAvaliativas(prev => prev.filter(a => a.id !== id)); }, []);
  const getAtividadesByUnidade = useCallback((unidadeId: string) => atividadesAvaliativas.filter(a => a.unidadeId === unidadeId).sort((a, b) => b.criadoEm.getTime() - a.criadoEm.getTime()), [atividadesAvaliativas]);

  const addSlides = useCallback((unidadeId: string, slides: any[]) => {
    setSlidesPersistidos(prev => [...prev, { id: generateId(), unidadeId, slides, criadoEm: new Date() }]);
  }, []);

  const deleteSlides = useCallback((id: string) => { setSlidesPersistidos(prev => prev.filter(s => s.id !== id)); }, []);
  const getSlidesByUnidade = useCallback((unidadeId: string) => slidesPersistidos.filter(s => s.unidadeId === unidadeId).sort((a, b) => b.criadoEm.getTime() - a.criadoEm.getTime()), [slidesPersistidos]);

  const value: AppContextType = {
    disciplinas, unidades, planosAula, atividadesAvaliativas, slidesPersistidos, isLoading,
    addDisciplina, updateDisciplina, deleteDisciplina, getDisciplina,
    addUnidade, updateUnidade, deleteUnidade, getUnidade, getUnidadesByDisciplina, sugerirUnidades,
    gerarPlanoAula, updatePlanoAula, deletePlanoAula, getPlanosByUnidade,
    gerarAtividadeAvaliativa, updateAtividadeAvaliativa, deleteAtividade, getAtividadesByUnidade,
    addSlides, deleteSlides, getSlidesByUnidade, resetData
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
