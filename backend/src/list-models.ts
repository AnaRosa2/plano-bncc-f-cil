import dotenv from 'dotenv';
dotenv.config();

import { GoogleGenerativeAI } from '@google/generative-ai';

async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  
  // Não logar chave de API em ambientes de produção/dev compartilhado.
  
  if (!apiKey) {
    console.error('❌ GEMINI_API_KEY não encontrada!');
    return;
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  
  try {
    // Teste mais simples - só listar
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`
    );
    
    const data = await response.json();
    
    if (data.error) {
      console.error('❌ Erro da API:', data.error);
    } else {
      console.log('✅ Modelos disponíveis:');
      data.models?.forEach((model: any) => {
        if (model.name.includes('gemini')) {
          console.log(`- ${model.name}`);
        }
      });
    }
  } catch (error: any) {
    console.error('❌ Erro:', error.message);
  }
}

listModels();