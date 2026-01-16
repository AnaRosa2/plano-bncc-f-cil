# 📘 Plano BNCC com IA

Uma ferramenta inteligente para ajudar professores a criarem planos de aula alinhados à **Base Nacional Comum Curricular (BNCC)** — com apoio de **Inteligência Artificial**.

---

## 🎯 O Que é?

O **Plano BNCC com IA** é uma aplicação web voltada para educadores que desejam planejar suas aulas de forma rápida, coerente e pedagogicamente sólida. Ao informar apenas a **disciplina** e o **tema da aula**, o sistema gera automaticamente:

- ✍️ Um plano de aula completo  
- 🎯 Objetivo geral alinhado à BNCC  
- 📚 Metodologia didática sugerida  
- 📝 Atividade avaliativa contextualizada  

Tudo isso com o objetivo de **reduzir a burocracia docente** e **potencializar o tempo de ensino**.

---

## 🔁 Fluxo da Aplicação

1. **Usuário acessa a interface web** e seleciona:
   - A disciplina (ex: Matemática, História)
   - O tema da aula (ex: “Frações”, “Revolução Francesa”)

2. **Frontend envia os dados** para a API (backend) via requisição HTTP.

3. **Backend processa a solicitação** e repassa as informações para o módulo de geração de conteúdo.

4. **Módulo de IA (simulado)** produz um plano de aula estruturado com base em regras pedagógicas pré-definidas.

5. **Resposta é retornada ao frontend**, onde o plano gerado é exibido de forma clara e editável.

> ⚠️ **Atualmente**, a IA é simulada por um serviço interno. A arquitetura já está preparada para substituir esse módulo por uma integração real com LLMs (ex: OpenAI, Azure, etc.).

---

## 🧱 Arquitetura

O sistema é dividido em três camadas principais:

| Camada       | Tecnologias                     | Responsabilidade |
|--------------|----------------------------------|------------------|
| **Frontend** | React, TypeScript, Vite, Tailwind CSS | Interface do usuário |
| **Backend**  | Node.js, Express, TypeScript, CORS | Lógica de negócio e comunicação com a IA |
| **IA**       | Serviço interno (simulado)       | Geração automática de conteúdo pedagógico |

A separação em camadas permite fácil manutenção, testes independentes e futuras evoluções — como autenticação, banco de dados ou integração com modelos de linguagem reais.

---

## 🚀 Status Atual

- ✅ Interface funcional e responsiva  
- ✅ Backend estruturado em TypeScript  
- ✅ Comunicação front ↔ back funcionando  
- 🟡 Geração de conteúdo simulada (pronta para migração para IA real)  
- 🔜 Próximas etapas:  
  - Persistência com banco de dados  
  - Deploy em nuvem  
  - Integração com LLMs  
  - Suporte a múltiplos usuários e salvamento de planos

---

## 💡 Contexto

Este projeto foi inicialmente desenvolvido durante um **hackathon educacional** e está sendo continuamente aprimorado. É open source e aberto a contribuições de educadores, desenvolvedores e entusiastas da inovação na educação.

> **"Tecnologia a serviço da educação — não o contrário."**
