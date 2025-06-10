import * as vscode from 'vscode';
import { UnusedStyle, SelectorPosition } from '../types/ComponentInterfaces';
import { SelectorMatcher } from './SelectorMatcher';

export class UnusedStyleFinder {
    private selectorMatcher = new SelectorMatcher();
    
    findUnusedStyles(
        cssSelectors: Map<string, SelectorPosition>,
        usedSelectors: Set<string>,
        styleDocument: vscode.TextDocument
    ): UnusedStyle[] {
        const unused: UnusedStyle[] = [];
        const config = vscode.workspace.getConfiguration('angularUnusedStyles');
        const ignoredSelectors: string[] = config.get('ignoredSelectors', []);
        
        for (const [selector, position] of cssSelectors.entries()) {
            if (this.selectorMatcher.shouldIgnoreSelector(selector, ignoredSelectors)) {
                continue;
            }
            
            if (!this.selectorMatcher.isSelectorUsed(selector, usedSelectors)) {
                unused.push({
                    selector,
                    line: position.line,
                    character: position.character,
                    length: position.length,
                    reason: `Style '${selector}' appears to be unused`
                });
            }
        }
        
        return unused;
    }
}