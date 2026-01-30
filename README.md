# 📚 Plano BNCC - Sistema de Geração de Materiais Didáticos de Cultura Digital
<!-- Teste de deploy Vercel - 2026-01-26 -->

> Sistema Inteligente para Geração de Materiais Didáticos alinhados à BNCC desenvolvido para o Hackathon IFPI Campus Piripiri - Janeiro 2026

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Uso de IA no Desenvolvimento](#uso-de-ia-no-desenvolvimento)
- [Requisitos do Hackathon](#requisitos-do-hackathon)
- [Como Executar](#como-executar)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Demonstração](#demonstração)
- [Equipe](#equipe)

---

## 🎯 Sobre o Projeto

O **Plano BNCC** é uma aplicação web desenvolvida para apoiar professores do Ensino Fundamental e Médio no planejamento pedagógico de aulas de Cultura Digital. O sistema utiliza **Inteligência Artificial Generativa (Google Gemini)** com técnicas de **RAG (Retrieval-Augmented Generation)** baseadas na Base Nacional Comum Curricular para gerar automaticamente:

- 📝 **Planos de aula** completos e alinhados à BNCC
- 📊 **Atividades avaliativas** (objetivas, discursivas e práticas)
- 💡 **Sugestões de unidades temáticas** contextualizadas
- 🎬 **Slides educacionais** (RF06 - Opcional implementado!)
- 📄 **Exportação em PDF** de todo o material gerado

### Diferenciais

- ✅ **100% funcional com IA real** - Não usa templates mockados
- ✅ **RAG com BNCC (100KB)** - IA treinada com documento oficial
- ✅ **RF06 Implementado** - Geração de slides educacionais
- ✅ **Exportação PDF** - Gera documentos profissionais prontos para uso
- ✅ **Interface moderna** - Design responsivo e intuitivo
- ✅ **Testes unitários** - 23 testes passando com Vitest
- ✅ **Single-user** - Sem necessidade de login (dados salvos localmente)
- ✅ **Persistência Local** - Dados preservados via LocalStorage (não perde no F5)
- ✅ **Console Clean** - Sem erros ou avisos de acessibilidade/semântica
- ✅ **Modo Escuro Suave** - Paleta de cores refinada para reduzir cansaço visual
- ✅ **Gestão de Disciplinas** - Funcionalidade de exclusão com modal de segurança

---

## ⚡ Funcionalidades

### Requisitos Funcionais Implementados

| Código | Requisito | Status |
|--------|-----------|--------|
| **RF01** | Cadastro e gerenciamento de disciplinas | ✅ Implementado |
| **RF02** | Criação manual de unidades (aulas) | ✅ Implementado |
| **RF03** | Sugestão automática de unidades via IA | ✅ Implementado |
| **RF04** | Geração automática de plano de aula | ✅ Implementado |
| **RF05** | Geração automática de atividade avaliativa | ✅ Implementado |
| **RF06** | Geração de slides por unidade | ✅ Implementado |

### Funcionalidades Adicionais

- 🎨 **Edição de conteúdo gerado** - Personalize planos e atividades após geração
- 📥 **Exportação em PDF** - Baixe materiais formatados profissionalmente
- 🔄 **Integração completa** - Frontend ↔ Backend ↔ IA
- 💬 **Feedback visual** - Loading states e toasts informativos
- 📱 **Totalmente responsivo** - Funciona em desktop, tablet e mobile
- 🧪 **Testes unitários** - 23 testes com Vitest
- 🛡️ **Segurança de exclusão** - Modal customizado para evitar erros acidentais

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18** - Biblioteca para interfaces
- **TypeScript** - Tipagem estática
- **Vite** - Build tool moderna
- **shadcn/ui** - Componentes acessíveis
- **Tailwind CSS** - Estilização utilitária
- **React Router** - Navegação SPA
- **pdfmake** - Geração de PDFs

### Backend
- **Node.js** - Runtime JavaScript
- **Express 5** - Framework web
- **TypeScript** - Tipagem no servidor
- **Google Gemini API** - IA Generativa
- **CORS** - Comunicação cross-origin

### IA e RAG
- **Google Gemini 1.5** - Modelo de linguagem
- **RAG (100KB)** - Retrieval-Augmented Generation otimizado
- **BNCC completa** - Base de conhecimento oficial

### Testes
- **Vitest** - Framework de testes
- **Testing Library** - Testes de componentes React
- **23 testes** - Cobertura de serviços, componentes e tipos

---

## 🤖 Uso de IA no Desenvolvimento

**Conforme Item 12 do Edital**, documentamos o papel da IA no desenvolvimento deste projeto:

### Ferramentas de IA Utilizadas

1. **GitHub Copilot / Google Gemini (Assistentes de Código)**
   - Geração de código boilerplate
   - Sugestões de estrutura de componentes React
   - Autocompletar funções e tipos TypeScript
   - Debugging e refatoração

2. **ChatGPT / Gemini (Consultas Técnicas)**
   - Pesquisa de melhores práticas
   - Resolução de problemas específicos
   - Otimização de prompts para IA generativa
   - Estruturação de arquitetura

### Partes Desenvolvidas com Auxílio de IA

- ✅ **Componentes React** - Estrutura inicial gerada, depois customizada
- ✅ **Serviço de API** - Lógica de comunicação frontend/backend
- ✅ **Prompts para Gemini** - Refinamento iterativo para melhor qualidade
- ✅ **Tipagens TypeScript** - Interfaces e tipos sugeridos
- ✅ **Geração de PDF** - Estrutura inicial com pdfmake

### Domínio da Solução

**A equipe possui domínio TOTAL sobre a solução**, incluindo:
- Arquitetura do sistema (frontend/backend separados)
- Fluxo de dados e estado da aplicação
- Integração com API do Google Gemini
- Capacidade de explicar, modificar e estender qualquer parte do código

> **Importante:** A IA foi utilizada como **ferramenta de produtividade**, não como substituto do conhecimento técnico. Todo código gerado foi revisado, compreendido, testado e adaptado às necessidades específicas do projeto.

---

## ✅ Requisitos do Hackathon

### Conformidade com Edital

| Critério | Atendimento | Detalhes |
|----------|-------------|----------|
| Sistema web single-user | ✅ | Sem autenticação, dados locais |
| Cadastro de disciplinas | ✅ | Com ano/série e descrição |
| Criação manual de unidades | ✅ | Formulário completo implementado |
| Sugestão automática via IA | ✅ | Endpoint `/unidades/sugerir-tema` |
| Geração de plano de aula | ✅ | Endpoint `/unidades` com IA |
| Geração de atividades | ✅ | 3 tipos: objetiva, discursiva, prática |
| Uso de IA Generativa | ✅ | Google Gemini com RAG |
| Alinhamento à BNCC | ✅ | RAG com documento oficial |
| Código organizado | ✅ | TypeScript, separação clara |

### Público-Alvo

- 👨‍🏫 Professores do Ensino Fundamental (1º ao 9º ano)
- 👩‍🏫 Professores do Ensino Médio (1º ao 3º ano)

---

## 🚀 Como Executar

### Pré-requisitos

- **Node.js** 18+ ([instalar com nvm](https://github.com/nvm-sh/nvm))
- **npm** ou **yarn**
- **Chave API do Google Gemini** ([obter aqui](https://ai.google.dev/))

### Instalação

```bash
# Clone o repositório
git clone https://github.com/AnaRosa2/plano-bncc-f-cil.git
cd plano-bncc-f-cil
```

### Configuração do Backend

```bash
# Entre na pasta do backend
cd backend

# Instale as dependências
npm install

# Configure a variável de ambiente
echo "GEMINI_API_KEY=SUA_CHAVE_AQUI" > .env

# Inicie o servidor (porta 3333)
npx ts-node src/server.ts
```

### Configuração do Frontend

```bash
# Em outro terminal, entre na pasta do frontend
cd frontend

# Instale as dependências
npm install

# Configure a URL da API
echo "VITE_API_URL=http://localhost:3333" > .env

# Inicie o servidor de desenvolvimento (porta 8081)
npm run dev
```

### Acessar a Aplicação

Abra o navegador em: **http://localhost:8081**

---

## 📁 Estrutura do Projeto

```
plano-bncc-f-cil/
├── frontend/                 # Aplicação React
│   ├── src/
│   │   ├── components/      # Componentes React reutilizáveis
│   │   ├── contexts/        # Context API (estado global)
│   │   ├── pages/           # Páginas da aplicação
│   │   ├── services/        # Serviço de comunicação com API
│   │   ├── utils/           # Utilitários (geração de PDF)
│   │   ├── types/           # Tipos TypeScript
│   │   └── test/            # Testes unitários (Vitest)
│   └── package.json
│
├── backend/                  # API Node.js + Express
│   ├── src/
│   │   ├── routes/          # Rotas da API
│   │   ├── services/        # Lógica de negócio e IA
│   │   ├── middlewares/     # Tratamento de erros
│   │   ├── validators/      # Validações de entrada
│   │   ├── utils/           # Utilitários (BNCC, RAG)
│   │   └── server.ts        # Entrada da aplicação
│   └── package.json
│
└── README.md                 # Este arquivo
```

---

## 🎥 Demonstração

### Fluxo de Uso

1. **Criar Disciplina**
   - Informar nome, ano/série e descrição
   - Exemplo: "Cultura Digital - 6º ano EF"

2. **Adicionar Unidade**
   - Criar manualmente OU
   - Usar sugestões da IA

3. **Gerar Plano de Aula**
   - Clique em "Gerar Plano de Aula com IA"
   - Aguarde processamento (5-10 segundos)
   - Conteúdo alinhado à BNCC gerado automaticamente

4. **Gerar Atividade Avaliativa**
   - Escolha tipo: Objetiva / Discursiva / Prática
   - IA gera atividade coerente com o plano

5. **Exportar em PDF para slide**
   - Clique em "Baixar PDF"

### 

---

## 👥 Equipe

- **Líder:** [Nilson Rodrigo](https://github.com/Nilson-Rodrigo)
- **Integrante:** [Ana Rosa](https://github.com/AnaRosa2)

**Curso:** Tecnologia em Análise e Desenvolvimento de Sistemas (TADS)  
**Instituição:** IFPI Campus Piripiri  
**Hackathon:** Janeiro 2026

---

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais no contexto do Hackathon IFPI 2026.

---

## 🏆 Considerações para Avaliação

### Pontos Fortes

- ✅ **Sistema 100% funcional** - Todos os requisitos obrigatórios implementados
- ✅ **IA real integrada** - Não usa templates mockados, gera conteúdo dinâmico
- ✅ **RAG com BNCC** - Base de conhecimento oficial carregada
- ✅ **Código profissional** - TypeScript, organização clara, separação frontend/backend
- ✅ **UX moderna** - shadcn/ui, responsivo, feedback visual
- ✅ **Persistência robusta** - Uso de LocalStorage para simular banco de dados local

### Decisões Técnicas

1. **Separação Frontend/Backend** - Facilita manutenção e escalabilidade
2. **TypeScript** - Reduz bugs, melhora DX
3. **Context API** - Gerenciamento de estado simples e eficaz
4. **pdfmake** - Gera PDFs no cliente, sem dependência do backend

### Executar Testes

```bash
cd frontend
npm run test
```

**Resultado**: 23 testes passando ✅

---

## 📞 Contato

Para dúvidas sobre o projeto:
- **GitHub (Líder):** [Nilson-Rodrigo](https://github.com/Nilson-Rodrigo)
- **GitHub (Repositório):** [AnaRosa2/plano-bncc-f-cil](https://github.com/AnaRosa2/plano-bncc-f-cil)

---

**Desenvolvido com 💙 para o Hackathon IFPI 2026**
