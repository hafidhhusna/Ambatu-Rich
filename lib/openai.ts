import OpenAI from 'openai';

// Debug logging
console.log('🔧 OpenAI Configuration:', {
  hasApiKey: !!process.env.OPENROUTER_API_KEY,
  keyLength: process.env.OPENROUTER_API_KEY?.length || 0,
  keyPrefix: process.env.OPENROUTER_API_KEY?.substring(0, 10) || 'not-found',
});

if (!process.env.OPENROUTER_API_KEY) {
  console.warn('⚠️ OPENROUTER_API_KEY is not set in environment variables');
}

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': 'http://localhost:3000',
    'X-Title': 'AmbatuRich Finance App',
  },
});

export default openai;
