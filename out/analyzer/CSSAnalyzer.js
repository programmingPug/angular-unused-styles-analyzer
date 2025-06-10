"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CSSAnalyzer = void 0;
class CSSAnalyzer {
    extractSelectors(document) {
        const selectors = new Map();
        const text = document.getText();
        // Parse CSS/SCSS using regex-based approach
        this.parseStylesheet(text, selectors);
        return selectors;
    }
    parseStylesheet(text, selectors) {
        const lines = text.split('\n');
        let inComment = false;
        let inRule = false;
        let braceCount = 0;
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];
            // Handle multi-line comments
            if (inComment) {
                const commentEnd = line.indexOf('*/');
                if (commentEnd !== -1) {
                    inComment = false;
                    line = line.substring(commentEnd + 2);
                }
                else {
                    continue;
                }
            }
            // Remove single-line comments
            const commentStart = line.indexOf('//');
            if (commentStart !== -1) {
                line = line.substring(0, commentStart);
            }
            // Handle multi-line comment start
            const multiCommentStart = line.indexOf('/*');
            if (multiCommentStart !== -1) {
                const multiCommentEnd = line.indexOf('*/', multiCommentStart);
                if (multiCommentEnd !== -1) {
                    line = line.substring(0, multiCommentStart) + line.substring(multiCommentEnd + 2);
                }
                else {
                    inComment = true;
                    line = line.substring(0, multiCommentStart);
                }
            }
            // Count braces to track nesting
            const openBraces = (line.match(/\{/g) || []).length;
            const closeBraces = (line.match(/\}/g) || []).length;
            // If we're not in a rule and line contains a selector pattern
            if (!inRule && braceCount === 0) {
                const selectorMatch = this.extractSelectorFromLine(line, i);
                if (selectorMatch) {
                    selectors.set(selectorMatch.selector, {
                        line: i,
                        character: selectorMatch.character,
                        length: selectorMatch.length
                    });
                }
            }
            braceCount += openBraces - closeBraces;
            inRule = braceCount > 0;
        }
    }
    extractSelectorFromLine(line, lineNumber) {
        // Remove leading/trailing whitespace
        const trimmed = line.trim();
        // Skip empty lines, variables, imports, mixins, etc.
        if (!trimmed ||
            trimmed.startsWith('$') ||
            trimmed.startsWith('@') ||
            trimmed.startsWith('//') ||
            trimmed.startsWith('/*') ||
            !trimmed.includes('{')) {
            return null;
        }
        // Extract selector part (everything before the opening brace)
        const braceIndex = trimmed.indexOf('{');
        if (braceIndex === -1) {
            return null;
        }
        const selectorPart = trimmed.substring(0, braceIndex).trim();
        // Validate that this looks like a CSS selector
        if (this.isValidSelector(selectorPart)) {
            const character = line.indexOf(selectorPart);
            return {
                selector: selectorPart,
                character: character >= 0 ? character : 0,
                length: selectorPart.length
            };
        }
        return null;
    }
    isValidSelector(selector) {
        // Skip SCSS control structures and mixins
        if (selector.startsWith('@') ||
            selector.includes('@if') ||
            selector.includes('@for') ||
            selector.includes('@while') ||
            selector.includes('@each') ||
            selector.includes('@mixin') ||
            selector.includes('@include')) {
            return false;
        }
        // Basic CSS selector patterns
        const selectorPatterns = [
            /^[.#]?[a-zA-Z_-][a-zA-Z0-9_-]*/,
            /^::[a-zA-Z-]+/,
            /^:[a-zA-Z-]+/,
            /^\[.*\]/,
            /^[*]/, // Universal selector
        ];
        // Check if selector matches any valid pattern
        return selectorPatterns.some(pattern => pattern.test(selector.trim())) ||
            selector.includes('.') ||
            selector.includes('#') ||
            selector.includes(':');
    }
}
exports.CSSAnalyzer = CSSAnalyzer;
//# sourceMappingURL=CSSAnalyzer.js.map