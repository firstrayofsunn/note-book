import { JSDOM } from 'jsdom';

/**
 * Extracts plain text from the given document data.
 * @param documentData - The document data which could be HTML or plain text.
 * @returns The extracted plain text or null if parsing fails.
 */
export function extractTextFromDocument(documentData: string): string | null {
    try {
        if (isHtml(documentData)) {
            const dom = new JSDOM(documentData);
            return dom.window.document.body.textContent || null;
        }
        return documentData;
    } catch (error) {
        console.error("Error parsing document data:", error instanceof Error ? error.message : error);
        return null;
    }
}

/**
 * Checks if the given string is HTML.
 * @param str - The string to check.
 * @returns True if the string is HTML, false otherwise.
 */
export function isHtml(str: string): boolean {
    try {
        // Quick check to see if the string starts with a common HTML tag
        if (/^\s*<([a-z][^>]*|\/[a-z][^>]*|!DOCTYPE)/i.test(str)) {
            return true;
        }

        const doc = new JSDOM(str).window.document;
        return doc.body.innerHTML !== '';
    } catch {
        return false;
    }
}

