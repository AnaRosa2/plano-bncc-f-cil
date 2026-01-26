
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

async function testModel() {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
        console.error('API KEY NOT FOUND');
        return;
    }
    const genAI = new GoogleGenerativeAI(key);
    const modelsToTest = ["gemini-3.0-flash", "gemini-2.0-flash", "gemini-1.5-flash"];

    for (const m of modelsToTest) {
        console.log(`\n--- Testando modelo: ${m} ---`);
        try {
            const model = genAI.getGenerativeModel({ model: m });
            const result = await model.generateContent("Diga 'OK'");
            console.log(`Sucesso com ${m}:`, (await result.response).text());
            break; // Se um funcionar, já sabemos o que usar
        } catch (err: any) {
            console.error(`Falha com ${m}:`, err.message, `(Status: ${err.status})`);
        }
    }
}

testModel();
