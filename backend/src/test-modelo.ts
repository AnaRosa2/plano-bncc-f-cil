import dotenv from 'dotenv';
dotenv.config();

import { GoogleGenerativeAI } from '@google/generative-ai';

async function test() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

  // Seguindo a documentação oficial
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = "Escreva uma história sobre um robô mágico.";

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log('✅ Resposta:', text);
  } catch (error: any) {
    console.error('❌ Erro:', error.message);
    console.error('Status:', error.status);
  }
}

test();