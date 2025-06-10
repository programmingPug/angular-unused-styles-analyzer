import * as vscode from 'vscode';

export class HTMLAnalyzer {
    extractUsedSelectors(document: vscode.TextDocument): Set<string> {
        const usedSelectors = new Set<string>();
        const text = document.getText();
        
        // Extract class attributes
        const classMatches = text.match(/class\s*=\s*["']([^"']+)["']/g) || [];
        classMatches.forEach(match => {
            const classes = match.replace(/class\s*=\s*["']([^"']+)["']/, '$1').split(/\s+/);
            classes.forEach(cls => cls.trim() && usedSelectors.add(cls.trim()));
        });
        
        // Extract id attributes
        const idMatches = text.match(/id\s*=\s*["']([^"']+)["']/g) || [];
        idMatches.forEach(match => {
            const id = match.replace(/id\s*=\s*["']([^"']+)["']/, '$1').trim();
            if (id) usedSelectors.add(id);
        });
        
        // Extract Angular class bindings
        const ngClassMatches = text.match(/\[class\.([^\]]+)\]/g) || [];
        ngClassMatches.forEach(match => {
            const className = match.replace(/\[class\.([^\]]+)\]/, '$1');
            usedSelectors.add(className);
        });
        
        // Extract ngClass bindings
        const ngClassObjectMatches = text.match(/\[ngClass\]\s*=\s*["']([^"']+)["']/g) || [];
        ngClassObjectMatches.forEach(match => {
            const expr = match.replace(/\[ngClass\]\s*=\s*["']([^"']+)["']/, '$1');
            // This would need more sophisticated parsing for object expressions
            const possibleClasses = expr.match(/['"`]([^'"`]+)['"`]/g) || [];
            possibleClasses.forEach(cls => {
                const className = cls.replace(/['"`]/g, '');
                usedSelectors.add(className);
            });
        });
        
        return usedSelectors;
    }
}