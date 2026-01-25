// backend/src/test-gemini.ts
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

async function testGeminiDirect() {
    const API_KEY = process.env.GEMINI_API_KEY;

    console.log('=== TESTING GEMINI API DIRECTLY ===\n');
    console.log('API Key loaded:', API_KEY ? `YES (${API_KEY.substring(0, 20)}...)` : 'NO');

    if (!API_KEY) {
        console.error('❌ NO API KEY!');
        return;
    }

    const genAI = new GoogleGenerativeAI(API_KEY);

    try {
        console.log('\nTrying gemini-1.5-flash...');
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = 'Respond with just "OK"';
        console.log('Sending prompt:', prompt);

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log('\n✅✅✅ SUCCESS! ✅✅✅');
        console.log('Response:', text);
        console.log('\nThe API key is VALID and WORKING!');

    } catch (error: any) {
        console.error('\n❌❌❌ FAILED! ❌❌❌');
        console.error('Error message:', error.message);
        console.error('Error status:', error?.status);
        console.error('Error details:', error);
        console.log('\nThe API key might be INVALID, EXPIRED, or RESTRICTED.');
        console.log('Go to https://aistudio.google.com/app/apikey to check your key.');
    }
}

testGeminiDirect();
