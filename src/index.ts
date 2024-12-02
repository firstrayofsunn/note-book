import { Hono } from 'hono';
import { cors } from 'hono/cors';
import axios, { AxiosError } from 'axios';
import { JSDOM } from 'jsdom';
import dotenv from 'dotenv';

dotenv.config();

// Type definitions for bindings
type Bindings = {
    GEMINI_API_KEY: string; // You can rename this to reflect its use for Google API, if needed
};

const app = new Hono<{ Bindings: Bindings }>();

// Configure CORS
app.use(
    '/*',
    cors({
        origin: '*',
        allowHeaders: ['X-Custom-Header', 'Upgrade-Insecure-Requests', 'Content-Type'],
        allowMethods: ['POST', 'GET', 'OPTIONS', 'PUT'],
        exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
        maxAge: 600,
        credentials: true,
    })
);

// Helper function to extract text content from a document
function extractTextFromDocument(documentData: string): string {
    if (isHtml(documentData)) {
        const dom = new JSDOM(documentData);
        return dom.window.document.body.textContent || '';
    }
    return documentData;
}

// Helper function to check if the input is HTML
function isHtml(str: string): boolean {
    const htmlPattern = /<\/?[a-z][\s\S]*>/i;
    return htmlPattern.test(str);
}

// Route to chat with document content
app.post('/chatToDocument', async (c) => {
    const { documentData, question } = await c.req.json();
    const GEMINI_API_KEY = c.env.GEMINI_API_KEY;

    try {
        // Validate input
        if (!documentData || !question) {
            return c.json({ error: 'Missing required fields: documentData and question' }, 400);
        }

        // Extract text content
        const extractedText = extractTextFromDocument(documentData);

        // Call Google Semantic Retrieval API
        const response = await axios.post(
            'https://ai.google.com/v1/semantic-retrieval/question-answering',
            {
                context: extractedText,
                query: question,
            },
            {
                headers: {
                    Authorization: `Bearer ${GEMINI_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        console.log('Google API response:', response.data);
        return c.json({ message: response.data.answer });
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 401) {
                console.error('Authentication error:', error.message);
                return c.json({ error: 'Authentication failed. Please check your API key.' }, 401);
            } else {
                console.error('API request error:', error.message);
                return c.json({ error: 'API request failed. Please try again later.' }, 500);
            }
        } else if (error instanceof Error) {
            console.error('Generic error:', error.message);
            return c.json({ error: 'An unexpected error occurred.' }, 500);
        } else {
            console.error('Unknown error:', error);
            return c.json({ error: 'An unknown error occurred.' }, 500);
        }
    }
});

// Export the app
export default app;
