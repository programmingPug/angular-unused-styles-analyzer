import * as vscode from 'vscode';

export class TypeScriptAnalyzer {
    extractDynamicSelectors(document: vscode.TextDocument): Set<string> {
        const dynamicSelectors = new Set<string>();
        const text = document.getText();
        
        // Look for renderer.addClass, renderer.removeClass calls
        const rendererMatches = text.match(/renderer\.(addClass|removeClass)\s*\(\s*[^,]+,\s*['"`]([^'"`]+)['"`]/g) || [];
        rendererMatches.forEach(match => {
            const className = match.replace(/.*['"`]([^'"`]+)['"`].*/, '$1');
            dynamicSelectors.add(className);
        });
        
        // Look for element.classList operations
        const classListMatches = text.match(/\.classList\.(add|remove|toggle)\s*\(\s*['"`]([^'"`]+)['"`]/g) || [];
        classListMatches.forEach(match => {
            const className = match.replace(/.*['"`]([^'"`]+)['"`].*/, '$1');
            dynamicSelectors.add(className);
        });
        
        // Look for HostBinding decorators
        const hostBindingMatches = text.match(/@HostBinding\s*\(\s*['"`]class\.([^'"`]+)['"`]/g) || [];
        hostBindingMatches.forEach(match => {
            const className = match.replace(/@HostBinding\s*\(\s*['"`]class\.([^'"`]+)['"`].*/, '$1');
            dynamicSelectors.add(className);
        });
        
        // Look for string literals that might be class names
        const stringLiteralMatches = text.match(/['"`][a-zA-Z_-][a-zA-Z0-9_-]*['"`]/g) || [];
        stringLiteralMatches.forEach(match => {
            const str = match.replace(/['"`]/g, '');
            // Only consider strings that look like CSS class names
            if (str.match(/^[a-zA-Z_-][a-zA-Z0-9_-]*$/) && str.length > 2) {
                dynamicSelectors.add(str);
            }
        });
        
        return dynamicSelectors;
    }
}