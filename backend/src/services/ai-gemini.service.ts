// src/services/ai-gemini.service.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function gerarTextoComIA(prompt: string) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  
  if (!GEMINI_API_KEY) {
    throw new Error("❌ Chave da API do Gemini não encontrada!");
  }

  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

  try {
    // Seguindo a documentação oficial do Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return text.trim();
  } catch (error: any) {
    console.error("🔥 Erro da API do Gemini:", error.message);
    console.error("🔥 Status:", error?.status);
    
    // Se for erro de quota, informa melhor
    if (error.status === 429) {
      throw new Error('Quota da API excedida. Aguarde alguns minutos ou use outra chave.');
    }
    
    throw new Error('Falha ao gerar conteúdo com IA.');
  }
}